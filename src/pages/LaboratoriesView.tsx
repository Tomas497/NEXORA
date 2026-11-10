import React, { useState } from 'react';
import { 
  Code, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Atom, 
  Sliders, 
  ChevronRight,
  BookOpen,
  Zap,
  Award,
  FileText,
  Send,
  Layers,
  CheckCheck,
  Clock,
  HelpCircle
} from 'lucide-react';
import { NexoOrb } from '../components/NexoOrb';
import { Language, UserProgress } from '../types';
import { getTranslation } from '../i18n';

interface LaboratoriesViewProps {
  progress: UserProgress;
  language: Language;
  initialTab?: 'prog' | 'math' | 'sci' | 'assignments';
  onAwardXP: (amount: number, reason: string) => void;
}

export const LaboratoriesView: React.FC<LaboratoriesViewProps> = ({
  progress,
  language,
  initialTab = 'prog',
  onAwardXP,
}) => {
  const [activeTab, setActiveTab] = useState<'prog' | 'math' | 'sci' | 'assignments'>(initialTab);

  // ==================== 1. PROGRAMMING LAB ====================
  const [selectedProgChallenge, setSelectedProgChallenge] = useState<'suma_pares' | 'binary_search' | 'palindrome'>('suma_pares');
  
  const progChallengesData = {
    suma_pares: {
      title: 'Reto 1: Depurar Suma de Números Pares',
      desc: 'Encuentra y corrige el error en la condición para sumar únicamente números pares.',
      code: `function sumaPares(lista) {
  let total = 0;
  for (let i = 0; i < lista.length; i++) {
    if (lista[i] % 2 === 1) { // ERROR: cambia 1 por 0
      total += lista[i];
    }
  }
  return total;
}

console.log(sumaPares([1, 2, 3, 4, 5, 6]));`,
      test: (func: Function) => {
        const t1 = func([1, 2, 3, 4, 5, 6]);
        const t2 = func([7, 9, 11]);
        const t3 = func([-2, 4, 5]);
        const pass1 = t1 === 12;
        const pass2 = t2 === 0;
        const pass3 = t3 === 2;
        return {
          passed: pass1 && pass2 && pass3,
          details: [
            { passed: pass1, message: `[1, 2, 3, 4, 5, 6] -> ${t1} (esperado: 12)` },
            { passed: pass2, message: `[7, 9, 11] -> ${t2} (esperado: 0)` },
            { passed: pass3, message: `[-2, 4, 5] -> ${t3} (esperado: 2)` },
          ]
        };
      },
      hint: 'Un número es par cuando el residuo de dividirlo entre 2 es 0 (`num % 2 === 0`).',
    },
    binary_search: {
      title: 'Reto 2: Algoritmo de Búsqueda Binaria O(log n)',
      desc: 'Implementa el cálculo del punto medio para buscar un número en un arreglo ordenado.',
      code: `function busquedaBinaria(arr, objetivo) {
  let inicio = 0;
  let fin = arr.length - 1;

  while (inicio <= fin) {
    // Corrige el cálculo del medio:
    let medio = Math.floor((inicio + fin) / 2);
    
    if (arr[medio] === objetivo) {
      return medio; // Retorna el índice
    } else if (arr[medio] < objetivo) {
      inicio = medio + 1;
    } else {
      fin = medio - 1;
    }
  }
  return -1; // No encontrado
}

console.log(busquedaBinaria([2, 5, 8, 12, 16, 23, 38, 56], 23));`,
      test: (func: Function) => {
        const arr = [2, 5, 8, 12, 16, 23, 38, 56];
        const t1 = func(arr, 23);
        const t2 = func(arr, 2);
        const t3 = func(arr, 99);
        const pass1 = t1 === 5;
        const pass2 = t2 === 0;
        const pass3 = t3 === -1;
        return {
          passed: pass1 && pass2 && pass3,
          details: [
            { passed: pass1, message: `buscar 23 en [2..56] -> índice ${t1} (esperado: 5)` },
            { passed: pass2, message: `buscar 2 en [2..56] -> índice ${t2} (esperado: 0)` },
            { passed: pass3, message: `buscar 99 en [2..56] -> índice ${t3} (esperado: -1)` },
          ]
        };
      },
      hint: 'La búsqueda binaria divide el espacio de búsqueda a la mitad en cada paso, logrando complejidad O(log n).',
    },
    palindrome: {
      title: 'Reto 3: Detector de Palíndromos',
      desc: 'Verifica si una palabra se lee igual al derecho y al revés ignorando espacios y mayúsculas.',
      code: `function esPalindromo(cadena) {
  const limpia = cadena.toLowerCase().replace(/[^a-z0-9]/g, '');
  const invertida = limpia.split('').reverse().join('');
  return limpia === invertida;
}

console.log(esPalindromo("reconocer"));`,
      test: (func: Function) => {
        const t1 = func("reconocer");
        const t2 = func("anita lava la tina");
        const t3 = func("nexora");
        const pass1 = t1 === true;
        const pass2 = t2 === true;
        const pass3 = t3 === false;
        return {
          passed: pass1 && pass2 && pass3,
          details: [
            { passed: pass1, message: `"reconocer" -> ${t1} (esperado: true)` },
            { passed: pass2, message: `"anita lava la tina" -> ${t2} (esperado: true)` },
            { passed: pass3, message: `"nexora" -> ${t3} (esperado: false)` },
          ]
        };
      },
      hint: 'Usa `split("")`, `reverse()` y `join("")` para comparar la cadena original limpia con su inversa.',
    }
  };

  const [code, setCode] = useState(progChallengesData[selectedProgChallenge].code);
  const [consoleOutput, setConsoleOutput] = useState<string>('Pulsa Ejecutar para ver la salida de tu código.');
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [nexoFeedback, setNexoFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [completedProgRetos, setCompletedProgRetos] = useState<Record<string, boolean>>({});

  const handleSelectProgChallenge = (key: 'suma_pares' | 'binary_search' | 'palindrome') => {
    setSelectedProgChallenge(key);
    setCode(progChallengesData[key].code);
    setConsoleOutput('Pulsa Ejecutar para evaluar tu solución.');
    setTestResults([]);
    setNexoFeedback(null);
  };

  const handleRunCode = () => {
    try {
      let logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      };

      const funcName = selectedProgChallenge === 'suma_pares' ? 'sumaPares' : selectedProgChallenge === 'binary_search' ? 'busquedaBinaria' : 'esPalindromo';
      const func = new Function('console', `${code}; return typeof ${funcName} === 'function' ? ${funcName} : null;`);
      const userFunc = func(customConsole);

      if (typeof userFunc === 'function') {
        const outcome = progChallengesData[selectedProgChallenge].test(userFunc);
        setTestResults(outcome.details);

        if (outcome.passed) {
          setConsoleOutput(`> ${logs.join('\n')}\n\n✓ ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE! (+60 XP y +5 Gemas)`);
          if (!completedProgRetos[selectedProgChallenge]) {
            setCompletedProgRetos(prev => ({ ...prev, [selectedProgChallenge]: true }));
            onAwardXP(60, `Reto de código: ${progChallengesData[selectedProgChallenge].title}`);
          }
        } else {
          setConsoleOutput(`> ${logs.join('\n')}\n\n⚠️ Algunas pruebas fallaron. Revisa la lógica y los casos borde.`);
        }
      } else {
        setConsoleOutput(`> ${logs.join('\n') || 'Ejecutado sin retorno de función.'}`);
      }
    } catch (err: any) {
      setConsoleOutput(`Error de sintaxis o ejecución: ${err.message}`);
    }
  };

  const handleAnalyzeWithNexo = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (selectedProgChallenge === 'suma_pares' && (code.includes('% 2 === 1') || code.includes('% 2 == 1'))) {
        setNexoFeedback(
          'Encontré una discrepancia conceptual: la expresión `numero % 2 === 1` filtra números impares. Para números pares el residuo debe ser exactamente 0: `numero % 2 === 0`.'
        );
      } else {
        setNexoFeedback(
          `¡Buen análisis! Recuerda: ${progChallengesData[selectedProgChallenge].hint}`
        );
      }
    }, 800);
  };

  // ==================== 2. MATHEMATICS LAB ====================
  const [selectedMathActivity, setSelectedMathActivity] = useState<'parabola' | 'riemann'>('parabola');
  const [mathA, setMathA] = useState(1);
  const [mathB, setMathB] = useState(0);
  const [mathC, setMathC] = useState(-4);
  const [tangentX, setTangentX] = useState(1);
  const [riemannN, setRiemannN] = useState<4 | 8 | 16 | 32>(8);

  const tangentSlope = 2 * mathA * tangentX + mathB;
  const tangentY = mathA * Math.pow(tangentX, 2) + mathB * tangentX + mathC;

  // Riemann sum approximation for f(x) = x^2 from x=0 to x=3 (Exact integral is 9.00)
  const riemannA = 0;
  const riemannB = 3;
  const dx = (riemannB - riemannA) / riemannN;
  let riemannArea = 0;
  for (let i = 0; i < riemannN; i++) {
    const xMid = riemannA + i * dx + dx / 2;
    riemannArea += Math.pow(xMid, 2) * dx;
  }

  // ==================== 3. SCIENCES & PHYSICS LAB ====================
  const [selectedSciActivity, setSelectedSciActivity] = useState<'projectile' | 'circuits'>('projectile');
  
  // Projectile state
  const [cannonAngle, setCannonAngle] = useState(45);
  const [cannonVelocity, setCannonVelocity] = useState(20);
  const [simulationState, setSimulationState] = useState<{ fired: boolean; hit: boolean; distance: number } | null>(null);

  // Circuits state (Ohm's Law: V = I * R)
  const [voltage, setVoltage] = useState(12); // Volts
  const [resistance, setResistance] = useState(6); // Ohms
  const currentAmps = Number((voltage / (resistance || 1)).toFixed(2));
  const powerWatts = Number((voltage * currentAmps).toFixed(1));

  const handleFireCannon = () => {
    const angleRad = (cannonAngle * Math.PI) / 180;
    const g = 9.81;
    const distance = (Math.pow(cannonVelocity, 2) * Math.sin(2 * angleRad)) / g;
    const roundedDist = Math.round(distance * 10) / 10;
    const isHit = Math.abs(roundedDist - 40) <= 2.5;

    setSimulationState({
      fired: true,
      hit: isHit,
      distance: roundedDist,
    });

    if (isHit) {
      onAwardXP(40, 'Diana en simulación de física');
    }
  };

  // ==================== 4. COURSEWORK ASSIGNMENTS & TRABAJOS ====================
  const [assignmentsList, setAssignmentsList] = useState([
    {
      id: 'as_1',
      title: 'Taller 1: Regla de la Cadena y Derivadas Compuestas',
      subject: 'Cálculo I',
      teacher: 'Prof. Carlos Martínez',
      dueDate: 'Viernes, 18 de Nov',
      status: 'pending', // pending | submitted | graded
      grade: null as number | null,
      xpReward: 120,
      description: 'Resuelve 5 derivadas compuestas justificando paso a paso la derivada exterior e interior. Incluye una aplicación física a tasas de cambio.',
      rubric: [
        { criterion: 'Identificación de funciones interiores y exteriores', weight: '30%' },
        { criterion: 'Desarrollo algebraico sin errores', weight: '40%' },
        { criterion: 'Conclusión y tasa de cambio interpretada', weight: '30%' }
      ]
    },
    {
      id: 'as_2',
      title: 'Trabajo Práctico: Análisis de Complejidad Big-O en JavaScript',
      subject: 'Programación',
      teacher: 'Dra. Ana Valenzuela',
      dueDate: 'Lunes, 21 de Nov',
      status: 'submitted',
      grade: 95,
      xpReward: 150,
      description: 'Compara mediante benchmarks el rendimiento de la búsqueda lineal vs búsqueda binaria sobre un array de 100,000 elementos.',
      rubric: [
        { criterion: 'Código reproducible y limpio', weight: '35%' },
        { criterion: 'Gráfica de tiempos de ejecución', weight: '35%' },
        { criterion: 'Conclusiones teóricas', weight: '30%' }
      ]
    },
    {
      id: 'as_3',
      title: 'Informe de Laboratorio: Movimiento Parabólico con Resistencia del Aire',
      subject: 'Física',
      teacher: 'Prof. Carlos Martínez',
      dueDate: 'Miércoles, 23 de Nov',
      status: 'pending',
      grade: null,
      xpReward: 100,
      description: 'Comprueba el alcance real de un proyectil variando el ángulo de tiro entre 30° y 60° con gravedad terrestre.',
      rubric: [
        { criterion: 'Recolección de datos experimentales', weight: '40%' },
        { criterion: 'Cálculo de error porcentual', weight: '30%' },
        { criterion: 'Discusión de resultados', weight: '30%' }
      ]
    },
    {
      id: 'as_4',
      title: 'Proyecto de Optimización: Dimensionamiento de un Tanque Cilíndrico',
      subject: 'Cálculo I',
      teacher: 'Prof. Carlos Martínez',
      dueDate: 'Viernes, 28 de Nov',
      status: 'pending',
      grade: null,
      xpReward: 180,
      description: 'Encuentra las dimensiones (radio r y altura h) que minimizan la superficie de metal requerida para almacenar 1 m³ de agua.',
      rubric: [
        { criterion: 'Planteamiento de función objetivo y ligadura', weight: '35%' },
        { criterion: 'Derivada primera y segunda para comprobar mínimo', weight: '45%' },
        { criterion: 'Dimensiones finales en centímetros', weight: '20%' }
      ]
    }
  ]);

  const [selectedAssignmentModal, setSelectedAssignmentModal] = useState<any | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  const handleSubmitAssignment = () => {
    if (!submissionText.trim() || !selectedAssignmentModal) return;
    setIsSubmittingAssignment(true);

    setTimeout(() => {
      setIsSubmittingAssignment(false);
      setSubmissionFeedback(
        `¡Trabajo evaluado con éxito por Nexo! Calificación: 96/100. Has demostrado excelente dominio del método analítico y justificación matemática. Se han acreditado +${selectedAssignmentModal.xpReward} XP a tu cuenta.`
      );
      onAwardXP(selectedAssignmentModal.xpReward, `Trabajo entregado: ${selectedAssignmentModal.title}`);

      setAssignmentsList(prev => prev.map(a => 
        a.id === selectedAssignmentModal.id ? { ...a, status: 'submitted', grade: 96 } : a
      ));
    }, 1200);
  };

  const t = (section: string, key: string) => getTranslation(language, section, key);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* 4 Main Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'prog', title: 'Programación', sub: '3 retos de código interactivo', icon: Code, color: '#7255F7', bg: 'bg-[#ECE8FE]' },
          { id: 'math', title: 'Matemáticas', sub: 'Tangentes & Sumas de Riemann', icon: Sliders, color: '#19C6A3', bg: 'bg-[#E6F9F5]' },
          { id: 'sci', title: 'Ciencias & Física', sub: 'Tiro balístico & Ley de Ohm', icon: Atom, color: '#24B8E8', bg: 'bg-[#EBF7FC]' },
          { id: 'assignments', title: 'Trabajos & Tareas', sub: 'Entregables oficiales con rúbrica', icon: BookOpen, color: '#FFB547', bg: 'bg-[#FFF7E8]' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                isActive
                  ? 'border-2 border-[#7255F7] bg-white shadow-md'
                  : 'border-[var(--border-soft)] bg-white hover:bg-[#F5F4FC]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${tab.bg} flex items-center justify-center shrink-0`} style={{ color: tab.color }}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-xs sm:text-sm text-[var(--text-main)]">{tab.title}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{tab.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ================================= TAB 1: PROGRAMMING ================================= */}
      {activeTab === 'prog' && (
        <div className="space-y-4">
          {/* Sub-selector of programming challenges */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'suma_pares', label: '1. Suma de Pares (Depuración)', badge: '+60 XP' },
              { id: 'binary_search', label: '2. Búsqueda Binaria O(log n)', badge: '+80 XP' },
              { id: 'palindrome', label: '3. Detector de Palíndromos', badge: '+50 XP' },
            ].map(ch => (
              <button
                key={ch.id}
                onClick={() => handleSelectProgChallenge(ch.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  selectedProgChallenge === ch.id
                    ? 'bg-[#7255F7] text-white border-[#7255F7] shadow-sm'
                    : 'bg-white text-[#585876] border-[var(--border-soft)] hover:bg-[#F5F4FC]'
                }`}
              >
                <span>{ch.label}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${selectedProgChallenge === ch.id ? 'bg-white/20 text-white' : 'bg-[#ECE8FE] text-[#7255F7]'}`}>
                  {completedProgRetos[ch.id] ? '✓ Hecho' : ch.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[var(--text-main)]">
                    {progChallengesData[selectedProgChallenge].title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {progChallengesData[selectedProgChallenge].desc}
                  </p>
                </div>
                <button
                  onClick={handleRunCode}
                  className="px-5 py-2.5 rounded-2xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white font-extrabold text-xs shadow-md shadow-[#7255F7]/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Ejecutar</span>
                </button>
              </div>

              {/* Code Editor Area */}
              <div className="relative rounded-2xl overflow-hidden border border-[#202038]">
                <div className="bg-[#1C1A38] px-4 py-2 text-xs font-mono text-[#A5A4C0] flex items-center justify-between">
                  <span>solution.js</span>
                  <span className="text-[10px] text-[#24B8E8] font-bold">JavaScript ES2022</span>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 bg-[#14122C] text-[#E5E3F5] font-mono text-xs p-4 focus:outline-none resize-none leading-relaxed selection:bg-[#7255F7]/40"
                  spellCheck={false}
                />
              </div>

              {/* Console Output */}
              <div className="bg-[#F5F4FC] rounded-2xl p-4 border border-[var(--border-soft)] space-y-2">
                <span className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider block">
                  Terminal de salida
                </span>
                <pre className="text-xs font-mono text-[var(--text-main)] whitespace-pre-wrap">
                  {consoleOutput}
                </pre>
              </div>
            </div>

            {/* Right: Tests & Nexo AI Helper */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-3">
                <h4 className="font-heading font-extrabold text-sm text-[var(--text-main)]">
                  Casos de prueba automatizados
                </h4>
                <div className="space-y-2">
                  {testResults.length === 0 ? (
                    <p className="text-xs text-[#8E8EA8]">Presiona 'Ejecutar' para comprobar tu algoritmo.</p>
                  ) : (
                    testResults.map((t, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-2.5 ${
                          t.passed ? 'bg-[#E6F9F5] text-[#059669]' : 'bg-[#FEEBED] text-[#E11D48]'
                        }`}
                      >
                        {t.passed ? <Check className="w-4 h-4 shrink-0 stroke-[3]" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span className="truncate">{t.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Nexo Code Tutor */}
              <div className="bg-gradient-to-b from-[#1C1A38] to-[#14122C] text-white rounded-[28px] p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <NexoOrb size="sm" />
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-white">
                      Asistente Nexo AI
                    </h4>
                    <p className="text-[11px] text-white/60">
                      Análisis conceptual de tu código
                    </p>
                  </div>
                </div>

                <p className="text-xs text-white/80 leading-relaxed">
                  {nexoFeedback || 'Si tienes dudas o un test falla, pide un análisis inteligente sin revelar la respuesta completa.'}
                </p>

                <button
                  onClick={handleAnalyzeWithNexo}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Analizando lógica...' : 'Consultar a Nexo'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================= TAB 2: MATHEMATICS ================================= */}
      {activeTab === 'math' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMathActivity('parabola')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMathActivity === 'parabola'
                  ? 'bg-[#19C6A3] text-white shadow-sm'
                  : 'bg-white text-[#585876] border border-[var(--border-soft)] hover:bg-[#F5F4FC]'
              }`}
            >
              1. Parábolas y Recta Tangente (Derivada)
            </button>
            <button
              onClick={() => setSelectedMathActivity('riemann')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMathActivity === 'riemann'
                  ? 'bg-[#19C6A3] text-white shadow-sm'
                  : 'bg-white text-[#585876] border border-[var(--border-soft)] hover:bg-[#F5F4FC]'
              }`}
            >
              2. Sumas de Riemann (Integrales)
            </button>
          </div>

          {selectedMathActivity === 'parabola' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-[var(--text-main)]">
                      f(x) = {mathA}x² {mathB >= 0 ? `+ ${mathB}x` : `- ${Math.abs(mathB)}x`} {mathC >= 0 ? `+ ${mathC}` : `- ${Math.abs(mathC)}`}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      En x = {tangentX}: Pendiente f'({tangentX}) = <strong>{tangentSlope.toFixed(2)}</strong> (m = 2ax + b)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E6F9F5] text-[#059669] text-xs font-extrabold">
                    y = {tangentY.toFixed(1)}
                  </span>
                </div>

                <div className="h-72 bg-[#1C1A38] rounded-3xl p-4 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="-10 -10 20 20">
                    <line x1="-10" y1="0" x2="10" y2="0" stroke="#38365A" strokeWidth="0.2" />
                    <line x1="0" y1="-10" x2="0" y2="10" stroke="#38365A" strokeWidth="0.2" />
                    
                    {/* Parabola Curve */}
                    <path
                      d={Array.from({ length: 41 }, (_, i) => {
                        const x = -5 + (i * 10) / 40;
                        const y = -(mathA * Math.pow(x, 2) + mathB * x + mathC);
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#24B8E8"
                      strokeWidth="0.5"
                    />

                    {/* Tangent line at tangentX */}
                    <line
                      x1={tangentX - 3}
                      y1={-(tangentY - 3 * tangentSlope)}
                      x2={tangentX + 3}
                      y2={-(tangentY + 3 * tangentSlope)}
                      stroke="#FF6B91"
                      strokeWidth="0.4"
                      strokeDasharray="0.5,0.5"
                    />

                    {/* Point of Tangency */}
                    <circle cx={tangentX} cy={-tangentY} r="0.4" fill="#FFB547" />
                  </svg>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
                <h4 className="font-heading font-extrabold text-base text-[var(--text-main)]">
                  Parámetros de la función
                </h4>
                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Punto de tangencia x: {tangentX}</span>
                    </div>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.5"
                      value={tangentX}
                      onChange={(e) => setTangentX(parseFloat(e.target.value))}
                      className="w-full h-2 bg-[#E5E3F5] rounded-lg accent-[#FF6B91] cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Coeficiente a: {mathA.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={mathA}
                      onChange={(e) => setMathA(parseFloat(e.target.value))}
                      className="w-full h-2 bg-[#E5E3F5] rounded-lg accent-[#24B8E8] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-[var(--text-main)]">
                      Aproximación de Área bajo f(x) = x² en [0, 3]
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Integral exacta: ∫₀³ x² dx = <strong>9.00 u²</strong>. Suma de Riemann con {riemannN} rectángulos: <strong>{riemannArea.toFixed(3)} u²</strong>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#ECE8FE] text-[#7255F7] text-xs font-extrabold">
                    Error: {Math.abs(riemannArea - 9).toFixed(3)} u²
                  </span>
                </div>

                <div className="h-72 bg-[#14122C] rounded-3xl p-4 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 60">
                    <line x1="5" y1="55" x2="95" y2="55" stroke="#38365A" strokeWidth="1" />
                    <line x1="10" y1="5" x2="10" y2="55" stroke="#38365A" strokeWidth="1" />

                    {/* Riemann Rectangles */}
                    {Array.from({ length: riemannN }, (_, i) => {
                      const rw = (80 / riemannN);
                      const rx = 10 + i * rw;
                      const xMid = (i + 0.5) * (3 / riemannN);
                      const h = (Math.pow(xMid, 2) / 9) * 45;
                      return (
                        <rect
                          key={i}
                          x={rx}
                          y={55 - h}
                          width={rw - 0.5}
                          height={h}
                          fill="#7255F7"
                          opacity={0.6}
                          stroke="#9D89FA"
                          strokeWidth="0.5"
                        />
                      );
                    })}

                    {/* Smooth curve */}
                    <path
                      d={Array.from({ length: 31 }, (_, i) => {
                        const px = 10 + (i * 80) / 30;
                        const x = (i * 3) / 30;
                        const py = 55 - (Math.pow(x, 2) / 9) * 45;
                        return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#19C6A3"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
                <h4 className="font-heading font-extrabold text-base text-[var(--text-main)]">
                  Número de particiones (n)
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  A mayor número de rectángulos (n → ∞), la suma de Riemann converge al valor exacto de la integral definida.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[4, 8, 16, 32].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRiemannN(n as any)}
                      className={`p-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                        riemannN === n
                          ? 'bg-[#7255F7] text-white border-[#7255F7] shadow-sm'
                          : 'bg-[#F5F4FC] text-[#585876] border-[var(--border-soft)] hover:bg-[#ECE8FE]'
                      }`}
                    >
                      {n} rectángulos
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================= TAB 3: SCIENCES & PHYSICS ================================= */}
      {activeTab === 'sci' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSciActivity('projectile')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSciActivity === 'projectile'
                  ? 'bg-[#24B8E8] text-white shadow-sm'
                  : 'bg-white text-[#585876] border border-[var(--border-soft)] hover:bg-[#F5F4FC]'
              }`}
            >
              1. Simulación de Tiro Parabólico
            </button>
            <button
              onClick={() => setSelectedSciActivity('circuits')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSciActivity === 'circuits'
                  ? 'bg-[#24B8E8] text-white shadow-sm'
                  : 'bg-white text-[#585876] border border-[var(--border-soft)] hover:bg-[#F5F4FC]'
              }`}
            >
              2. Circuitos y Ley de Ohm (V = I · R)
            </button>
          </div>

          {selectedSciActivity === 'projectile' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-[var(--text-main)]">
                      Simulador de Tiro Parabólico
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Ajusta ángulo y velocidad para impactar en la diana situada a 40 metros.
                    </p>
                  </div>
                  <button
                    onClick={handleFireCannon}
                    className="px-5 py-2.5 rounded-2xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white font-extrabold text-xs shadow-md shadow-[#7255F7]/30 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Atom className="w-4 h-4" />
                    <span>Disparar Proyectil</span>
                  </button>
                </div>

                <div className="h-80 bg-gradient-to-b from-[#EBF7FC] to-[#D5F0FA] rounded-3xl border border-[var(--border-soft)] relative overflow-hidden p-4 flex flex-col justify-end">
                  <div className="h-10 bg-[#7BC88A] w-full rounded-b-2xl border-t-2 border-[#5AA86A] flex items-center justify-end pr-16 relative">
                    <div className="absolute right-20 bottom-8 flex flex-col items-center">
                      <div className="w-8 h-5 bg-red-500 rounded-sm font-bold text-[9px] text-white flex items-center justify-center shadow-sm">
                        40m
                      </div>
                      <div className="w-1 h-8 bg-black" />
                    </div>
                  </div>

                  {simulationState?.fired && (
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 60">
                        <path
                          d={`M 10 50 Q ${10 + simulationState.distance * 0.9} 5 ${10 + simulationState.distance * 1.8} 50`}
                          fill="none"
                          stroke="#FF6B91"
                          strokeWidth="1.5"
                          strokeDasharray="2,2"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {simulationState && (
                  <div className={`p-4 rounded-2xl text-xs font-bold ${
                    simulationState.hit
                      ? 'bg-[#E6F9F5] text-[#059669] border border-[#19C6A3]/30'
                      : 'bg-[#FEEBED] text-[#E11D48] border border-[#FF6B91]/30'
                  }`}>
                    {simulationState.hit
                      ? `🎯 ¡IMPACTO EXACTO! Alcance calculado: ${simulationState.distance} m. Has ganado +40 XP.`
                      : `Alcance obtenido: ${simulationState.distance} m. La diana está a 40 m. Ajusta el ángulo o la velocidad para corregir.`}
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
                <h4 className="font-heading font-extrabold text-base text-[var(--text-main)]">
                  Controles de lanzamiento
                </h4>
                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Ángulo de inclinación θ: {cannonAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="75"
                      value={cannonAngle}
                      onChange={(e) => setCannonAngle(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#E5E3F5] rounded-lg accent-[#7255F7] cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Velocidad inicial v₀: {cannonVelocity} m/s</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="35"
                      value={cannonVelocity}
                      onChange={(e) => setCannonVelocity(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#E5E3F5] rounded-lg accent-[#24B8E8] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-[var(--text-main)]">
                      Laboratorio de Circuitos: Ley de Ohm (V = I · R)
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Observa cómo la corriente I (Amperios) y la potencia de iluminación cambian según el voltaje y la resistencia.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FFF7E8] text-[#D97706] text-xs font-extrabold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{powerWatts} Watts</span>
                  </span>
                </div>

                <div className="h-72 bg-[#1C1A38] rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden text-white">
                  {/* Glowing Bulb Visual */}
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative"
                    style={{
                      backgroundColor: `rgba(255, 181, 71, ${Math.min(1, currentAmps / 3)})`,
                      boxShadow: `0 0 ${currentAmps * 25}px rgba(255, 181, 71, ${Math.min(1, currentAmps / 2)})`,
                    }}
                  >
                    <Zap 
                      className="w-10 h-10 transition-colors" 
                      style={{ color: currentAmps > 0.5 ? '#1C1A38' : '#FFB547' }} 
                    />
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className="font-heading font-extrabold text-lg text-white">
                      Intensidad de Corriente: {currentAmps} A
                    </div>
                    <div className="text-xs text-[#A5A4C0] mt-1">
                      Fórmula: I = {voltage}V / {resistance}Ω = {currentAmps} A
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[var(--card-bg)] rounded-[28px] p-6 shadow-sm border border-[var(--border-soft)] space-y-4">
                <h4 className="font-heading font-extrabold text-base text-[var(--text-main)]">
                  Fuentes y Resistencias
                </h4>
                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Voltaje de la fuente (V): {voltage} V</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="24"
                      value={voltage}
                      onChange={(e) => setVoltage(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#E5E3F5] rounded-lg accent-[#FFB547] cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Resistencia del circuito (R): {resistance} Ω</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={resistance}
                      onChange={(e) => setResistance(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#E5E3F5] rounded-lg accent-[#7255F7] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================= TAB 4: ASSIGNMENTS & TRABAJOS ================================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[var(--text-main)]">
                Trabajos, Talleres y Proyectos Asignados
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Entregables oficiales con rúbricas de evaluación y retroalimentación inteligente del tutor Nexo.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-[#ECE8FE] text-[#7255F7] text-xs font-extrabold self-start sm:self-auto">
              {assignmentsList.filter(a => a.status === 'submitted').length} de {assignmentsList.length} entregados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignmentsList.map((as) => (
              <div
                key={as.id}
                className="bg-white rounded-[24px] p-5 sm:p-6 border border-[var(--border-soft)] shadow-sm hover:border-[#D1D0E4] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F5F4FC] text-[#585876] text-[11px] font-extrabold">
                      {as.subject}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                      as.status === 'submitted'
                        ? 'bg-[#E6F9F5] text-[#059669]'
                        : 'bg-[#FFF7E8] text-[#D97706]'
                    }`}>
                      {as.status === 'submitted' ? `✓ Entregado (${as.grade}/100)` : `Pendiente · ${as.dueDate}`}
                    </span>
                  </div>

                  <h4 className="font-heading font-extrabold text-base text-[var(--text-main)]">
                    {as.title}
                  </h4>

                  <p className="text-xs text-[#585876] leading-relaxed">
                    {as.description}
                  </p>

                  <div className="bg-[#FBFBFF] p-3 rounded-xl border border-[#F0EEFA] space-y-1">
                    <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider block">
                      Rúbrica de evaluación:
                    </span>
                    <div className="space-y-1">
                      {as.rubric.map((r, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-[#585876]">
                          <span>• {r.criterion}</span>
                          <span className="font-bold text-[#7255F7]">{r.weight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F5F4FC] flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#19C6A3]">
                    +{as.xpReward} XP de recompensa
                  </span>
                  <button
                    onClick={() => {
                      setSelectedAssignmentModal(as);
                      setSubmissionFeedback(null);
                      setSubmissionText('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      as.status === 'submitted'
                        ? 'bg-[#F5F4FC] text-[#585876] hover:bg-[#E5E3F5]'
                        : 'bg-[#7255F7] text-white shadow-md shadow-[#7255F7]/25 hover:bg-[#5D3DE6]'
                    }`}
                  >
                    <span>{as.status === 'submitted' ? 'Revisar Entrega' : 'Entregar Trabajo'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Modal for Assignments */}
      {selectedAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--card-bg)] rounded-[28px] max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[var(--border-soft)] animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#7255F7] uppercase tracking-wider">
                  {selectedAssignmentModal.subject} · Entrega Oficial
                </span>
                <h3 className="font-heading font-extrabold text-lg text-[var(--text-main)] mt-1">
                  {selectedAssignmentModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssignmentModal(null)}
                className="w-8 h-8 rounded-full bg-[#F5F4FC] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#585876] leading-relaxed">
              {selectedAssignmentModal.description}
            </p>

            {submissionFeedback ? (
              <div className="p-4 rounded-2xl bg-[#E6F9F5] border border-[#19C6A3]/30 text-[#059669] text-xs font-semibold leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <span>Entrega Evaluada Exitosamente</span>
                </div>
                <p>{submissionFeedback}</p>
                <button
                  onClick={() => setSelectedAssignmentModal(null)}
                  className="mt-2 w-full py-2.5 rounded-xl bg-[#059669] text-white font-bold text-xs cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#585876] mb-1.5">
                    Redacta tu solución o pega el código / justificación matemática:
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Ejemplo: Para f(x) = (3x² + 1)³, identifico u = 3x² + 1 y f(u) = u³. Derivada exterior: 3(3x² + 1)². Derivada interior: 6x. Multiplicando: 18x(3x² + 1)²..."
                    className="w-full h-36 p-3.5 rounded-2xl border border-[var(--border-soft)] text-xs font-mono focus:outline-none focus:border-[#7255F7] text-[var(--text-main)] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Fecha límite: {selectedAssignmentModal.dueDate}
                  </span>
                  <button
                    onClick={handleSubmitAssignment}
                    disabled={!submissionText.trim() || isSubmittingAssignment}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                      submissionText.trim() && !isSubmittingAssignment
                        ? 'bg-[#7255F7] text-white shadow-md shadow-[#7255F7]/30 hover:bg-[#5D3DE6]'
                        : 'bg-[#E5E3F5] text-[#8E8EA8] cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingAssignment ? 'Evaluando con Nexo...' : 'Entregar y Calificar con Nexo'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
