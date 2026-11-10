import React, { useState } from 'react';
import { 
  Sparkle, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  Code, 
  Compass, 
  Target, 
  Award, 
  FlaskConical, 
  Users, 
  Globe 
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n';
import { NexoOrb } from '../components/NexoOrb';

interface LandingPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onStartFree: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  setLanguage,
  onStartFree,
  onLogin,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const t = (section: string, key: string, params?: any) => getTranslation(language, section, key, params);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#F5F4FC] text-[#202038] font-['Inter',sans-serif]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E3F5] px-4 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7255F7] to-[#24B8E8] flex items-center justify-center shadow-md shadow-[#7255F7]/30">
                <Sparkle className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-[#202038]">
                NEXORA
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#585876]">
              <a href="#como-funciona" className="hover:text-[#7255F7] transition-colors">Cómo funciona</a>
              <a href="#estudiantes" className="hover:text-[#7255F7] transition-colors">Estudiantes</a>
              <a href="#docentes" className="hover:text-[#7255F7] transition-colors">Docentes</a>
              <a href="#precios" className="hover:text-[#7255F7] transition-colors">Precios</a>
              <a href="#preguntas" className="hover:text-[#7255F7] transition-colors">Preguntas</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1 text-xs font-bold text-[#585876] bg-[#F5F4FC] px-2.5 py-1.5 rounded-xl border border-[#E5E3F5]">
              <Globe className="w-3.5 h-3.5 text-[#7255F7]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none outline-none cursor-pointer text-xs font-bold text-[#202038]"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>

            <button
              onClick={onLogin}
              className="hidden sm:inline-block px-4 py-2 rounded-xl text-sm font-bold text-[#585876] hover:text-[#202038] hover:bg-[#F5F4FC] transition-colors cursor-pointer"
            >
              {t('brand', 'login')}
            </button>

            <button
              onClick={onStartFree}
              className="px-5 py-2.5 rounded-xl bg-[#7255F7] text-white text-sm font-bold shadow-md shadow-[#7255F7]/30 hover:bg-[#5D3DE6] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {t('brand', 'startFree')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 lg:px-12 pt-12 pb-20 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECE8FE] text-[#7255F7] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#7255F7]" />
              <span>Nuevo · Tutor IA que se adapta a ti</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#202038] tracking-tight leading-[1.12]">
              Aprender nunca fue{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7255F7] via-[#24B8E8] to-[#19C6A3]">
                tan personal.
              </span>
            </h1>

            <p className="text-lg text-[#585876] leading-relaxed max-w-xl font-normal">
              {t('brand', 'heroSubtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartFree}
                className="px-7 py-3.5 rounded-2xl bg-[#7255F7] text-white font-bold text-base shadow-lg shadow-[#7255F7]/35 hover:bg-[#5D3DE6] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t('brand', 'startFree')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#como-funciona"
                className="px-6 py-3.5 rounded-2xl bg-white border border-[#E5E3F5] text-[#202038] font-bold text-base hover:bg-[#F5F4FC] transition-colors cursor-pointer"
              >
                {t('brand', 'discover')}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-semibold text-[#7A7A9E]">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#19C6A3]" /> {t('brand', 'freeForever')}
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#19C6A3]" /> {t('brand', 'noCreditCard')}
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#19C6A3]" /> {t('brand', 'languagesBadge')}
              </span>
            </div>
          </div>

          {/* Right Hero Visual Mockup matching screenshot */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E3F5] relative z-10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EEFA]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs font-semibold text-[#8E8EA8] ml-2">app.nexora · Inicio</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5E6] text-[#D97706] text-xs font-bold">
                  🔥 12 días
                </div>
              </div>

              {/* Next Step Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#7255F7] to-[#5D3DE6] text-white">
                <div className="text-[10px] font-bold tracking-wider uppercase opacity-80">TU SIGUIENTE PASO</div>
                <div className="text-lg font-extrabold mt-0.5">Regla de la cadena</div>
                <div className="text-xs opacity-90 mt-1">15 min · Te falta poco para dominar Derivadas</div>
              </div>

              {/* Nexo Conversation Bubble Preview */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F4FC] border border-[#E5E3F5]">
                <NexoOrb size="sm" />
                <div className="text-xs text-[#202038] font-medium leading-relaxed">
                  Vi que en tu último ejercicio olvidaste derivar la función interior. ¿Lo vemos con un ejemplo visual?
                </div>
              </div>

              {/* Progress mini bars */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#585876] mb-1">
                  <span>Minutos de aprendizaje</span>
                  <span className="text-[#19C6A3]">+18% esta semana</span>
                </div>
                <div className="flex items-end justify-between h-16 pt-3 px-2 bg-[#F5F4FC] rounded-2xl">
                  {[{ d: 'L', h: '60%' }, { d: 'M', h: '45%' }, { d: 'X', h: '80%' }, { d: 'J', h: '35%' }, { d: 'V', h: '70%' }, { d: 'S', h: '25%' }, { d: 'D', h: '50%' }].map((b, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 w-6">
                      <div className="w-4 rounded-t-md bg-[#7255F7]" style={{ height: b.h }} />
                      <span className="text-[10px] text-[#8E8EA8]">{b.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glowing blur ball */}
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#24B8E8]/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Section 1: How It Works */}
      <section id="como-funciona" className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E5E3F5]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-[#7255F7] uppercase tracking-wider mb-2">CÓMO FUNCIONA</div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#202038] tracking-tight">
            {t('landing', 'howItWorksTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '01', title: t('landing', 'step1Title'), desc: t('landing', 'step1Desc'), color: 'text-[#7255F7]' },
            { num: '02', title: t('landing', 'step2Title'), desc: t('landing', 'step2Desc'), color: 'text-[#24B8E8]' },
            { num: '03', title: t('landing', 'step3Title'), desc: t('landing', 'step3Desc'), color: 'text-[#19C6A3]' },
            { num: '04', title: t('landing', 'step4Title'), desc: t('landing', 'step4Desc'), color: 'text-[#FF6B91]' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E3F5] hover:shadow-md transition-shadow">
              <span className={`font-heading font-extrabold text-4xl ${s.color} block mb-3`}>
                {s.num}
              </span>
              <h3 className="font-heading font-bold text-lg text-[#202038] mb-2">{s.title}</h3>
              <p className="text-sm text-[#585876] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: For Students */}
      <section id="estudiantes" className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E5E3F5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold text-[#19C6A3] uppercase tracking-wider">PARA ESTUDIANTES</div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#202038] tracking-tight">
              {t('landing', 'forStudentsTitle')}
            </h2>
            <p className="text-base text-[#585876] leading-relaxed">
              {t('landing', 'forStudentsSubtitle')}
            </p>

            <div className="space-y-4 pt-2">
              {[
                { title: 'Explicaciones a tu nivel', desc: 'Analogías, ejemplos y diagramas según cómo aprendes.', icon: Brain, color: 'text-[#7255F7]' },
                { title: 'Errores que enseñan', desc: 'Sube tu solución y descubre exactamente dónde te desviaste.', icon: Compass, color: 'text-[#24B8E8]' },
                { title: 'Retos personalizados', desc: 'Ejercicios que crecen contigo, ni muy fáciles ni frustrantes.', icon: Target, color: 'text-[#19C6A3]' },
                { title: 'Progreso visible', desc: 'Un mapa de conocimiento que muestra qué sabes y qué sigue.', icon: Award, color: 'text-[#FFB547]' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E5E3F5]">
                    <div className="p-2 rounded-xl bg-[#F5F4FC]">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#202038]">{item.title}</h4>
                      <p className="text-xs text-[#585876] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Preview Card: Mastery Map */}
          <div className="lg:col-span-6">
            <div className="bg-[#202038] text-white rounded-3xl p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/70">TU MAPA DE DOMINIO</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-[#19C6A3] font-bold">En tiempo real</span>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Límites', pct: 92, color: 'bg-[#19C6A3]' },
                  { name: 'Derivadas', pct: 78, color: 'bg-[#24B8E8]' },
                  { name: 'Regla de la cadena', pct: 46, color: 'bg-[#FFB547]' },
                  { name: 'Integrales', pct: 18, color: 'bg-[#FF6B91]' },
                ].map((concept, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{concept.name}</span>
                      <span>{concept.pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full ${concept.color} rounded-full`} style={{ width: `${concept.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed">
                <span className="font-bold text-[#24B8E8]">Nexo sugiere:</span> refuerza la regla de la cadena antes de empezar Integrales. Te tomará unos 20 minutos.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: For Teachers */}
      <section id="docentes" className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E5E3F5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Class Preview */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E5E3F5] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFA]">
                <div>
                  <h4 className="font-heading font-extrabold text-lg text-[#202038]">Cálculo I · Grupo B</h4>
                  <p className="text-xs text-[#7A7A9E]">Prof. Martínez · 28 estudiantes</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#E6F9F5] text-[#059669] font-bold">Activo</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-[#F5F4FC] text-center">
                  <div className="font-heading font-extrabold text-2xl text-[#202038]">28</div>
                  <div className="text-[11px] text-[#7A7A9E] font-medium">Estudiantes</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#E6F9F5] text-center">
                  <div className="font-heading font-extrabold text-2xl text-[#059669]">74%</div>
                  <div className="text-[11px] text-[#7A7A9E] font-medium">Dominio medio</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FFF5E6] text-center">
                  <div className="font-heading font-extrabold text-2xl text-[#D97706]">3</div>
                  <div className="text-[11px] text-[#7A7A9E] font-medium">Alertas IA</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEEBED] border border-[#FF6B91]/30 text-xs text-[#E11D48] flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <span><strong>Dificultad detectada:</strong> 3 estudiantes repiten el mismo error conceptual en la regla de la cadena.</span>
              </div>
            </div>
          </div>

          {/* Right: Teacher Features */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="text-xs font-bold text-[#24B8E8] uppercase tracking-wider">PARA DOCENTES</div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#202038] tracking-tight">
              {t('landing', 'forTeachersTitle')}
            </h2>
            <p className="text-base text-[#585876] leading-relaxed">
              {t('landing', 'forTeachersSubtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { title: 'Detección de dificultades', desc: 'Alertas tempranas cuando un grupo se atasca.' },
                { title: 'Evaluaciones con IA', desc: 'Genera evaluaciones alineadas a tus objetivos en minutos.' },
                { title: 'Perfiles individuales', desc: 'El recorrido de cada estudiante, en un solo lugar.' },
                { title: 'Reportes claros', desc: 'Informes listos para compartir con tu institución.' },
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-[#E5E3F5]">
                  <h4 className="font-heading font-bold text-sm text-[#202038] mb-1">{f.title}</h4>
                  <p className="text-xs text-[#585876] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <button
                onClick={onStartFree}
                className="px-6 py-3 rounded-xl bg-[#202038] text-white font-bold text-sm hover:bg-[#323254] transition-colors cursor-pointer"
              >
                {t('landing', 'teacherCta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Features Grid */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E5E3F5]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-[#7255F7] uppercase tracking-wider mb-2">FUNCIONES</div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#202038] tracking-tight">
            {t('landing', 'featuresTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: t('landing', 'featTutorTitle'), desc: t('landing', 'featTutorDesc'), icon: Brain, color: 'text-[#7255F7]', bg: 'bg-[#ECE8FE]' },
            { title: t('landing', 'featMapTitle'), desc: t('landing', 'featMapDesc'), icon: Compass, color: 'text-[#24B8E8]', bg: 'bg-[#EBF7FC]' },
            { title: t('landing', 'featLabCodeTitle'), desc: t('landing', 'featLabCodeDesc'), icon: Code, color: 'text-[#19C6A3]', bg: 'bg-[#E6F9F5]' },
            { title: t('landing', 'featLabMathTitle'), desc: t('landing', 'featLabMathDesc'), icon: Target, color: 'text-[#FFB547]', bg: 'bg-[#FFF5E6]' },
            { title: t('landing', 'featLabSciTitle'), desc: t('landing', 'featLabSciDesc'), icon: FlaskConical, color: 'text-[#FF6B91]', bg: 'bg-[#FEEBED]' },
            { title: t('landing', 'featMissionsTitle'), desc: t('landing', 'featMissionsDesc'), icon: Award, color: 'text-[#7255F7]', bg: 'bg-[#ECE8FE]' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white rounded-3xl p-6 border border-[#E5E3F5] shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#202038] mb-2">{card.title}</h3>
                <p className="text-sm text-[#585876] leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 5: Pricing */}
      <section id="precios" className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E5E3F5]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-[#19C6A3] uppercase tracking-wider mb-2">PRECIOS</div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#202038] tracking-tight">
            {t('landing', 'pricingTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#7255F7] shadow-xl relative">
            <span className="absolute -top-3.5 left-8 px-3.5 py-1 rounded-full bg-[#7255F7] text-white text-xs font-bold uppercase tracking-wider">
              Popular
            </span>
            <div className="flex justify-between items-baseline mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-[#202038]">{t('landing', 'freePlan')}</h3>
                <p className="text-xs text-[#7A7A9E] mt-1">Para estudiantes y autodidactas</p>
              </div>
              <div className="text-right">
                <span className="font-heading font-extrabold text-4xl text-[#202038]">{t('landing', 'freePrice')}</span>
                <span className="text-xs text-[#7A7A9E] block">{t('landing', 'freePeriod')}</span>
              </div>
            </div>

            <div className="space-y-3 my-6 text-sm text-[#4B4B68]">
              {[
                t('landing', 'freeF1'),
                t('landing', 'freeF2'),
                t('landing', 'freeF3'),
                t('landing', 'freeF4'),
                t('landing', 'freeF5'),
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#19C6A3]" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onStartFree}
              className="w-full py-3.5 rounded-2xl bg-[#7255F7] text-white font-bold text-sm shadow-md shadow-[#7255F7]/30 hover:bg-[#5D3DE6] transition-colors cursor-pointer"
            >
              {t('brand', 'startFree')}
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E3F5] shadow-sm relative opacity-90">
            <div className="flex justify-between items-baseline mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-[#202038]">{t('landing', 'premiumPlan')}</h3>
                <p className="text-xs text-[#7A7A9E] mt-1">Para alto rendimiento y preparación</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-[#ECE8FE] text-[#7255F7] text-xs font-bold">
                  {t('landing', 'premiumPrice')}
                </span>
              </div>
            </div>

            <div className="space-y-3 my-6 text-sm text-[#7A7A9E]">
              {[
                t('landing', 'premiumF1'),
                t('landing', 'premiumF2'),
                t('landing', 'premiumF3'),
                t('landing', 'premiumF4'),
                t('landing', 'premiumF5'),
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Sparkle className="w-3.5 h-3.5 text-[#FFB547]" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              disabled
              className="w-full py-3.5 rounded-2xl bg-[#F5F4FC] text-[#8E8EA8] font-bold text-sm border border-[#E5E3F5] cursor-not-allowed"
            >
              {t('landing', 'joinWaitlist')}
            </button>
          </div>
        </div>
      </section>

      {/* Section 6: FAQs */}
      <section id="preguntas" className="py-20 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto border-t border-[#E5E3F5]">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-[#7255F7] uppercase tracking-wider mb-2">PREGUNTAS FRECUENTES</div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#202038] tracking-tight">
            {t('landing', 'faqTitle')}
          </h2>
        </div>

        <div className="space-y-4">
          {[
            { q: t('landing', 'faq1Q'), a: t('landing', 'faq1A') },
            { q: t('landing', 'faq2Q'), a: t('landing', 'faq2A') },
            { q: t('landing', 'faq3Q'), a: t('landing', 'faq3A') },
            { q: t('landing', 'faq4Q'), a: t('landing', 'faq4A') },
            { q: t('landing', 'faq5Q'), a: t('landing', 'faq5A') },
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-[#E5E3F5] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-heading font-bold text-base text-[#202038] hover:bg-[#F5F4FC] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#7255F7]" /> : <ChevronDown className="w-5 h-5 text-[#7A7A9E]" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#585876] leading-relaxed border-t border-[#F0EEFA]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-8 lg:px-12 pb-20 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#7255F7] via-[#5D3DE6] to-[#24B8E8] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
              {t('landing', 'footerCallout')}
            </h3>
            <p className="text-white/80 text-sm font-medium">
              {t('brand', 'tagline')}
            </p>
          </div>
          <button
            onClick={onStartFree}
            className="px-8 py-4 rounded-2xl bg-white text-[#7255F7] font-extrabold text-base shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative z-10 shrink-0"
          >
            {t('brand', 'startFree')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E3F5] bg-white py-12 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#7A7A9E]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#7255F7] to-[#24B8E8] flex items-center justify-center">
              <Sparkle className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="font-heading font-extrabold text-base text-[#202038]">NEXORA</span>
          </div>

          <div>{t('landing', 'footerRights')}</div>

          <div className="flex items-center gap-6">
            <button onClick={onLogin} className="hover:text-[#202038] transition-colors cursor-pointer">
              {t('brand', 'login')}
            </button>
            <button onClick={onStartFree} className="hover:text-[#202038] transition-colors cursor-pointer">
              {t('brand', 'register')}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
