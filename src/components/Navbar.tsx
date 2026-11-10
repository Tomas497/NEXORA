import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  Globe, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Sparkle,
  BookOpen,
  Moon,
  Sun,
  Cloud,
  Check,
  Palette,
  MoreHorizontal,
  GraduationCap,
  Trophy,
  Target,
  ShoppingBag,
  FlaskConical,
  Clock,
  Home
} from 'lucide-react';
import { Language, UserProfile, UserProgress, UserThemeConfig, CloudSyncStatus, AccentColor } from '../types';
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
  onSelectAccent?: (accent: AccentColor) => void;
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
  onSelectAccent,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const t = (section: string, key: string) => getTranslation(language, section, key);
  const isNight = themeConfig.mode.startsWith('dark');

  // Primary tabs (always visible on desktop)
  const primaryTabs = [
    { id: 'home', label: t('nav', 'home'), icon: Home },
    { id: 'tutor', label: t('nav', 'tutor'), icon: Sparkles, isAi: true },
    { id: 'tasks', label: 'Tareas', icon: Clock, isNew: true },
    { id: 'labs', label: t('nav', 'labs'), icon: FlaskConical },
  ];

  // Secondary tabs (consolidated under "Más" dropdown to avoid navbar overflow)
  const secondaryTabs = [
    { id: 'progress', label: 'Mapa & Perfil', icon: User, desc: 'Visualiza tu dominio conceptual' },
    { id: 'missions', label: t('nav', 'missions'), icon: Target, desc: 'Retos y misiones diarias' },
    { id: 'leagues', label: t('nav', 'leagues'), icon: Trophy, desc: 'Clasificación semanal' },
    { id: 'store', label: t('nav', 'store'), icon: ShoppingBag, desc: 'Recompensas y potenciadores' },
  ];

  if (user.role === 'teacher' || user.isTeacherApproved) {
    secondaryTabs.push({ 
      id: 'teacher', 
      label: t('nav', 'teacherStudio'), 
      icon: GraduationCap, 
      desc: 'Gestión y asignaciones para alumnos' 
    });
  }

  const isSecondaryActive = secondaryTabs.some(tab => tab.id === currentTab);
  const activeSecondaryTab = secondaryTabs.find(tab => tab.id === currentTab);

  const ACCENT_LIST: { id: AccentColor; name: string; hex: string }[] = [
    { id: 'purple', name: 'Nexo', hex: '#7255F7' },
    { id: 'violet', name: 'Violeta', hex: '#8B5CF6' },
    { id: 'blue', name: 'Azul', hex: '#24B8E8' },
    { id: 'cyan', name: 'Cyan', hex: '#06B6D4' },
    { id: 'mint', name: 'Menta', hex: '#10B981' },
    { id: 'emerald', name: 'Esmeralda', hex: '#059669' },
    { id: 'lime', name: 'Lima', hex: '#84CC16' },
    { id: 'amber', name: 'Ámbar', hex: '#F59E0B' },
    { id: 'orange', name: 'Naranja', hex: '#F97316' },
    { id: 'ruby', name: 'Rubí', hex: '#E11D48' },
    { id: 'pink', name: 'Rosa', hex: '#EC4899' },
    { id: 'indigo', name: 'Índigo', hex: '#6366F1' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-[var(--card-bg)]/95 backdrop-blur-md border-b border-[var(--border-soft)] px-3 sm:px-6 py-2 transition-colors duration-300 overflow-x-clip">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-3 lg:gap-5 min-w-0">
          <button 
            onClick={() => { sound.playClick(); setCurrentTab('home'); }}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#7255F7] to-[#24B8E8] flex items-center justify-center shadow-md shadow-[#7255F7]/25 group-hover:scale-105 transition-transform shrink-0">
              <Sparkle className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
            </div>
            <div className="min-w-0">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors leading-none block">
                NEXORA
              </span>
            </div>
          </button>

          {/* Primary Navigation Tabs (Desktop only - Compact 4 items + "Más" menu) */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryTabs.map((item) => {
              const active = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { sound.playClick(); setCurrentTab(item.id); }}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold shadow-2xs'
                      : 'text-[var(--text-muted)] hover:bg-[var(--card-elevated)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[var(--primary)]' : ''}`} />
                  <span>{item.label}</span>
                  {item.isNew && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#19C6A3]" />
                  )}
                </button>
              );
            })}

            {/* Consolidated "Más" Dropdown for secondary tabs */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSecondaryActive
                    ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold shadow-2xs'
                    : 'text-[var(--text-muted)] hover:bg-[var(--card-elevated)] hover:text-[var(--text-main)]'
                }`}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
                <span>{isSecondaryActive && activeSecondaryTab ? activeSecondaryTab.label : 'Más'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMoreMenu && (
                <div 
                  className="absolute left-0 mt-2 w-56 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-soft)] p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setShowMoreMenu(false)}
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Herramientas de Estudio
                  </div>
                  {secondaryTabs.map((tab) => {
                    const active = currentTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          sound.playClick();
                          setCurrentTab(tab.id);
                          setShowMoreMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center gap-2.5 cursor-pointer ${
                          active
                            ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold'
                            : 'hover:bg-[var(--card-elevated)] text-[var(--text-main)]'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${active ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card-elevated)] text-[var(--text-muted)]'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate">{tab.label}</div>
                          <div className="text-[10px] text-[var(--text-muted)] truncate">{tab.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Controls: Clean, Non-Overflowing Responsive Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Streak Counter - Compact pill on mobile, full on tablet+ */}
          <div 
            title={t('home', 'streakDays')}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#FFF9F0] border border-[#FFB547]/30 text-[#D97706] text-xs font-bold shrink-0"
          >
            <Flame className="w-3.5 h-3.5 fill-[#FFB547] text-[#FFB547]" />
            <span>{progress.streak}</span>
          </div>

          {/* Gems Counter - Compact pill */}
          <button
            onClick={() => { sound.playClick(); setCurrentTab('store'); }}
            title={t('shop', 'yourGems')}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-[#E6F9F5] border border-[#19C6A3]/30 text-[#059669] text-xs font-bold cursor-pointer hover:bg-[#D5F5EE] transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#19C6A3] fill-[#19C6A3]" />
            <span>{progress.gems}</span>
          </button>

          {/* Quick Color Palette Selector */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setShowColorPicker(!showColorPicker);
              }}
              title="Cambiar color de acento y tema visual"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border border-[var(--border-soft)] bg-[var(--card-elevated)] hover:border-[var(--primary)] text-[var(--text-muted)] hover:text-[var(--primary)] shadow-2xs relative shrink-0"
            >
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span 
                className="w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 border border-white dark:border-black shadow-xs"
                style={{ backgroundColor: 'var(--primary)' }}
              />
            </button>

            {showColorPicker && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-soft)] p-3 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowColorPicker(false)}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-soft)]">
                  <span className="font-heading font-extrabold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[var(--primary)]" />
                    Color de Acento
                  </span>
                  <button
                    onClick={() => {
                      setShowColorPicker(false);
                      onOpenThemeModal();
                    }}
                    className="text-[10px] font-bold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    Avanzado →
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2 pt-1">
                  {ACCENT_LIST.map((acc) => {
                    const isSelected = themeConfig.accent === acc.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => {
                          sound.playClick();
                          if (onSelectAccent) onSelectAccent(acc.id);
                          setShowColorPicker(false);
                        }}
                        title={acc.name}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-115 cursor-pointer relative shadow-sm ${
                          isSelected ? 'ring-2 ring-offset-2 ring-[var(--text-main)] scale-110' : ''
                        }`}
                        style={{ backgroundColor: acc.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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
            title={isNight ? 'Cambiar a Modo Día' : 'Cambiar a Modo Nocturno'}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
              isNight
                ? 'bg-[#1C1A38] text-amber-300 border-[#7255F7]/40 shadow-sm shadow-[#7255F7]/25'
                : 'bg-[var(--card-elevated)] text-[var(--text-muted)] hover:text-[var(--primary)] border-[var(--border-soft)]'
            }`}
          >
            {isNight ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300/40" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Cloud Sync Status Icon Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCloudModal();
            }}
            title={`Sincronización en la nube: ${cloudSync.status === 'synced' ? 'Al día' : 'Sincronizando'}`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--card-elevated)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-all cursor-pointer relative shrink-0"
          >
            <Cloud className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${cloudSync.status === 'syncing' ? 'text-amber-500 animate-spin' : 'text-emerald-500'}`} />
            <span className={`w-1.5 h-1.5 rounded-full absolute top-1.5 right-1.5 ${cloudSync.status === 'syncing' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          </button>

          {/* User Profile Avatar & Comprehensive Control Hub */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm hover:scale-105 transition-transform cursor-pointer shrink-0 text-xs sm:text-sm"
              style={{ backgroundColor: user.avatar.bgColor || '#7255F7' }}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </button>

            {showUserMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-soft)] p-2.5 z-50 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                {/* Profile Header */}
                <div className="p-2 border-b border-[var(--border-soft)] mb-1">
                  <div className="font-heading font-bold text-sm text-[var(--text-main)] truncate">{user.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">@{user.username}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--primary-light)] text-[var(--primary)] text-[10px] font-bold">
                      Nivel {progress.level}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF5E6] text-[#D97706] text-[10px] font-bold flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5" />
                      {progress.streak} días
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#E6F9F5] text-[#059669] text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      {progress.gems}
                    </span>
                  </div>
                </div>

                {/* Navigation inside drawer */}
                <div className="space-y-0.5 py-1">
                  <button
                    onClick={() => { setCurrentTab('progress'); setShowUserMenu(false); }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Mi Perfil y Progreso</span>
                  </button>

                  <button
                    onClick={() => { onOpenThemeModal(); setShowUserMenu(false); }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Tonalidades & Sonidos</span>
                  </button>

                  <button
                    onClick={() => { onOpenCloudModal(); setShowUserMenu(false); }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                  >
                    <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Sincronización en la Nube</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('settings'); setShowUserMenu(false); }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>{t('nav', 'settings')}</span>
                  </button>
                </div>

                {/* Language Switcher inside User Menu */}
                <div className="border-t border-[var(--border-soft)] my-1 pt-1.5 px-2">
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[var(--primary)]" />
                    <span>Idioma</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { code: 'es', label: 'ES' },
                      { code: 'en', label: 'EN' },
                      { code: 'pt', label: 'PT' },
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLanguage(l.code as Language); }}
                        className={`py-1 text-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          language === l.code
                            ? 'bg-[var(--primary-light)] text-[var(--primary)] ring-1 ring-[var(--primary)]'
                            : 'bg-[var(--card-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Demo Switcher inside User Menu */}
                <div className="border-t border-[var(--border-soft)] my-1 pt-1.5 px-2">
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                    Cambiar Perfil Demo
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'user_sofia', name: 'Sofía (Nivel 5)' },
                      { id: 'user_new', name: 'Tomás (Nivel 1)' },
                      { id: 'user_teacher', name: 'Prof. Carlos' },
                    ].map((demo) => (
                      <button
                        key={demo.id}
                        onClick={() => {
                          onSwitchUser(demo.id);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          user.id === demo.id
                            ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold'
                            : 'text-[var(--text-muted)] hover:bg-[var(--card-elevated)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        <span className="truncate">{demo.name}</span>
                        {user.id === demo.id && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auth Actions */}
                <div className="border-t border-[var(--border-soft)] mt-1.5 pt-1.5">
                  <button
                    onClick={() => { onOpenAuth(); setShowUserMenu(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--card-elevated)] flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#24B8E8]" />
                    <span>Iniciar sesión</span>
                  </button>
                  <button
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#E11D48] hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
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
