import React from 'react';
import { Home, Sparkles, User, FlaskConical, Target } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n';

interface MobileTabBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentTab,
  setCurrentTab,
  language,
}) => {
  const t = (section: string, key: string) => getTranslation(language, section, key);

  const tabs = [
    { id: 'home', label: t('nav', 'home'), icon: Home },
    { id: 'tutor', label: t('nav', 'tutor'), icon: Sparkles },
    { id: 'progress', label: 'Perfil', icon: User },
    { id: 'labs', label: t('nav', 'labs'), icon: FlaskConical },
    { id: 'missions', label: t('nav', 'missions'), icon: Target },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E3F5] px-2 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const active = currentTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              active ? 'text-[#7255F7] font-bold' : 'text-[#8E8EA8]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${active ? 'bg-[#ECE8FE]' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      {/* Floating Sparkle Action button matching screenshot */}
      <button
        onClick={() => setCurrentTab('tutor')}
        className="absolute -top-6 right-6 w-12 h-12 rounded-full bg-gradient-to-tr from-[#7255F7] to-[#24B8E8] text-white flex items-center justify-center shadow-lg shadow-[#7255F7]/40 active:scale-95 transition-transform cursor-pointer"
        title="Abrir Tutor Nexo"
      >
        <Sparkles className="w-6 h-6 fill-white" />
      </button>
    </div>
  );
};
