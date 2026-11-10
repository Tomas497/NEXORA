import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Swords, 
  Timer, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X,
  Award
} from 'lucide-react';
import { UserProgress, Language } from '../types';
import { getTranslation } from '../i18n';

interface LeaguesViewProps {
  progress: UserProgress;
  leaderboard: any[];
  language: Language;
  onAwardXP: (amount: number, reason: string) => void;
}

export const LeaguesView: React.FC<LeaguesViewProps> = ({
  progress,
  leaderboard,
  language,
  onAwardXP,
}) => {
  const [showDuelModal, setShowDuelModal] = useState(false);
  const [duelStep, setDuelStep] = useState(0);
  const [duelScoreUser, setDuelScoreUser] = useState(0);
  const [duelScoreOpponent, setDuelScoreOpponent] = useState(0);
  const [duelFinished, setDuelFinished] = useState(false);

  const t = (section: string, key: string) => getTranslation(language, section, key);

  const divisions = [
    'Cuarzo', 'Ámbar', 'Jade', 'Zafiro', 'Rubí',
    'Nebulosa', 'Cometa', 'Órbita', 'Galaxia', 'Nexus'
  ];

  const duelQuestions = [
    { q: '¿Derivada de f(x) = 5x³?', opts: ['15x²', '15x', '5x²'], correct: 0 },
    { q: '¿lim(x→0) sin(x)/x?', opts: ['0', '1', 'Indefinido'], correct: 1 },
    { q: '¿Derivada de f(x) = e^(2x)?', opts: ['e^(2x)', '2e^(2x)', '2x·e^(2x)'], correct: 1 },
  ];

  const handleAnswerDuel = (optIdx: number) => {
    const isCorrect = optIdx === duelQuestions[duelStep].correct;
    if (isCorrect) setDuelScoreUser(prev => prev + 1);
    // Opponent random chance
    if (Math.random() > 0.4) setDuelScoreOpponent(prev => prev + 1);

    if (duelStep + 1 < duelQuestions.length) {
      setDuelStep(duelStep + 1);
    } else {
      setDuelFinished(true);
      if (duelScoreUser >= duelScoreOpponent) {
        onAwardXP(30, 'Victoria en Duelo de Cálculo');
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Divisions Carousel */}
      <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E3F5] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#7255F7] uppercase tracking-wider block">
              {t('leaguesView', 'title')}
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-[#202038]">
              División {progress.currentLeague}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowDuelModal(true); setDuelStep(0); setDuelScoreUser(0); setDuelScoreOpponent(0); setDuelFinished(false); }}
              className="px-4 py-2 rounded-xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#7255F7]/25 transition-all cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>{t('leaguesView', 'duelFriend')}</span>
            </button>
          </div>
        </div>

        {/* Division Badges Line */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {divisions.map((div, i) => {
            const isCurrent = div === progress.currentLeague;
            return (
              <div
                key={div}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border transition-all ${
                  isCurrent
                    ? 'bg-[#7255F7] text-white border-[#7255F7] shadow-sm shadow-[#7255F7]/30 scale-105'
                    : 'bg-[#F5F4FC] text-[#7A7A9E] border-[#E5E3F5]'
                }`}
              >
                {div}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table matching specifications */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-[#E5E3F5] space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#585876] font-medium">
            {t('leaguesView', 'subtitle')}
          </p>
          <span className="text-xs font-bold text-[#19C6A3]">
            Cierre en: 2 días 14 h
          </span>
        </div>

        <div className="space-y-2">
          {leaderboard.map((member, idx) => {
            const isTop7 = member.rank <= 7;
            const isBottom5 = member.rank >= 26;
            const isUser = Boolean(member.isUser || member.name.includes('(Tú)'));

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isUser
                    ? 'bg-[#ECE8FE] border-[#7255F7] shadow-sm font-bold'
                    : 'bg-white border-[#E5E3F5] hover:bg-[#F5F4FC]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-6 text-center font-heading font-extrabold text-sm text-[#7A7A9E]">
                    {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : member.rank}
                  </div>

                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>

                  <div>
                    <div className="font-heading font-bold text-xs sm:text-sm text-[#202038] flex items-center gap-1.5">
                      <span>{member.name}</span>
                      {isUser && (
                        <span className="px-1.5 py-0.2 bg-[#7255F7] text-white text-[9px] font-bold rounded">TÚ</span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#7A7A9E] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#FFB547] fill-[#FFB547]" />
                      <span>{member.streak} días</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-heading font-extrabold text-sm text-[#7255F7]">
                    {member.xp} XP
                  </span>
                  {isTop7 && (
                    <span title="Zona de ascenso">
                      <ArrowUp className="w-4 h-4 text-[#19C6A3]" />
                    </span>
                  )}
                  {isBottom5 && (
                    <span title="Zona de descenso">
                      <ArrowDown className="w-4 h-4 text-[#FF6B91]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Duel Interactive Modal */}
      {showDuelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E3F5] space-y-5 relative">
            <button
              onClick={() => setShowDuelModal(false)}
              className="absolute top-4 right-4 text-[#7A7A9E] hover:text-[#202038]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ECE8FE] text-[#7255F7] flex items-center justify-center">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#202038]">
                  Duelo de Cálculo Rápido
                </h3>
                <p className="text-xs text-[#7A7A9E]">Tú vs Andrés Navarro (Líder Liga Zafiro)</p>
              </div>
            </div>

            {/* Live Duel Scores */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#F5F4FC] text-center">
              <div>
                <div className="text-xs text-[#7A7A9E]">Tú</div>
                <div className="font-heading font-extrabold text-xl text-[#7255F7]">{duelScoreUser}</div>
              </div>
              <div>
                <div className="text-xs text-[#7A7A9E]">Andrés</div>
                <div className="font-heading font-extrabold text-xl text-[#FFB547]">{duelScoreOpponent}</div>
              </div>
            </div>

            {!duelFinished ? (
              <div className="space-y-4 pt-2">
                <div className="text-xs font-bold text-[#7255F7]">
                  Pregunta {duelStep + 1} de {duelQuestions.length}:
                </div>
                <div className="font-heading font-extrabold text-base text-[#202038]">
                  {duelQuestions[duelStep].q}
                </div>

                <div className="space-y-2">
                  {duelQuestions[duelStep].opts.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerDuel(i)}
                      className="w-full p-3 rounded-2xl border border-[#E5E3F5] hover:border-[#7255F7] hover:bg-[#F5F4FC] text-left text-xs font-semibold text-[#202038] transition-colors cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="text-2xl">
                  {duelScoreUser >= duelScoreOpponent ? '🏆 ¡VICTORIA!' : '🤝 ¡BUEN INTENTO!'}
                </div>
                <p className="text-xs text-[#585876]">
                  {duelScoreUser >= duelScoreOpponent 
                    ? 'Has superado al rival y ganado +30 XP para la liga semanal.'
                    : 'Un duelo muy reñido. Sigue practicando para escalar posiciones.'}
                </p>
                <button
                  onClick={() => setShowDuelModal(false)}
                  className="w-full py-3 rounded-2xl bg-[#7255F7] text-white font-bold text-xs"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
