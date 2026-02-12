import { useState, useEffect, useCallback } from 'react';
import { Transaction, FinancialGoal } from '../types';
import { authService } from '../services/authService';

const getStorageKey = (base: string) => {
  const session = authService.getSession();
  return session ? `${base}_${session.userId}` : base;
};

export const useFinancialData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('financasia_transactions'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('financasia_goals'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Salvar automaticamente ao alterar
  useEffect(() => {
    const key = getStorageKey('financasia_transactions');
    localStorage.setItem(key, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    const key = getStorageKey('financasia_goals');
    localStorage.setItem(key, JSON.stringify(goals));
  }, [goals]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const session = authService.getSession();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      userId: session?.userId,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const addMultipleTransactions = useCallback((txList: Omit<Transaction, 'id'>[]) => {
    const session = authService.getSession();
    const newTxs = txList.map((tx, i) => ({
      ...tx,
      id: (Date.now() + i).toString() + Math.random().toString(36).slice(2),
      userId: session?.userId,
    }));
    setTransactions(prev => [...newTxs, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const addGoal = useCallback((goal: Omit<FinancialGoal, 'id'>) => {
    const session = authService.getSession();
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      userId: session?.userId,
    };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<FinancialGoal>) => {
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, ...updates } : g))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  // Limpar todos os dados do usuário
  const clearAllData = useCallback(() => {
    setTransactions([]);
    setGoals([]);
  }, []);

  return {
    transactions,
    goals,
    addTransaction,
    addMultipleTransactions,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    clearAllData,
  };
};
