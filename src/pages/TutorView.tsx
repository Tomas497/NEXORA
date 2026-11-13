import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  RotateCcw, 
  Lightbulb, 
  Target, 
  AlertCircle, 
  Compass, 
  Check, 
  TrendingUp,
  BrainCircuit,
  Sliders,
  ChevronDown,
  Dices,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NexoOrb } from '../components/NexoOrb';
import { UserProfile, UserProgress, ConceptMastery, Language, TutorMessage } from '../types';
import { getTranslation } from '../i18n';
import { sound } from '../utils/soundEngine';

interface TutorViewProps {
  user: UserProfile;
  progress: UserProgress;
  concepts: ConceptMastery[];
  language: Language;
  onOpenLabs: (tab?: string) => void;
  onOpenMap: () => void;
  onBack?: () => void;
  onAwardXP?: (amount: number, reason: string) => void;
}

const AVAILABLE_STEM_TOPICS = [
  { id: 'c_regla_cadena', name: 'Regla de la Cadena', subject: 'Cálculo', icon: '📐' },
  { id: 'c_limites', name: 'Límites y Continuidad', subject: 'Cálculo', icon: '📐' },
  { id: 'c_optimizacion', name: 'Optimización y Extremos', subject: 'Cálculo', icon: '📐' },
  { id: 'c_bucles', name: 'Bucles y Complejidad', subject: 'Programación', icon: '💻' },
  { id: 'c_recursion', name: 'Recursión y Casos Base', subject: 'Programación', icon: '💻' },
  { id: 'c_cinematica', name: 'Cinemática y Proyectiles', subject: 'Física', icon: '⚛️' },
];

export const TutorView: React.FC<TutorViewProps> = ({
  user,
  progress,
  concepts,
  language,
  onOpenLabs,
  onOpenMap,
  onBack,
  onAwardXP,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'm_welcome',
      sender: 'nexo',
      mode: 'explain',
      text: '¡Hola! Soy **Nexo**, tu tutor de inteligencia artificial integrado. Puedes hacerme **cualquier pregunta básica** sobre ciencias, matemáticas, física, biología, química, programación o técnicas de estudio, o pedirme retos interactivos adaptados a tu nivel. ¿En qué duda o tema te ayudo hoy?',
      timestamp: 'Ahora',
      card: {
        mode: 'explain',
        title: 'Tutor IA Integrado NEXORA',
        analogy: 'Tu copiloto cognitivo listo para resolver cualquier duda paso a paso y entrenar tu mente.',
        steps: [
          'Escribe cualquier duda conceptual básica (ej: "¿Qué es la gravedad?", "¿Qué es una función?", "¿Qué es la fotosíntesis?", "¿Qué es un algoritmo?").',
          'Pide un reto interactivo con «🎲 Otro Reto» o escribe "Ponme un reto de derivadas".',
          'Calcula operaciones o despeja ecuaciones matemáticas en lenguaje natural.'
        ]
      }
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [activeMode, setActiveMode] = useState<'explain' | 'challenge' | 'analyze_error' | 'test_level'>('explain');
  const [activeConceptId, setActiveConceptId] = useState('c_regla_cadena');
  const [isThinking, setIsThinking] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Record<string, boolean>>({});
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showTopicMenu, setShowTopicMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const t = (section: string, key: string, params?: any) => getTranslation(language, section, key, params);
  const currentTopic = AVAILABLE_STEM_TOPICS.find(t => t.id === activeConceptId) || AVAILABLE_STEM_TOPICS[0];

  const handleSendMessage = async (textToSend?: string, overrideMode?: any, overrideConcept?: string) => {
    const text = textToSend !== undefined ? textToSend : inputMessage;
    const currentMode = overrideMode || activeMode;
    const conceptToUse = overrideConcept || activeConceptId;

    if (!text.trim() && !overrideMode) return;

    sound.playClick();
    const userMsg: TutorMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text || (currentMode === 'challenge' ? `Ponme un reto de ${currentTopic.name}` : `Explícame ${currentTopic.name}`),
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
          conceptId: conceptToUse,
          language,
        }),
      });

      const data = await response.json();
      if (data.card || data.textResponse) {
        const nexoMsg: TutorMessage = {
          id: `nx_${Date.now()}`,
          sender: 'nexo',
          mode: data.card?.mode || currentMode,
          card: data.card,
          text: data.textResponse,
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

  const handleSelectOption = (messageId: string, optionIndex: number, correctIndex: number, xpReward: number = 50) => {
    if (userAnswers[messageId] !== undefined) return; // Prevent multiple submissions for same card

    setUserAnswers(prev => ({ ...prev, [messageId]: optionIndex }));
    const isCorrect = optionIndex === correctIndex;

    if (isCorrect) {
      sound.playCorrect();
      setAnsweredCorrectly(prev => ({ ...prev, [messageId]: true }));
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#7255F7', '#24B8E8', '#10B981', '#F59E0B'],
      });
      if (onAwardXP) {
        onAwardXP(xpReward, 'Reto del Tutor Nexo');
      }
    } else {
      sound.playIncorrect();
      setAnsweredCorrectly(prev => ({ ...prev, [messageId]: false }));
    }
  };

  const handleGenerateNextChallenge = () => {
    handleSendMessage(`Genera un nuevo reto dinámico de ${currentTopic.name}`, 'challenge');
  };

  const handleModeChange = (mode: 'explain' | 'challenge' | 'analyze_error' | 'test_level') => {
    setActiveMode(mode);
    if (mode === 'challenge') {
      handleSendMessage(`Ponme un reto adaptado sobre ${currentTopic.name}`, 'challenge');
    } else if (mode === 'analyze_error') {
      handleSendMessage(`Analiza un error común en ${currentTopic.name}`, 'analyze_error');
    } else if (mode === 'test_level') {
      handleSendMessage(`Comprueba mi nivel en ${currentTopic.name}`, 'test_level');
    } else {
      handleSendMessage(`Explícame ${currentTopic.name} con un ejemplo visual`, 'explain');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 md:pb-8 items-start">
      {/* Left Chat & Mode Area (Cols 1-8) */}
      <div className="lg:col-span-8 bg-[var(--card-bg)] rounded-[28px] shadow-sm border border-[var(--border-soft)] overflow-hidden flex flex-col min-h-[calc(100vh-140px)] md:min-h-[720px] justify-between relative transition-colors">
        
        {/* Tutor Top Header */}
        <div className="p-3.5 sm:p-5 border-b border-[var(--border-soft)] flex items-center justify-between gap-3 bg-[var(--card-bg)] sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Back button */}
            <button
              onClick={() => onBack ? onBack() : window.history.back()}
              className="w-10 h-10 rounded-2xl bg-[var(--card-elevated)] hover:bg-[var(--primary-light)] text-[var(--text-main)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Volver"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <NexoOrb size="md" isThinking={isThinking} />

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg text-[var(--text-main)]">Nexo</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium leading-tight truncate">
                Tutor STEM Dinámico · {currentTopic.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Topic Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTopicMenu(!showTopicMenu)}
                className="px-3 py-1.5 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentTopic.icon}</span>
                <span className="hidden sm:inline">{currentTopic.name}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showTopicMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-soft)] p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setShowTopicMenu(false)}
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Selecciona un Tema STEM
                  </div>
                  {AVAILABLE_STEM_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        sound.playClick();
                        setActiveConceptId(topic.id);
                        setShowTopicMenu(false);
                        handleSendMessage(`Cambiar tema a: ${topic.name}. Ponme un reto dinámico.`, 'challenge', topic.id);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                        activeConceptId === topic.id
                          ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold'
                          : 'hover:bg-[var(--card-elevated)] text-[var(--text-main)]'
                      }`}
                    >
                      <span className="text-base">{topic.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{topic.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-normal">{topic.subject}</div>
                      </div>
                      {activeConceptId === topic.id && <Check className="w-3.5 h-3.5 text-[var(--primary)]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden px-2.5 py-1.5 rounded-xl bg-[var(--card-elevated)] text-[var(--text-muted)] text-xs font-bold transition-colors cursor-pointer"
            >
              {showMobileSidebar ? 'Ocultar' : 'Mapa'}
            </button>
          </div>
        </div>

        {/* Dynamic Mode Selector & "Nuevo Reto" Button */}
        <div className="p-3 bg-[var(--card-elevated)] border-b border-[var(--border-soft)] flex items-center justify-between gap-2 overflow-x-auto scrollbar-none snap-x">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'explain', label: 'Explícame' },
              { id: 'challenge', label: 'Reto adaptado' },
              { id: 'analyze_error', label: 'Analiza mi error' },
              { id: 'test_level', label: 'Diagnóstico' },
            ].map((modeItem) => {
              const isActive = activeMode === modeItem.id;
              return (
                <button
                  key={modeItem.id}
                  onClick={() => handleModeChange(modeItem.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap snap-start shrink-0 ${
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-xs'
                      : 'bg-[var(--card-bg)] border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {modeItem.label}
                </button>
              );
            })}
          </div>

          {/* Quick Dynamic Challenge Generator Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              handleSendMessage(`Genera otro reto completamente nuevo de ${currentTopic.name}`, activeMode);
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)]/30 hover:bg-[var(--primary)] hover:text-white transition-all cursor-pointer whitespace-nowrap snap-start shrink-0 flex items-center gap-1.5 shadow-xs"
            title="Genera un nuevo ejercicio aleatorio con IA"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>🎲 Otro Reto</span>
          </button>
        </div>

        {/* Chat Conversation Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div 
                    className="max-w-lg text-white p-4 rounded-3xl rounded-tr-sm text-sm font-medium shadow-md transition-all"
                    style={{ backgroundColor: 'var(--primary)', boxShadow: '0 8px 24px -6px var(--night-glow)' }}
                  >
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
                    <div className="p-4 rounded-3xl rounded-tl-sm bg-[var(--card-elevated)] border border-[var(--border-soft)] text-sm text-[var(--text-main)] leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </div>
                  )}

                  {/* Dynamic Interactive Cards from Server */}
                  {msg.card && (
                    <div className="p-5 rounded-3xl rounded-tl-sm bg-[var(--card-bg)] border border-[var(--border-soft)] shadow-md space-y-4">
                      
                      {/* 1. Explain Card */}
                      {msg.card.mode === 'explain' && (
                        <div className="space-y-4">
                          {msg.card.title && (
                            <h3 className="font-heading font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-500" />
                              <span>{msg.card.title}</span>
                            </h3>
                          )}

                          {msg.card.analogy && (
                            <div className="p-4 rounded-2xl bg-[var(--primary-light)] border border-[var(--primary)]/20 text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                              <span className="font-bold block mb-1 text-[var(--primary)]">Analogía intuitiva:</span>
                              <p className="font-normal">{msg.card.analogy}</p>
                            </div>
                          )}

                          {msg.card.steps && (
                            <div className="space-y-2 text-xs sm:text-sm text-[var(--text-main)]">
                              {msg.card.steps.map((step: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <span 
                                    className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: 'var(--primary)' }}
                                  >
                                    {idx + 1}
                                  </span>
                                  <p className="leading-relaxed">{step}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. Dynamic Challenge Card */}
                      {(msg.card.mode === 'challenge' || msg.card.mode === 'test_level') && msg.card.challenge && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-extrabold tracking-wider uppercase">
                              <Sparkles className="w-3.5 h-3.5" />
                              {msg.card.challenge.badge || 'RETO ADAPTADO'}
                            </span>
                            <span className="text-xs font-extrabold text-[var(--primary)]">
                              +{msg.card.challenge.xp || 50} XP
                            </span>
                          </div>

                          <p className="text-sm text-[var(--text-main)] font-semibold leading-relaxed">
                            {msg.card.challenge.problem}
                          </p>

                          {msg.card.challenge.formula && (
                            <div className="py-3 px-4 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)] text-center font-mono font-extrabold text-lg sm:text-xl text-[var(--text-main)] overflow-x-auto">
                              {msg.card.challenge.formula}
                            </div>
                          )}

                          {/* Options Checklist */}
                          <div className="space-y-2.5">
                            {msg.card.challenge.options.map((opt: string, i: number) => {
                              const isSelected = userAnswers[msg.id] === i;
                              const isCorrectOption = i === msg.card!.challenge!.correctIndex;
                              const hasAnswered = userAnswers[msg.id] !== undefined;

                              let btnClass = 'border-[var(--border-soft)] bg-[var(--card-bg)] hover:bg-[var(--card-elevated)] text-[var(--text-main)]';
                              if (hasAnswered) {
                                if (isCorrectOption) {
                                  btnClass = 'border-2 border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs';
                                } else if (isSelected) {
                                  btnClass = 'border-2 border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-bold';
                                }
                              }

                              return (
                                <button
                                  key={i}
                                  onClick={() => handleSelectOption(msg.id, i, msg.card!.challenge!.correctIndex, msg.card!.challenge!.xp)}
                                  disabled={hasAnswered}
                                  className={`w-full p-3.5 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {hasAnswered && isCorrectOption && (
                                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                                      <Check className="w-4 h-4 stroke-[3]" /> Correcto
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation and Next Challenge Chain Button */}
                          {userAnswers[msg.id] !== undefined && (
                            <div className="space-y-3 animate-in fade-in">
                              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-medium leading-relaxed">
                                {msg.card.challenge.explanation}
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  onClick={handleGenerateNextChallenge}
                                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                                  style={{ backgroundColor: 'var(--primary)' }}
                                >
                                  <span>Siguiente Reto Adaptado</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. Dynamic Error Analysis Card */}
                      {msg.card.mode === 'analyze_error' && msg.card.errorAnalysis && (
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 text-red-500 text-xs font-bold uppercase tracking-wider">
                            <AlertCircle className="w-3.5 h-3.5" />
                            ANALIZA EL ERROR CONCEPTUAL
                          </div>

                          <div className="space-y-2 p-3.5 rounded-2xl bg-[var(--card-elevated)] font-mono text-xs border border-[var(--border-soft)]">
                            {msg.card.errorAnalysis.codeOrMath.map((line: string, idx: number) => (
                              <div 
                                key={idx} 
                                className={`p-2 rounded-lg transition-colors ${
                                  idx === msg.card!.errorAnalysis!.errorLineIndex 
                                    ? 'bg-red-500/15 text-red-500 font-bold border border-red-500/30' 
                                    : 'text-[var(--text-muted)]'
                                }`}
                              >
                                {line}
                              </div>
                            ))}
                          </div>

                          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-[var(--text-main)] space-y-1">
                            <span className="font-bold text-amber-500 block">Diagnóstico del error:</span>
                            <p>{msg.card.errorAnalysis.conceptErrorName}</p>
                          </div>

                          <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                            {msg.card.errorAnalysis.correctionGuide.map((step: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-500 font-bold">✓</span>
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

          {isThinking && (
            <div className="flex items-center gap-3">
              <NexoOrb size="sm" isThinking={true} />
              <div className="p-3 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)] text-xs text-[var(--text-muted)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
                <span>Nexo está generando un nuevo ejercicio dinámico...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Suggestion Quick Chips */}
        <div className="px-4 py-2.5 bg-[var(--card-bg)] flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-[var(--border-soft)] snap-x">
          {[
            '🌌 ¿Qué es la gravedad?',
            '🌿 ¿Qué es la fotosíntesis?',
            '💻 ¿Qué es un bucle?',
            '📐 ¿Qué es una función?',
            '⚡ Leyes de Newton',
            '🔢 ¿Qué es Pi (π)?',
            `🎲 Reto de ${currentTopic.name}`,
            '💡 Explícamelo con otra analogía',
          ].map((sugg, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sugg)}
              className="px-3.5 py-1.5 rounded-full border border-[var(--border-soft)] bg-[var(--card-elevated)] hover:bg-[var(--primary-light)] text-xs font-bold text-[var(--text-main)] hover:text-[var(--primary)] transition-all cursor-pointer whitespace-nowrap snap-start shrink-0 active:scale-95 shadow-2xs"
            >
              {sugg}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-[var(--card-bg)] border-t border-[var(--border-soft)] sticky bottom-0 z-20">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--card-elevated)] shadow-xs focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/15"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Hazme cualquier pregunta básica, ciencia, código, cálculo o pide un reto..."
              className="flex-1 bg-transparent border-none text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() && !isThinking}
              className="w-10 h-10 rounded-xl disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
              style={{ backgroundColor: 'var(--primary)' }}
              title="Enviar pregunta"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar: Concept in Focus, Mastery & Recommendations */}
      <div className={`${showMobileSidebar ? 'block' : 'hidden'} lg:block lg:col-span-4 space-y-6 w-full`}>
        {/* Concept in Focus Card */}
        <div className="bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-5 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t('tutor', 'conceptInFocus')}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-bold">
              {currentTopic.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-heading font-extrabold text-xl shadow-xs">
              {currentTopic.icon}
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-[var(--text-main)]">
                {currentTopic.name}
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Materia: {currentTopic.subject}</p>
            </div>
          </div>

          {/* Concepts Switcher List */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-soft)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Explorar Otros Temas
            </span>
            {AVAILABLE_STEM_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  sound.playClick();
                  setActiveConceptId(topic.id);
                  handleSendMessage(`Cambiar a ${topic.name}. Ponme un reto dinámico.`, 'challenge', topic.id);
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  activeConceptId === topic.id
                    ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold border border-[var(--primary)]/30'
                    : 'hover:bg-[var(--card-elevated)] text-[var(--text-main)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{topic.icon}</span>
                  <span>{topic.name}</span>
                </div>
                {activeConceptId === topic.id && <span className="text-xs">Activo</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Previous Dynamic Sessions History */}
        <div className="bg-gradient-to-b from-[#1C1A38] to-[#14122C] text-white rounded-[28px] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block">
              Generador Inteligente Activo
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            Nexo adapta los coeficientes, expresiones trigonométricas y códigos en cada turno para que nunca veas el mismo ejercicio repetido.
          </p>

          <button
            onClick={handleGenerateNextChallenge}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Generar Nuevo Reto Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
