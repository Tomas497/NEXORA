import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Eye, 
  Check, 
  X, 
  CloudRain, 
  Headphones, 
  Waves,
  Zap
} from 'lucide-react';
import { UserThemeConfig, ThemeMode, AccentColor, AmbientSoundType } from '../types';
import { sound } from '../utils/soundEngine';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: UserThemeConfig;
  onUpdateTheme: (updated: Partial<UserThemeConfig>) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  themeConfig,
  onUpdateTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'sound'>('theme');

  if (!isOpen) return null;

  const handleSelectMode = (mode: ThemeMode) => {
    sound.playClick();
    onUpdateTheme({ mode });
  };

  const handleSelectAccent = (accent: AccentColor) => {
    sound.playClick();
    onUpdateTheme({ accent });
  };

  const handleToggleSound = (enabled: boolean) => {
    sound.setMuted(!enabled);
    if (enabled) sound.playClick();
    onUpdateTheme({ soundEnabled: enabled });
  };

  const handleSelectAmbient = (type: AmbientSoundType) => {
    if (type === 'none') {
      sound.stopAmbient();
    } else {
      sound.startAmbient(type);
    }
    onUpdateTheme({ ambientSound: type });
  };

  const handleVolumeChange = (vol: number) => {
    sound.setVolume(vol);
    onUpdateTheme({ soundVolume: vol });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[var(--card-bg)] text-[var(--text-main)] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border-soft)] space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-soft)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7255F7]/15 text-[#7255F7] flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl tracking-tight">
                Tonalidades & Personalización
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Adapta la iluminación, sonidos y colores para máxima concentración.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[var(--card-elevated)] hover:bg-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Tonalidades vs Sonidos */}
        <div className="flex bg-[var(--card-elevated)] p-1 rounded-2xl border border-[var(--border-soft)]">
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'theme'
                ? 'bg-[var(--card-bg)] text-[#7255F7] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Tonalidades & Modo Nocturno</span>
          </button>
          <button
            onClick={() => setActiveTab('sound')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'sound'
                ? 'bg-[var(--card-bg)] text-[#7255F7] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Sonidos & Concentración</span>
          </button>
        </div>

        {/* Tab 1: Theme & Night Palettes */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            {/* 4 Themed Palettes */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] block">
                Paleta de Iluminación Nocturna
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Light Mode */}
                <button
                  type="button"
                  onClick={() => handleSelectMode('light')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    themeConfig.mode === 'light'
                      ? 'border-2 border-[#7255F7] bg-[#ECE8FE]/40 shadow-sm'
                      : 'border-[var(--border-soft)] bg-[var(--card-elevated)] hover:border-[#7255F7]/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs sm:text-sm">Modo Claro (Día)</span>
                      {themeConfig.mode === 'light' && <Check className="w-4 h-4 text-[#7255F7]" />}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                      Fondo blanco nube suave, ideal para ambientes bien iluminados.
                    </p>
                  </div>
                </button>

                {/* 2. Cosmic Midnight */}
                <button
                  type="button"
                  onClick={() => handleSelectMode('dark-midnight')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    themeConfig.mode === 'dark-midnight'
                      ? 'border-2 border-[#7255F7] bg-[#7255F7]/15 shadow-sm'
                      : 'border-[var(--border-soft)] bg-[var(--card-elevated)] hover:border-[#7255F7]/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1C1A38] text-[#7255F7] flex items-center justify-center shrink-0 border border-[#7255F7]/30">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs sm:text-sm">Medianoche Cósmica</span>
                      {themeConfig.mode === 'dark-midnight' && <Check className="w-4 h-4 text-[#7255F7]" />}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                      Azul índigo oscuro profundo. Reduce el resplandor sin perder contraste.
                    </p>
                  </div>
                </button>

                {/* 3. Pure AMOLED */}
                <button
                  type="button"
                  onClick={() => handleSelectMode('dark-amoled')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    themeConfig.mode === 'dark-amoled'
                      ? 'border-2 border-[#7255F7] bg-black/40 shadow-sm'
                      : 'border-[var(--border-soft)] bg-[var(--card-elevated)] hover:border-[#7255F7]/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0 border border-white/20">
                    <span className="font-mono text-xs font-bold">OLED</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs sm:text-sm">AMOLED Puro (Negro)</span>
                      {themeConfig.mode === 'dark-amoled' && <Check className="w-4 h-4 text-[#7255F7]" />}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                      Negro absoluto #000000. Máximo ahorro de batería y descanso en penumbra.
                    </p>
                  </div>
                </button>

                {/* 4. Warm Amber / Blue-Light filter */}
                <button
                  type="button"
                  onClick={() => handleSelectMode('dark-warm')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    themeConfig.mode === 'dark-warm'
                      ? 'border-2 border-amber-500 bg-amber-500/10 shadow-sm'
                      : 'border-[var(--border-soft)] bg-[var(--card-elevated)] hover:border-amber-500/40'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs sm:text-sm">Luz Cálida / Ámbar</span>
                      {themeConfig.mode === 'dark-warm' && <Check className="w-4 h-4 text-amber-500" />}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                      Tonalidad sepia/ámbar con filtro anti-luz azul para no alterar el sueño.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Accent Colors */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] block">
                Color de Acento & Personalización
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {[
                  { id: 'purple', name: 'Nexo', color: '#7255F7' },
                  { id: 'blue', name: 'Eléctrico', color: '#24B8E8' },
                  { id: 'mint', name: 'Menta', color: '#10B981' },
                  { id: 'orange', name: 'Energía', color: '#F97316' },
                  { id: 'pink', name: 'Creativo', color: '#EC4899' },
                  { id: 'emerald', name: 'Esmeralda', color: '#14B8A6' },
                ].map((acc) => {
                  const isSelected = themeConfig.accent === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectAccent(acc.id as any)}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-2 border-[var(--text-main)] shadow-sm scale-105'
                          : 'border-[var(--border-soft)] hover:bg-[var(--card-elevated)]'
                      }`}
                    >
                      <div 
                        className="w-7 h-7 rounded-full shadow-sm flex items-center justify-center text-white"
                        style={{ backgroundColor: acc.color }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-[11px] font-bold">{acc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accessibility / Night visibility options */}
            <div className="space-y-3 p-4 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-heading font-bold text-xs sm:text-sm">
                    Alto Contraste para Fórmulas Matemáticas
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Realza trazos, matrices y símbolos matemáticos en sesiones nocturnas.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={themeConfig.highContrastNight}
                  onChange={(e) => onUpdateTheme({ highContrastNight: e.target.checked })}
                  className="w-5 h-5 accent-[#7255F7] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-soft)]">
                <div>
                  <div className="font-heading font-bold text-xs sm:text-sm">
                    Filtro Suave Anti-Fatiga Visual
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Atenúa contrastes agresivos y reduce emisión de luz blanca.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={themeConfig.eyeCareFilter}
                  onChange={(e) => onUpdateTheme({ eyeCareFilter: e.target.checked })}
                  className="w-5 h-5 accent-[#7255F7] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sound Engine & Nocturnal Ambient Audio */}
        {activeTab === 'sound' && (
          <div className="space-y-6">
            {/* Master Sound FX Switch */}
            <div className="p-4 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${themeConfig.soundEnabled ? 'bg-[#19C6A3]/20 text-[#19C6A3]' : 'bg-[var(--border-soft)] text-[var(--text-muted)]'}`}>
                  {themeConfig.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-heading font-bold text-xs sm:text-sm">
                    Efectos Sonoros Hápticos
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Sonidos de acierto, error suave, subida de nivel y fuego de racha.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleSound(!themeConfig.soundEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  themeConfig.soundEnabled
                    ? 'bg-[#19C6A3] text-white shadow-xs'
                    : 'bg-[var(--border-soft)] text-[var(--text-muted)]'
                }`}
              >
                {themeConfig.soundEnabled ? 'Activado' : 'Silenciado'}
              </button>
            </div>

            {/* Test Sounds buttons */}
            {themeConfig.soundEnabled && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Probar Efectos Sonoros
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => sound.playCorrect()}
                    className="px-3 py-1.5 rounded-xl bg-[#E6F9F5] text-[#059669] border border-[#19C6A3]/30 text-xs font-bold hover:scale-102 transition-transform cursor-pointer"
                  >
                    ✓ Acierto
                  </button>
                  <button
                    type="button"
                    onClick={() => sound.playIncorrect()}
                    className="px-3 py-1.5 rounded-xl bg-[#FEEBED] text-[#E11D48] border border-[#FF6B91]/30 text-xs font-bold hover:scale-102 transition-transform cursor-pointer"
                  >
                    ✕ Error Suave
                  </button>
                  <button
                    type="button"
                    onClick={() => sound.playLevelUp()}
                    className="px-3 py-1.5 rounded-xl bg-[#ECE8FE] text-[#7255F7] border border-[#7255F7]/30 text-xs font-bold hover:scale-102 transition-transform cursor-pointer"
                  >
                    ⭐ Nivel Superior
                  </button>
                  <button
                    type="button"
                    onClick={() => sound.playStreakFire()}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF5E6] text-[#D97706] border border-[#FFB547]/30 text-xs font-bold hover:scale-102 transition-transform cursor-pointer"
                  >
                    🔥 Racha Ardiente
                  </button>
                  <button
                    type="button"
                    onClick={() => sound.playGemPickup()}
                    className="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold hover:scale-102 transition-transform cursor-pointer"
                  >
                    💎 Gemas
                  </button>
                </div>
              </div>
            )}

            {/* Nocturnal Ambient Sound Generator */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] block">
                  Sonido Ambiental de Concentración Nocturna
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Generado en tiempo real con Web Audio para aislar ruidos y mantener el flujo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'none', label: 'Sin sonido ambiental', desc: 'Silencio absoluto', icon: VolumeX, color: '#7A7A9E' },
                  { id: 'lofi-rain', label: 'Lluvia Nocturna Lo-Fi', desc: 'Gotas suaves y ruido rosa relajante', icon: CloudRain, color: '#24B8E8' },
                  { id: 'binaural-focus', label: 'Ondas Alfa Binaurales (10Hz)', desc: 'Frecuencias para concentración profunda', icon: Headphones, color: '#7255F7' },
                  { id: 'white-noise', label: 'Ruido Blanco Calibrado', desc: 'Mascara ruidos del entorno', icon: Waves, color: '#19C6A3' },
                ].map((amb) => {
                  const isSelected = themeConfig.ambientSound === amb.id;
                  const Icon = amb.icon;
                  return (
                    <button
                      key={amb.id}
                      type="button"
                      onClick={() => handleSelectAmbient(amb.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-2 border-[#7255F7] bg-[#7255F7]/10 shadow-sm'
                          : 'border-[var(--border-soft)] bg-[var(--card-elevated)] hover:border-[#7255F7]/30'
                      }`}
                    >
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${amb.color}20`, color: amb.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs sm:text-sm">{amb.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#7255F7]" />}
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          {amb.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Slider */}
            <div className="p-4 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Volumen General</span>
                <span>{Math.round(themeConfig.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={themeConfig.soundVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-[var(--border-soft)] rounded-lg appearance-none cursor-pointer accent-[#7255F7]"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border-soft)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white font-extrabold text-xs shadow-md shadow-[#7255F7]/25 transition-all cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
