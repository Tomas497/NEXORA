import React, { useState } from 'react';
import { 
  Flame, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Info,
  Calendar,
  Zap,
  Trophy
} from 'lucide-react';
import { UserProgress, Language } from '../types';
import { getTranslation } from '../i18n';
import { sound } from '../utils/soundEngine';

interface DailyStreakCounterProps {
  progress: UserProgress;
  language: Language;
  onOpenStore?: () => void;
  onStartLesson?: () => void;
  compact?: boolean;
}

export const DailyStreakCounter: React.FC<DailyStreakCounterProps> = ({
  progress,
  language,
  onOpenStore,
  onStartLesson,
  compact = false,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const t = (section: string, key: string) => getTranslation(language, section, key);

  const streak = progress.streak || 0;
  const isFireActive = streak > 3; // Animation for streaks over 3 days
  const todayXP = progress.todayXP || 0;
  const hasCompletedToday = todayXP > 0;

  const daysOfWeek = [
    { label: 'Lun', dayNum: 1 },
    { label: 'Mar', dayNum: 2 },
    { label: 'Mié', dayNum: 3 },
    { label: 'Jue', dayNum: 4 },
    { label: 'Vie', dayNum: 5 },
    { label: 'Sáb', dayNum: 6 },
    { label: 'Dom', dayNum: 7 },
  ];

  const currentDayIndex = Math.min(6, Math.max(0, (new Date().getDay() + 6) % 7));

  const dayStreakStatus = daysOfWeek.map((day, idx) => {
    const isToday = idx === currentDayIndex;
    const isPast = idx < currentDayIndex;
    const daysFromToday = currentDayIndex - idx;
    const isCompleted = isToday 
      ? hasCompletedToday 
      : isPast && streak > daysFromToday;

    return {
      ...day,
      isToday,
      isCompleted,
    };
  });

  const getNextMilestone = (current: number) => {
    if (current < 3) return { goal: 3, label: 'Fuego Ardiente 🔥' };
    if (current < 7) return { goal: 7, label: 'Semana Imparable (+50 XP)' };
    if (current < 14) return { goal: 14, label: 'Hábito de Acero (+100 XP)' };
    if (current < 30) return { goal: 30, label: 'Mes Maestro (+250 XP)' };
    return { goal: current + 10, label: 'Racha Legendaria' };
  };

  const nextMilestone = getNextMilestone(streak);
  const progressToMilestone = Math.min(100, Math.round((streak / nextMilestone.goal) * 100));

  const handleFlameClick = () => {
    if (isFireActive) {
      sound.playStreakFire();
    } else {
      sound.playClick();
    }
  };

  if (compact) {
    return (
      <div 
        onClick={handleFlameClick}
        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
          isFireActive 
            ? 'bg-gradient-to-r from-[#FFF5E6] to-[#FFEBD4] border-[#FFB547] animate-fire-glow' 
            : 'bg-[var(--card-elevated)] border-[var(--border-soft)]'
        } flex items-center justify-between`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isFireActive ? 'bg-[#FF8800] text-white shadow-md shadow-[#FF8800]/40' : 'bg-[#FFB547]/20 text-[#D97706]'
          }`}>
            <Flame className={`w-5 h-5 ${isFireActive ? 'animate-flame fill-white text-white' : 'fill-[#FFB547] text-[#FFB547]'}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-base text-[var(--text-main)] leading-none">
                {streak} {streak === 1 ? 'día' : 'días'}
              </span>
              {isFireActive && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#FF8800]/15 text-[#D97706] text-[10px] font-extrabold flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  3+ días
                </span>
              )}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {hasCompletedToday ? '¡Racha asegurada hoy!' : 'Completa una lección hoy'}
            </div>
          </div>
        </div>

        {progress.streakProtectors > 0 && (
          <div 
            title="Protector de racha activo"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--card-bg)] border border-[#FFB547]/40 text-[#D97706] text-[11px] font-bold"
          >
            <Shield className="w-3.5 h-3.5 fill-[#FFB547]/30" />
            <span>{progress.streakProtectors}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-[28px] p-6 sm:p-7 border transition-all shadow-sm relative overflow-hidden ${
      isFireActive 
        ? 'bg-gradient-to-br from-[#FFF9F0] via-[#FFF3E0] to-[#FFE8CC] border-[#FFB547] animate-fire-glow' 
        : 'bg-[var(--card-bg)] border-[var(--border-soft)]'
    }`}>
      {/* Decorative ambient glow for 3+ days fire */}
      {isFireActive && (
        <>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FF8800]/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#FFB547]/20 blur-xl pointer-events-none" />
        </>
      )}

      {/* Header Row */}
      <div className="relative z-10 flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3.5">
          {/* Animated Flame Icon Container */}
          <div 
            onClick={handleFlameClick}
            className={`relative w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform cursor-pointer hover:scale-110 active:scale-95 ${
              isFireActive 
                ? 'bg-gradient-to-tr from-[#FF5500] via-[#FF8800] to-[#FFB547] text-white shadow-[#FF8800]/40' 
                : 'bg-[#FFF5E6] text-[#D97706] border border-[#FFB547]/30'
            }`}
          >
            <Flame className={`w-7 h-7 ${
              isFireActive 
                ? 'animate-flame fill-white text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]' 
                : 'fill-[#FFB547] text-[#FFB547]'
            }`} />

            {isFireActive && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center text-[#FF5500] shadow-sm animate-pulse">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[var(--text-main)] tracking-tight">
                {streak} {streak === 1 ? 'Día de Racha' : 'Días de Racha'}
              </h3>
              {isFireActive ? (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500] text-white text-[11px] font-extrabold tracking-wide uppercase shadow-sm flex items-center gap-1">
                  <span>🔥</span> En Llamas
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#FFF5E6] text-[#D97706] text-[10px] font-bold">
                  {streak === 0 ? 'Empieza hoy' : `${3 - streak} días para fuego`}
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
              {hasCompletedToday 
                ? '¡Has completado tu lección de hoy! Tu racha está protegida.' 
                : 'Completa al menos 1 lección o reto antes de medianoche para no perderla.'}
            </p>
          </div>
        </div>

        {/* Info button */}
        <button
          onClick={() => setShowInfoModal(!showInfoModal)}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--card-elevated)] transition-colors cursor-pointer shrink-0"
          title="Cómo funcionan las rachas"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* 7-Day Visual Streak Trail */}
      <div className="relative z-10 bg-[var(--card-elevated)]/90 backdrop-blur-xs rounded-2xl p-4 border border-[var(--border-soft)] space-y-3 mb-4">
        <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#FFB547]" />
            Actividad de esta semana
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">
            Récord histórico: <strong className="text-[var(--text-main)]">{progress.bestStreak} días</strong>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dayStreakStatus.map((day) => (
            <div 
              key={day.label}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all ${
                day.isCompleted
                  ? isFireActive
                    ? 'bg-gradient-to-b from-[#FFF5E6] to-[#FFE8CC] border-[#FFB547] text-[#D97706] shadow-xs'
                    : 'bg-[#FFF9F0] border-[#FFB547]/50 text-[#D97706]'
                  : day.isToday
                    ? 'bg-[#ECE8FE]/40 border-2 border-dashed border-[#7255F7] text-[#7255F7]'
                    : 'bg-[var(--card-bg)] border-[var(--border-soft)] text-[var(--text-muted)]'
              }`}
            >
              <span className="text-[10px] font-extrabold uppercase mb-1">{day.label}</span>
              <div className="w-6 h-6 flex items-center justify-center">
                {day.isCompleted ? (
                  <Flame className={`w-4 h-4 ${isFireActive ? 'animate-flame fill-[#FF5500] text-[#FF5500]' : 'fill-[#FFB547] text-[#FFB547]'}`} />
                ) : day.isToday ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7255F7] animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-strong)]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Progress & Protectors Footer */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="space-y-1.5 flex-1 max-w-md">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[var(--text-main)] flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#FFB547]" />
              Próximo hito: {nextMilestone.label}
            </span>
            <span className="text-[var(--text-muted)]">{streak}/{nextMilestone.goal} días</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--border-soft)] overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isFireActive 
                  ? 'bg-gradient-to-r from-[#FF8800] to-[#FF3B00]' 
                  : 'bg-gradient-to-r from-[#FFB547] to-[#FF8800]'
              }`}
              style={{ width: `${progressToMilestone}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-soft)] text-xs font-bold text-[var(--text-muted)]">
            <Shield className={`w-3.5 h-3.5 ${progress.streakProtectors > 0 ? 'text-[#19C6A3] fill-[#19C6A3]/30' : 'text-[var(--text-muted)]'}`} />
            <span>
              {progress.streakProtectors > 0 
                ? `${progress.streakProtectors} ${progress.streakProtectors === 1 ? 'protector' : 'protectores'}`
                : 'Sin protectores'}
            </span>
          </div>

          {progress.streakProtectors === 0 && onOpenStore && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenStore();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1"
            >
              <span>Equipar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {showInfoModal && (
        <div className="mt-4 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-soft)] text-xs text-[var(--text-muted)] space-y-2 animate-in fade-in duration-150">
          <div className="font-heading font-extrabold text-[var(--text-main)] text-sm flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#FF8800] fill-[#FF8800]" />
            Reglas de la Racha Diaria en NEXORA
          </div>
          <p>
            • Completa al menos <strong>una lección, reto adaptado o sesión de laboratorio</strong> cada día para extender tu racha.
          </p>
          <p>
            • Al superar los <strong>3 días consecutivos</strong>, tu llama entra en estado <strong>ardiente animado 🔥</strong> y desbloqueas multiplicadores de XP en ligas.
          </p>
          <p>
            • Si un día no puedes estudiar, el <strong>Protector de Racha</strong> evitará que tu contador regrese a cero. Puedes conseguir protectores en la tienda de gemas.
          </p>
        </div>
      )}
    </div>
  );
};
