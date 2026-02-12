import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { securityService } from '../../services/securityService';
import { UserSession } from '../../types';

interface LoginPageProps {
  onLogin: (user: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await authService.login(formData.email, formData.password);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          setError(result.error || 'Erro ao fazer login');
        }
      } else {
        if (!formData.name.trim()) {
          setError('Informe seu nome');
          setLoading(false);
          return;
        }

        if (!securityService.validateEmail(formData.email)) {
          setError('Email inválido');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem');
          setLoading(false);
          return;
        }

        const strength = securityService.validatePasswordStrength(formData.password);
        if (!strength.valid) {
          setError(strength.message);
          setLoading(false);
          return;
        }

        const result = await authService.register(formData.email, formData.password, formData.name);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          setError(result.error || 'Erro ao criar conta');
        }
      }
    } catch {
      setError('Erro inesperado. Tente novamente.');
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');

    if (name === 'password' && !isLogin) {
      const strength = securityService.validatePasswordStrength(value);
      setPasswordHint(value.length > 0 ? strength.message : '');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex flex-col items-center justify-center p-4">
      {/* Splash / Brand */}
      <div className="mb-6 text-center animate-fadeIn">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-xl">
          <span className="text-4xl">💰</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">FinançasIA</h1>
        <p className="text-white/80 mt-1 text-sm">Controle Inteligente com IA</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
        {/* Tabs */}
        <div className="flex bg-gray-50 border-b">
          <button
            onClick={() => { setIsLogin(true); setError(''); setPasswordHint(''); }}
            className={`flex-1 py-4 font-semibold text-sm transition-all ${
              isLogin
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🔐 Entrar
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); setPasswordHint(''); }}
            className={`flex-1 py-4 font-semibold text-sm transition-all ${
              !isLogin
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ✨ Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-emerald-500 transition-colors text-gray-900"
                placeholder="Seu nome"
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-emerald-500 transition-colors text-gray-900"
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-emerald-500 transition-colors text-gray-900"
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {passwordHint && !isLogin && (
              <p className={`text-xs mt-1.5 ${
                passwordHint.includes('forte') ? 'text-emerald-600' :
                passwordHint.includes('fraca') ? 'text-orange-500' : 'text-gray-500'
              }`}>
                {passwordHint}
              </p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-emerald-500 transition-colors text-gray-900"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-bold text-base hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processando...
              </span>
            ) : isLogin ? '🔐 Entrar' : '✨ Criar Conta'}
          </button>

          <p className="text-center text-sm text-gray-500">
            {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setPasswordHint(''); }}
              className="text-emerald-600 font-semibold hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </form>
      </div>

      {/* Security badge */}
      <div className="mt-4 flex items-center gap-2 text-white/60 text-xs">
        <span>🔒</span>
        <span>Dados criptografados • 100% seguro</span>
      </div>
    </div>
  );
};
