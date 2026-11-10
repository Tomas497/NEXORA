import React from 'react';
import { 
  Flame, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Award, 
  Star, 
  Target, 
  Code, 
  Atom, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { UserProfile, UserProgress, DailyMission, WeeklyMission, Achievement, Language } from '../types';
import { getTranslation } from '../i18n';

interface MissionsViewProps {
  user: UserProfile;
  progress: UserProgress;
  dailyMissions: DailyMission[];
  weeklyMissions: WeeklyMission[];
  achievements: Achievement[];
  language: Language;
  onGoToDashboard: () => void;
  onGoToTutor: () => void;
  onGoToLabs: () => void;
  onClaimDailyMission: (id: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  user,
  progress,
  dailyMissions,
  weeklyMissions,
  achievements,
  language,
  onGoToDashboard,
  onGoToTutor,
  onGoToLabs,
  onClaimDailyMission,
}) => {
  const t = (section: string, key: string) => getTranslation(language, section, key);

  const levelMilestones = [
    { num: 1, label: 'Explorador' },
    { num: 2, label: 'Aprendiz' },
    { num: 3, label: 'Constructor' },
    { num: 4, label: 'Analista' },
    { num: 5, label: 'Estratega' },
    { num: 6, label: 'Maestro' },
    { num: 7, label: 'Mentor' },
    { num: 8, label: 'Visionario' },
  ];

  const streakDays = Array.from({ length: 14 }).map((_, i) => i < progress.streak);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Dark Banner matching Estudiante___Misiones_y_logros_ad4a885a.png */}
      <div className="rounded-[28px] bg-gradient-to-r from-[#1A1838] via-[#15132E] to-[#1E1940] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FFB547]/20 to-[#FF6B91]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#FFB547]">
              NIVEL {progress.level} · {progress.level >= 5 ? 'ESTRATEGA' : 'EXPLORADOR'}
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight mt-1">
              {progress.xp.toLocaleString()} <span className="text-lg font-normal text-white/70">XP</span>
            </h1>
            <p className="text-xs text-white/75 mt-1 max-w-lg">
              En NEXORA ganas XP por comprender: acertar después de equivocarte vale más que adivinar.
            </p>
          </div>

          {/* 14 Days Streak Blocks */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFB547]">
              <Flame className="w-4 h-4 fill-[#FFB547]" />
              <span>{progress.streak} días de racha</span>
            </div>
            <div className="flex items-center gap-1">
              {streakDays.map((active, i) => (
                <div
                  key={i}
                  className={`w-4 h-6 rounded-md transition-colors ${
                    active ? 'bg-[#FFB547] shadow-sm shadow-[#FFB547]/40' : 'bg-white/10'
                  }`}
                  title={`Día ${i + 1}`}
                />
              ))}
            </div>
            <div className="text-[10px] text-white/40 font-medium">Últimos 14 días</div>
          </div>
        </div>

        {/* Milestone Timeline Line */}
        <div className="pt-4 border-t border-white/10 relative z-10 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[550px] relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/20 -z-0" />
            {levelMilestones.map((ms) => {
              const isPast = ms.num < progress.level;
              const isCurrent = ms.num === progress.level;
              return (
                <div key={ms.num} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-extrabold text-xs transition-transform ${
                      isCurrent
                        ? 'bg-[#FFB547] text-[var(--text-main)] ring-4 ring-[#FFB547]/30 scale-110 shadow-lg'
                        : isPast
                        ? 'bg-[#19C6A3] text-white'
                        : 'bg-white/15 text-white/60'
                    }`}
                  >
                    {isPast ? '✓' : ms.num}
                  </div>
                  <span className={`text-[10px] font-semibold ${isCurrent ? 'text-[#FFB547] font-bold' : 'text-white/60'}`}>
                    {ms.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Grid: Daily Quests & Weekly Milestone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Daily Quests List */}
        <div className="lg:col-span-8 bg-[var(--card-bg)] rounded-[28px] p-6 sm:p-7 shadow-sm border border-[var(--border-soft)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-base text-[var(--text-main)]">
              Misiones diarias
            </h3>
            <span className="text-xs text-[var(--text-muted)] font-medium">
              1/5 · se renuevan en 9 h
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'm_1',
                title: 'Revisa tu siguiente paso',
                desc: 'Abre tu panel y elige la actividad recomendada',
                xp: '+10 XP',
                completed: true,
                action: onGoToDashboard,
              },
              {
                id: 'm_2',
                title: 'Resuelve el reto rápido del día',
                desc: 'Una pregunta de derivadas en tu panel',
                xp: '+30 XP',
                completed: false,
                action: onGoToDashboard,
              },
              {
                id: 'm_3',
                title: 'Supera un reto con Nexo',
                desc: 'Modo Ponme un reto, nivel intermedio',
                xp: '+50 XP',
                completed: false,
                action: onGoToTutor,
              },
              {
                id: 'm_4',
                title: 'Comprueba tu nivel',
                desc: '3 preguntas de Derivadas',
                xp: '+40 XP',
                completed: false,
                action: onGoToTutor,
              },
              {
                id: 'm_5',
                title: 'Arregla el código del laboratorio',
                desc: 'Haz que pasen las 3 pruebas unitarias',
                xp: '+60 XP',
                completed: false,
                action: onGoToLabs,
              },
            ].map((mission) => (
              <div
                key={mission.id}
                className="p-4 rounded-2xl border border-[var(--border-soft)] bg-[#FBFBFF] flex items-center justify-between gap-3 hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="font-heading font-bold text-sm text-[var(--text-main)]">{mission.title}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{mission.desc}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-heading font-extrabold text-xs text-[#7255F7]">{mission.xp}</span>
                  {mission.completed ? (
                    <span className="px-3 py-1.5 rounded-xl bg-[#E6F9F5] text-[#059669] text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Completada</span>
                    </span>
                  ) : (
                    <button
                      onClick={mission.action}
                      className="px-4 py-1.5 rounded-xl bg-[#202038] hover:bg-[#343452] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Ir ahora
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Weekly Challenge & Content Unlock Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Reto Semanal Card matching screenshot */}
          <div className="rounded-[28px] bg-gradient-to-tr from-[#684AF4] to-[#4F33D8] text-white p-6 shadow-xl space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
              RETO SEMANAL
            </span>

            <h3 className="font-heading font-extrabold text-xl text-white">
              Semana del razonamiento
            </h3>

            <p className="text-xs text-white/80 leading-relaxed">
              Demuestra constancia y aprende de tus errores esta semana.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Días seguidos aprendiendo</span>
                  <span>3/5</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Errores analizados con Nexo</span>
                  <span>2/3</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '66%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Retos de laboratorio</span>
                  <span>1/3</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '33%' }} />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/15 border border-white/20 text-xs font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFB547]" />
              <span>Recompensa: insignia Mente Analítica + 300 XP</span>
            </div>
          </div>

          {/* Contenido por desbloquear */}
          <div className="bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
            <div className="flex items-center gap-2 font-heading font-extrabold text-sm text-[var(--text-main)]">
              <Lock className="w-4 h-4 text-[#7255F7]" />
              <span>Contenido por desbloquear</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-[var(--text-main)]">Integrales</span>
                  <span className="text-[#7255F7]">78%</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">Domina Derivadas al 85% para abrir</p>
                <div className="h-1.5 w-full rounded-full bg-[#ECE8FE] overflow-hidden">
                  <div className="h-full bg-[#7255F7] rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#F0EEFA]">
                <div className="flex justify-between font-bold">
                  <span className="text-[var(--text-main)]">Laboratorio de química</span>
                  <span className="text-[#19C6A3]">83%</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">Alcanza el nivel 6</p>
                <div className="h-1.5 w-full rounded-full bg-[#ECE8FE] overflow-hidden">
                  <div className="h-full bg-[#19C6A3] rounded-full" style={{ width: '83%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Badges and Achievements */}
      <div className="bg-[var(--card-bg)] rounded-[28px] p-6 sm:p-8 shadow-sm border border-[var(--border-soft)] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-xl text-[var(--text-main)]">
            Logros
          </h3>
          <span className="text-xs font-bold text-[var(--text-muted)]">
            3 de 8 desbloqueados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: 'Primeros pasos', desc: 'Completa tu perfil de aprendizaje', state: 'Desbloqueado', color: '#FFB547', icon: Star },
            { title: 'Racha de fuego', desc: 'Aprende 7 días seguidos', state: 'Desbloqueado', color: '#FF6B91', icon: Flame },
            { title: 'Mente analítica', desc: 'Analiza 5 errores con Nexo', state: 'Desbloqueado', color: '#19C6A3', icon: AlertCircle },
            { title: 'Retador', desc: 'Supera tu primer reto con Nexo', state: 'Bloqueado', color: '#8E8EA8', icon: Target },
            { title: 'Programador', desc: 'Pasa todas las pruebas de código', state: 'Bloqueado', color: '#8E8EA8', icon: Code },
            { title: 'Científico', desc: 'Acierta al objetivo en el simulador', state: 'Bloqueado', color: '#8E8EA8', icon: Atom },
            { title: 'Matemático visual', desc: 'Resuelve el reto de la parábola', state: 'Bloqueado', color: '#8E8EA8', icon: TrendingUp },
            { title: 'Maestro del cálculo', desc: 'Domina 10 conceptos de Cálculo', state: 'Bloqueado', color: '#8E8EA8', icon: Award },
          ].map((ach, idx) => {
            const Icon = ach.icon;
            const isUnlocked = ach.state === 'Desbloqueado';
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border text-left space-y-3 transition-shadow ${
                  isUnlocked ? 'border-[var(--border-soft)] bg-white shadow-sm' : 'border-[#F0EEFA] bg-[#FBFBFF] opacity-75'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                  style={{ backgroundColor: `${ach.color}18`, color: ach.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[var(--text-main)]">{ach.title}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">{ach.desc}</p>
                </div>
                <div className={`text-[11px] font-bold ${isUnlocked ? 'text-[#059669]' : 'text-[#8E8EA8]'}`}>
                  {ach.state}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
