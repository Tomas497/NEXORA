import React, { useState } from 'react';
import { 
  Flame, 
  Heart, 
  Sparkles, 
  Globe, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  GraduationCap,
  Sparkle,
  BookOpen
} from 'lucide-react';
import { Language, UserProfile, UserProgress } from '../types';
import { getTranslation } from '../i18n';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile;
  progress: UserProgress;
  onSwitchUser: (userId: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  user,
  progress,
  onSwitchUser,
  onOpenAuth,
  onLogout,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const t = (section: string, key: string) => getTranslation(language, section, key);

  const navItems = [
    { id: 'home', label: t('nav', 'home') },
    { id: 'tutor', label: t('nav', 'tutor'), isAi: true },
    { id: 'labs', label: t('nav', 'labs') },
    { id: 'progress', label: t('nav', 'progress') },
    { id: 'missions', label: t('nav', 'missions') },
    { id: 'leagues', label: t('nav', 'leagues') },
    { id: 'store', label: t('nav', 'store') },
  ];

  if (user.role === 'teacher' || user.isTeacherApproved) {
    navItems.push({ id: 'teacher', label: t('nav', 'teacherStudio'), isAi: false });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E3F5] px-4 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Lema */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7255F7] to-[#24B8E8] flex items-center justify-center shadow-md shadow-[#7255F7]/25 group-hover:scale-105 transition-transform">
              <Sparkle className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-[#202038] group-hover:text-[#7255F7] transition-colors">
                NEXORA
              </span>
              <p className="hidden xl:block text-[10px] text-[#7A7A9E] leading-tight font-medium">
                {t('brand', 'tagline')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#ECE8FE] text-[#7255F7]'
                      : 'text-[#585876] hover:bg-[#F5F4FC] hover:text-[#202038]'
                  }`}
                >
                  {item.isAi && (
                    <Sparkles className="w-3.5 h-3.5 text-[#7255F7]" />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Stats, Quick Demo Switcher, Language & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Counter */}
          <div 
            title={t('home', 'streakDays')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFF5E6] border border-[#FFB547]/30 text-[#D97706] text-xs sm:text-sm font-bold"
          >
            <Flame className="w-4 h-4 text-[#FFB547] fill-[#FFB547]" />
            <span>{progress.streak}</span>
          </div>

          {/* Energy / Hearts */}
          <div 
            title="Energía disponible para lecciones"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEEBED] border border-[#FF6B91]/30 text-[#E11D48] text-xs sm:text-sm font-bold"
          >
            <Heart className="w-4 h-4 text-[#FF6B91] fill-[#FF6B91]" />
            <span>{progress.energy}/{progress.maxEnergy}</span>
          </div>

          {/* Gems */}
          <button
            onClick={() => setCurrentTab('store')}
            title={t('shop', 'yourGems')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E6F9F5] border border-[#19C6A3]/30 text-[#059669] text-xs sm:text-sm font-bold cursor-pointer hover:bg-[#D5F5EE] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#19C6A3] fill-[#19C6A3]" />
            <span>{progress.gems}</span>
          </button>

          {/* Quick Demo Account Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F5F4FC] border border-[#E5E3F5] text-xs font-semibold text-[#585876] hover:bg-[#ECE8FE] hover:text-[#7255F7] transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Demo</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showDemoMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E3F5] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setShowDemoMenu(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#8E8EA8] uppercase tracking-wider">
                  {t('auth', 'demoProfiles')}
                </div>
                <button
                  onClick={() => { onSwitchUser('user_new'); setShowDemoMenu(false); }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    user.id === 'user_new' ? 'bg-[#ECE8FE] text-[#7255F7] font-bold' : 'hover:bg-[#F5F4FC] text-[#202038]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">✨ Mi Cuenta (Desde cero)</div>
                    <div className="text-[10px] text-[#7A7A9E]">Nivel 1 · 0 XP · Personalizada</div>
                  </div>
                  {user.id === 'user_new' && <span className="text-xs">✓</span>}
                </button>

                <button
                  onClick={() => { onSwitchUser('user_sofia'); setShowDemoMenu(false); }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    user.id === 'user_sofia' ? 'bg-[#ECE8FE] text-[#7255F7] font-bold' : 'hover:bg-[#F5F4FC] text-[#202038]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Mockup diseño: Sofía</div>
                    <div className="text-[10px] text-[#7A7A9E]">Estudiante Nivel 5 (2.340 XP)</div>
                  </div>
                  {user.id === 'user_sofia' && <span className="text-xs">✓</span>}
                </button>

                <button
                  onClick={() => { onSwitchUser('user_teacher'); setShowDemoMenu(false); }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    user.id === 'user_teacher' ? 'bg-[#ECE8FE] text-[#7255F7] font-bold' : 'hover:bg-[#F5F4FC] text-[#202038]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Prof. Carlos Martínez</div>
                    <div className="text-[10px] text-[#7A7A9E]">Teacher Studio · Cálculo I</div>
                  </div>
                  {user.id === 'user_teacher' && <span className="text-xs">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 p-2 rounded-xl text-[#585876] hover:bg-[#F5F4FC] hover:text-[#202038] transition-colors cursor-pointer"
              title="Cambiar idioma"
            >
              <Globe className="w-4 h-4 text-[#7255F7]" />
              <span className="text-xs font-bold uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showLangMenu && (
              <div 
                className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-[#E5E3F5] p-1.5 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowLangMenu(false)}
              >
                {[
                  { code: 'es', label: 'Español' },
                  { code: 'en', label: 'English' },
                  { code: 'pt', label: 'Português' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code as Language); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      language === l.code ? 'bg-[#ECE8FE] text-[#7255F7]' : 'text-[#3D3D58] hover:bg-[#F5F4FC]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
              style={{ backgroundColor: user.avatar.bgColor || '#7255F7' }}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </button>

            {showUserMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5E3F5] p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="p-2 border-b border-[#F0EEFA] mb-1">
                  <div className="font-heading font-bold text-sm text-[#202038] truncate">{user.name}</div>
                  <div className="text-[11px] text-[#7A7A9E] truncate">@{user.username}</div>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ECE8FE] text-[#7255F7] text-[10px] font-bold">
                    Nivel {progress.level} · {progress.currentLeague}
                  </div>
                </div>

                <button
                  onClick={() => { setCurrentTab('progress'); setShowUserMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#4B4B68] hover:bg-[#F5F4FC] hover:text-[#202038] flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#7255F7]" />
                  <span>Mi Perfil y Progreso</span>
                </button>

                <button
                  onClick={() => { setCurrentTab('settings'); setShowUserMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#4B4B68] hover:bg-[#F5F4FC] hover:text-[#202038] flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#7255F7]" />
                  <span>{t('nav', 'settings')}</span>
                </button>

                {user.role === 'teacher' && (
                  <button
                    onClick={() => { setCurrentTab('teacher'); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#4B4B68] hover:bg-[#F5F4FC] hover:text-[#202038] flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#19C6A3]" />
                    <span>Teacher Studio</span>
                  </button>
                )}

                <div className="border-t border-[#F0EEFA] mt-1 pt-1">
                  <button
                    onClick={() => { onOpenAuth(); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#4B4B68] hover:bg-[#F5F4FC] hover:text-[#202038] flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#24B8E8]" />
                    <span>Cambiar de cuenta</span>
                  </button>
                  <button
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#E11D48] hover:bg-[#FEEBED] flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('brand', 'logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
