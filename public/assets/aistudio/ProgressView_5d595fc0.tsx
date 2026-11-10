import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Lock,
  ChevronRight
} from 'lucide-react';
import { UserProfile, UserProgress, ConceptMastery, Language } from '../types';
import { getTranslation } from '../i18n';

interface ProgressViewProps {
  user: UserProfile;
  progress: UserProgress;
  concepts: ConceptMastery[];
  language: Language;
  onOpenTutorForConcept: (conceptId: string) => void;
  onOpenLabs: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  user,
  progress,
  concepts,
  language,
  onOpenTutorForConcept,
  onOpenLabs,
}) => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'trimester'>('week');
  const [selectedConceptNode, setSelectedConceptNode] = useState<string>('c_regla_cadena');

  const t = (section: string, key: string, params?: any) => getTranslation(language, section, key, params);

  const activeConcept = concepts.find(c => c.conceptId === selectedConceptNode) || concepts[4];

  // Knowledge Map Connected Graph Nodes
  const knowledgeNodes = [
    { id: 'c_funciones', name: 'Funciones', pct: 96, x: 10, y: 50, status: 'mastered' },
    { id: 'c_limites', name: 'Límites', pct: 92, x: 28, y: 25, status: 'mastered' },
    { id: 'c_continuidad', name: 'Continuidad', pct: 85, x: 28, y: 75, status: 'mastered' },
    { id: 'c_derivadas', name: 'Derivadas', pct: 78, x: 50, y: 50, status: 'in_progress' },
    { id: 'c_regla_cadena', name: 'Regla de la cadena', pct: 46, x: 72, y: 25, status: 'next_step' },
    { id: 'c_optimizacion', name: 'Optimización', pct: 32, x: 72, y: 75, status: 'reinforce' },
    { id: 'c_integrales', name: 'Integrales', pct: 0, x: 90, y: 50, status: 'locked' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Banner Notice & Time Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706] bg-[#FFF5E6] px-3.5 py-1.5 rounded-full border border-[#FFB547]/30 w-fit">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{t('brand', 'demoModeNotice')}</span>
        </div>

        <div className="flex items-center bg-white p-1 rounded-2xl border border-[#E5E3F5] text-xs font-bold text-[#585876] w-fit">
          {(['week', 'month', 'trimester'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                timeFilter === filter ? 'bg-[#202038] text-white shadow-sm' : 'hover:text-[#202038]'
              }`}
            >
              {filter === 'week' ? t('progressView', 'week') : filter === 'month' ? t('progressView', 'month') : t('progressView', 'trimester')}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Summary Cards matching Estudiante___Progreso_c6cb77e2.png */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E3F5] space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#7A7A9E]">
            <Clock className="w-4 h-4 text-[#7255F7]" />
            <span>{t('progressView', 'studyTime')}</span>
          </div>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202038]">3,9 h</div>
          <div className="text-[11px] font-bold text-[#19C6A3]">+18% vs. periodo anterior</div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E3F5] space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#7A7A9E]">
            <Compass className="w-4 h-4 text-[#24B8E8]" />
            <span>{t('progressView', 'averageMastery')}</span>
          </div>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202038]">71%</div>
          <div className="text-[11px] font-bold text-[#19C6A3]">+4 pts vs. periodo anterior</div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E3F5] space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#7A7A9E]">
            <Target className="w-4 h-4 text-[#19C6A3]" />
            <span>{t('progressView', 'challengeAccuracy')}</span>
          </div>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202038]">82%</div>
          <div className="text-[11px] font-bold text-[#19C6A3]">+6 pts vs. periodo anterior</div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E3F5] space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#7A7A9E]">
            <Sparkles className="w-4 h-4 text-[#FFB547]" />
            <span>{t('progressView', 'xpGained')}</span>
          </div>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202038]">+{progress.weeklyXP}</div>
          <div className="text-[11px] font-bold text-[#19C6A3]">+12% vs. periodo anterior</div>
        </div>
      </div>

      {/* Middle Row: Activity Stacked Bars & Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Minutos por materia */}
        <div className="lg:col-span-8 bg-white rounded-[28px] p-6 sm:p-7 shadow-sm border border-[#E5E3F5] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#202038]">
                {t('progressView', 'learningActivity')}
              </h3>
              <p className="text-xs text-[#7A7A9E]">Minutos por materia por día</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#585876]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7255F7]" /> Cálculo</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#24B8E8]" /> Programación</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#19C6A3]" /> Física</span>
            </div>
          </div>

          <div className="h-48 pt-6 flex items-end justify-between gap-3 px-4">
            {[
              { d: 'Lun', total: 35, c: 18, p: 10, f: 7 },
              { d: 'Mar', total: 28, c: 12, p: 10, f: 6 },
              { d: 'Mié', total: 42, c: 22, p: 12, f: 8 },
              { d: 'Jue', total: 20, c: 10, p: 6, f: 4 },
              { d: 'Vie', total: 38, c: 20, p: 10, f: 8 },
              { d: 'Sáb', total: 15, c: 8, p: 4, f: 3 },
              { d: 'Hoy', total: 20, c: 12, p: 5, f: 3, isToday: true },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-[#8E8EA8]">{col.total}</span>
                <div className="w-full max-w-[32px] rounded-t-xl overflow-hidden flex flex-col justify-end" style={{ height: `${(col.total / 45) * 100}%` }}>
                  <div className="bg-[#7255F7]" style={{ height: `${(col.c / col.total) * 100}%` }} />
                  <div className="bg-[#24B8E8]" style={{ height: `${(col.p / col.total) * 100}%` }} />
                  <div className="bg-[#19C6A3]" style={{ height: `${(col.f / col.total) * 100}%` }} />
                </div>
                <span className={`text-xs font-semibold ${col.isToday ? 'text-[#7255F7] font-bold' : 'text-[#7A7A9E]'}`}>
                  {col.d}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart: Tiempo dedicado */}
        <div className="lg:col-span-4 bg-white rounded-[28px] p-6 sm:p-7 shadow-sm border border-[#E5E3F5] space-y-5 flex flex-col justify-between">
          <h3 className="font-heading font-extrabold text-base text-[#202038]">
            {t('progressView', 'timeDedicated')}
          </h3>

          <div className="flex items-center justify-center relative py-2">
            {/* SVG Donut */}
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E3F5"
                strokeWidth="3.8"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#7255F7"
                strokeWidth="3.8"
                strokeDasharray="48, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#24B8E8"
                strokeWidth="3.8"
                strokeDasharray="30, 100"
                strokeDashoffset="-48"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#19C6A3"
                strokeWidth="3.8"
                strokeDasharray="22, 100"
                strokeDashoffset="-78"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-heading font-extrabold text-2xl text-[#202038]">3,9</span>
              <span className="text-[10px] text-[#7A7A9E] font-medium">horas</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold pt-2 border-t border-[#F0EEFA]">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#7255F7]" /> Cálculo</span>
              <span>48%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#24B8E8]" /> Programación</span>
              <span>30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#19C6A3]" /> Física</span>
              <span>22%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Knowledge Map matching Estudiante___Perfil_y_mapa_de_conocimiento_b916f6fb.png */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-[#E5E3F5] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-[#202038]">
              Mapa de conocimiento
            </h3>
            <p className="text-xs text-[#7A7A9E]">
              Toca un concepto para ver tu dominio y qué hacer después.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#19C6A3]" /> Dominado (≥85%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#24B8E8]" /> En progreso</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FFB547]" /> Reforzar</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8E8EA8]" /> Bloqueado</span>
          </div>
        </div>

        {/* Network Graph Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive Nodes Canvas */}
          <div className="lg:col-span-8 bg-[#FBFBFF] rounded-3xl p-6 border border-[#E5E3F5] relative min-h-[300px] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-64" viewBox="0 0 100 100">
              {/* Connecting Edges */}
              <line x1="10" y1="50" x2="28" y2="25" stroke="#7255F7" strokeWidth="0.8" />
              <line x1="10" y1="50" x2="28" y2="75" stroke="#7255F7" strokeWidth="0.8" />
              <line x1="28" y1="25" x2="50" y2="50" stroke="#7255F7" strokeWidth="0.8" />
              <line x1="28" y1="75" x2="50" y2="50" stroke="#7255F7" strokeWidth="0.8" />
              <line x1="50" y1="50" x2="72" y2="25" stroke="#7255F7" strokeWidth="1" strokeDasharray="1.5,1" />
              <line x1="50" y1="50" x2="72" y2="75" stroke="#FFB547" strokeWidth="0.8" />
              <line x1="72" y1="25" x2="90" y2="50" stroke="#D1D0E4" strokeWidth="0.8" strokeDasharray="1,1" />

              {/* Node Circles */}
              {knowledgeNodes.map((node) => {
                const isSelected = selectedConceptNode === node.id;
                let strokeColor = '#19C6A3';
                if (node.status === 'in_progress') strokeColor = '#24B8E8';
                if (node.status === 'next_step') strokeColor = '#7255F7';
                if (node.status === 'reinforce') strokeColor = '#FFB547';
                if (node.status === 'locked') strokeColor = '#D1D0E4';

                return (
                  <g 
                    key={node.id} 
                    onClick={() => setSelectedConceptNode(node.id)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.status === 'next_step' ? 7 : 6}
                      fill={isSelected ? '#ECE8FE' : '#ffffff'}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 1.5 : 1}
                      strokeDasharray={node.status === 'locked' ? '1,1' : 'none'}
                    />
                    <text
                      x={node.x}
                      y={node.y + 0.8}
                      textAnchor="middle"
                      fontSize="2.8"
                      fontWeight="bold"
                      fill={strokeColor}
                    >
                      {node.status === 'locked' ? '🔒' : `${node.pct}%`}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 11}
                      textAnchor="middle"
                      fontSize="2.4"
                      fontWeight="600"
                      fill="#202038"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right Selected Node Action Card */}
          <div className="lg:col-span-4 bg-[#1C1A38] text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7255F7] text-white text-[10px] font-extrabold uppercase tracking-wider">
              {activeConcept.mastery >= 85 ? 'DOMINADO' : activeConcept.mastery === 0 ? 'BLOQUEADO' : 'SIGUIENTE PASO'}
            </div>

            <h4 className="font-heading font-extrabold text-xl text-white">
              {activeConcept.name[language] || activeConcept.name.es}
            </h4>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-white/80">
                <span>Dominio</span>
                <span>{activeConcept.mastery}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#7255F7] to-[#24B8E8]"
                  style={{ width: `${activeConcept.mastery}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              {activeConcept.commonError 
                ? `Patrón de refuerzo: ${activeConcept.commonError}.`
                : 'Es tu paso recomendado: desbloquea los conceptos avanzados de cálculo integral.'}
            </p>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => onOpenTutorForConcept(activeConcept.conceptId)}
                className="w-full py-3 rounded-2xl bg-white text-[#202038] font-extrabold text-xs shadow-md hover:bg-[#F5F4FC] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Practicar con Nexo</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7255F7]" />
              </button>

              <button
                onClick={onOpenLabs}
                className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Abrir laboratorio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Areas Needing Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tus fortalezas */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E3F5] space-y-4">
          <div className="flex items-center gap-2 font-heading font-extrabold text-base text-[#202038]">
            <CheckCircle2 className="w-5 h-5 text-[#19C6A3]" />
            <span>Tus fortalezas</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Funciones', pct: 96 },
              { name: 'Límites', pct: 92 },
              { name: 'Condicionales en código', pct: 90 },
              { name: 'Caída libre y cinemática', pct: 88 },
            ].map((f, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-[#F0EEFA] last:border-none">
                <span className="font-semibold text-[#202038]">{f.name}</span>
                <span className="font-bold text-[#19C6A3]">{f.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Áreas que requieren atención */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E3F5] space-y-4">
          <div className="flex items-center gap-2 font-heading font-extrabold text-base text-[#202038]">
            <AlertCircle className="w-5 h-5 text-[#FF6B91]" />
            <span>{t('progressView', 'areasNeedAttention')}</span>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'c_regla_cadena', name: 'Regla de la cadena', desc: 'Precisión del 46% en los últimos 5 intentos' },
              { id: 'c_optimizacion', name: 'Optimización', desc: 'Dificultad al plantear el problema a maximizar' },
              { id: 'c_recursion', name: 'Recursión', desc: 'Caso base ausente en 2 retos seguidos' },
            ].map((area) => (
              <button
                key={area.id}
                onClick={() => onOpenTutorForConcept(area.id)}
                className="w-full p-3 rounded-2xl bg-[#FEEBED]/40 hover:bg-[#FEEBED] border border-[#FF6B91]/30 text-left transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-[#E11D48]">{area.name}</div>
                  <div className="text-[11px] text-[#7A7A9E] mt-0.5">{area.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#FF6B91] group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
