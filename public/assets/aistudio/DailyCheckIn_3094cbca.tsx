import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Gift, 
  Calendar, 
  Clock, 
  Award, 
  ChevronRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { UserProgress, Language } from '../types';

interface DailyCheckInProps {
  progress: UserProgress;
  language: Language;
  onClaimGems?: (gemsAdded: number, newProgress: UserProgress) => void;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  progress,
  language,
  onClaimGems,
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [celebrationReward, setCelebrationReward] = useState<number | null>(null);
  const [localProgress, setLocalProgress] = useState<UserProgress>(progress);

  // Sync if prop updates
  React.useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  const todayStr = new Date().toISOString().split('T')[0];
  const isAlreadyClaimedToday = localProgress.lastCheckInDate === todayStr;

  // Day rewards for the 7 days of attendance
  const weekRewards = [
    { day: 1, gems: 5, label: 'Día 1' },
    { day: 2, gems: 10, label: 'Día 2' },
    { day: 3, gems: 10, label: 'Día 3' },
    { day: 4, gems: 15, label: 'Día 4' },
    { day: 5, gems: 15, label: 'Día 5' },
    { day: 6, gems: 20, label: 'Día 6' },
    { day: 7, gems: 35, label: 'Día 7', isChest: true },
  ];

  const checkInDays = localProgress.checkInDays || 0;
  // Current active day in 1-7 cycle
  const currentCycleIndex = checkInDays % 7; // 0 to 6
  const attendanceCount = isAlreadyClaimedToday 
    ? Math.min(7, (currentCycleIndex === 0 && checkInDays > 0 ? 7 : currentCycleIndex)) 
    : currentCycleIndex;

  const currentReward = weekRewards[currentCycleIndex]?.gems || 10;
  const progressPercent = Math.min(100, Math.round((attendanceCount / 7) * 100));

  // Handle claiming attendance
  const handleCheckIn = async () => {
    if (isAlreadyClaimedToday || isClaiming) return;
    setIsClaiming(true);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setLocalProgress(data.progress);
        setCelebrationReward(data.rewardGems);
        if (onClaimGems) {
          onClaimGems(data.rewardGems, data.progress);
        }
      } else {
        // Fallback optimistic update if offline
        const rewardGems = currentReward;
        const newCheckInDays = checkInDays + 1;
        const newWeekly = [...(localProgress.weeklyAttendance || [false, false, false, false, false, false, false])];
        newWeekly[currentCycleIndex] = true;

        const updated: UserProgress = {
          ...localProgress,
          gems: localProgress.gems + rewardGems,
          checkInDays: newCheckInDays,
          lastCheckInDate: todayStr,
          weeklyAttendance: newWeekly,
        };

        setLocalProgress(updated);
        setCelebrationReward(rewardGems);
        if (onClaimGems) {
          onClaimGems(rewardGems, updated);
        }
      }
    } catch {
      // Optimistic update
      const rewardGems = currentReward;
      const newCheckInDays = checkInDays + 1;
      const updated: UserProgress = {
        ...localProgress,
        gems: localProgress.gems + rewardGems,
        checkInDays: newCheckInDays,
        lastCheckInDate: todayStr,
      };
      setLocalProgress(updated);
      setCelebrationReward(rewardGems);
      if (onClaimGems) {
        onClaimGems(rewardGems, updated);
      }
    } finally {
      setIsClaiming(false);
      setTimeout(() => {
        setCelebrationReward(null);
      }, 3500);
    }
  };

  // Circular progress ring calculation
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E5E3F5] shadow-sm relative overflow-hidden space-y-5">
      {/* Celebration floating notification banner */}
      {celebrationReward && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ECE8FE] via-[#E6F9F5] to-[#FFF5E6] border border-[#7255F7]/30 flex items-center justify-between animate-in zoom-in-95 duration-200 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">💎</span>
            <div>
              <div className="font-heading font-extrabold text-sm text-[#202038]">
                ¡Asistencia registrada con éxito!
              </div>
              <div className="text-xs text-[#059669] font-bold">
                +{celebrationReward} Gemas añadidas a tu inventario
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#19C6A3] text-white text-xs font-extrabold shadow-sm">
            ¡Reclamado!
          </span>
        </div>
      )}

      {/* Top Section: Progress Ring + Title + Gem Reward Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {/* Circular SVG Progress Ring visualizing attendance towards 7 days */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              {/* Background track circle */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-[#F0EEFA]"
                strokeWidth="6"
                stroke="currentColor"
                fill="none"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-[#7255F7] transition-all duration-700 ease-out"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
              />
            </svg>

            {/* Inner Content: Fraction and icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-heading font-extrabold text-sm text-[#202038] leading-none">
                {attendanceCount}/7
              </span>
              <span className="text-[10px] text-[#7A7A9E] font-bold mt-0.5">
                días
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ECE8FE] text-[#7255F7] text-[10px] font-extrabold uppercase tracking-wide">
                Asistencia Semanal
              </span>
              <span className="text-[11px] text-[#059669] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#19C6A3] fill-current" />
                {progressPercent}% completado
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#202038] mt-1">
              Check-in Diario · Bono de Gemas
            </h3>

            <p className="text-xs text-[#7A7A9E] font-medium leading-relaxed mt-0.5">
              {isAlreadyClaimedToday 
                ? '¡Asistencia de hoy completada! Vuelve mañana para seguir llenando tu anillo.' 
                : 'Abre la app diariamente para reclamar gemas gratuitas y desbloquear el cofre del día 7.'}
            </p>
          </div>
        </div>

        {/* Claim Action Button */}
        <div className="shrink-0 flex items-center">
          {isAlreadyClaimedToday ? (
            <div className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#E6F9F5] border border-[#19C6A3]/30 text-[#059669] font-bold text-xs flex items-center justify-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#19C6A3]" />
              <span>Asistencia registrada hoy</span>
            </div>
          ) : (
            <button
              onClick={handleCheckIn}
              disabled={isClaiming}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#7255F7] to-[#24B8E8] hover:from-[#5D3DE6] hover:to-[#0284C7] text-white font-extrabold text-xs shadow-md shadow-[#7255F7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{isClaiming ? 'Registrando...' : `Reclamar Bono (+${currentReward} 💎)`}</span>
            </button>
          )}
        </div>
      </div>

      {/* 7-Day Attendance Road */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
        {weekRewards.map((item, idx) => {
          const isDone = isAlreadyClaimedToday 
            ? idx <= currentCycleIndex 
            : idx < currentCycleIndex;

          const isCurrentTarget = !isAlreadyClaimedToday && idx === currentCycleIndex;

          return (
            <div
              key={item.day}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between relative ${
                isDone
                  ? 'bg-[#E6F9F5]/70 border-[#19C6A3]/40 text-[#059669]'
                  : isCurrentTarget
                    ? 'bg-[#ECE8FE] border-2 border-[#7255F7] text-[#7255F7] shadow-sm animate-pulse'
                    : 'bg-[#F5F4FC] border-[#E5E3F5] text-[#585876]'
              }`}
            >
              {/* Day Badge */}
              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase mb-1.5">
                <span>{item.label}</span>
                {isDone ? (
                  <span className="w-4 h-4 rounded-full bg-[#19C6A3] text-white flex items-center justify-center text-[9px]">
                    ✓
                  </span>
                ) : isCurrentTarget ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#7255F7] text-white text-[8px] font-extrabold">
                    HOY
                  </span>
                ) : null}
              </div>

              {/* Gem Reward visual */}
              <div className="py-1.5 flex flex-col items-center justify-center">
                {item.isChest ? (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${
                    isDone ? 'bg-[#19C6A3]/20' : isCurrentTarget ? 'bg-[#7255F7]/20' : 'bg-white'
                  }`}>
                    🎁
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm ${
                    isDone ? 'bg-[#19C6A3]/20' : isCurrentTarget ? 'bg-[#7255F7]/20' : 'bg-white'
                  }`}>
                    💎
                  </div>
                )}
                <span className="font-heading font-extrabold text-xs mt-1 text-[#202038]">
                  +{item.gems}
                </span>
                <span className="text-[9px] text-[#7A7A9E] font-medium">gemas</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
