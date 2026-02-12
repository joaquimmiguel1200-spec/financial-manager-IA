import { ParsedExpense, PaymentMethod } from '../types';

export class ChatAIService {

  // Interpreta a mensagem do usuário e extrai informações de gasto
  static parseUserMessage(message: string): ParsedExpense | null {
    const msg = message.toLowerCase().trim();

    // Detectar valor
    const amount = this.extractAmount(msg);
    if (!amount) return null;

    // Detectar método de pagamento
    const paymentMethod = this.detectPaymentMethod(msg);

    // Detectar parcelas
    const installmentInfo = this.detectInstallments(msg, amount);

    // Detectar categoria
    const category = this.detectCategory(msg);

    // Detectar descrição
    const description = this.extractDescription(message);

    return {
      description: description || 'Compra registrada via chat',
      totalAmount: amount,
      paymentMethod,
      installments: installmentInfo.count,
      installmentAmount: installmentInfo.amount,
      category,
    };
  }

  static extractAmount(msg: string): number | null {
    // Padrões: "1000 reais", "R$ 1.000,00", "1000", "R$1000", "mil reais", "200,50"
    const patterns = [
      /r\$\s*([\d.,]+)/i,
      /([\d.,]+)\s*(?:reais|real|r\$|brl)/i,
      /(?:de|por|custou|paguei|gastei|comprei|valor|total)\s*(?:r\$)?\s*([\d.,]+)/i,
      /(?:no valor de|no total de|totalizando)\s*(?:r\$)?\s*([\d.,]+)/i,
    ];

    for (const pattern of patterns) {
      const match = msg.match(pattern);
      if (match) {
        return this.parseNumber(match[1]);
      }
    }

    // Detectar "mil"
    const milMatch = msg.match(/(\d+)\s*mil/);
    if (milMatch) {
      return parseInt(milMatch[1]) * 1000;
    }

    // Último recurso: procurar qualquer número grande
    const numbers = msg.match(/\d[\d.,]*\d|\d+/g);
    if (numbers) {
      // Pegar o maior número como provável valor
      const parsed = numbers.map(n => this.parseNumber(n)).filter(n => n > 0);
      if (parsed.length > 0) {
        // Se tem parcelas, o maior é provavelmente o total
        return Math.max(...parsed);
      }
    }

    return null;
  }

  static parseNumber(str: string): number {
    // Remove pontos de milhar e troca vírgula por ponto
    let cleaned = str.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  static detectPaymentMethod(msg: string): PaymentMethod {
    // Cartão de crédito
    if (
      msg.includes('credito') || msg.includes('crédito') ||
      msg.includes('cartao') || msg.includes('cartão') ||
      msg.includes('cartão de credito') || msg.includes('cartão de crédito') ||
      msg.includes('no credito') || msg.includes('no crédito') ||
      msg.includes('fatura') || msg.includes('cc')
    ) {
      // Verificar se é parcelado
      if (this.hasInstallmentKeywords(msg)) {
        return 'credito';
      }
      return 'credito';
    }

    // Pix parcelado
    if (
      (msg.includes('pix') && this.hasInstallmentKeywords(msg)) ||
      msg.includes('pix parcelado')
    ) {
      return 'pix_parcelado';
    }

    // Pix normal
    if (msg.includes('pix')) {
      return 'pix';
    }

    // Débito
    if (msg.includes('debito') || msg.includes('débito')) {
      return 'debito';
    }

    // Dinheiro
    if (msg.includes('dinheiro') || msg.includes('espécie') || msg.includes('especie') || msg.includes('cash')) {
      return 'dinheiro';
    }

    // Boleto
    if (msg.includes('boleto')) {
      return 'boleto';
    }

    return 'pix'; // Default
  }

  static hasInstallmentKeywords(msg: string): boolean {
    return (
      /\d+\s*[xX×]\s*/.test(msg) ||
      /em\s*\d+\s*(?:vezes|parcelas|x)/.test(msg) ||
      /parcel/.test(msg) ||
      /\d+\s*parcela/.test(msg) ||
      /dividid/.test(msg)
    );
  }

  static detectInstallments(msg: string, totalAmount: number): { count: number; amount: number } {
    // Padrões: "5x", "em 5 vezes", "5 parcelas", "parcelado em 5"
    const patterns = [
      /(\d+)\s*[xX×]/,
      /em\s*(\d+)\s*(?:vezes|parcelas|x)/,
      /(\d+)\s*parcelas?/,
      /parcelad[oa]\s*(?:em\s*)?(\d+)/,
      /dividid[oa]\s*(?:em\s*)?(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = msg.match(pattern);
      if (match) {
        const count = parseInt(match[1]);
        if (count > 1 && count <= 48) {
          // Verificar se menciona valor da parcela
          const parcelaMatch = msg.match(/(?:de|cada)\s*(?:r\$)?\s*([\d.,]+)/);
          let installmentAmount: number;

          if (parcelaMatch) {
            installmentAmount = this.parseNumber(parcelaMatch[1]);
            // Se o valor total não bateu, recalcular
            if (Math.abs(installmentAmount * count - totalAmount) > 1) {
              installmentAmount = totalAmount / count;
            }
          } else {
            installmentAmount = totalAmount / count;
          }

          return { count, amount: Math.round(installmentAmount * 100) / 100 };
        }
      }
    }

    return { count: 1, amount: totalAmount };
  }

  static detectCategory(msg: string): string {
    const categoryKeywords: Record<string, string[]> = {
      'Alimentação': ['comida', 'almoço', 'almoco', 'jantar', 'café', 'lanche', 'restaurante', 'ifood', 'delivery', 'supermercado', 'mercado', 'padaria', 'pizza', 'hamburguer', 'sushi', 'açaí', 'acai', 'feira'],
      'Transporte': ['uber', 'taxi', 'gasolina', 'combustível', 'estacionamento', 'ônibus', 'onibus', 'metro', 'metrô', 'passagem', 'pedágio', 'pedagio', '99', 'indriver'],
      'Moradia': ['aluguel', 'condomínio', 'condominio', 'luz', 'energia', 'água', 'agua', 'gás', 'gas', 'iptu', 'casa', 'apartamento', 'reforma'],
      'Saúde': ['remédio', 'remedio', 'farmácia', 'farmacia', 'médico', 'medico', 'consulta', 'exame', 'hospital', 'dentista', 'plano de saúde', 'academia', 'suplemento'],
      'Educação': ['curso', 'faculdade', 'escola', 'livro', 'aula', 'mensalidade', 'material escolar', 'udemy', 'alura'],
      'Lazer': ['cinema', 'teatro', 'show', 'festa', 'viagem', 'hotel', 'netflix', 'spotify', 'jogo', 'game', 'bar', 'balada', 'parque', 'streaming'],
      'Compras': ['roupa', 'sapato', 'tênis', 'tenis', 'celular', 'notebook', 'computador', 'eletrônico', 'eletronico', 'loja', 'shopping', 'presente', 'amazon', 'mercado livre', 'shopee', 'magazine', 'tv', 'geladeira', 'máquina', 'maquina', 'móvel', 'movel', 'eletrodoméstico'],
      'Serviços': ['internet', 'telefone', 'plano', 'assinatura', 'seguro', 'manutenção', 'manutencao', 'conserto', 'faxina', 'lavanderia'],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (msg.includes(keyword)) {
          return category;
        }
      }
    }

    return 'Compras'; // Default para gastos avulsos
  }

  static extractDescription(message: string): string {
    // Remove informações de pagamento e valores para pegar a descrição
    let desc = message
      .replace(/(?:no\s*)?(?:cartão|cartao)\s*(?:de\s*)?(?:crédito|credito)/gi, '')
      .replace(/(?:no\s*)?(?:pix|débito|debito|dinheiro|boleto)/gi, '')
      .replace(/(?:parcelad[oa]\s*)?(?:em\s*)?\d+\s*[xX×]\s*/gi, '')
      .replace(/em\s*\d+\s*(?:vezes|parcelas)/gi, '')
      .replace(/\d+\s*parcelas?/gi, '')
      .replace(/r\$\s*[\d.,]+/gi, '')
      .replace(/[\d.,]+\s*(?:reais|real)/gi, '')
      .replace(/(?:de|por|cada)\s*[\d.,]+/gi, '')
      .replace(/(?:paguei|gastei|comprei|fiz)\s*/gi, '')
      .replace(/(?:todo\s*mês|mensal|na\s*fatura)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Capitalizar primeira letra
    if (desc.length > 0) {
      desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    }

    return desc || 'Compra via chat';
  }

  // Gera resposta da IA baseada no que foi interpretado
  static generateResponse(parsed: ParsedExpense): string {
    const methodNames: Record<PaymentMethod, string> = {
      'pix': '💚 Pix',
      'pix_parcelado': '💚 Pix Parcelado',
      'credito': '💳 Cartão de Crédito',
      'debito': '💳 Cartão de Débito',
      'dinheiro': '💵 Dinheiro',
      'boleto': '📄 Boleto',
    };

    const method = methodNames[parsed.paymentMethod] || parsed.paymentMethod;
    let response = `✅ **Gasto registrado com sucesso!**\n\n`;
    response += `📝 **${parsed.description}**\n`;
    response += `💰 Valor total: **R$ ${parsed.totalAmount.toFixed(2)}**\n`;
    response += `🏷️ Categoria: **${parsed.category}**\n`;
    response += `💳 Pagamento: **${method}**\n`;

    if (parsed.installments && parsed.installments > 1) {
      response += `\n📊 **Parcelamento:**\n`;
      response += `   ${parsed.installments}x de R$ ${parsed.installmentAmount?.toFixed(2)}\n`;

      if (parsed.paymentMethod === 'credito') {
        response += `\n📅 As parcelas serão adicionadas nas próximas faturas do cartão.\n`;
        response += `⚠️ Cada parcela de R$ ${parsed.installmentAmount?.toFixed(2)} aparecerá no extrato mensal.`;
      } else if (parsed.paymentMethod === 'pix_parcelado') {
        response += `\n📅 Cada parcela de R$ ${parsed.installmentAmount?.toFixed(2)} será um Pix mensal.\n`;
        response += `⚠️ Lembre-se de realizar cada Pix na data correta!`;
      }
    } else {
      if (parsed.paymentMethod === 'pix') {
        response += `\n✅ Valor debitado instantaneamente via Pix.`;
      } else if (parsed.paymentMethod === 'credito') {
        response += `\n📅 Será cobrado na próxima fatura do cartão.`;
      }
    }

    return response;
  }

  // Gera resposta de ajuda/saudação
  static generateHelpResponse(): string {
    return `🤖 **Olá! Sou a FinançasIA!**

Posso te ajudar a registrar seus gastos de forma rápida e fácil! Basta me dizer o que comprou, quanto pagou e como pagou.

**📌 Exemplos de como falar comigo:**

💳 **Cartão parcelado:**
_"Comprei um celular de R$ 2000 no cartão de crédito em 10x"_

💚 **Pix parcelado:**
_"Paguei um sofá de R$ 3000 no pix parcelado em 6x"_

💚 **Pix normal:**
_"Paguei R$ 150 de pix no mercado"_

💵 **Dinheiro:**
_"Gastei 50 reais de dinheiro no almoço"_

💳 **Débito:**
_"Comprei gasolina R$ 200 no débito"_

**🏷️ Categorias automáticas:**
Eu detecto automaticamente a categoria (comida, transporte, compras, etc.)

**Dica:** Quanto mais detalhes você me der, melhor eu registro! 😊`;
  }

  static generateConfusionResponse(): string {
    return `🤔 Hmm, não consegui entender completamente. Pode me dizer de outra forma?

**Tente algo como:**
• _"Comprei [produto] de R$ [valor] no [cartão/pix/dinheiro]"_
• _"Gastei [valor] reais no [produto] parcelado em [N]x"_
• _"Paguei [valor] via pix no [lugar]"_

Preciso pelo menos do **valor** para registrar! 💡`;
  }

  // Detecta se é uma saudação ou pedido de ajuda
  static isGreetingOrHelp(msg: string): boolean {
    const lower = msg.toLowerCase().trim();
    const greetings = ['oi', 'olá', 'ola', 'hey', 'eae', 'e aí', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi', 'ajuda', 'help', 'como funciona', 'o que', 'como usar', 'menu', 'início', 'inicio', 'opções', 'opcoes'];
    return greetings.some(g => lower.startsWith(g) || lower === g);
  }

  // Detecta se quer ver extrato/resumo
  static isQueryRequest(msg: string): boolean {
    const lower = msg.toLowerCase().trim();
    const queries = ['quanto gastei', 'meu extrato', 'meus gastos', 'resumo', 'total', 'saldo', 'quanto devo', 'minhas parcelas', 'parcelas abertas'];
    return queries.some(q => lower.includes(q));
  }
}
