import React, { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, GraduationCap, BookOpen, Sparkles, Target } from 'lucide-react';
import { NexoOrb } from './NexoOrb';
import { Language } from '../types';
import { getTranslation } from '../i18n';

interface OnboardingModalProps {
  isOpen: boolean;
  language: Language;
  onComplete: (data: any) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  language,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [educationLevel, setEducationLevel] = useState('Universidad');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['calculo', 'programacion']);
  const [learningStyle, setLearningStyle] = useState<'visual' | 'practical' | 'reading' | 'conversation'>('visual');
  const [dailyGoalXP, setDailyGoalXP] = useState<10 | 20 | 30 | 50>(20);

  if (!isOpen) return null;

  const t = (section: string, key: string, params?: any) => getTranslation(language, section, key, params);
  const totalSteps = 5;
  const progressPercent = (step / totalSteps) * 100;

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        name: userName.trim() || undefined,
        educationLevel,
        subjects: selectedSubjects,
        learningStyle,
        dailyGoalXP,
        passedPlacement: false,
      });
    }
  };

  const handlePlacementChoice = (takePlacement: boolean) => {
    onComplete({
      name: userName.trim() || undefined,
      educationLevel,
      subjects: selectedSubjects,
      learningStyle,
      dailyGoalXP,
      passedPlacement: takePlacement,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F5F4FC] animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-[#E5E3F5] relative space-y-8">
        {/* Progress Bar & Step Counter matching screenshot */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-[#7A7A9E]">
            <span>{t('onboarding', 'step')} {step} {t('onboarding', 'of')} {totalSteps}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#ECE8FE] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#7255F7] to-[#24B8E8] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step 1: Education Level (Matches reference image Onboarding_5f5ee15e.png) */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <NexoOrb size="md" />
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202038] tracking-tight">
                  {t('onboarding', 'q1Title')}
                </h2>
                <p className="text-sm text-[#7A7A9E] mt-1">
                  {t('onboarding', 'q1Sub')}
                </p>
              </div>
            </div>

            {/* User Name Input */}
            <div className="bg-[#ECE8FE]/40 p-4 rounded-2xl border border-[#ECE8FE] space-y-1.5">
              <label className="block text-xs font-bold text-[#7255F7] uppercase tracking-wider">
                ¿Cómo te llamas o cómo quieres que te llame Nexo?
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Escribe tu nombre (ej: Tomás)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E3F5] bg-white text-sm font-semibold focus:outline-none focus:border-[#7255F7] text-[#202038]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'Bachillerato', title: t('onboarding', 'q1Opt1'), sub: t('onboarding', 'q1Opt1Sub'), icon: GraduationCap, color: '#7255F7' },
                { id: 'Universidad', title: t('onboarding', 'q1Opt2'), sub: t('onboarding', 'q1Opt2Sub'), icon: BookOpen, color: '#24B8E8' },
                { id: 'Autodidacta', title: t('onboarding', 'q1Opt3'), sub: t('onboarding', 'q1Opt3Sub'), icon: Sparkles, color: '#19C6A3' },
                { id: 'Preparando un examen', title: t('onboarding', 'q1Opt4'), sub: t('onboarding', 'q1Opt4Sub'), icon: Target, color: '#FFB547' },
              ].map((opt) => {
                const isSelected = educationLevel === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setEducationLevel(opt.id)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-36 ${
                      isSelected
                        ? 'border-2 border-[#7255F7] bg-[#FBFBFF] shadow-md shadow-[#7255F7]/10'
                        : 'border-[#E5E3F5] bg-white hover:bg-[#F5F4FC]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F4FC] flex items-center justify-center" style={{ color: opt.color }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-[#7255F7] border-[#7255F7] text-white' : 'border-[#D1D0E4]'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm text-[#202038]">{opt.title}</div>
                      <div className="text-[11px] text-[#7A7A9E] mt-0.5 leading-tight">{opt.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Subjects Focus */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <NexoOrb size="md" />
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202038] tracking-tight">
                  {t('onboarding', 'q2Title')}
                </h2>
                <p className="text-sm text-[#7A7A9E] mt-1">
                  {t('onboarding', 'q2Sub')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'calculo', name: 'Cálculo', desc: 'Límites, derivadas, integrales y optimización', color: '#7255F7' },
                { id: 'programacion', name: 'Programación', desc: 'Lógica, bucles, algoritmos y JavaScript', color: '#24B8E8' },
                { id: 'fisica', name: 'Física', desc: 'Cinemática, proyectiles y leyes de Newton', color: '#19C6A3' },
              ].map((subj) => {
                const isSelected = selectedSubjects.includes(subj.id);
                return (
                  <button
                    key={subj.id}
                    onClick={() => toggleSubject(subj.id)}
                    className={`p-6 rounded-2xl border text-left transition-all cursor-pointer relative space-y-3 ${
                      isSelected
                        ? 'border-2 border-[#7255F7] bg-[#FBFBFF] shadow-md shadow-[#7255F7]/10'
                        : 'border-[#E5E3F5] bg-white hover:bg-[#F5F4FC]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-extrabold text-lg text-[#202038]">{subj.name}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-[#7255F7] border-[#7255F7] text-white' : 'border-[#D1D0E4]'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-xs text-[#585876] leading-relaxed">{subj.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Learning Style */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <NexoOrb size="md" />
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202038] tracking-tight">
                  {t('onboarding', 'q3Title')}
                </h2>
                <p className="text-sm text-[#7A7A9E] mt-1">
                  {t('onboarding', 'q3Sub')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'visual', title: t('onboarding', 'q3Opt1'), sub: t('onboarding', 'q3Opt1Sub') },
                { id: 'practical', title: t('onboarding', 'q3Opt2'), sub: t('onboarding', 'q3Opt2Sub') },
                { id: 'reading', title: t('onboarding', 'q3Opt3'), sub: t('onboarding', 'q3Opt3Sub') },
                { id: 'conversation', title: t('onboarding', 'q3Opt4'), sub: t('onboarding', 'q3Opt4Sub') },
              ].map((style) => {
                const isSelected = learningStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setLearningStyle(style.id as any)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? 'border-2 border-[#7255F7] bg-[#ECE8FE]/40'
                        : 'border-[#E5E3F5] bg-white hover:bg-[#F5F4FC]'
                    }`}
                  >
                    <div>
                      <div className="font-heading font-bold text-sm text-[#202038]">{style.title}</div>
                      <div className="text-xs text-[#7A7A9E] mt-0.5">{style.sub}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${isSelected ? 'bg-[#7255F7] border-[#7255F7] text-white' : 'border-[#D1D0E4]'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Daily Goal Commitment */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <NexoOrb size="md" />
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202038] tracking-tight">
                  {t('onboarding', 'q4Title')}
                </h2>
                <p className="text-sm text-[#7A7A9E] mt-1">
                  {t('onboarding', 'q4Sub')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { val: 10, label: t('onboarding', 'goal10') },
                { val: 20, label: t('onboarding', 'goal20') },
                { val: 30, label: t('onboarding', 'goal30') },
                { val: 50, label: t('onboarding', 'goal50') },
              ].map((g) => {
                const isSelected = dailyGoalXP === g.val;
                return (
                  <button
                    key={g.val}
                    onClick={() => setDailyGoalXP(g.val as any)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? 'border-2 border-[#7255F7] bg-[#ECE8FE]/40 shadow-sm'
                        : 'border-[#E5E3F5] bg-white hover:bg-[#F5F4FC]'
                    }`}
                  >
                    <span className="font-heading font-bold text-sm text-[#202038]">{g.label}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-[#7255F7] border-[#7255F7] text-white' : 'border-[#D1D0E4]'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Placement Test Choice */}
        {step === 5 && (
          <div className="space-y-8 text-center max-w-xl mx-auto">
            <div className="flex justify-center">
              <NexoOrb size="lg" />
            </div>

            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202038] tracking-tight">
                {t('onboarding', 'q5Title')}
              </h2>
              <p className="text-sm text-[#7A7A9E] mt-2 leading-relaxed">
                {t('onboarding', 'q5Sub')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => handlePlacementChoice(true)}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7255F7] to-[#24B8E8] text-white font-bold text-sm shadow-lg shadow-[#7255F7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                {t('onboarding', 'takePlacement')}
              </button>

              <button
                onClick={() => handlePlacementChoice(false)}
                className="py-3.5 px-6 rounded-2xl bg-white border border-[#E5E3F5] text-[#585876] font-bold text-sm hover:bg-[#F5F4FC] transition-colors cursor-pointer"
              >
                {t('onboarding', 'startFromZero')}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        {step < 5 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#F0EEFA]">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-[#E5E3F5] text-sm font-semibold text-[#585876] hover:bg-[#F5F4FC] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('onboarding', 'back')}</span>
              </button>
            ) : <div />}

            <button
              onClick={handleNext}
              className="px-7 py-3 rounded-2xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white font-bold text-sm shadow-md shadow-[#7255F7]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{t('onboarding', 'next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
