import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Lightbulb, 
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, Exercise, Language } from '../types';
import { getTranslation } from '../i18n';
import { sound } from '../utils/soundEngine';

interface LessonPlayerModalProps {
  isOpen: boolean;
  lesson: Lesson;
  energy: number;
  language: Language;
  onClose: () => void;
  onSubmitAnswer: (params: {
    exerciseId: string;
    answer: any;
    exerciseType: string;
    conceptId: string;
    isExam?: boolean;
    isReview?: boolean;
  }) => Promise<{
    isCorrect: boolean;
    explanation: string;
    xpEarned: number;
    gemsEarned: number;
    energyRemaining: number;
    leveledUp: boolean;
    newLevel: number;
    newTitle: string;
  }>;
  onOpenTutorWithExercise: (exercise: Exercise, failedAnswer: any) => void;
  onLessonFinished: (summary: { xp: number; gems: number; accuracy: number; timeSec: number }) => void;
}

export const LessonPlayerModal: React.FC<LessonPlayerModalProps> = ({
  isOpen,
  lesson,
  energy: initialEnergy,
  language,
  onClose,
  onSubmitAnswer,
  onOpenTutorWithExercise,
  onLessonFinished,
}) => {
  const [queue, setQueue] = useState<Exercise[]>(() => [...lesson.exercises]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [orderedSteps, setOrderedSteps] = useState<number[]>([]);
  const [graphParam, setGraphParam] = useState<number>(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionEnergy, setSessionEnergy] = useState(initialEnergy);

  if (!isOpen) return null;

  const currentExercise = queue[currentIndex];
  const t = (section: string, key: string) => getTranslation(language, section, key);
  const progressPercent = ((currentIndex + 1) / Math.max(queue.length, 1)) * 100;

  if (currentExercise?.type === 'order_steps' && orderedSteps.length === 0 && currentExercise.stepsToOrder) {
    setOrderedSteps(currentExercise.stepsToOrder.map((_, i) => i));
  }

  const handleCheck = async () => {
    if (!currentExercise || isEvaluating) return;
    setIsEvaluating(true);

    let answerToSubmit = selectedOption;
    if (currentExercise.type === 'order_steps') {
      answerToSubmit = orderedSteps;
    } else if (currentExercise.type === 'interactive_graph') {
      answerToSubmit = graphParam;
    }

    try {
      const res = await onSubmitAnswer({
        exerciseId: currentExercise.id,
        answer: answerToSubmit,
        exerciseType: currentExercise.type,
        conceptId: currentExercise.conceptId,
        isExam: lesson.isExam,
        isReview: lesson.isReview,
      });

      setSessionEnergy(res.energyRemaining);
      setTotalAttempted(prev => prev + 1);
      setFeedback({
        isCorrect: res.isCorrect,
        explanation: res.explanation || currentExercise.explanation[language] || currentExercise.explanation.es,
      });
      setIsChecked(true);

      if (res.isCorrect) {
        sound.playCorrect();
        setCorrectCount(prev => prev + 1);
      } else {
        sound.playIncorrect();
        setQueue(prev => [...prev, currentExercise]);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleContinue = () => {
    sound.playClick();
    setIsChecked(false);
    setFeedback(null);
    setSelectedOption(null);
    setOrderedSteps([]);

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
      sound.playLevelUp();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      const timeSec = Math.round((Date.now() - startTime) / 1000);
      const accuracy = Math.round((correctCount / Math.max(totalAttempted, 1)) * 100);
      onLessonFinished({
        xp: lesson.xpReward + (accuracy === 100 ? 5 : 0),
        gems: lesson.gemsReward + (accuracy === 100 ? 1 : 0),
        accuracy,
        timeSec,
      });
    }
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    sound.playClick();
    const updated = [...orderedSteps];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setOrderedSteps(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl min-h-[620px] bg-[var(--card-bg)] text-[var(--text-main)] rounded-3xl shadow-2xl border border-[var(--border-soft)] flex flex-col justify-between overflow-hidden relative">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-soft)] flex items-center justify-between gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl hover:bg-[var(--card-elevated)] text-[var(--text-muted)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-md h-3 rounded-full bg-[var(--border-soft)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7255F7] to-[#24B8E8] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FEEBED] text-[#E11D48] text-xs font-bold">
            <Heart className="w-4 h-4 fill-[#FF6B91] text-[#FF6B91]" />
            <span>{sessionEnergy}</span>
          </div>
        </div>

        {/* Center: Active Exercise or Completion */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center">
          {isCompleted ? (
            <div className="text-center space-y-6 max-w-md mx-auto py-8">
              <div className="w-20 h-20 rounded-full bg-[#E6F9F5] text-[#19C6A3] flex items-center justify-center mx-auto shadow-lg shadow-[#19C6A3]/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="font-heading font-extrabold text-3xl text-[var(--text-main)]">
                  {t('lesson', 'lessonComplete')}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Has dominado conceptos clave de {lesson.title[language] || lesson.title.es}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)]">
                <div className="text-center">
                  <div className="font-heading font-extrabold text-xl text-[#7255F7]">+{lesson.xpReward}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{t('lesson', 'xpEarned')}</div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-extrabold text-xl text-[#19C6A3]">+{lesson.gemsReward}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{t('lesson', 'gemsEarned')}</div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-extrabold text-xl text-[#24B8E8]">
                    {Math.round((correctCount / Math.max(totalAttempted, 1)) * 100)}%
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{t('lesson', 'accuracy')}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-[#7255F7] text-white font-bold text-sm shadow-lg shadow-[#7255F7]/30 hover:scale-[1.02] transition-all cursor-pointer"
              >
                {t('lesson', 'finishLesson')}
              </button>
            </div>
          ) : currentExercise ? (
            <div className="space-y-6 max-w-xl mx-auto w-full">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7255F7] bg-[#ECE8FE] px-2.5 py-1 rounded-md">
                  {currentExercise.type.replace('_', ' ')}
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-[var(--text-main)] mt-2.5 leading-snug">
                  {currentExercise.question[language] || currentExercise.question.es}
                </h3>
              </div>

              {/* Multiple Choice */}
              {currentExercise.type === 'multiple_choice' && currentExercise.options && (
                <div className="space-y-3">
                  {currentExercise.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        disabled={isChecked}
                        onClick={() => {
                          sound.playClick();
                          setSelectedOption(opt.id);
                        }}
                        className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-2 border-[#7255F7] bg-[#ECE8FE]/50 text-[#7255F7] shadow-sm'
                            : 'border-[var(--border-soft)] bg-[var(--card-elevated)] hover:bg-[var(--border-soft)]/50 text-[var(--text-main)]'
                        }`}
                      >
                        <span>{opt.text}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#7255F7] bg-[#7255F7] text-white' : 'border-[var(--border-strong)]'}`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* True / False */}
              {currentExercise.type === 'true_false' && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: true, label: 'Verdadero' },
                    { val: false, label: 'Falso' },
                  ].map((btn) => {
                    const isSelected = selectedOption === btn.val;
                    return (
                      <button
                        key={String(btn.val)}
                        disabled={isChecked}
                        onClick={() => {
                          sound.playClick();
                          setSelectedOption(btn.val);
                        }}
                        className={`p-6 rounded-2xl border text-center font-heading font-bold text-base transition-all cursor-pointer ${
                          isSelected
                            ? 'border-2 border-[#7255F7] bg-[#ECE8FE]/50 text-[#7255F7]'
                            : 'border-[var(--border-soft)] bg-[var(--card-elevated)] text-[var(--text-main)]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Fill Blank */}
              {(currentExercise.type === 'fill_blank' || currentExercise.type === 'numeric') && (
                <div className="pt-2">
                  <input
                    type="text"
                    disabled={isChecked}
                    value={selectedOption || ''}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full px-5 py-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--card-elevated)] text-base font-semibold focus:outline-none focus:border-[#7255F7] text-[var(--text-main)]"
                  />
                </div>
              )}

              {/* Order Steps */}
              {currentExercise.type === 'order_steps' && currentExercise.stepsToOrder && (
                <div className="space-y-2.5">
                  <p className="text-xs text-[var(--text-muted)]">Ordena los pasos lógicos de arriba a abajo:</p>
                  {orderedSteps.map((stepIndex, pos) => (
                    <div
                      key={stepIndex}
                      className="p-3.5 rounded-2xl border border-[var(--border-soft)] bg-[var(--card-elevated)] flex items-center justify-between text-xs sm:text-sm font-medium text-[var(--text-main)] shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FE] text-[#7255F7] font-bold text-xs flex items-center justify-center">
                          {pos + 1}
                        </span>
                        <span>{currentExercise.stepsToOrder![stepIndex]}</span>
                      </div>
                      {!isChecked && (
                        <div className="flex items-center gap-1">
                          {pos > 0 && (
                            <button
                              onClick={() => moveStep(pos, pos - 1)}
                              className="px-2 py-1 text-xs rounded bg-[var(--card-bg)] hover:bg-[#ECE8FE] font-bold"
                            >
                              ▲
                            </button>
                          )}
                          {pos < orderedSteps.length - 1 && (
                            <button
                              onClick={() => moveStep(pos, pos + 1)}
                              className="px-2 py-1 text-xs rounded bg-[var(--card-bg)] hover:bg-[#ECE8FE] font-bold"
                            >
                              ▼
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Spot Error */}
              {currentExercise.type === 'spot_error' && currentExercise.solutionLines && (
                <div className="space-y-2.5">
                  <p className="text-xs text-[var(--text-muted)]">Selecciona la línea donde se encuentra el error:</p>
                  {currentExercise.solutionLines.map((line) => {
                    const isSelected = selectedOption === line.line;
                    return (
                      <button
                        key={line.line}
                        disabled={isChecked}
                        onClick={() => {
                          sound.playClick();
                          setSelectedOption(line.line);
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-left font-mono text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-2 border-[#FF6B91] bg-[#FEEBED] text-[#E11D48] font-bold'
                            : 'border-[var(--border-soft)] bg-[var(--card-elevated)] text-[var(--text-main)]'
                        }`}
                      >
                        <span>Línea {line.line}: {line.text}</span>
                        {isSelected && <span className="text-xs font-sans font-bold">Error marcado</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Interactive Graph */}
              {currentExercise.type === 'interactive_graph' && (
                <div className="p-6 rounded-3xl bg-[var(--card-elevated)] border border-[var(--border-soft)] space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Parámetro de la función x = {graphParam.toFixed(1)}</span>
                    <span className="text-[#7255F7]">Pendiente tangente f'(x) = {(2 * graphParam).toFixed(1)}</span>
                  </div>

                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.1"
                    value={graphParam}
                    disabled={isChecked}
                    onChange={(e) => setGraphParam(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[var(--border-soft)] rounded-lg appearance-none cursor-pointer accent-[#7255F7]"
                  />

                  <div className="h-32 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-soft)] flex items-center justify-center p-2 relative overflow-hidden">
                    <svg className="w-full h-full" viewBox="-4 -2 8 8">
                      <path d="M -3 9 Q 0 -1 3 9" fill="none" stroke="#7255F7" strokeWidth="0.2" />
                      <circle cx={graphParam} cy={Math.min(7, graphParam * graphParam)} r="0.25" fill="#24B8E8" />
                      <line
                        x1={graphParam - 1.5}
                        y1={graphParam * graphParam - 1.5 * (2 * graphParam)}
                        x2={graphParam + 1.5}
                        y2={graphParam * graphParam + 1.5 * (2 * graphParam)}
                        stroke="#FF6B91"
                        strokeWidth="0.15"
                        strokeDasharray="0.2,0.1"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!isCompleted && (
          <div className={`p-4 sm:p-6 border-t transition-colors ${
            isChecked
              ? feedback?.isCorrect
                ? 'bg-[#E6F9F5] border-[#19C6A3]/30'
                : 'bg-[#FEEBED] border-[#FF6B91]/30'
              : 'bg-[var(--card-bg)] border-[var(--border-soft)]'
          }`}>
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              {isChecked ? (
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 font-heading font-extrabold text-sm sm:text-base">
                    {feedback?.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                        <span className="text-[#059669]">{t('lesson', 'correctTitle')}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-[#E11D48]" />
                        <span className="text-[#E11D48]">{t('lesson', 'incorrectTitle')}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {feedback?.explanation}
                  </p>
                </div>
              ) : (
                <div className="hidden sm:block text-xs text-[var(--text-muted)] font-medium">
                  Selecciona una respuesta para continuar
                </div>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isChecked && !feedback?.isCorrect && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenTutorWithExercise(currentExercise, selectedOption);
                    }}
                    className="px-4 py-3 rounded-2xl bg-[var(--card-bg)] border border-[#FF6B91]/30 text-[#E11D48] font-bold text-xs hover:bg-[#FFF5F7] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Lightbulb className="w-4 h-4 text-[#FFB547]" />
                    <span>{t('lesson', 'askNexoHelp')}</span>
                  </button>
                )}

                {isChecked ? (
                  <button
                    onClick={handleContinue}
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      feedback?.isCorrect
                        ? 'bg-[#059669] hover:bg-[#047857]'
                        : 'bg-[#E11D48] hover:bg-[#BE123C]'
                    }`}
                  >
                    <span>{t('lesson', 'continue')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled={selectedOption === null && currentExercise?.type !== 'order_steps' && currentExercise?.type !== 'interactive_graph'}
                    onClick={handleCheck}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7255F7] hover:bg-[#5D3DE6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-md shadow-[#7255F7]/30 transition-all cursor-pointer"
                  >
                    {t('lesson', 'check')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
