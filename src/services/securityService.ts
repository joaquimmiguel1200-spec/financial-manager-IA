// Serviço de segurança - Criptografia e proteção de dados
// Para requisitos da Play Store

const ENCRYPTION_KEY = 'financasia-secure-2024';

export const securityService = {
  // Hash de senha usando SHA-256 (mais seguro que btoa)
  hashPassword: async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + ENCRYPTION_KEY);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // Verificar senha
  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    const passwordHash = await securityService.hashPassword(password);
    return passwordHash === hash;
  },

  // Gerar ID único seguro
  generateId: (): string => {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return Array.from(array, n => n.toString(36)).join('') + Date.now().toString(36);
  },

  // Sanitizar input para prevenir XSS
  sanitizeInput: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  // Validar email
  validateEmail: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validar força da senha
  validatePasswordStrength: (password: string): { valid: boolean; message: string } => {
    if (password.length < 6) {
      return { valid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
    }
    if (password.length < 8) {
      return { valid: true, message: 'Senha fraca - recomendamos 8+ caracteres' };
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (hasUpper && hasLower && hasNumber) {
      return { valid: true, message: 'Senha forte ✓' };
    }
    return { valid: true, message: 'Senha média - adicione maiúsculas, minúsculas e números' };
  },

  // Criptografar dados sensíveis para storage
  encryptData: (data: string): string => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(data)));
      // Simple XOR cipher for local storage
      let result = '';
      for (let i = 0; i < encoded.length; i++) {
        result += String.fromCharCode(
          encoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
        );
      }
      return btoa(result);
    } catch {
      return btoa(data);
    }
  },

  // Descriptografar dados
  decryptData: (encryptedData: string): string => {
    try {
      const decoded = atob(encryptedData);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(
          decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
        );
      }
      return decodeURIComponent(escape(atob(result)));
    } catch {
      try { return atob(encryptedData); } catch { return encryptedData; }
    }
  },

  // Rate limiting para tentativas de login
  checkLoginAttempts: (email: string): boolean => {
    const key = `login_attempts_${email}`;
    const data = localStorage.getItem(key);
    if (!data) return true;

    const { count, timestamp } = JSON.parse(data);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - timestamp > fiveMinutes) {
      localStorage.removeItem(key);
      return true;
    }

    return count < 5;
  },

  recordLoginAttempt: (email: string): void => {
    const key = `login_attempts_${email}`;
    const data = localStorage.getItem(key);
    const now = Date.now();

    if (!data) {
      localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
    } else {
      const parsed = JSON.parse(data);
      parsed.count += 1;
      localStorage.setItem(key, JSON.stringify(parsed));
    }
  },

  clearLoginAttempts: (email: string): void => {
    localStorage.removeItem(`login_attempts_${email}`);
  },

  // Session token
  generateSessionToken: (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }
};
