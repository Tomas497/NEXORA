import React, { useState } from 'react';
import { 
  Flame, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Code, 
  FlaskConical, 
  Target, 
  AlertCircle, 
  Lightbulb, 
  Atom, 
  CheckCircle2, 
  TrendingUp,
  Award
} from 'lucide-react';
import { UserProfile, UserProgress, ConceptMastery, Language } from '../types';
import { getTranslation } from '../i18n';
import { StudyFeed } from '../components/StudyFeed';

interface DashboardViewProps {
  user: UserProfile;
  progress: UserProgress;
  concepts: ConceptMastery[];
  language: Language;
  leaderboard?: any[];
  onStartLesson: (lessonId?: string) => void;
  onOpenTutor: (mode?: string, conceptId?: string) => void;
  onOpenLabs: (tab?: string) => void;
  onOpenMap: () => void;
  onQuickChallengeSubmit: (answerId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  progress,
  concepts,
  language,
  leaderboard = [],
  onStartLesson,
  onOpenTutor,
  onOpenLabs,
  onOpenMap,
  onQuickChallengeSubmit,
}) => {
  const [selectedQuickOption, setSelectedQuickOption] = useState<string | null>(null);
  const [quickResult, setQuickResult] = useState<{ checked: boolean; isCorrect: boolean } | null>(null);

  const t = (section: string, key: string, params?: any) => getTranslation(language, section, key, params);

  const handleCheckQuick = (optId: string) => {
    setSelectedQuickOption(optId);
    const correct = optId === 'opt_q2';
    setQuickResult({ checked: true, isCorrect: correct });
    if (correct) {
      onQuickChallengeSubmit(optId);
    }
  };

  const isZeroState = progress.xp === 0;
  const weeklyData = isZeroState ? [
    { day: 'Lun', min: 0, h: '10%' },
    { day: 'Mar', min: 0, h: '10%' },
    { day: 'Mié', min: 0, h: '10%' },
    { day: 'Jue', min: 0, h: '10%' },
    { day: 'Vie', min: 0, h: '10%' },
    { day: 'Sáb', min: 0, h: '10%' },
    { day: 'Hoy', min: progress.todayXP, h: progress.todayXP > 0 ? '50%' : '10%', isToday: true },
  ] : [
    { day: 'Lun', min: 35, h: '70%' },
    { day: 'Mar', min: 28, h: '55%' },
    { day: 'Mié', min: 42, h: '85%' },
    { day: 'Jue', min: 20, h: '40%' },
    { day: 'Vie', min: 38, h: '75%' },
    { day: 'Sáb', min: 15, h: '30%' },
    { day: 'Hoy', min: progress.todayXP, h: '45%', isToday: true },
  ];

  // Time-based greeting for mobile header
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Mobile Top Header (Visible on mobile screens < 768px matching M_vil___Inicio_0390c8f8.png) */}
      <div className="md:hidden flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-full flex items-center justify-center font-heading font-extrabold text-lg text-white shadow-md shadow-[#7255F7]/25"
            style={{ backgroundColor: user.avatar.bgColor || '#D946EF' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs text-[#7A7A9E] font-medium leading-none mb-1">
              {getGreeting()}
            </div>
            <h2 className="font-heading font-extrabold text-xl text-[#202038] leading-tight">
              Hola, {user.name.split(' ')[0]}
            </h2>
          </div>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-11 h-11 rounded-2xl bg-white border border-[#E5E3F5] flex items-center justify-center text-[#585876] hover:text-[#7255F7] shadow-sm active:scale-95 transition-transform cursor-pointer"
            title="Notificaciones"
          >
            <div className="relative">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4565] border-2 border-white absolute -top-1 -right-1" />
            </div>
          </button>

          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E3F5] p-3 z-50 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EEFA] mb-2">
                <span className="font-heading font-extrabold text-xs text-[#202038]">Notificaciones</span>
                <span className="text-[10px] text-[#7255F7] font-bold">Marcar leídas</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-[#ECE8FE]/40 flex items-start gap-2.5">
                  <span className="text-base">👏</span>
                  <div>
                    <div className="font-semibold text-[#202038]">Lucas aplaudió tu racha</div>
                    <div className="text-[10px] text-[#7A7A9E]">Hace 12 min</div>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-[#E6F9F5]/50 flex items-start gap-2.5">
                  <span className="text-base">⚡</span>
                  <div>
                    <div className="font-semibold text-[#202038]">Nuevo reto diario disponible</div>
                    <div className="text-[10px] text-[#7A7A9E]">+30 XP por resolverlo</div>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-[#FFF9F0]/60 flex items-start gap-2.5">
                  <span className="text-base">🎉</span>
                  <div>
                    <div className="font-semibold text-[#202038]">Elena celebró tu proyecto</div>
                    <div className="text-[10px] text-[#7A7A9E]">Hace 1 hora</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Metric Strip (Visible on mobile < 768px matching M_vil___Inicio_0390c8f8.png) */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        {/* Streak card */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E3F5] shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF5E6] flex items-center justify-center text-[#D97706] shrink-0">
            <Flame className="w-5 h-5 fill-[#FFB547] text-[#FFB547]" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-xl text-[#202038] leading-tight">
              {progress.streak}
            </div>
            <div className="text-xs text-[#7A7A9E] font-medium">días de racha</div>
          </div>
        </div>

        {/* XP & Level card */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E3F5] shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#ECE8FE] flex items-center justify-center text-[#7255F7] shrink-0">
            <svg className="w-5 h-5 fill-[#7255F7]" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <div className="font-heading font-extrabold text-xl text-[#202038] leading-tight">
              {progress.xp.toLocaleString()}
            </div>
            <div className="text-xs text-[#7A7A9E] font-medium">XP · Nivel {progress.level}</div>
          </div>
        </div>
      </div>

      {/* Top Banner Row: Next Step Hero Card & Profile Mini Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: "TU SIGUIENTE PASO" Big Purple Hero Card matching both mobile & desktop */}
        <div className="lg:col-span-8 rounded-[28px] bg-gradient-to-tr from-[#6042F0] via-[#7255F7] to-[#4F33D8] text-white p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-[#7255F7]/25">
          {/* Subtle geometric circles */}
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 right-20 w-44 h-44 rounded-full bg-[#24B8E8]/20 blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-extrabold tracking-wider uppercase text-white">
              <Sparkles className="w-3.5 h-3.5" />
              {isZeroState ? 'TU RUTA EMPIEZA AQUÍ · NIVEL 1' : 'TU SIGUIENTE PASO'}
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight">
              {isZeroState ? `¡Hola, ${user.name}! Tu primer reto te espera` : 'Domina la regla de la cadena'}
            </h1>

            <p className="text-white/85 text-xs sm:text-sm font-normal leading-relaxed">
              {isZeroState 
                ? 'Empezarás desde cero en el Nivel 1. Aprende conceptos STEM a tu propio ritmo con lecciones interactivas cortas y retroalimentación inteligente de Nexo.'
                : '15 min · Explicación visual + reto adaptado'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-white/15 text-[11px] font-bold">
                {isZeroState ? '5 min' : '15 min'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/15 text-[11px] font-bold">
                {isZeroState ? 'Concepto básico + reto interactivo' : 'Explicación visual + reto'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#19C6A3] text-white text-[11px] font-extrabold shadow-sm">
                +50 XP
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-6">
            <button
              onClick={() => onStartLesson(isZeroState ? 'l_calc_1_1' : 'l_calc_2_1')}
              className="px-6 py-3.5 rounded-2xl bg-white text-[#7255F7] font-extrabold text-sm shadow-md hover:bg-[#F5F4FC] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{isZeroState ? 'Empezar primera lección' : 'Empezar ahora'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenMap}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-sm transition-colors cursor-pointer"
            >
              {t('home', 'viewInMap')}
            </button>
          </div>
        </div>

        {/* Right: User Profile Mini Stats Card (Desktop only; on mobile rendered as dedicated cards) */}
        <div className="hidden md:flex lg:col-span-4 bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E3F5] flex-col justify-between">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-extrabold text-lg text-white shadow-md"
                style={{ backgroundColor: user.avatar.bgColor || '#7255F7' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-extrabold text-base text-[#202038]">{user.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#ECE8FE] text-[#7255F7] text-[10px] font-bold">
                    Nivel {progress.level}
                  </span>
                </div>
                <div className="text-xs text-[#7A7A9E] font-medium">
                  {progress.level >= 5 ? 'Estratega · Aprendes mejor viendo' : 'Explorador · Ruta inicial'}
                </div>
              </div>
            </div>

            {/* Level XP Progress Bar */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#202038]">{progress.xp.toLocaleString()} XP</span>
                <span className="text-[#7A7A9E]">{progress.xpForNextLevel || 2500} XP para nivel {progress.level + 1}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#ECE8FE] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#7255F7] to-[#24B8E8] transition-all duration-500"
                  style={{ width: `${Math.min(100, ((progress.currentLevelXP || 140) / (progress.xpForNextLevel || 300)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metric Pills */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F0EEFA]">
            {/* Streak */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9F0] border border-[#FFB547]/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFB547]/20 flex items-center justify-center text-[#D97706]">
                <Flame className="w-5 h-5 fill-[#FFB547] text-[#FFB547]" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-lg text-[#202038] leading-tight">{progress.streak}</div>
                <div className="text-[10px] text-[#7A7A9E] font-semibold">{t('home', 'streakDays')}</div>
              </div>
            </div>

            {/* Daily Goal Donut/Circle */}
            <div className="p-3.5 rounded-2xl bg-[#E6F9F5] border border-[#19C6A3]/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#19C6A3]/20 flex items-center justify-center text-[#059669] font-heading font-bold text-xs">
                {progress.todayXP}/{user.dailyGoalXP}
              </div>
              <div>
                <div className="font-heading font-bold text-xs text-[#202038] leading-tight">Meta diaria</div>
                <div className="text-[10px] text-[#7A7A9E] font-medium">
                  {progress.todayXP >= user.dailyGoalXP ? '¡Cumplida!' : `${user.dailyGoalXP - progress.todayXP} XP faltantes`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile "Meta diaria" Progress Ring Card (matching M_vil___Inicio_0390c8f8.png) */}
      <div className="md:hidden p-4 rounded-[24px] bg-white border border-[#E5E3F5] shadow-sm flex items-center gap-4">
        {/* Circular SVG Donut Ring */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#E6F9F5]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#19C6A3]"
              strokeDasharray={`${Math.min(100, Math.round((progress.todayXP / (user.dailyGoalXP || 30)) * 100))}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-heading font-extrabold text-xs text-[#202038]">
            {progress.todayXP}/{user.dailyGoalXP}
          </div>
        </div>

        <div>
          <div className="font-heading font-extrabold text-base text-[#202038]">
            Meta diaria
          </div>
          <div className="text-xs text-[#7A7A9E] mt-0.5">
            {progress.todayXP >= user.dailyGoalXP 
              ? '¡Excelente trabajo! Has completado tu meta de hoy' 
              : `Te faltan ${user.dailyGoalXP - progress.todayXP} minutos para cumplirla`}
          </div>
        </div>
      </div>

      {/* "Para ti hoy" Section matching M_vil___Inicio_0390c8f8.png */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-lg text-[#202038]">
            Para ti hoy
          </h2>
          <button 
            onClick={() => onOpenLabs()}
            className="text-xs font-bold text-[#7255F7] hover:underline cursor-pointer"
          >
            Ver todo
          </button>
        </div>

        {/* Horizontal scroll on mobile, responsive grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x">
          {/* Card 1: Gráficas de funciones cuadráticas (Mint) */}
          <button
            onClick={() => onOpenLabs('math')}
            className="min-w-[210px] sm:min-w-0 flex-1 p-4 rounded-2xl bg-[#E8FAF4] border border-[#C5F3E7] hover:border-[#19C6A3] text-left transition-all cursor-pointer flex flex-col justify-between snap-start"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center font-serif text-lg font-bold text-[#059669]">
                ∑
              </div>
              <div className="font-heading font-bold text-sm text-[#202038] mt-3 leading-snug">
                Gráficas de funciones cuadráticas
              </div>
            </div>
            <div className="text-xs text-[#7A7A9E] mt-4 font-medium">12 min</div>
          </button>

          {/* Card 2: Reto: suma de números pares (Lavender) */}
          <button
            onClick={() => onOpenLabs('prog')}
            className="min-w-[210px] sm:min-w-0 flex-1 p-4 rounded-2xl bg-[#F0EEFE] border border-[#DDD6FE] hover:border-[#7255F7] text-left transition-all cursor-pointer flex flex-col justify-between snap-start"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#7255F7]">
                <Code className="w-4 h-4 text-[#7255F7]" />
              </div>
              <div className="font-heading font-bold text-sm text-[#202038] mt-3 leading-snug">
                Reto: suma de números pares
              </div>
            </div>
            <div className="text-xs text-[#7A7A9E] mt-4 font-medium">10 min</div>
          </button>

          {/* Card 3: Simulador de proyectiles (Soft Cyan) */}
          <button
            onClick={() => onOpenLabs('sci')}
            className="min-w-[210px] sm:min-w-0 flex-1 p-4 rounded-2xl bg-[#EBF7FC] border border-[#BAE6FD] hover:border-[#24B8E8] text-left transition-all cursor-pointer flex flex-col justify-between snap-start"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0284C7]">
                <Atom className="w-4 h-4 text-[#0284C7]" />
              </div>
              <div className="font-heading font-bold text-sm text-[#202038] mt-3 leading-snug">
                Simulador de proyectiles
              </div>
            </div>
            <div className="text-xs text-[#7A7A9E] mt-4 font-medium">15 min</div>
          </button>

          {/* Card 4: Comprueba tu nivel en Límites (Soft Orange) */}
          <button
            onClick={() => onOpenTutor('test_level', 'c_derivadas')}
            className="min-w-[210px] sm:min-w-0 flex-1 p-4 rounded-2xl bg-[#FFF9F0] border border-[#FED7AA] hover:border-[#FFB547] text-left transition-all cursor-pointer flex flex-col justify-between snap-start"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#D97706]">
                <Target className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="font-heading font-bold text-sm text-[#202038] mt-3 leading-snug">
                Comprueba tu nivel: Derivadas
              </div>
            </div>
            <div className="text-xs text-[#7A7A9E] mt-4 font-medium">8 min</div>
          </button>
        </div>
      </div>

      {/* Middle Row: Weekly Progress Graph & Nexo Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-7 shadow-sm border border-[#E5E3F5] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#202038]">
                {t('home', 'weeklyProgress')}
              </h3>
              <p className="text-xs text-[#7A7A9E]">198 minutos esta semana · meta 210</p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#FFF5E6] text-[#D97706] font-bold">
              Datos reales
            </span>
          </div>

          <div className="h-44 pt-4 flex items-end justify-between gap-2 px-2 sm:px-6">
            {weeklyData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-[#8E8EA8]">{item.min}</span>
                <div 
                  className={`w-full max-w-[36px] rounded-t-xl transition-all ${
                    item.isToday
                      ? 'bg-gradient-to-t from-[#7255F7] to-[#24B8E8] shadow-md shadow-[#7255F7]/30'
                      : 'bg-[#ECE8FE] hover:bg-[#DED8FD]'
                  }`}
                  style={{ height: item.h }}
                />
                <span className={`text-xs font-semibold ${item.isToday ? 'text-[#7255F7] font-bold' : 'text-[#7A7A9E]'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nexo Recommends Action List */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#1C1A38] to-[#14122C] text-white rounded-[28px] p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#7255F7] flex items-center justify-center">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-white">
              {t('home', 'nexoRecommends')}
            </h3>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => onOpenTutor('analyze_error', 'c_regla_cadena')}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FFB547]/20 text-[#FFB547]">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#24B8E8] transition-colors">
                    Repasa con el modo Analiza mi error
                  </div>
                  <div className="text-[11px] text-white/60 mt-0.5">
                    Sube tu último ejercicio de derivadas y descubre el patrón.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white" />
            </button>

            <button
              onClick={() => onOpenLabs('math')}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#19C6A3]/20 text-[#19C6A3]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#24B8E8] transition-colors">
                    Explora parábolas en el laboratorio
                  </div>
                  <div className="text-[11px] text-white/60 mt-0.5">
                    Mueve las variables y observa cómo cambia la gráfica.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white" />
            </button>

            <button
              onClick={() => onOpenTutor('test_level', 'c_limites')}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#24B8E8]/20 text-[#24B8E8]">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#24B8E8] transition-colors">
                    Comprueba tu nivel en Límites
                  </div>
                  <div className="text-[11px] text-white/60 mt-0.5">
                    5 preguntas para desbloquear Integrales.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Quick Challenge of the Day & Recommended Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quick Challenge of the Day */}
        <div className="lg:col-span-6 bg-white rounded-[28px] p-6 sm:p-7 shadow-sm border border-[#E5E3F5] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base text-[#202038]">
                {t('home', 'quickChallenge')}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#ECE8FE] text-[#7255F7] text-xs font-extrabold">
              +30 XP
            </span>
          </div>

          <p className="text-sm font-semibold text-[#202038]">
            ¿Cuál es la derivada de <strong className="text-[#7255F7]">f(x) = (3x + 1)²</strong>?
          </p>

          <div className="space-y-2.5">
            {[
              { id: 'opt_q1', label: "f'(x) = 2(3x + 1)" },
              { id: 'opt_q2', label: "f'(x) = 6(3x + 1)" },
              { id: 'opt_q3', label: "f'(x) = 6x + 1" },
            ].map((option) => {
              const isSelected = selectedQuickOption === option.id;
              let btnStyle = 'border-[#E5E3F5] bg-white hover:bg-[#F5F4FC] text-[#202038]';
              if (isSelected && quickResult?.checked) {
                btnStyle = quickResult.isCorrect 
                  ? 'border-[#19C6A3] bg-[#E6F9F5] text-[#059669] font-bold'
                  : 'border-[#FF6B91] bg-[#FEEBED] text-[#E11D48] font-bold';
              } else if (isSelected) {
                btnStyle = 'border-[#7255F7] bg-[#ECE8FE] text-[#7255F7] font-bold';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleCheckQuick(option.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option.label}</span>
                  {isSelected && quickResult?.checked && (
                    <span>{quickResult.isCorrect ? '✓ Correcto' : '✗ Revisa'}</span>
                  )}
                </button>
              );
            })}
          </div>

          {quickResult?.checked && (
            <div className={`p-3 rounded-xl text-xs font-medium leading-relaxed ${quickResult.isCorrect ? 'bg-[#E6F9F5] text-[#059669]' : 'bg-[#FEEBED] text-[#E11D48]'}`}>
              {quickResult.isCorrect 
                ? '¡Exacto! Regla de la cadena: 2(3x + 1) · 3 = 6(3x + 1) = 18x + 6. Has ganado +30 XP.'
                : 'Recuerda multiplicar por la derivada interior de (3x + 1), que es 3.'}
            </div>
          )}
        </div>

        {/* Recommended Activities Grid */}
        <div className="lg:col-span-6 bg-white rounded-[28px] p-6 sm:p-7 shadow-sm border border-[#E5E3F5] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-base text-[#202038]">
              {t('home', 'recommendedActivities')}
            </h3>
            <button 
              onClick={() => onOpenLabs()}
              className="text-xs font-bold text-[#7255F7] hover:underline cursor-pointer"
            >
              {t('home', 'viewLabs')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onOpenLabs('math')}
              className="p-4 rounded-2xl bg-[#F5F4FC] hover:bg-[#ECE8FE]/50 border border-[#E5E3F5] text-left transition-colors cursor-pointer space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-[#7255F7]/15 text-[#7255F7] flex items-center justify-center font-bold">
                ∑
              </div>
              <div className="font-heading font-bold text-xs text-[#202038]">
                Gráficas de funciones cuadráticas
              </div>
              <div className="text-[11px] text-[#7A7A9E]">12 min · Laboratorio</div>
            </button>

            <button
              onClick={() => onOpenLabs('prog')}
              className="p-4 rounded-2xl bg-[#F5F4FC] hover:bg-[#E6F9F5]/50 border border-[#E5E3F5] text-left transition-colors cursor-pointer space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-[#24B8E8]/15 text-[#24B8E8] flex items-center justify-center font-bold">
                <Code className="w-4 h-4" />
              </div>
              <div className="font-heading font-bold text-xs text-[#202038]">
                Reto: suma de números pares
              </div>
              <div className="text-[11px] text-[#7A7A9E]">10 min · Código JS</div>
            </button>

            <button
              onClick={() => onOpenLabs('sci')}
              className="p-4 rounded-2xl bg-[#F5F4FC] hover:bg-[#EBF7FC]/50 border border-[#E5E3F5] text-left transition-colors cursor-pointer space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-[#19C6A3]/15 text-[#19C6A3] flex items-center justify-center font-bold">
                <Atom className="w-4 h-4" />
              </div>
              <div className="font-heading font-bold text-xs text-[#202038]">
                Simulador de proyectiles
              </div>
              <div className="text-[11px] text-[#7A7A9E]">15 min · Física</div>
            </button>

            <button
              onClick={() => onOpenTutor('test_level', 'c_derivadas')}
              className="p-4 rounded-2xl bg-[#F5F4FC] hover:bg-[#FFF5E6]/50 border border-[#E5E3F5] text-left transition-colors cursor-pointer space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFB547]/15 text-[#D97706] flex items-center justify-center font-bold">
                <Target className="w-4 h-4" />
              </div>
              <div className="font-heading font-bold text-xs text-[#202038]">
                Comprueba tu nivel: Derivadas
              </div>
              <div className="text-[11px] text-[#7A7A9E]">8 min · Diagnóstico</div>
            </button>
          </div>
        </div>
      </div>

      {/* Social Study Feed: Achievements & Community Engagement */}
      <StudyFeed 
        user={user} 
        progress={progress} 
        leaderboard={leaderboard} 
      />
    </div>
  );
};
