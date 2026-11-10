import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  Trophy, 
  Sparkles, 
  Target, 
  Atom, 
  Heart, 
  Send, 
  Check, 
  MessageCircle, 
  TrendingUp,
  Share2,
  BookOpen,
  GraduationCap,
  Lightbulb,
  PartyPopper
} from 'lucide-react';
import { StudyFeedItem, UserProfile, UserProgress } from '../types';

interface StudyFeedProps {
  user: UserProfile;
  progress: UserProgress;
  leaderboard?: any[];
}

export const StudyFeed: React.FC<StudyFeedProps> = ({
  user,
  progress,
  leaderboard = [],
}) => {
  const [filter, setFilter] = useState<'all' | 'celebration' | 'streak' | 'achievement' | 'assignment' | 'challenge'>('all');
  const [postText, setPostText] = useState('');
  const [cheerNotice, setCheerNotice] = useState<string | null>(null);
  const [activeReactionAnim, setActiveReactionAnim] = useState<{ itemId: string; type: string } | null>(null);

  // Initial social achievements seeded from top performers, friends and professors
  const [feedItems, setFeedItems] = useState<StudyFeedItem[]>([
    {
      id: 'feed_1',
      userId: 'u_andres',
      userName: 'Andrés Navarro',
      userAvatar: 'A',
      avatarColor: '#19C6A3',
      type: 'league',
      title: '¡Ascendió al #1 de la Liga Zafiro!',
      description: 'Acumuló 820 XP esta semana dominando funciones y límites en tiempo récord.',
      timeAgo: 'Hace 12 min',
      badgeText: 'Top 1 Zafiro',
      badgeColor: '#19C6A3',
      reactions: { clap: 18, celebration: 24, fire: 30, heart: 12, inspire: 6 },
      hasReacted: {},
    },
    {
      id: 'feed_2',
      userId: 'u_valentina',
      userName: 'Valentina Cruz',
      userAvatar: 'V',
      avatarColor: '#7255F7',
      type: 'streak',
      title: '¡Racha legendaria de 21 días!',
      description: 'Lleva 3 semanas consecutivas completando su meta diaria sin usar protector de racha.',
      timeAgo: 'Hace 35 min',
      badgeText: 'Racha 21 Días',
      badgeColor: '#FF6B91',
      reactions: { clap: 35, celebration: 42, fire: 58, heart: 24, inspire: 9 },
      hasReacted: {},
    },
    {
      id: 'feed_assign_1',
      userId: 'u_teacher',
      userName: 'Prof. Carlos Martínez',
      userAvatar: 'C',
      avatarColor: '#19C6A3',
      type: 'assignment',
      title: '📚 Nuevo Trabajo asignado: Taller de Regla de la Cadena y Optimización',
      description: '8 ejercicios prácticos con retroalimentación automática de Nexo. Fecha límite: Viernes 18 de Noviembre (+120 XP).',
      timeAgo: 'Hace 45 min',
      badgeText: 'Trabajo Asignado',
      badgeColor: '#7255F7',
      reactions: { clap: 22, celebration: 15, fire: 19, heart: 28, inspire: 14 },
      hasReacted: {},
    },
    {
      id: 'feed_3',
      userId: 'u_elena',
      userName: 'Elena Soler',
      userAvatar: 'E',
      avatarColor: '#FFB547',
      type: 'achievement',
      title: 'Desbloqueó insignia "Maestra de Límites"',
      description: 'Completó los 5 ejercicios de límites infinitos con 100% de precisión al primer intento.',
      timeAgo: 'Hace 1 hora',
      badgeText: 'Insignia Oro',
      badgeColor: '#FFB547',
      reactions: { clap: 14, celebration: 19, fire: 15, heart: 20, inspire: 8 },
      hasReacted: {},
    },
    {
      id: 'feed_4',
      userId: 'u_david',
      userName: 'David Kim',
      userAvatar: 'D',
      avatarColor: '#24B8E8',
      type: 'challenge',
      title: 'Superó el Laboratorio de Proyectiles & Cinemática',
      description: 'Calculó el ángulo óptimo de 45° en la simulación física de movimiento parabólico en menos de 6 minutos.',
      timeAgo: 'Hace 2 horas',
      badgeText: 'Lab Física',
      badgeColor: '#24B8E8',
      reactions: { clap: 12, celebration: 16, fire: 21, heart: 8, inspire: 11 },
      hasReacted: {},
    },
    {
      id: 'feed_5',
      userId: 'u_camila',
      userName: 'Camila Torres',
      userAvatar: 'C',
      avatarColor: '#19C6A3',
      type: 'mastery',
      title: 'Alcanzó 100% de maestría en Regla de la Cadena',
      description: 'Superó los 4 niveles de dificultad y practicó con el tutor IA Nexo.',
      timeAgo: 'Hace 3 horas',
      badgeText: '100% Dominio',
      badgeColor: '#7255F7',
      reactions: { clap: 20, celebration: 25, fire: 27, heart: 16, inspire: 9 },
      hasReacted: {},
    },
    {
      id: 'feed_6',
      userId: 'u_mateo',
      userName: 'Mateo Gómez',
      userAvatar: 'M',
      avatarColor: '#FFB547',
      type: 'streak',
      title: 'Cumplió su meta diaria en 10 minutos',
      description: 'Avanzó 40 XP resolviendo retos de sintaxis y bucles en JavaScript.',
      timeAgo: 'Hace 4 horas',
      badgeText: 'Meta Cumplida',
      badgeColor: '#19C6A3',
      reactions: { clap: 11, celebration: 13, fire: 14, heart: 9, inspire: 4 },
      hasReacted: {},
    },
    {
      id: 'feed_7',
      userId: 'u_lucas',
      userName: 'Lucas Fernández',
      userAvatar: 'L',
      avatarColor: '#7255F7',
      type: 'challenge',
      title: '¡Reto Relámpago de Algoritmos superado!',
      description: 'Implementó la búsqueda binaria en JavaScript con 0 errores y obtuvo +50 XP y 15 gemas.',
      timeAgo: 'Hace 5 horas',
      badgeText: 'Reto Código',
      badgeColor: '#24B8E8',
      reactions: { clap: 26, celebration: 30, fire: 33, heart: 14, inspire: 18 },
      hasReacted: {},
    },
  ]);

  // Toggle reaction on a feed item (Clap, Celebration, Fire, Heart, Inspire)
  const handleToggleReaction = (itemId: string, reactionType: 'clap' | 'celebration' | 'fire' | 'heart' | 'inspire') => {
    setActiveReactionAnim({ itemId, type: reactionType });
    setTimeout(() => setActiveReactionAnim(null), 1000);

    setFeedItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;

      const hasReacted = item.hasReacted?.[reactionType];
      const delta = hasReacted ? -1 : 1;
      const currentCount = item.reactions[reactionType] ?? 0;

      return {
        ...item,
        reactions: {
          ...item.reactions,
          [reactionType]: Math.max(0, currentCount + delta),
        },
        hasReacted: {
          ...item.hasReacted,
          [reactionType]: !hasReacted,
        },
      };
    }));
  };

  // Quick Cheer message with confetti effect
  const handleSendCheer = (userName: string) => {
    setCheerNotice(`🎉 ¡Le enviaste una celebración y aplauso a ${userName}!`);
    setTimeout(() => setCheerNotice(null), 3000);
  };

  // Post user's custom status or celebration to the feed
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    const newPost: StudyFeedItem = {
      id: `post_${Date.now()}`,
      userId: user.id,
      userName: `${user.name} (Tú)`,
      userAvatar: user.name.charAt(0).toUpperCase() || 'U',
      avatarColor: user.avatar.bgColor || '#7255F7',
      type: 'post',
      title: 'Compartió una actualización de estudio',
      description: postText.trim(),
      timeAgo: 'Ahora mismo',
      badgeText: `Nivel ${progress.level}`,
      badgeColor: '#7255F7',
      reactions: { clap: 1, celebration: 1, fire: 1, heart: 1, inspire: 1 },
      hasReacted: { clap: true, celebration: true },
    };

    setFeedItems([newPost, ...feedItems]);
    setPostText('');
    setCheerNotice('🚀 ¡Tu actualización se publicó en el Muro de Estudio!');
    setTimeout(() => setCheerNotice(null), 3000);
  };

  // Preset quick status chips
  const handleQuickPreset = (preset: string) => {
    setPostText(preset);
  };

  // Filter items
  const filteredItems = feedItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'celebration') return (item.reactions.celebration ?? 0) >= 15 || item.type === 'league';
    if (filter === 'streak') return item.type === 'streak';
    if (filter === 'achievement') return item.type === 'achievement' || item.type === 'league' || item.type === 'mastery';
    if (filter === 'assignment') return item.type === 'assignment';
    if (filter === 'challenge') return item.type === 'challenge' || item.type === 'post';
    return true;
  });

  const getTypeIcon = (type: StudyFeedItem['type']) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-[#FF6B91] fill-[#FF6B91]" />;
      case 'league':
        return <Trophy className="w-4 h-4 text-[#FFB547] fill-[#FFB547]" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-[#7255F7]" />;
      case 'achievement':
      case 'mastery':
        return <Sparkles className="w-4 h-4 text-[#7255F7] fill-[#7255F7]" />;
      case 'challenge':
        return <Atom className="w-4 h-4 text-[#24B8E8]" />;
      default:
        return <MessageCircle className="w-4 h-4 text-[#19C6A3]" />;
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 shadow-sm border border-[#E5E3F5] space-y-6">
      {/* Feed Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7255F7] to-[#24B8E8] text-white flex items-center justify-center shadow-md shadow-[#7255F7]/25">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#202038]">
                Muro de Estudio & Retos · Comunidad
              </h3>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669] text-[10px] font-bold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                24 en línea
              </span>
            </div>
            <p className="text-xs text-[#7A7A9E] mt-0.5">
              Interactúa con aplausos (Clap), celebraciones, retos y trabajos asignados por docentes.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-[#F5F4FC] p-1 rounded-2xl border border-[#E5E3F5]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-[#7255F7] shadow-sm'
                : 'text-[#585876] hover:text-[#202038]'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('celebration')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'celebration'
                ? 'bg-white text-[#FFB547] shadow-sm'
                : 'text-[#585876] hover:text-[#202038]'
            }`}
          >
            <span>🎉</span>
            <span>Celebraciones</span>
          </button>
          <button
            onClick={() => setFilter('streak')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'streak'
                ? 'bg-white text-[#FF6B91] shadow-sm'
                : 'text-[#585876] hover:text-[#202038]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Rachas</span>
          </button>
          <button
            onClick={() => setFilter('assignment')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'assignment'
                ? 'bg-white text-[#7255F7] shadow-sm'
                : 'text-[#585876] hover:text-[#202038]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Trabajos</span>
          </button>
          <button
            onClick={() => setFilter('challenge')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'challenge'
                ? 'bg-white text-[#24B8E8] shadow-sm'
                : 'text-[#585876] hover:text-[#202038]'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Retos</span>
          </button>
        </div>
      </div>

      {/* Cheer Notification Toast */}
      {cheerNotice && (
        <div className="p-3.5 rounded-2xl bg-[#E6F9F5] border border-[#19C6A3]/40 text-[#059669] text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <span>{cheerNotice}</span>
          <Check className="w-4 h-4 shrink-0" />
        </div>
      )}

      {/* Quick Post Box to Share Progress */}
      <form onSubmit={handlePublishPost} className="bg-[#F5F4FC] p-4 rounded-2xl border border-[#E5E3F5] space-y-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm"
            style={{ backgroundColor: user.avatar.bgColor || '#7255F7' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <input
            type="text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={`¿Qué reto o trabajo estás preparando hoy, ${user.name}? Comparte tu avance...`}
            className="flex-1 bg-white px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-[#E5E3F5] focus:outline-none focus:border-[#7255F7] text-[#202038] placeholder:text-[#8E8EA8]"
          />
          <button
            type="submit"
            disabled={!postText.trim()}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              postText.trim()
                ? 'bg-[#7255F7] text-white shadow-md shadow-[#7255F7]/25 hover:bg-[#5D3DE6]'
                : 'bg-[#E5E3F5] text-[#8E8EA8] cursor-not-allowed'
            }`}
          >
            <span>Publicar</span>
            <Send className="w-3 h-3" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-[#8E8EA8] font-medium mr-1">Sugerencias rápidas:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('🔥 ¡Hoy arranqué mi racha de estudio en NEXORA!')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E3F5] text-[#585876] hover:text-[#7255F7] hover:border-[#7255F7] transition-colors cursor-pointer"
          >
            🔥 Empezando racha
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('📐 Repasando el taller de derivadas y regla de la cadena.')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E3F5] text-[#585876] hover:text-[#7255F7] hover:border-[#7255F7] transition-colors cursor-pointer"
          >
            📐 Taller de derivadas
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('⚡ Cumplí mi reto del día con el laboratorio de física.')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E3F5] text-[#585876] hover:text-[#7255F7] hover:border-[#7255F7] transition-colors cursor-pointer"
          >
            ⚡ Reto de física superado
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('🎉 ¡Entregué el trabajo de cálculo antes de la fecha límite!')}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E3F5] text-[#585876] hover:text-[#7255F7] hover:border-[#7255F7] transition-colors cursor-pointer"
          >
            🎉 Trabajo entregado
          </button>
        </div>
      </form>

      {/* Feed Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isAnimActive = activeReactionAnim?.itemId === item.id;

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 relative overflow-hidden ${
                item.type === 'assignment'
                  ? 'bg-[#FBFBFF] border-[#7255F7]/30 shadow-xs'
                  : 'bg-white border-[#E5E3F5] hover:border-[#D1D0E4] hover:shadow-sm'
              }`}
            >
              {/* Floating animation indicator */}
              {isAnimActive && (
                <div className="absolute top-3 right-12 z-20 animate-bounce text-sm font-extrabold px-2.5 py-1 rounded-full bg-[#ECE8FE] text-[#7255F7] border border-[#7255F7]/20 shadow-md">
                  +{activeReactionAnim.type === 'clap' ? '👏 Aplauso' : activeReactionAnim.type === 'celebration' ? '🎉 Celebración' : activeReactionAnim.type === 'fire' ? '🔥 Fuego' : activeReactionAnim.type === 'heart' ? '❤️ Apoyo' : '💡 Inspiración'}!
                </div>
              )}

              {/* Top Row: User details & Type Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm"
                    style={{ backgroundColor: item.avatarColor }}
                  >
                    {item.userAvatar}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading font-extrabold text-xs sm:text-sm text-[#202038]">
                        {item.userName}
                      </span>
                      {item.badgeText && (
                        <span 
                          className="px-2 py-0.5 rounded-md text-[10px] font-extrabold"
                          style={{ 
                            backgroundColor: `${item.badgeColor || '#7255F7'}15`,
                            color: item.badgeColor || '#7255F7'
                          }}
                        >
                          {item.badgeText}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8E8EA8] mt-0.5">
                      {item.timeAgo}
                    </div>
                  </div>
                </div>

                {/* Icon badge */}
                <div className="w-8 h-8 rounded-xl bg-[#F5F4FC] flex items-center justify-center shrink-0">
                  {getTypeIcon(item.type)}
                </div>
              </div>

              {/* Content description */}
              <div className="pl-0 sm:pl-13 space-y-1.5">
                <div className="font-heading font-bold text-xs sm:text-sm text-[#202038]">
                  {item.title}
                </div>
                <p className="text-xs text-[#585876] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Reaction Buttons & Social Interactions */}
              <div className="pl-0 sm:pl-13 pt-1 border-t border-[#F5F4FC] flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* CLAP (Aplauso) */}
                  <button
                    type="button"
                    onClick={() => handleToggleReaction(item.id, 'clap')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      item.hasReacted?.clap
                        ? 'bg-[#ECE8FE] border-[#7255F7] text-[#7255F7] font-bold shadow-xs scale-105'
                        : 'bg-[#F5F4FC] border-[#E5E3F5] text-[#585876] hover:bg-[#ECE8FE]/50 hover:scale-102'
                    }`}
                    title="Aplaudir logro (Clap)"
                  >
                    <span>👏</span>
                    <span className="font-bold text-[11px]">{item.reactions.clap}</span>
                    <span className="hidden sm:inline text-[10px] font-medium opacity-80">Clap</span>
                  </button>

                  {/* CELEBRATION (Celebrar) */}
                  <button
                    type="button"
                    onClick={() => handleToggleReaction(item.id, 'celebration')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      item.hasReacted?.celebration
                        ? 'bg-[#FFF7E8] border-[#FFB547] text-[#D97706] font-bold shadow-xs scale-105'
                        : 'bg-[#F5F4FC] border-[#E5E3F5] text-[#585876] hover:bg-[#FFF7E8]/50 hover:scale-102'
                    }`}
                    title="Celebrar logro con fiesta"
                  >
                    <span>🎉</span>
                    <span className="font-bold text-[11px]">{item.reactions.celebration}</span>
                    <span className="hidden sm:inline text-[10px] font-medium opacity-80">Celebrar</span>
                  </button>

                  {/* FIRE (En llamas) */}
                  <button
                    type="button"
                    onClick={() => handleToggleReaction(item.id, 'fire')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      item.hasReacted?.fire
                        ? 'bg-[#FEEBED] border-[#FF6B91] text-[#E11D48] font-bold shadow-xs scale-105'
                        : 'bg-[#F5F4FC] border-[#E5E3F5] text-[#585876] hover:bg-[#FEEBED]/50'
                    }`}
                    title="¡En llamas! / Boost de energía"
                  >
                    <span>🔥</span>
                    <span className="font-bold text-[11px]">{item.reactions.fire}</span>
                  </button>

                  {/* HEART (Apoyo) */}
                  <button
                    type="button"
                    onClick={() => handleToggleReaction(item.id, 'heart')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      item.hasReacted?.heart
                        ? 'bg-[#FEEBED] border-[#FF6B91] text-[#FF6B91] font-bold shadow-xs scale-105'
                        : 'bg-[#F5F4FC] border-[#E5E3F5] text-[#585876] hover:bg-[#FEEBED]/50'
                    }`}
                    title="Apoyar a tu compañero"
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.hasReacted?.heart ? 'fill-current' : ''}`} />
                    <span className="font-bold text-[11px]">{item.reactions.heart}</span>
                  </button>

                  {/* INSPIRE (Inspiración) */}
                  <button
                    type="button"
                    onClick={() => handleToggleReaction(item.id, 'inspire')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      item.hasReacted?.inspire
                        ? 'bg-[#EBF7FC] border-[#24B8E8] text-[#0284C7] font-bold shadow-xs scale-105'
                        : 'bg-[#F5F4FC] border-[#E5E3F5] text-[#585876] hover:bg-[#EBF7FC]/50'
                    }`}
                    title="Inspiración / Genio"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span className="font-bold text-[11px]">{item.reactions.inspire ?? 5}</span>
                  </button>
                </div>

                {/* Quick Cheer or Homework Action */}
                {item.userId !== user.id && (
                  <div className="flex items-center gap-2">
                    {item.type === 'assignment' ? (
                      <span className="px-3 py-1 rounded-xl bg-[#ECE8FE] text-[#7255F7] text-[11px] font-extrabold flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Ver Tarea</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendCheer(item.userName)}
                        className="px-3 py-1 rounded-xl bg-white hover:bg-[#ECE8FE] border border-[#E5E3F5] text-[#7255F7] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Felicitar</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-[#8E8EA8] text-xs space-y-1">
            <p>No hay publicaciones en esta categoría todavía.</p>
            <p className="font-semibold text-[#7255F7]">¡Sé el primero en compartir un reto o logro!</p>
          </div>
        )}
      </div>
    </div>
  );
};
