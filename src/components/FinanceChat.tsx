import { useState, useRef, useEffect } from 'react';
import { Transaction, ChatMessage, Installment } from '../types';
import { ChatAIService } from '../services/chatAIService';

interface FinanceChatProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onAddMultipleTransactions: (transactions: Omit<Transaction, 'id'>[]) => void;
}

export const FinanceChat = ({ transactions, onAddTransaction, onAddMultipleTransactions }: FinanceChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('financasia_chat');
    if (saved) return JSON.parse(saved);
    return [{
      id: 'welcome',
      role: 'assistant' as const,
      content: ChatAIService.generateHelpResponse(),
      timestamp: new Date().toISOString(),
    }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('financasia_chat', JSON.stringify(messages.slice(-50)));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (role: 'user' | 'assistant', content: string, extra?: Partial<ChatMessage>) => {
    const msg: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      timestamp: new Date().toISOString(),
      ...extra,
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput('');
    addMessage('user', text);
    setIsTyping(true);

    // Simular delay da IA
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

    // Verificar saudação/ajuda
    if (ChatAIService.isGreetingOrHelp(text)) {
      addMessage('assistant', ChatAIService.generateHelpResponse());
      setIsTyping(false);
      return;
    }

    // Verificar consulta de extrato
    if (ChatAIService.isQueryRequest(text)) {
      const response = generateQueryResponse(text);
      addMessage('assistant', response);
      setIsTyping(false);
      return;
    }

    // Tentar interpretar como gasto
    const parsed = ChatAIService.parseUserMessage(text);

    if (!parsed) {
      addMessage('assistant', ChatAIService.generateConfusionResponse());
      setIsTyping(false);
      return;
    }

    // Criar transações
    const now = new Date();

    if (parsed.installments && parsed.installments > 1) {
      // Gasto parcelado - criar transações futuras
      const installmentsList: Installment[] = [];
      const txList: Omit<Transaction, 'id'>[] = [];
      const parentId = Date.now().toString();

      for (let i = 0; i < parsed.installments; i++) {
        const dueDate = new Date(now);
        dueDate.setMonth(dueDate.getMonth() + i);

        installmentsList.push({
          installmentNumber: i + 1,
          totalInstallments: parsed.installments,
          installmentAmount: parsed.installmentAmount!,
          dueDate: dueDate.toISOString(),
          paid: i === 0, // Primeira parcela já paga
        });

        txList.push({
          type: 'expense',
          amount: parsed.installmentAmount!,
          category: parsed.category,
          description: `${parsed.description} (${i + 1}/${parsed.installments})`,
          date: dueDate.toISOString(),
          paymentMethod: parsed.paymentMethod,
          totalAmount: parsed.totalAmount,
          parentId: parentId,
          source: 'chat',
          installments: [{
            installmentNumber: i + 1,
            totalInstallments: parsed.installments,
            installmentAmount: parsed.installmentAmount!,
            dueDate: dueDate.toISOString(),
            paid: i === 0,
          }],
        });
      }

      onAddMultipleTransactions(txList);

      const response = ChatAIService.generateResponse(parsed);
      addMessage('assistant', response);
    } else {
      // Gasto à vista
      const tx: Omit<Transaction, 'id'> = {
        type: 'expense',
        amount: parsed.totalAmount,
        category: parsed.category,
        description: parsed.description,
        date: now.toISOString(),
        paymentMethod: parsed.paymentMethod,
        source: 'chat',
      };

      onAddTransaction(tx);

      const response = ChatAIService.generateResponse(parsed);
      addMessage('assistant', response, { transactionCreated: { ...tx, id: 'temp' } });
    }

    setIsTyping(false);
  };

  const generateQueryResponse = (text: string): string => {
    const lower = text.toLowerCase();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    if (lower.includes('parcela')) {
      const parcelados = transactions.filter(t =>
        t.installments && t.installments.length > 0 && t.installments[0].totalInstallments > 1
      );

      if (parcelados.length === 0) {
        return '📊 Você não tem parcelas abertas no momento! 🎉';
      }

      let response = '📊 **Suas Parcelas:**\n\n';
      const groups = new Map<string, Transaction[]>();

      parcelados.forEach(t => {
        const key = t.parentId || t.id;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(t);
      });

      groups.forEach((txs) => {
        const first = txs[0];
        const remaining = txs.filter(t =>
          new Date(t.date) >= now
        ).length;
        const baseName = first.description.replace(/\s*\(\d+\/\d+\)/, '');
        response += `• **${baseName}**\n`;
        response += `  ${first.installments![0].totalInstallments}x de R$ ${first.amount.toFixed(2)}`;
        response += ` | ${remaining} restantes\n\n`;
      });

      return response;
    }

    // Resumo do mês
    const monthTx = transactions.filter(t => new Date(t.date) >= monthStart);
    const totalGasto = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalRecebido = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    const chatTx = monthTx.filter(t => t.source === 'chat' && t.type === 'expense');
    const chatTotal = chatTx.reduce((s, t) => s + t.amount, 0);

    let response = `📊 **Resumo do Mês:**\n\n`;
    response += `💰 Receitas: **R$ ${totalRecebido.toFixed(2)}**\n`;
    response += `💸 Despesas: **R$ ${totalGasto.toFixed(2)}**\n`;
    response += `📱 Gastos via Chat: **R$ ${chatTotal.toFixed(2)}** (${chatTx.length} registros)\n`;
    response += `\n💵 Saldo: **R$ ${(totalRecebido - totalGasto).toFixed(2)}**`;

    return response;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: '💳 Cartão parcelado', text: 'Comprei no cartão de crédito em ' },
    { label: '💚 Pix', text: 'Paguei via pix R$ ' },
    { label: '💚 Pix parcelado', text: 'Paguei no pix parcelado em ' },
    { label: '📊 Meus gastos', text: 'Quanto gastei este mês?' },
    { label: '📋 Parcelas', text: 'Minhas parcelas abertas' },
  ];

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content.split('\n').map((line, i) => {
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em class="text-gray-500">$1</em>');
      return (
        <span key={i} className="block" dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }} />
      );
    });
  };

  const clearChat = () => {
    const welcome: ChatMessage = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content: ChatAIService.generateHelpResponse(),
      timestamp: new Date().toISOString(),
    };
    setMessages([welcome]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-[700px]">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-t-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">FinançasIA Chat</h3>
            <p className="text-violet-200 text-xs">Registre gastos conversando comigo</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Limpar conversa"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
              }`}
            >
              <div className="text-sm leading-relaxed">
                {formatContent(msg.content)}
              </div>
              <div className={`text-[10px] mt-1 ${
                msg.role === 'user' ? 'text-violet-200' : 'text-gray-400'
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-t border-gray-100 px-3 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(action.text);
                inputRef.current?.focus();
              }}
              className="px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-medium rounded-full border border-violet-200 whitespace-nowrap transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 rounded-b-2xl p-3 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex: Comprei um tênis de R$ 400 no cartão 4x..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-11 h-11 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:shadow-none flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};
