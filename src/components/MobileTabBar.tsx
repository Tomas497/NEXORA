import React from 'react';
import { Home, Sparkles, User, FlaskConical, Clock } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n';
import { sound } from '../utils/soundEngine';

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

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--card-bg)]/95 backdrop-blur-md border-t border-[var(--border-soft)] px-2 py-1 flex items-center justify-around shadow-lg transition-colors safe-area-pb">
      {/* 1. Inicio */}
      <button
        onClick={() => {
          sound.playClick();
          setCurrentTab('home');
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          currentTab === 'home' ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${currentTab === 'home' ? 'bg-[var(--primary-light)]' : ''}`}>
          <Home className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5 leading-none">{t('nav', 'home')}</span>
      </button>

      {/* 2. Tareas */}
      <button
        onClick={() => {
          sound.playClick();
          setCurrentTab('tasks');
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          currentTab === 'tasks' ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${currentTab === 'tasks' ? 'bg-[var(--primary-light)]' : ''}`}>
          <Clock className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5 leading-none">Tareas</span>
      </button>

      {/* 3. Center Elevated Nexo Tutor IA Button */}
      <div className="relative -top-3 px-1">
        <button
          onClick={() => {
            sound.playClick();
            setCurrentTab('tutor');
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer ${
            currentTab === 'tutor'
              ? 'ring-4 ring-[var(--card-bg)] scale-105'
              : 'hover:scale-105'
          }`}
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #24B8E8 100%)',
            boxShadow: '0 8px 20px -4px var(--night-glow)',
          }}
          title="Tutor Nexo IA"
        >
          <Sparkles className="w-6 h-6 fill-white" />
        </button>
      </div>

      {/* 4. Laboratorios */}
      <button
        onClick={() => {
          sound.playClick();
          setCurrentTab('labs');
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          currentTab === 'labs' ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${currentTab === 'labs' ? 'bg-[var(--primary-light)]' : ''}`}>
          <FlaskConical className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5 leading-none">{t('nav', 'labs')}</span>
      </button>

      {/* 5. Perfil / Mapa */}
      <button
        onClick={() => {
          sound.playClick();
          setCurrentTab('progress');
        }}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
          currentTab === 'progress' ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'
        }`}
      >
        <div className={`p-1.5 rounded-xl transition-all ${currentTab === 'progress' ? 'bg-[var(--primary-light)]' : ''}`}>
          <User className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5 leading-none">Perfil</span>
      </button>
    </nav>
  );
};
