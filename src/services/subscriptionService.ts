// Serviço de gerenciamento de assinaturas
// Em produção, integrar com Google Play Billing / Stripe

export type PlanType = 'free' | 'pro_monthly' | 'pro_yearly';

export interface Subscription {
  plan: PlanType;
  startDate: string;
  trialEnd?: string;
  isTrialActive: boolean;
  isActive: boolean;
}

const SUB_KEY = 'financasia_subscription';

import { authService } from './authService';

export const subscriptionService = {
  getSubscription: (): Subscription | null => {
    // Admin Pro vitalício: sempre retorna assinatura Pro para o email específico
    const session = authService.getSession();
    if (session?.email === 'joaquimmiguel1200@gmail.com') {
      return {
        plan: 'pro_yearly',
        startDate: new Date().toISOString(),
        trialEnd: undefined,
        isTrialActive: false,
        isActive: true,
      };
    }

    // Assinatura normal (armazenada no dispositivo)
    try {
      const data = localStorage.getItem(SUB_KEY);
      if (!data) return null;
      const sub: Subscription = JSON.parse(data);
      
      // Verificar se o trial expirou
      if (sub.isTrialActive && sub.trialEnd) {
        const trialEnd = new Date(sub.trialEnd);
        if (new Date() > trialEnd) {
          sub.isTrialActive = false;
          if (sub.plan !== 'free') {
            // Em produção, verificar pagamento real
            // Por ora, manter ativo (simulação)
            sub.isActive = true;
          }
          localStorage.setItem(SUB_KEY, JSON.stringify(sub));
        }
      }
      
      return sub;
    } catch {
      return null;
    }
  },

  subscribe: (plan: PlanType): Subscription => {
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 7); // 7 dias de trial

    const sub: Subscription = {
      plan,
      startDate: now.toISOString(),
      trialEnd: plan !== 'free' ? trialEnd.toISOString() : undefined,
      isTrialActive: plan !== 'free',
      isActive: true,
    };

    localStorage.setItem(SUB_KEY, JSON.stringify(sub));
    return sub;
  },

  cancelSubscription: (): void => {
    const sub = subscriptionService.getSubscription();
    if (sub) {
      sub.plan = 'free';
      sub.isTrialActive = false;
      sub.isActive = true;
      localStorage.setItem(SUB_KEY, JSON.stringify(sub));
    }
  },

  upgradePlan: (newPlan: PlanType): Subscription => {
    return subscriptionService.subscribe(newPlan);
  },

  isPro: (): boolean => {
    const session = authService.getSession();
    if (session?.email === 'joaquimmiguel1200@gmail.com') {
      // Admin: sempre Pro ativo e gratuito
      return true;
    }

    const sub = subscriptionService.getSubscription();
    if (!sub) return false;
    return sub.plan !== 'free' && sub.isActive;
  },

  isTrialActive: (): boolean => {
    const sub = subscriptionService.getSubscription();
    if (!sub) return false;
    return sub.isTrialActive;
  },

  getTrialDaysRemaining: (): number => {
    const sub = subscriptionService.getSubscription();
    if (!sub || !sub.trialEnd || !sub.isTrialActive) return 0;
    const remaining = new Date(sub.trialEnd).getTime() - Date.now();
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
  },

  getPlanLabel: (plan: PlanType): string => {
    switch (plan) {
      case 'free': return 'Grátis';
      case 'pro_monthly': return 'Pro Mensal';
      case 'pro_yearly': return 'Pro Anual';
      default: return 'Grátis';
    }
  },

  getPlanPrice: (plan: PlanType): string => {
    switch (plan) {
      case 'free': return 'R$ 0';
      case 'pro_monthly': return 'R$ 9,90/mês';
      case 'pro_yearly': return 'R$ 7,90/mês';
      default: return 'R$ 0';
    }
  },

  // Verificar limites do plano gratuito
  canAddTransaction: (currentCount: number): boolean => {
    if (subscriptionService.isPro()) return true;
    return currentCount < 30; // Limite de 30 transações no plano grátis
  },

  canUseChat: (todayCount: number): boolean => {
    if (subscriptionService.isPro()) return true;
    return todayCount < 5; // Limite de 5 chats por dia no grátis
  },

  canExport: (): boolean => {
    return subscriptionService.isPro();
  },

  canAddGoal: (currentCount: number): boolean => {
    if (subscriptionService.isPro()) return true;
    return currentCount < 1; // 1 meta no plano grátis
  },

  canUseFixedEntries: (): boolean => {
    return subscriptionService.isPro();
  },

  clear: (): void => {
    localStorage.removeItem(SUB_KEY);
  }
};
