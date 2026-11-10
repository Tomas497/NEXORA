import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  Code, 
  FileText, 
  Image as ImageIcon, 
  ArrowRight, 
  Check, 
  Lightbulb, 
  AlertCircle, 
  TrendingUp,
  Target,
  Compass,
  FlaskConical,
  Award
} from 'lucide-react';
import { NexoOrb } from '../components/NexoOrb';
import { Language, UserProfile, UserProgress, ConceptMastery, TutorMessage } from '../types';
import { getTranslation } from '../i18n';

interface TutorViewProps {
  user: UserProfile;
  progress: UserProgress;
  concepts: ConceptMastery[];
  language: Language;
  initialMode?: 'explain' | 'challenge' | 'analyze_error' | 'test_level';
  initialConceptId?: string;
  onOpenLabs: (tab?: string) => void;
  onOpenMap: () => void;
  onBack?: () => void;
}

export const TutorView: React.FC<TutorViewProps> = ({
  user,
  progress,
  concepts,
  language,
  initialMode = 'explain',
  initialConceptId = 'c_regla_cadena',
  onOpenLabs,
  onOpenMap,
  onBack,
}) => {
  const [activeMode, setActiveMode] = useState<'explain' | 'challenge' | 'analyze_error' | 'test_level'>(initialMode);
  const [activeConceptId, setActiveConceptId] = useState<string>(initialConceptId);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [tangentSliderVal, setTangentSliderVal] = useState(1);
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(1); // Default to option 2 (6x(x²+1)²) matching screenshot
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const t = (section: string, key: string, params?: any) => getTranslation(language, section, key, params);

  // Initial Seeded Conversation matching the reference screenshots
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'Ponme un reto de derivadas, algo un poco más difícil',
      timestamp: '10:02',
    },
    {
      id: 'm2',
      sender: 'nexo',
      mode: 'challenge',
      timestamp: '10:02',
      card: {
        mode: 'challenge',
        challenge: {
          badge: 'RETO ADAPTADO',
          xp: 50,
          problem: 'Combina la regla de la potencia con la regla de la cadena.',
          formula: 'g(x) = (x² + 1)³',
          options: [
            '3(x² + 1)²',
            '6x(x² + 1)²',
            '3x²(x² + 1)²',
          ],
          correctIndex: 1,
          explanation: '¡Muy bien! Exterior: 3(x² + 1)². Interior: 2x. Al multiplicarlas obtienes 6x(x² + 1)².',
        }
      }
    }
  ]);

  const activeConcept = concepts.find(c => c.conceptId === activeConceptId) || concepts[3];

  const handleSendMessage = async (textToSend?: string, overrideMode?: any) => {
    const text = textToSend || inputMessage;
    if (!text.trim() && !overrideMode) return;

    const currentMode = overrideMode || activeMode;
    const userMsg: TutorMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text || (currentMode === 'challenge' ? 'Ponme un reto de derivadas, algo un poco más difícil' : 'Explícame este concepto'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: currentMode,
          message: text,
          conceptId: activeConceptId,
          language,
        }),
      });

      const data = await response.json();
      if (data.card) {
        const nexoMsg: TutorMessage = {
          id: `nx_${Date.now()}`,
          sender: 'nexo',
          mode: currentMode,
          card: data.card,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, nexoMsg]);
      }
    } catch (err) {
      console.error('Error in tutor chat:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleModeChange = (mode: 'explain' | 'challenge' | 'analyze_error' | 'test_level') => {
    setActiveMode(mode);
    if (mode === 'challenge') {
      handleSendMessage('Ponme un reto adaptado sobre la regla de la cadena', 'challenge');
    } else if (mode === 'analyze_error') {
      handleSendMessage('Analiza este error en derivadas: f(x) = (3x+1)^4', 'analyze_error');
    } else if (mode === 'test_level') {
      handleSendMessage('Comprueba mi nivel con preguntas de derivadas', 'test_level');
    } else {
      handleSendMessage('¿Cómo funciona la regla de la cadena con un ejemplo visual?', 'explain');
    }
  };

  const getModeSubtitle = () => {
    switch (activeMode) {
      case 'challenge': return 'Ponme un reto · intermedio';
      case 'explain': return 'Explícame · visual';
      case 'analyze_error': return 'Analiza mi error · guiado';
      case 'test_level': return 'Comprueba mi nivel · diagnóstico';
      default: return 'Tutor adaptativo personal';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 md:pb-8 items-start">
      {/* Left Chat & Mode Area (Cols 1-8) */}
      <div className="lg:col-span-8 bg-white rounded-[28px] shadow-sm border border-[#E5E3F5] overflow-hidden flex flex-col min-h-[calc(100vh-140px)] md:min-h-[720px] justify-between relative">
        {/* Tutor Top Header matching both M_vil___Tutor_IA_b95573e7.png and Desktop */}
        <div className="p-3.5 sm:p-5 border-b border-[#F0EEFA] flex items-center justify-between gap-3 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Back button (Active on mobile to return to Dashboard) */}
            <button
              onClick={() => onBack ? onBack() : window.history.back()}
              className="w-10 h-10 rounded-2xl bg-[#F5F4FC] hover:bg-[#ECE8FE] text-[#202038] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Volver"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <NexoOrb size="md" isThinking={isThinking} />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg text-[#202038]">Nexo</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-[#7A7A9E] font-medium leading-tight">
                {getModeSubtitle()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden px-3 py-1.5 rounded-xl bg-[#ECE8FE] text-[#7255F7] text-xs font-bold transition-colors cursor-pointer"
            >
              {showMobileSidebar ? 'Ocultar mapa' : 'Ver mapa'}
            </button>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-[#E6F9F5] text-[#059669] text-xs font-bold items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              {t('tutor', 'firstUnderstand')}
            </span>
          </div>
        </div>

        {/* Mode Selector Chips matching M_vil___Tutor_IA_b95573e7.png */}
        <div className="p-3 bg-[#F5F4FC]/70 border-b border-[#E5E3F5] flex items-center gap-2 overflow-x-auto scrollbar-none snap-x">
          {[
            { id: 'explain', label: 'Explícame' },
            { id: 'challenge', label: 'Ponme un reto' },
            { id: 'analyze_error', label: 'Analiza mi error' },
            { id: 'test_level', label: 'Comprueba mi nivel' },
          ].map((modeItem) => {
            const isActive = activeMode === modeItem.id;
            return (
              <button
                key={modeItem.id}
                onClick={() => handleModeChange(modeItem.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap snap-start shrink-0 ${
                  isActive
                    ? 'bg-[#202038] text-white shadow-sm'
                    : 'bg-white border border-[#E5E3F5] text-[#585876] hover:bg-[#F5F4FC]'
                }`}
              >
                {modeItem.label}
              </button>
            );
          })}
        </div>

        {/* Chat Conversation Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-lg bg-[#7255F7] text-white p-4 rounded-3xl rounded-tr-sm text-sm font-medium shadow-md shadow-[#7255F7]/15">
                    {msg.text}
                  </div>
                </div>
              );
            }

            // Nexo Message
            return (
              <div key={msg.id} className="flex items-start gap-3 max-w-2xl">
                <NexoOrb size="sm" />
                <div className="flex-1 space-y-3">
                  {msg.text && (
                    <div className="p-4 rounded-3xl rounded-tl-sm bg-[#F5F4FC] border border-[#E5E3F5] text-sm text-[#202038] leading-relaxed">
                      {msg.text}
                    </div>
                  )}

                  {/* Render Structured Pedagogical Card */}
                  {msg.card && (
                    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E3F5] shadow-sm space-y-4">
                      {/* Explícame Mode Card */}
                      {msg.card.mode === 'explain' && (
                        <>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE8FE] text-[#7255F7] text-xs font-bold uppercase tracking-wider">
                            EXPLÍCAME · VISUAL
                          </div>

                          <h3 className="font-heading font-extrabold text-xl text-[#202038]">
                            {msg.card.title}
                          </h3>

                          {msg.card.analogy && (
                            <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#FFB547]/30 text-xs sm:text-sm text-[#202038] flex items-start gap-3">
                              <Lightbulb className="w-5 h-5 text-[#FFB547] shrink-0 mt-0.5" />
                              <p className="leading-relaxed font-normal">{msg.card.analogy}</p>
                            </div>
                          )}

                          {msg.card.steps && (
                            <div className="space-y-2 text-xs sm:text-sm text-[#202038]">
                              {msg.card.steps.map((step: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <span className="w-5 h-5 rounded-full bg-[#7255F7] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <p className="leading-relaxed">{step}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Interactive Tangent Slider in Explícame Mode */}
                          <div className="p-5 rounded-2xl bg-[#F5F4FC] border border-[#E5E3F5] space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span>Mueve el punto y mira cómo cambia la pendiente</span>
                              <span className="text-[#7255F7]">En x = {tangentSliderVal.toFixed(1)}, la pendiente es {(2 * tangentSliderVal).toFixed(1)}</span>
                            </div>

                            <input
                              type="range"
                              min="-2"
                              max="3"
                              step="0.5"
                              value={tangentSliderVal}
                              onChange={(e) => setTangentSliderVal(parseFloat(e.target.value))}
                              className="w-full h-2 bg-[#E5E3F5] rounded-lg appearance-none cursor-pointer accent-[#7255F7]"
                            />

                            {/* SVG Parabola and Tangent Preview */}
                            <div className="h-32 bg-white rounded-xl border border-[#E5E3F5] flex items-center justify-center relative overflow-hidden">
                              <svg className="w-full h-full" viewBox="-3 -1 6 7">
                                <path d="M -2.5 6.25 Q 0 -0.5 2.5 6.25" fill="none" stroke="#7255F7" strokeWidth="0.15" />
                                <circle cx={tangentSliderVal} cy={tangentSliderVal * tangentSliderVal} r="0.2" fill="#24B8E8" />
                                <line 
                                  x1={tangentSliderVal - 1.2} 
                                  y1={tangentSliderVal * tangentSliderVal - 1.2 * (2 * tangentSliderVal)} 
                                  x2={tangentSliderVal + 1.2} 
                                  y2={tangentSliderVal * tangentSliderVal + 1.2 * (2 * tangentSliderVal)} 
                                  stroke="#FF6B91" 
                                  strokeWidth="0.1" 
                                  strokeDasharray="0.15,0.08" 
                                />
                              </svg>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Ponme un Reto Card matching M_vil___Tutor_IA_b95573e7.png */}
                      {msg.card.mode === 'challenge' && msg.card.challenge && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-[#FFF5E6] text-[#D97706] text-xs font-extrabold uppercase tracking-wider">
                              {msg.card.challenge.badge || 'RETO ADAPTADO'}
                            </span>
                            <span className="text-xs font-extrabold text-[#7255F7]">+{msg.card.challenge.xp || 50} XP</span>
                          </div>

                          <p className="text-sm text-[#202038] font-medium leading-relaxed">
                            {msg.card.challenge.problem}
                          </p>

                          {msg.card.challenge.formula && (
                            <div className="py-3 px-4 rounded-2xl bg-[#F5F4FC] text-center font-heading font-extrabold text-xl text-[#202038]">
                              {msg.card.challenge.formula}
                            </div>
                          )}

                          <div className="space-y-2.5">
                            {msg.card.challenge.options.map((opt: string, i: number) => {
                              const isSelected = challengeAnswer === i;
                              const isCorrectOption = i === msg.card!.challenge!.correctIndex;
                              let btnClass = 'border-[#E5E3F5] bg-white hover:bg-[#F5F4FC] text-[#202038]';
                              if (challengeAnswer !== null) {
                                if (isCorrectOption) {
                                  btnClass = 'border-2 border-[#19C6A3] bg-[#E8FAF4] text-[#059669] font-bold shadow-sm';
                                } else if (isSelected) {
                                  btnClass = 'border-[#FF6B91] bg-[#FEEBED] text-[#E11D48] font-bold';
                                }
                              }

                              return (
                                <button
                                  key={i}
                                  onClick={() => setChallengeAnswer(i)}
                                  className={`w-full p-3.5 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {challengeAnswer !== null && isCorrectOption && <span className="text-[#059669] font-bold">✓</span>}
                                </button>
                              );
                            })}
                          </div>

                          {challengeAnswer !== null && (
                            <div className="p-3.5 rounded-2xl bg-[#E8FAF4] border border-[#C5F3E7] text-[#059669] text-xs font-medium leading-relaxed">
                              {msg.card.challenge.explanation}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Analiza mi error Card */}
                      {msg.card.mode === 'analyze_error' && msg.card.errorAnalysis && (
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEEBED] text-[#E11D48] text-xs font-bold uppercase tracking-wider">
                            <AlertCircle className="w-3.5 h-3.5" />
                            ANALIZA MI ERROR
                          </div>

                          <div className="space-y-2 p-3.5 rounded-2xl bg-[#F5F4FC] font-mono text-xs">
                            {msg.card.errorAnalysis.codeOrMath.map((line: string, idx: number) => (
                              <div 
                                key={idx} 
                                className={`p-2 rounded-lg ${idx === msg.card!.errorAnalysis!.errorLineIndex ? 'bg-[#FF6B91]/15 text-[#E11D48] font-bold border border-[#FF6B91]/30' : 'text-[#585876]'}`}
                              >
                                {line}
                              </div>
                            ))}
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#FFF9F0] border border-[#FFB547]/30 text-xs text-[#202038] space-y-1">
                            <span className="font-bold text-[#D97706] block">Patrón conceptual identificado:</span>
                            <p>{msg.card.errorAnalysis.conceptErrorName}</p>
                          </div>

                          <div className="space-y-1.5 text-xs text-[#585876]">
                            {msg.card.errorAnalysis.correctionGuide.map((step: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-[#19C6A3] font-bold">✓</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Preparing next challenge Pill matching M_vil___Tutor_IA_b95573e7.png */}
          <div className="flex items-center gap-2.5 pt-1">
            <NexoOrb size="sm" isThinking={isThinking} />
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F5F4FC] border border-[#E5E3F5] text-xs text-[#585876] font-medium shadow-sm">
              <span className="flex items-center gap-1 text-[#7255F7]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7255F7] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7255F7] animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7255F7] animate-pulse [animation-delay:0.4s]" />
              </span>
              <span>{isThinking ? 'Nexo está razonando...' : 'Preparando un reto más difícil...'}</span>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips matching M_vil___Tutor_IA_b95573e7.png */}
        <div className="px-4 py-2.5 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-[#F0EEFA] snap-x">
          {[
            'Algo más difícil',
            'Con trigonometría',
            'Explícamelo con un gráfico',
            'Otro ejercicio similar',
          ].map((sugg, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sugg)}
              className="px-4 py-1.5 rounded-full border border-[#DDD6FE] bg-white hover:bg-[#F5F4FC] text-xs font-bold text-[#7255F7] transition-all cursor-pointer whitespace-nowrap snap-start shrink-0 active:scale-95 shadow-2xs"
            >
              {sugg}
            </button>
          ))}
        </div>

        {/* Sticky Chat Input Bar matching M_vil___Tutor_IA_b95573e7.png */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E5E3F5] sticky bottom-0 z-20">
          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl border border-[#E5E3F5] bg-white shadow-sm focus-within:border-[#7255F7] focus-within:ring-2 focus-within:ring-[#7255F7]/15">
            <button 
              type="button" 
              onClick={() => alert('Simulación: Adjuntar documento o captura de ejercicio.')}
              className="p-1.5 rounded-xl text-[#8E8EA8] hover:text-[#585876] transition-colors cursor-pointer shrink-0" 
              title="Adjuntar imagen o ejercicio"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pide un reto o un tema..."
              className="flex-1 bg-transparent border-none text-sm text-[#202038] placeholder-[#8E8EA8] focus:outline-none"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() && !isThinking}
              className="w-10 h-10 rounded-xl bg-[#7255F7] hover:bg-[#5D3DE6] disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-[#7255F7]/30 transition-all cursor-pointer shrink-0"
              title="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Concept in Focus, Mastery & Recommendations (Desktop always; Mobile toggleable) */}
      <div className={`${showMobileSidebar ? 'block' : 'hidden'} lg:block lg:col-span-4 space-y-6 w-full`}>
        {/* Concept in Focus Card matching reference design */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E3F5] space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A9E]">
              {t('tutor', 'conceptInFocus')}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECE8FE] text-[#7255F7] font-bold">
              {activeConcept.name[language] || activeConcept.name.es}
            </span>
          </div>

          {/* Big Mastery Circle */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F5F4FC]">
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center font-heading font-extrabold text-lg text-[#7255F7] bg-white shadow-sm border-2 border-[#7255F7]">
              {activeConcept.mastery}%
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-[#202038]">
                {activeConcept.name[language] || activeConcept.name.es}
              </h4>
              <p className="text-xs text-[#7A7A9E] mt-0.5">Nivel detectado: intermedio</p>
            </div>
          </div>

          {/* Concepts Hierarchy */}
          <div className="space-y-3 pt-1">
            {[
              { name: 'Límites', pct: 92, state: 'Dominado', color: 'text-[#19C6A3]' },
              { name: 'Regla de la cadena', pct: 46, state: 'Reforzar', color: 'text-[#FFB547]' },
              { name: 'Integrales', pct: 0, state: 'Bloqueado', color: 'text-[#8E8EA8]' },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[#F0EEFA] last:border-none">
                <span className="font-semibold text-[#202038]">{c.name}</span>
                <span className={`font-bold ${c.color}`}>{c.pct > 0 ? `${c.pct}%` : c.state}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Card */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E3F5] space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A9E] block">
            {t('tutor', 'recommendations')}
          </span>

          <div className="space-y-2.5">
            <button
              onClick={() => onOpenLabs('math')}
              className="w-full p-3 rounded-2xl bg-[#F5F4FC] hover:bg-[#ECE8FE]/50 text-left transition-colors cursor-pointer flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-[#7255F7]/15 text-[#7255F7] flex items-center justify-center font-bold">
                ∑
              </div>
              <div>
                <div className="text-xs font-bold text-[#202038]">Laboratorio de matemáticas</div>
                <div className="text-[11px] text-[#7A7A9E]">Visualiza tangentes y parábolas</div>
              </div>
            </button>

            <button
              onClick={onOpenMap}
              className="w-full p-3 rounded-2xl bg-[#F5F4FC] hover:bg-[#EBF7FC]/50 text-left transition-colors cursor-pointer flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-[#24B8E8]/15 text-[#24B8E8] flex items-center justify-center font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#202038]">Mapa de conocimiento</div>
                <div className="text-[11px] text-[#7A7A9E]">Mira qué desbloqueas después</div>
              </div>
            </button>

            <button
              onClick={() => handleSendMessage('Ponme el reto diario de derivados', 'challenge')}
              className="w-full p-3 rounded-2xl bg-[#F5F4FC] hover:bg-[#FFF5E6]/50 text-left transition-colors cursor-pointer flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFB547]/15 text-[#D97706] flex items-center justify-center font-bold">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#202038]">Misión del día</div>
                <div className="text-[11px] text-[#7A7A9E]">Completa 2 retos con Nexo</div>
              </div>
            </button>
          </div>
        </div>

        {/* Previous Sessions */}
        <div className="bg-gradient-to-b from-[#1C1A38] to-[#14122C] text-white rounded-[28px] p-6 shadow-xl space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block">
            {t('tutor', 'previousSessions')}
          </span>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-white/10">
              <span className="font-semibold">Límites al infinito</span>
              <span className="text-white/60">Ayer</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/10">
              <span className="font-semibold">Continuidad</span>
              <span className="text-white/60">Lun</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-semibold">Funciones compuestas</span>
              <span className="text-white/60">Dom</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
