interface HeaderProps {
  balance: number;
  onMenuClick: () => void;
}

export const Header = ({ balance, onMenuClick }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">💰</span>
              FinançasIA
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-90">🤖 IA</span>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-sm opacity-90 mb-1">Saldo Atual</div>
          <div className="text-3xl font-bold">
            R$ {balance.toFixed(2)}
          </div>
        </div>
      </div>
    </header>
  );
};
