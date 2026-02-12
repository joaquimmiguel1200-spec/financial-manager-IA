import { User, UserSession } from '../types';
import { securityService } from './securityService';

const USERS_KEY = 'financas_users_v2';
const SESSION_KEY = 'financas_session_v2';
const SESSION_TOKEN_KEY = 'financas_token';

export const authService = {
  register: async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string; user?: UserSession }> => {
    const trimEmail = email.trim().toLowerCase();

    if (!securityService.validateEmail(trimEmail)) {
      return { success: false, error: 'Email inválido' };
    }

    const strength = securityService.validatePasswordStrength(password);
    if (!strength.valid) {
      return { success: false, error: strength.message };
    }

    const users = authService.getAllUsers();
    if (users.find(u => u.email === trimEmail)) {
      return { success: false, error: 'Email já cadastrado' };
    }

    const hashedPassword = await securityService.hashPassword(password);

    const newUser: User = {
      id: securityService.generateId(),
      email: trimEmail,
      password: hashedPassword,
      name: securityService.sanitizeInput(name.trim()),
      createdAt: new Date().toISOString(),
      fixedIncomes: [],
      fixedExpenses: []
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const session: UserSession = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name
    };

    const token = securityService.generateSessionToken();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_TOKEN_KEY, token);

    return { success: true, user: session };
  },

  login: async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserSession }> => {
    const trimEmail = email.trim().toLowerCase();

    if (!securityService.checkLoginAttempts(trimEmail)) {
      return { success: false, error: 'Muitas tentativas. Aguarde 5 minutos.' };
    }

    const users = authService.getAllUsers();
    const user = users.find(u => u.email === trimEmail);

    if (!user) {
      securityService.recordLoginAttempt(trimEmail);
      return { success: false, error: 'Usuário não encontrado' };
    }

    // Compatibilidade com senhas antigas (btoa) e novas (SHA-256)
    let passwordMatch = false;

    if (user.password.length === 64) {
      // SHA-256 hash
      passwordMatch = await securityService.verifyPassword(password, user.password);
    } else {
      // Legacy btoa
      passwordMatch = user.password === btoa(password);
      // Migrar para SHA-256
      if (passwordMatch) {
        const newHash = await securityService.hashPassword(password);
        user.password = newHash;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }

    if (!passwordMatch) {
      securityService.recordLoginAttempt(trimEmail);
      return { success: false, error: 'Senha incorreta' };
    }

    securityService.clearLoginAttempts(trimEmail);

    const session: UserSession = {
      userId: user.id,
      email: user.email,
      name: user.name
    };

    const token = securityService.generateSessionToken();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(SESSION_TOKEN_KEY, token);

    return { success: true, user: session };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
  },

  getSession: (): UserSession | null => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!sessionData || !token) return null;
    try {
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return authService.getSession() !== null;
  },

  getAllUsers: (): User[] => {
    // Tenta ler v2 primeiro, depois migra v1
    let usersData = localStorage.getItem(USERS_KEY);
    if (!usersData) {
      const legacyData = localStorage.getItem('financas_users');
      if (legacyData) {
        localStorage.setItem(USERS_KEY, legacyData);
        usersData = legacyData;
      }
    }
    if (!usersData) return [];
    try {
      return JSON.parse(usersData);
    } catch {
      return [];
    }
  },

  getCurrentUser: (): User | null => {
    const session = authService.getSession();
    if (!session) return null;
    const users = authService.getAllUsers();
    return users.find(u => u.id === session.userId) || null;
  },

  updateUserProfile: (updates: Partial<User>): boolean => {
    const session = authService.getSession();
    if (!session) return false;
    const users = authService.getAllUsers();
    const userIndex = users.findIndex(u => u.id === session.userId);
    if (userIndex === -1) return false;

    // Sanitizar nome se foi atualizado
    if (updates.name) {
      updates.name = securityService.sanitizeInput(updates.name);
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    if (updates.name) {
      session.name = updates.name;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return true;
  },

  updateFixedIncomes: (fixedIncomes: User['fixedIncomes']): boolean => {
    return authService.updateUserProfile({ fixedIncomes });
  },

  updateFixedExpenses: (fixedExpenses: User['fixedExpenses']): boolean => {
    return authService.updateUserProfile({ fixedExpenses });
  },

  // Alterar senha
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const user = authService.getCurrentUser();
    if (!user) return { success: false, error: 'Usuário não encontrado' };

    let currentMatch = false;
    if (user.password.length === 64) {
      currentMatch = await securityService.verifyPassword(currentPassword, user.password);
    } else {
      currentMatch = user.password === btoa(currentPassword);
    }

    if (!currentMatch) {
      return { success: false, error: 'Senha atual incorreta' };
    }

    const strength = securityService.validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return { success: false, error: strength.message };
    }

    const newHash = await securityService.hashPassword(newPassword);
    const users = authService.getAllUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx].password = newHash;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    return { success: true };
  },

  // Deletar conta
  deleteAccount: async (password: string): Promise<{ success: boolean; error?: string }> => {
    const user = authService.getCurrentUser();
    if (!user) return { success: false, error: 'Usuário não encontrado' };

    let match = false;
    if (user.password.length === 64) {
      match = await securityService.verifyPassword(password, user.password);
    } else {
      match = user.password === btoa(password);
    }

    if (!match) return { success: false, error: 'Senha incorreta' };

    const users = authService.getAllUsers().filter(u => u.id !== user.id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Limpar dados do usuário
    localStorage.removeItem(`financasia_transactions_${user.id}`);
    localStorage.removeItem(`financasia_goals_${user.id}`);
    localStorage.removeItem(`financasia_chat_${user.id}`);

    authService.logout();
    return { success: true };
  }
};
