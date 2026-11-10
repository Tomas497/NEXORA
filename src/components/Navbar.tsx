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
  BookOpen,
  Moon,
  Sun,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Clock,
  Volume2,
  VolumeX,
  Check
} from 'lucide-react';
import { Language, UserProfile, UserProgress, UserThemeConfig, CloudSyncStatus } from '../types';
import { getTranslation } from '../i18n';
import { sound } from '../utils/soundEngine';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile;
  progress: UserProgress;
  themeConfig: UserThemeConfig;
  cloudSync: CloudSyncStatus;
  onSwitchUser: (userId: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenThemeModal: () => void;
  onOpenCloudModal: () => void;
  onQuickToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  user,
  progress,
  themeConfig,
  cloudSync,
  onSwitchUser,
  onOpenAuth,
  onLogout,
  onOpenThemeModal,
  onOpenCloudModal,
  onQuickToggleTheme,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const t = (section: string, key: string) => getTranslation(language, section, key);

  const navItems = [
    { id: 'home', label: t('nav', 'home') },
    { id: 'tutor', label: t('nav', 'tutor'), isAi: true },
    { id: 'labs', label: t('nav', 'labs') },
    { id: 'tasks', label: t('nav', 'tasks'), isNew: true },
    { id: 'progress', label: t('nav', 'progress') },
    { id: 'missions', label: t('nav', 'missions') },
    { id: 'leagues', label: t('nav', 'leagues') },
    { id: 'store', label: t('nav', 'store') },
  ];

  if (user.role === 'teacher' || user.isTeacherApproved) {
    navItems.push({ id: 'teacher', label: t('nav', 'teacherStudio'), isAi: false });
  }

  const isNight = themeConfig.mode.startsWith('dark');

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--card-bg)]/95 backdrop-blur-md border-b border-[var(--border-soft)] px-3.5 sm:px-6 lg:px-8 py-2.5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={() => { sound.playClick(); setCurrentTab('home'); }}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7255F7] to-[#24B8E8] flex items-center justify-center shadow-md shadow-[#7255F7]/25 group-hover:scale-105 transition-transform">
              <Sparkle className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-[var(--text-main)] group-hover:text-[#7255F7] transition-colors">
                NEXORA
              </span>
              <p className="hidden xl:block text-[10px] text-[var(--text-muted)] leading-tight font-medium">
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
                  onClick={() => { sound.playClick(); setCurrentTab(item.id); }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#ECE8FE] text-[#7255F7] font-bold shadow-xs'
                      : 'text-[var(--text-muted)] hover:bg-[var(--card-elevated)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {item.isAi && (
                    <Sparkles className="w-3.5 h-3.5 text-[#7255F7]" />
                  )}
                  <span>{item.label}</span>
                  {item.isNew && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#19C6A3]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Night Theme Toggle, Cloud Sync, Stats & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Day / Night Theme Button */}
          <button
            onClick={() => {
              sound.playClick();
              onQuickToggleTheme();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              onOpenThemeModal();
            }}
            title={isNight ? 'Cambiar a Modo Día (Click derecho: Ajustes de tono)' : 'Cambiar a Modo Nocturno (Click derecho: Ajustes de tono)'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              isNight
                ? 'bg-[#1C1A38] text-amber-300 border-[#7255F7]/40 shadow-sm shadow-[#7255F7]/25'
                : 'bg-[var(--card-elevated)] text-[var(--text-muted)] hover:text-[#7255F7] border-[var(--border-soft)]'
            }`}
          >
            {isNight ? <Moon className="w-4 h-4 fill-amber-300/40" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Cloud Sync Status Badge */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCloudModal();
            }}
            title={`Sincronización en la nube: ${cloudSync.status === 'synced' ? 'Al día' : 'Sincronizando'}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--card-elevated)] border border-[var(--border-soft)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[#7255F7]/30 transition-all cursor-pointer"
          >
            <Cloud className={`w-3.5 h-3.5 ${cloudSync.status === 'syncing' ? 'text-amber-500 animate-spin' : 'text-emerald-500'}`} />
            <span className="hidden sm:inline text-[11px]">
              {cloudSync.status === 'syncing' ? 'Guardando...' : 'Nube'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>

          {/* Streak Counter */}
          <div 
            title={t('home', 'streakDays')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs sm:text-sm font-bold ${
              progress.streak > 3
                ? 'bg-[#FFF5E6] border-[#FFB547] text-[#D97706] animate-fire-glow'
                : 'bg-[#FFF9F0] border-[#FFB547]/30 text-[#D97706]'
            }`}
          >
            <Flame className={`w-4 h-4 ${progress.streak > 3 ? 'animate-flame fill-[#FF8800] text-[#FF8800]' : 'fill-[#FFB547] text-[#FFB547]'}`} />
            <span>{progress.streak}</span>
          </div>

          {/* Energy / Hearts */}
          <div 
            title="Energía disponible para lecciones"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEEBED] border border-[#FF6B91]/30 text-[#E11D48] text-xs sm:text-sm font-bold"
          >
            <Heart className="w-4 h-4 fill-[#FF6B91] text-[#FF6B91]" />
            <span>{progress.energy}/{progress.maxEnergy}</span>
          </div>

          {/* Gems Counter */}
          <button
            onClick={() => { sound.playClick(); setCurrentTab('store'); }}
            title={t('shop', 'yourGems')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E6F9F5] border border-[#19C6A3]/30 text-[#059669] text-xs sm:text-sm font-bold cursor-pointer hover:bg-[#D5F5EE] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#19C6A3] fill-[#19C6A3]" />
            <span>{progress.gems}</span>
          </button>

          {/* Demo Profiles Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--card-elevated)] border border-[var(--border-soft)] text-xs font-semibold text-[var(--text-muted)] hover:text-[#7255F7] transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Demo</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showDemoMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-soft)] p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowDemoMenu(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  {t('auth', 'demoProfiles')}
                </div>
                <button
                  onClick={() => { onSwitchUser('user_new'); setShowDemoMenu(false); }}
                  className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    user.id === 'user_new' ? 'bg-[#ECE8FE] text-[#7255F7] font-bold' : 'hover:bg-[var(--card-elevated)] text-[var(--text-main)]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">✨ Tomás Ortiz (Desde cero)</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Nivel 1 · 0 XP · Personalizada</div>
                  </div>
                  {user.id === 'user_new' && <span className="text-xs">✓</span>}
                </button>

                <button
                  onClick={() => { onSwitchUser('user_sofia'); setShowDemoMenu(false); }}
                  className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    user.id === 'user_sofia' ? 'bg-[#ECE8FE] text-[#7255F7] font-bold' : 'hover:bg-[var(--card-elevated)] text-[var(--text-main)]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Mockup: Sofía Ramírez</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Estudiante Nivel 5 (2.340 XP)</div>
                  </div>
                  {user.id === 'user_sofia' && <span className="text-xs">✓</span>}
                </button>

                <button
                  onClick={() => { onSwitchUser('user_teacher'); setShowDemoMenu(false); }}
                  className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    user.id === 'user_teacher' ? 'bg-[#ECE8FE] text-[#7255F7] font-bold' : 'hover:bg-[var(--card-elevated)] text-[var(--text-main)]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Prof. Carlos Martínez</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Teacher Studio · Cálculo I</div>
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
              className="flex items-center gap-1 p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--card-elevated)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              title="Cambiar idioma"
            >
              <Globe className="w-4 h-4 text-[#7255F7]" />
              <span className="text-xs font-bold uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showLangMenu && (
              <div 
                className="absolute right-0 mt-2 w-36 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-soft)] p-1.5 z-50 animate-in fade-in zoom-in-95"
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
                      language === l.code ? 'bg-[#ECE8FE] text-[#7255F7]' : 'text-[var(--text-main)] hover:bg-[var(--card-elevated)]'
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
                className="absolute right-0 mt-2 w-60 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-soft)] p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="p-2 border-b border-[var(--border-soft)] mb-1">
                  <div className="font-heading font-bold text-sm text-[var(--text-main)] truncate">{user.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">@{user.username}</div>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ECE8FE] text-[#7255F7] text-[10px] font-bold">
                    Nivel {progress.level} · Liga {progress.currentLeague}
                  </div>
                </div>

                <button
                  onClick={() => { setCurrentTab('progress'); setShowUserMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#7255F7]" />
                  <span>Mi Perfil y Progreso</span>
                </button>

                <button
                  onClick={() => { onOpenThemeModal(); setShowUserMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tonalidades & Sonidos</span>
                </button>

                <button
                  onClick={() => { onOpenCloudModal(); setShowUserMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                >
                  <Cloud className="w-3.5 h-3.5 text-[#24B8E8]" />
                  <span>Sincronización en la Nube</span>
                </button>

                <button
                  onClick={() => { setCurrentTab('settings'); setShowUserMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#7255F7]" />
                  <span>{t('nav', 'settings')}</span>
                </button>

                <div className="border-t border-[var(--border-soft)] mt-1 pt-1">
                  <button
                    onClick={() => { onOpenAuth(); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#24B8E8]" />
                    <span>Cambiar de cuenta</span>
                  </button>
                  <button
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#E11D48] hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
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
