import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  FileText, 
  AlertTriangle, 
  Check, 
  Send, 
  Plus, 
  ChevronDown, 
  Download, 
  X,
  TrendingUp,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { Classroom, Language } from '../types';
import { getTranslation } from '../i18n';

interface TeacherStudioViewProps {
  classroom: Classroom;
  language: Language;
}

export const TeacherStudioView: React.FC<TeacherStudioViewProps> = ({
  classroom,
  language,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [generatorTopic, setGeneratorTopic] = useState('Regla de la Cadena');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [assignmentAssigned, setAssignmentAssigned] = useState(false);
  const [supportMessageSent, setSupportMessageSent] = useState(false);

  const t = (section: string, key: string) => getTranslation(language, section, key);

  // Heatmap Color Selector helper
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-[#19C6A3] text-white'; // Dominado
    if (score >= 60) return 'bg-[#7EE1FA] text-[#0A5364]'; // En progreso
    if (score >= 40) return 'bg-[#FFD38A] text-[#7A4B00]'; // Reforzar
    return 'bg-[#FFA8BA] text-[#801228]'; // Apoyo urgente
  };

  const handleGenerateAssignment = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/teacher/generate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: generatorTopic,
          difficulty: 'intermedio',
          count: 2,
        }),
      });
      const data = await response.json();
      if (data.questions) {
        setGeneratedQuestions(data.questions);
      }
    } catch (err) {
      console.error('Error generating assignment:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAssignToClass = () => {
    setAssignmentAssigned(true);
    setTimeout(() => {
      setAssignmentAssigned(false);
      setShowGeneratorModal(false);
      setGeneratedQuestions([]);
    }, 2000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Estudiante,Funciones,Límites,Derivadas,Cadena,Optimización\n"
      + classroom.students.map(s => 
          `${s.name},${s.conceptScores.Funciones},${s.conceptScores.Límites},${s.conceptScores.Derivadas},${s.conceptScores.Cadena},${s.conceptScores.Optimización}`
        ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_clase_${classroom.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Secondary Navbar matching Teacher_Studio_c1df960e.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 sm:px-6 sm:py-3.5 rounded-2xl border border-[#E5E3F5]">
        <div className="flex items-center gap-6 overflow-x-auto">
          <button className="px-3 py-1.5 rounded-xl bg-[#202038] text-white text-xs font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Panel</span>
          </button>
          <button className="text-xs font-semibold text-[#585876] hover:text-[#202038] shrink-0">
            Mis clases
          </button>
          <button className="text-xs font-semibold text-[#585876] hover:text-[#202038] shrink-0">
            Estudiantes
          </button>
          <button 
            onClick={() => { setShowGeneratorModal(true); handleGenerateAssignment(); }}
            className="text-xs font-semibold text-[#7255F7] hover:underline flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generador IA</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="text-xs font-semibold text-[#585876] hover:text-[#202038] flex items-center gap-1 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Reportes CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#F5F4FC] border border-[#E5E3F5] text-xs font-bold text-[#202038] flex items-center gap-1.5">
            <span>Clase: {classroom.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7A7A9E]" />
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E3F5] space-y-1">
          <div className="text-xs font-semibold text-[#7A7A9E]">{t('teacher', 'studentsActive')}</div>
          <div className="font-heading font-extrabold text-3xl text-[#202038]">{classroom.studentCount}</div>
          <div className="text-[11px] text-[#7A7A9E]">24 activos esta semana</div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E3F5] space-y-1">
          <div className="text-xs font-semibold text-[#7A7A9E]">{t('teacher', 'avgMastery')}</div>
          <div className="font-heading font-extrabold text-3xl text-[#19C6A3]">{classroom.averageMastery}%</div>
          <div className="text-[11px] font-bold text-[#19C6A3]">+6 pts en 2 semanas</div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E3F5] space-y-1">
          <div className="text-xs font-semibold text-[#7A7A9E]">{t('teacher', 'submittedTasks')}</div>
          <div className="font-heading font-extrabold text-3xl text-[#24B8E8]">{classroom.submissionRate}%</div>
          <div className="text-[11px] text-[#7A7A9E]">Tarea 4: 24 de 28</div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E3F5] space-y-1">
          <div className="text-xs font-semibold text-[#7A7A9E]">{t('teacher', 'difficultyAlerts')}</div>
          <div className="font-heading font-extrabold text-3xl text-[#FF6B91]">{classroom.alerts.length}</div>
          <div className="text-[11px] text-[#FF6B91] font-semibold">Detectadas por Nexo</div>
        </div>
      </div>

      {/* Central Matrix & Right Difficulty Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Heatmap Matrix Table (Cols 1-8) */}
        <div className="lg:col-span-8 bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E3F5] space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#202038]">
                {t('teacher', 'conceptPerformance')}
              </h3>
              <p className="text-xs text-[#7A7A9E]">
                {t('teacher', 'conceptHint')}
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#FFF5E6] text-[#D97706] font-bold">
              Datos de demostración
            </span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[#7A7A9E] font-bold text-[11px]">
                  <th className="pb-2 pl-2">Estudiante</th>
                  <th className="pb-2 text-center">Funciones</th>
                  <th className="pb-2 text-center">Límites</th>
                  <th className="pb-2 text-center">Derivadas</th>
                  <th className="pb-2 text-center">Cadena</th>
                  <th className="pb-2 text-center">Optimización</th>
                </tr>
              </thead>
              <tbody>
                {classroom.students.map((student) => (
                  <tr 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    className="hover:bg-[#F5F4FC] transition-colors cursor-pointer group"
                  >
                    <td className="py-2 pl-2 font-heading font-bold text-xs text-[#202038] flex items-center gap-2.5">
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[11px] shrink-0"
                        style={{ backgroundColor: student.color }}
                      >
                        {student.avatarLetter}
                      </div>
                      <span className="group-hover:text-[#7255F7] transition-colors">{student.name}</span>
                    </td>
                    {['Funciones', 'Límites', 'Derivadas', 'Cadena', 'Optimización'].map((col) => {
                      const score = student.conceptScores[col];
                      return (
                        <td key={col} className="text-center px-1">
                          <span className={`inline-block w-14 py-2 rounded-xl font-extrabold text-xs shadow-xs ${getScoreColor(score)}`}>
                            {score}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Color Legend */}
          <div className="pt-3 border-t border-[#F0EEFA] flex flex-wrap items-center gap-4 text-xs font-semibold text-[#585876]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[#19C6A3]" /> ≥ 85% Dominado</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[#7EE1FA]" /> 60–84% En progreso</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[#FFD38A]" /> 40–59% Reforzar</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[#FFA8BA]" /> &lt; 40% Apoyo urgente</span>
          </div>
        </div>

        {/* Right Sidebar: Dificultades Detectadas & Distribución (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dark Difficulties Card matching screenshot */}
          <div className="bg-[#1C1A38] text-white rounded-[28px] p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF6B91]" />
              <h4 className="font-heading font-extrabold text-base text-white">
                {t('teacher', 'difficultiesDetected')}
              </h4>
            </div>

            {supportMessageSent && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                ✓ Mensaje de apoyo pedagógico enviado a Diego Herrera.
              </div>
            )}

            {/* Alert 1: Regla de la cadena */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="font-heading font-extrabold text-sm text-white">Regla de la cadena</div>
              <p className="text-xs text-white/70 leading-relaxed">
                Mateo, Diego y Lucas olvidan la derivada interior en el 70% de los intentos.
              </p>
              <button
                onClick={() => {
                  setGeneratorTopic('Regla de la Cadena');
                  setShowGeneratorModal(true);
                  handleGenerateAssignment();
                }}
                className="w-full py-2.5 rounded-xl bg-white text-[#202038] font-extrabold text-xs hover:bg-[#F5F4FC] transition-colors cursor-pointer"
              >
                {t('teacher', 'assignReinforcement')}
              </button>
            </div>

            {/* Alert 2: Optimización */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="font-heading font-extrabold text-sm text-white">Optimización</div>
              <p className="text-xs text-white/70 leading-relaxed">
                El 45% del grupo no logra plantear la función a maximizar.
              </p>
              <button
                onClick={() => {
                  setGeneratorTopic('Problemas de Optimización');
                  setShowGeneratorModal(true);
                  handleGenerateAssignment();
                }}
                className="w-full py-2.5 rounded-xl bg-white text-[#202038] font-extrabold text-xs hover:bg-[#F5F4FC] transition-colors cursor-pointer"
              >
                {t('teacher', 'assignReinforcement')}
              </button>
            </div>

            {/* Alert 3: Ritmo de Diego */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="font-heading font-extrabold text-sm text-white">Ritmo de Diego Herrera</div>
              <p className="text-xs text-white/70 leading-relaxed">
                Bajó su actividad un 60% esta semana y lleva 5 días sin practicar.
              </p>
              <button
                onClick={() => setSupportMessageSent(true)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs transition-colors cursor-pointer"
              >
                {t('teacher', 'sendMessageSupport')}
              </button>
            </div>
          </div>

          {/* Cohort Distribution Bar */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E5E3F5] space-y-4">
            <h4 className="font-heading font-extrabold text-base text-[#202038]">
              {t('teacher', 'groupDistribution')}
            </h4>

            {/* Colored segmented distribution bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex">
              <div className="bg-[#19C6A3]" style={{ width: '32%' }} />
              <div className="bg-[#7EE1FA]" style={{ width: '43%' }} />
              <div className="bg-[#FFD38A]" style={{ width: '14%' }} />
              <div className="bg-[#FFA8BA]" style={{ width: '11%' }} />
            </div>

            <div className="space-y-2 text-xs font-semibold text-[#585876] pt-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#19C6A3]" /> Dominado</span>
                <span className="font-bold text-[#202038]">9</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#7EE1FA]" /> En progreso</span>
                <span className="font-bold text-[#202038]">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#FFD38A]" /> Reforzar</span>
                <span className="font-bold text-[#202038]">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#FFA8BA]" /> Apoyo urgente</span>
                <span className="font-bold text-[#202038]">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assignment Generator Modal */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E3F5] space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowGeneratorModal(false)}
              className="absolute top-5 right-5 text-[#7A7A9E] hover:text-[#202038]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ECE8FE] text-[#7255F7] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xl text-[#202038]">
                  {t('teacher', 'aiGenerator')}
                </h3>
                <p className="text-xs text-[#7A7A9E]">
                  Genera preguntas diagnósticas adaptadas con Gemini para tu grupo de Cálculo I.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#585876] mb-1">Tema a evaluar:</label>
                <input
                  type="text"
                  value={generatorTopic}
                  onChange={(e) => setGeneratorTopic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E3F5] text-sm focus:outline-none focus:border-[#7255F7] text-[#202038]"
                />
              </div>

              <button
                onClick={handleGenerateAssignment}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Generando con Gemini...' : 'Regenerar preguntas'}</span>
              </button>
            </div>

            {/* Generated Questions List */}
            {generatedQuestions.length > 0 && (
              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold text-[#202038] uppercase tracking-wider block">
                  Preguntas generadas (puedes editarlas antes de asignar):
                </span>
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F5F4FC] border border-[#E5E3F5] space-y-2">
                    <div className="text-xs font-bold text-[#202038]">
                      {idx + 1}. {q.question}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {q.options?.map((opt: string, i: number) => (
                        <div 
                          key={i} 
                          className={`p-2 rounded-lg border ${i === q.correctIndex ? 'border-[#19C6A3] bg-[#E6F9F5] text-[#059669] font-bold' : 'border-[#E5E3F5] bg-white text-[#585876]'}`}
                        >
                          {opt} {i === q.correctIndex ? '✓' : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {assignmentAssigned ? (
                  <div className="p-4 rounded-2xl bg-[#E6F9F5] text-[#059669] text-xs font-bold text-center border border-[#19C6A3]/30">
                    ✓ ¡Evaluación asignada a los 28 estudiantes con fecha límite 18 de Noviembre!
                  </div>
                ) : (
                  <button
                    onClick={handleAssignToClass}
                    className="w-full py-3.5 rounded-2xl bg-[#19C6A3] hover:bg-[#15B091] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Asignar tarea a toda la clase
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Drilldown Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E3F5] space-y-5 relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-[#7A7A9E] hover:text-[#202038]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-base"
                style={{ backgroundColor: selectedStudent.color }}
              >
                {selectedStudent.avatarLetter}
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#202038]">{selectedStudent.name}</h3>
                <p className="text-xs text-[#7A7A9E]">Estudiante de {classroom.name}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#202038] block">Dominio detallado:</span>
              {Object.entries(selectedStudent.conceptScores).map(([concept, score]: any) => (
                <div key={concept} className="flex justify-between items-center py-1 border-b border-[#F0EEFA]">
                  <span className="font-medium text-[#585876]">{concept}</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setSelectedStudent(null); setShowGeneratorModal(true); handleGenerateAssignment(); }}
              className="w-full py-3 rounded-2xl bg-[#7255F7] text-white font-bold text-xs shadow-md"
            >
              Asignar refuerzo individual con Nexo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
