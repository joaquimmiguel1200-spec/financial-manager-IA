interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: '🏠' },
    { id: 'transactions', label: 'Extrato', icon: '📊' },
    { id: 'chat', label: 'Chat', icon: '💬', highlight: true },
    { id: 'goals', label: 'Metas', icon: '🎯' },
    { id: 'user', label: 'Perfil', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
      <div className="max-w-4xl mx-auto grid grid-cols-5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 py-2 transition-all relative ${
              activeTab === tab.id
                ? tab.highlight ? 'text-violet-600' : 'text-emerald-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.highlight ? (
              <div className={`w-12 h-12 -mt-6 rounded-full flex items-center justify-center shadow-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-purple-700 scale-110'
                  : 'bg-gradient-to-r from-violet-500 to-purple-600'
              }`}>
                <span className="text-xl filter drop-shadow-sm">💬</span>
              </div>
            ) : (
              <span className={`text-xl transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
            )}
            <span className={`text-[10px] font-semibold ${tab.highlight ? 'mt-0' : ''}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className={`absolute bottom-0 w-10 h-1 rounded-full ${
                tab.highlight ? 'bg-violet-600' : 'bg-emerald-600'
              }`} />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
