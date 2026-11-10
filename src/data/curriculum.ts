import { CurriculumSubject, StoreItem, ConceptMastery, DailyMission, WeeklyMission, Achievement, Classroom, StudyTask } from '../types';

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  {
    id: 'subj_calculus',
    title: { es: 'Cálculo Diferencial', en: 'Differential Calculus', pt: 'Cálculo Diferencial' },
    description: { es: 'Límites, continuidad, derivadas y optimización matemática', en: 'Limits, continuity, derivatives, and optimization', pt: 'Limites, continuidade, derivadas e otimização' },
    iconName: 'FunctionSquare',
    color: '#7255F7',
    units: [
      {
        id: 'u_calc_1',
        title: { es: 'Unidad 1: Límites y Continuidad', en: 'Unit 1: Limits & Continuity', pt: 'Unidade 1: Limites e Continuidade' },
        lessons: [
          {
            id: 'l_calc_1_1',
            unitId: 'u_calc_1',
            subjectId: 'subj_calculus',
            title: { es: 'Concepto intuitivo de Límite', en: 'Intuitive Concept of Limits', pt: 'Conceito intuitivo de Limite' },
            description: { es: 'Aproximación por la izquierda y derecha en funciones racionales', en: 'Left and right hand limits in rational functions', pt: 'Aproximação pela esquerda e direita' },
            xpReward: 50,
            gemsReward: 5,
            estimatedMinutes: 8,
            exercises: [
              {
                id: 'ex_c1_1',
                conceptId: 'c_limites',
                type: 'multiple_choice',
                question: {
                  es: '¿Qué valor toma el límite cuando x se aproxima a 2 de f(x) = (x² - 4)/(x - 2)?',
                  en: 'What is the limit of f(x) = (x² - 4)/(x - 2) as x approaches 2?',
                  pt: 'Qual é o limite de f(x) = (x² - 4)/(x - 2) quando x se aproxima de 2?',
                },
                explanation: {
                  es: 'Factorizando el numerador: (x - 2)(x + 2)/(x - 2) = x + 2. Evaluando en x = 2: 2 + 2 = 4.',
                  en: 'Factoring numerator: (x - 2)(x + 2)/(x - 2) = x + 2. Evaluating at x = 2 yields 4.',
                  pt: 'Fatorando: (x - 2)(x + 2)/(x - 2) = x + 2. Em x = 2 resulta em 4.',
                },
                options: [
                  { id: 'opt_1', text: '0' },
                  { id: 'opt_2', text: '2' },
                  { id: 'opt_3', text: '4' },
                  { id: 'opt_4', text: 'Indeterminado' },
                ],
                correctOptionId: 'opt_3',
              },
            ],
          },
        ],
      },
      {
        id: 'u_calc_2',
        title: { es: 'Unidad 2: Reglas de Derivación', en: 'Unit 2: Differentiation Rules', pt: 'Unidade 2: Regras de Derivação' },
        lessons: [
          {
            id: 'l_calc_2_1',
            unitId: 'u_calc_2',
            subjectId: 'subj_calculus',
            title: { es: 'Regla de la Cadena', en: 'The Chain Rule', pt: 'Regra da Cadeia' },
            description: { es: 'Derivación de funciones compuestas: exterior por interior', en: 'Differentiating composite functions', pt: 'Derivação de funções compostas' },
            xpReward: 50,
            gemsReward: 8,
            estimatedMinutes: 12,
            exercises: [
              {
                id: 'ex_c_chain_1',
                conceptId: 'c_regla_cadena',
                type: 'multiple_choice',
                question: {
                  es: '¿Cuál es la derivada de la función f(x) = (3x + 1)²?',
                  en: 'What is the derivative of f(x) = (3x + 1)²?',
                  pt: 'Qual é a derivada de f(x) = (3x + 1)²?',
                },
                explanation: {
                  es: 'Regla de la cadena: derivada exterior 2(3x + 1) multiplicada por la derivada interior 3. Resultado: 6(3x + 1).',
                  en: 'Chain rule: outer derivative 2(3x + 1) multiplied by inner derivative 3. Result: 6(3x + 1).',
                  pt: 'Regra da cadeia: 2(3x + 1) * 3 = 6(3x + 1).',
                },
                options: [
                  { id: 'opt_ch1', text: "f'(x) = 2(3x + 1)" },
                  { id: 'opt_ch2', text: "f'(x) = 6(3x + 1)" },
                  { id: 'opt_ch3', text: "f'(x) = 6x + 1" },
                  { id: 'opt_ch4', text: "f'(x) = 9x² + 6x + 1" },
                ],
                correctOptionId: 'opt_ch2',
              },
              {
                id: 'ex_c_chain_2',
                conceptId: 'c_regla_cadena',
                type: 'order_steps',
                question: {
                  es: 'Ordena los pasos lógicos para derivar y = sin(x² + 3):',
                  en: 'Order the logical steps to differentiate y = sin(x² + 3):',
                  pt: 'Ordene os passos para derivar y = sin(x² + 3):',
                },
                explanation: {
                  es: '1. Identificar función exterior sin(u) e interior u = x² + 3. 2. Derivar exterior cos(u). 3. Derivar interior 2x. 4. Multiplicar: 2x·cos(x² + 3).',
                  en: 'Identify outer and inner functions, differentiate each, and multiply.',
                  pt: 'Identificar funções, derivar e multiplicar.',
                },
                stepsToOrder: [
                  'Identificar la función exterior f(u) = sin(u) y la interior u(x) = x² + 3',
                  'Calcular la derivada de la función exterior: f\'(u) = cos(u)',
                  'Calcular la derivada de la función interior: u\'(x) = 2x',
                  'Multiplicar ambas partes: dy/dx = 2x · cos(x² + 3)',
                ],
                correctOrder: [0, 1, 2, 3],
              },
              {
                id: 'ex_c_chain_3',
                conceptId: 'c_regla_cadena',
                type: 'spot_error',
                question: {
                  es: 'Encuentra la línea que contiene el error conceptual al derivar g(x) = (2x + 1)⁴:',
                  en: 'Spot the line containing the conceptual error when differentiating g(x) = (2x + 1)⁴:',
                  pt: 'Encontre a linha com erro ao derivar g(x) = (2x + 1)⁴:',
                },
                explanation: {
                  es: 'En la línea 2 se olvidó multiplicar por la derivada interior d/dx(2x+1) = 2, concluyendo erróneamente 4(2x+1)³.',
                  en: 'Line 2 missed multiplying by the inner derivative (2).',
                  pt: 'Na linha 2 faltou multiplicar pela derivada interna (2).',
                },
                solutionLines: [
                  { line: 1, text: 'Identificamos u = 2x + 1, entonces g(u) = u⁴' },
                  { line: 2, text: 'g\'(x) = 4(2x + 1)³   [Sin multiplicar por u\']', isError: true },
                  { line: 3, text: 'Conclusión: g\'(x) = 4(2x + 1)³' },
                ],
                errorLineIndex: 1,
              },
              {
                id: 'ex_c_chain_4',
                conceptId: 'c_regla_cadena',
                type: 'interactive_graph',
                question: {
                  es: 'Ajusta el parámetro x en el deslizador para encontrar dónde la recta tangente tiene pendiente nula (f\'(x) = 0):',
                  en: 'Adjust x with the slider to locate where the tangent slope is zero (f\'(x) = 0):',
                  pt: 'Ajuste x para encontrar onde a inclinação da reta tangente é zero:',
                },
                explanation: {
                  es: 'El vértice de la parábola ocurre en x = 0, donde la tangente es perfectamente horizontal con pendiente m = 0.',
                  en: 'The vertex is at x = 0 with a horizontal tangent.',
                  pt: 'O vértice ocorre em x = 0 com tangente horizontal.',
                },
                correctAnswer: 0,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const INITIAL_CONCEPTS: ConceptMastery[] = [
  { conceptId: 'c_funciones', subjectId: 'subj_calculus', name: { es: 'Funciones', en: 'Functions', pt: 'Funções' }, mastery: 96, status: 'mastered' },
  { conceptId: 'c_limites', subjectId: 'subj_calculus', name: { es: 'Límites', en: 'Limits', pt: 'Limites' }, mastery: 92, status: 'mastered' },
  { conceptId: 'c_continuidad', subjectId: 'subj_calculus', name: { es: 'Continuidad', en: 'Continuity', pt: 'Continuidade' }, mastery: 85, status: 'mastered' },
  { conceptId: 'c_derivadas', subjectId: 'subj_calculus', name: { es: 'Derivadas', en: 'Derivatives', pt: 'Derivadas' }, mastery: 78, status: 'in_progress' },
  { conceptId: 'c_regla_cadena', subjectId: 'subj_calculus', name: { es: 'Regla de la cadena', en: 'Chain Rule', pt: 'Regra da cadeia' }, mastery: 46, status: 'next_step', commonError: 'Olvida derivar la función interior en 70% de casos' },
  { conceptId: 'c_optimizacion', subjectId: 'subj_calculus', name: { es: 'Optimización', en: 'Optimization', pt: 'Otimização' }, mastery: 32, status: 'reinforce', commonError: 'Dificultad al plantear la ecuación a maximizar' },
  { conceptId: 'c_integrales', subjectId: 'subj_calculus', name: { es: 'Integrales', en: 'Integrals', pt: 'Integrais' }, mastery: 0, status: 'locked' },
  { conceptId: 'c_bucles', subjectId: 'subj_programming', name: { es: 'Bucles y lógica', en: 'Loops & Logic', pt: 'Laços e lógica' }, mastery: 74, status: 'in_progress' },
  { conceptId: 'c_recursion', subjectId: 'subj_programming', name: { es: 'Recursión', en: 'Recursion', pt: 'Recursão' }, mastery: 20, status: 'reinforce', commonError: 'Olvido del caso base' },
];

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task_1',
    title: 'Resolver 3 retos de derivación compuesta con Nexo',
    subject: 'Cálculo I',
    priority: 'high',
    completed: false,
    dueDate: 'Hoy',
    xpReward: 60,
    estimatedMinutes: 15,
    notes: 'Enfocarse en no olvidar la derivada interior.',
    isNightTask: true,
  },
  {
    id: 'task_2',
    title: 'Completar sesión Pomodoro de lectura de teoremas',
    subject: 'Matemáticas',
    priority: 'medium',
    completed: true,
    dueDate: 'Hoy',
    xpReward: 40,
    estimatedMinutes: 25,
    notes: 'Revisar teorema del valor medio.',
    isNightTask: false,
  },
  {
    id: 'task_3',
    title: 'Práctica nocturna: Simulación de Tiro Balístico a 40m',
    subject: 'Física',
    priority: 'medium',
    completed: false,
    dueDate: 'Mañana',
    xpReward: 50,
    estimatedMinutes: 15,
    notes: 'Calcular ángulo óptimo con menor error.',
    isNightTask: true,
  },
  {
    id: 'task_4',
    title: 'Depuración de búsqueda binaria O(log n) en JavaScript',
    subject: 'Programación',
    priority: 'high',
    completed: false,
    dueDate: 'Viernes',
    xpReward: 70,
    estimatedMinutes: 20,
    notes: 'Verificar los límites fin e inicio en la condición while.',
    isNightTask: false,
  },
  {
    id: 'task_5',
    title: 'Entregar Taller Oficial de Optimización Cilíndrica',
    subject: 'Cálculo I',
    priority: 'high',
    completed: false,
    dueDate: '18 de Nov',
    xpReward: 120,
    estimatedMinutes: 30,
    notes: 'Justificar el cálculo de derivada segunda.',
    isNightTask: true,
  },
];

export const INITIAL_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'm_1',
    title: { es: 'Revisa tu siguiente paso', en: 'Review your next step', pt: 'Revise seu próximo passo' },
    description: { es: 'Abre tu panel y selecciona la lección recomendada', en: 'Open dashboard and choose recommended lesson', pt: 'Abra o painel e selecione a lição' },
    xpReward: 10,
    completed: true,
    claimed: true,
    actionRoute: 'home',
  },
  {
    id: 'm_2',
    title: { es: 'Resuelve el reto rápido del día', en: 'Solve the daily quick challenge', pt: 'Resolva o desafio rápido' },
    description: { es: 'Una pregunta de derivadas en tu panel de inicio', en: 'A calculus question on your dashboard', pt: 'Uma questão de cálculo' },
    xpReward: 30,
    completed: false,
    claimed: false,
    actionRoute: 'home',
  },
  {
    id: 'm_3',
    title: { es: 'Supera un reto con Nexo', en: 'Beat a challenge with Nexo', pt: 'Vença um desafio com Nexo' },
    description: { es: 'Usa el modo Ponme un reto en el tutor IA', en: 'Use Challenge Mode in AI Tutor', pt: 'Use o modo Desafio no tutor' },
    xpReward: 50,
    completed: false,
    claimed: false,
    actionRoute: 'tutor',
  },
  {
    id: 'm_4',
    title: { es: 'Sesión de concentración nocturna', en: 'Nocturnal focus session', pt: 'Sessão de foco noturno' },
    description: { es: 'Estudia 15 min en modo nocturno con sonido ambiental', en: 'Study 15 min in night mode with ambient audio', pt: 'Estude 15 min em modo noturno' },
    xpReward: 40,
    completed: false,
    claimed: false,
    actionRoute: 'tasks',
  },
  {
    id: 'm_5',
    title: { es: 'Arregla el código del laboratorio', en: 'Fix code in programming lab', pt: 'Corrija o código no laboratório' },
    description: { es: 'Haz que pasen las 3 pruebas unitarias', en: 'Pass all 3 unit tests in JS lab', pt: 'Passe nos 3 testes' },
    xpReward: 60,
    completed: false,
    claimed: false,
    actionRoute: 'labs',
  },
];

export const INITIAL_WEEKLY_MISSIONS: WeeklyMission[] = [
  {
    id: 'wm_1',
    title: { es: 'Constancia de acero', en: 'Iron Consistency', pt: 'Constância de ferro' },
    description: { es: 'Días seguidos aprendiendo esta semana', en: 'Consecutive study days', pt: 'Dias seguidos estudando' },
    current: 4,
    target: 5,
    rewardText: '+150 XP y 10 Gemas',
    xpReward: 150,
  },
  {
    id: 'wm_2',
    title: { es: 'Mente Analítica', en: 'Analytical Mind', pt: 'Mente Analítica' },
    description: { es: 'Errores analizados conceptualmente con Nexo', en: 'Conceptual errors analyzed', pt: 'Erros analisados com Nexo' },
    current: 2,
    target: 3,
    rewardText: 'Insignia Mente Analítica + 200 XP',
    xpReward: 200,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_1', title: { es: 'Primeros pasos', en: 'First Steps', pt: 'Primeiros passos' }, description: { es: 'Completa tu perfil y diagnóstico inicial', en: 'Complete your profile and diagnostic', pt: 'Complete o perfil' }, icon: 'Star', color: '#FFB547', unlocked: true, unlockedAt: 'Hace 3 semanas' },
  { id: 'ach_2', title: { es: 'Racha de fuego', en: 'Fire Streak', pt: 'Sequência de fogo' }, description: { es: 'Aprende 7 días seguidos sin romper la racha', en: 'Learn 7 consecutive days', pt: 'Aprenda 7 dias seguidos' }, icon: 'Flame', color: '#FF6B91', unlocked: true, unlockedAt: 'Hace 5 días' },
  { id: 'ach_3', title: { es: 'Búho Nocturno', en: 'Night Owl', pt: 'Coruja Noturna' }, description: { es: 'Completa una práctica en modo nocturno', en: 'Complete a night session', pt: 'Complete uma sessão noturna' }, icon: 'Moon', color: '#24B8E8', unlocked: true, unlockedAt: 'Ayer' },
  { id: 'ach_4', title: { es: 'Mente analítica', en: 'Analytical Mind', pt: 'Mente analítica' }, description: { es: 'Analiza 5 errores conceptuales con Nexo', en: 'Analyze 5 mistakes with Nexo', pt: 'Analise 5 erros' }, icon: 'AlertCircle', color: '#19C6A3', unlocked: true, unlockedAt: 'Hace 2 días' },
  { id: 'ach_5', title: { es: 'Programador hábil', en: 'Skilled Coder', pt: 'Programador hábil' }, description: { es: 'Supera todas las pruebas del laboratorio de código', en: 'Pass all unit tests in code lab', pt: 'Passe em todos os testes' }, icon: 'Code', color: '#7255F7', unlocked: false },
  { id: 'ach_6', title: { es: 'Científico en diana', en: 'Bullseye Scientist', pt: 'Cientista na mira' }, description: { es: 'Acierta al objetivo en el simulador de proyectiles', en: 'Hit target in projectile simulator', pt: 'Acerte o alvo' }, icon: 'Atom', color: '#FFB547', unlocked: false },
  { id: 'ach_7', title: { es: 'Maestro del Cálculo', en: 'Calculus Master', pt: 'Mestre do Cálculo' }, description: { es: 'Domina 10 conceptos de Cálculo Diferencial', en: 'Master 10 calculus concepts', pt: 'Domine 10 conceitos' }, icon: 'Award', color: '#7255F7', unlocked: false },
  { id: 'ach_8', title: { es: 'Sincronía Total', en: 'Cloud Master', pt: 'Sincronia Total' }, description: { es: 'Guarda y sincroniza 3 puntos en la nube', en: 'Sync 3 points to cloud', pt: 'Sincronize 3 pontos' }, icon: 'Cloud', color: '#24B8E8', unlocked: true, unlockedAt: 'Hoy' },
];

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'item_streak_freeze',
    title: { es: 'Protector de Racha', en: 'Streak Freeze', pt: 'Protetor de Sequência' },
    description: { es: 'Protege tu racha diaria si un día no puedes practicar.', en: 'Protects your daily streak if you miss a day.', pt: 'Protege sua sequência caso falte um dia.' },
    costGems: 25,
    category: 'streak',
    icon: 'Shield',
  },
  {
    id: 'item_energy_refill',
    title: { es: 'Recarga de Energía Total', en: 'Full Energy Refill', pt: 'Recarga de Energia Total' },
    description: { es: 'Restaura tus 5 corazones de energía para lecciones de inmediato.', en: 'Instantly restores all 5 hearts.', pt: 'Restaura todos os 5 corações.' },
    costGems: 15,
    category: 'energy',
    icon: 'Heart',
  },
  {
    id: 'item_double_xp',
    title: { es: 'Poción Doble XP (1h)', en: 'Double XP Potion (1h)', pt: 'Poção XP em Dobro (1h)' },
    description: { es: 'Duplica todos los puntos de experiencia ganados durante 60 minutos.', en: 'Doubles all XP gained for 60 minutes.', pt: 'Dobra todos os pontos de XP por 60 min.' },
    costGems: 30,
    category: 'booster',
    icon: 'Zap',
  },
  {
    id: 'item_frame_neon',
    title: { es: 'Marco Neón Nocturno', en: 'Neon Night Frame', pt: 'Moldura Neon Noturna' },
    description: { es: 'Borde resplandeciente en tu avatar visible en ligas y muro.', en: 'Glowing avatar border visible in leagues.', pt: 'Borda brilhante no seu avatar.' },
    costGems: 50,
    category: 'cosmetic',
    icon: 'Sparkles',
  },
];

export const INITIAL_CLASSROOM: Classroom = {
  id: 'class_calc1_b',
  code: 'CALC-2026',
  name: 'Cálculo I · Grupo B',
  teacherName: 'Prof. Carlos Martínez',
  studentCount: 28,
  averageMastery: 74,
  submissionRate: 86,
  alerts: [
    {
      id: 'alt_1',
      concept: 'Regla de la cadena',
      description: 'Mateo, Diego y Lucas olvidan la derivada interior en el 70% de los intentos.',
      severity: 'high',
    },
    {
      id: 'alt_2',
      concept: 'Optimización',
      description: 'El 45% del grupo no logra plantear la función a maximizar.',
      severity: 'high',
    },
    {
      id: 'alt_3',
      concept: 'Ritmo de Diego Herrera',
      description: 'Bajó su actividad un 60% esta semana y lleva 5 días sin practicar.',
      severity: 'medium',
    },
  ],
  students: [
    { id: 's_1', name: 'Sofía Ramírez', avatarLetter: 'S', color: '#7255F7', conceptScores: { Funciones: 96, Límites: 92, Derivadas: 78, Cadena: 46, Optimización: 32 }, activeStreak: 12, lastActive: 'Hoy' },
    { id: 's_2', name: 'Mateo Gómez', avatarLetter: 'M', color: '#24B8E8', conceptScores: { Funciones: 90, Límites: 85, Derivadas: 70, Cadena: 40, Optimización: 28 }, activeStreak: 8, lastActive: 'Ayer' },
    { id: 's_3', name: 'Valentina Cruz', avatarLetter: 'V', color: '#19C6A3', conceptScores: { Funciones: 98, Límites: 95, Derivadas: 92, Cadena: 85, Optimización: 70 }, activeStreak: 21, lastActive: 'Hoy' },
    { id: 's_4', name: 'Diego Herrera', avatarLetter: 'D', color: '#FFB547', conceptScores: { Funciones: 80, Límites: 72, Derivadas: 55, Cadena: 30, Optimización: 20 }, activeStreak: 0, lastActive: 'Hace 5 días' },
    { id: 's_5', name: 'Camila Torres', avatarLetter: 'C', color: '#FF6B91', conceptScores: { Funciones: 94, Límites: 90, Derivadas: 84, Cadena: 76, Optimización: 60 }, activeStreak: 14, lastActive: 'Hoy' },
    { id: 's_6', name: 'Lucas Fernández', avatarLetter: 'L', color: '#7255F7', conceptScores: { Funciones: 88, Límites: 80, Derivadas: 66, Cadena: 38, Optimización: 35 }, activeStreak: 5, lastActive: 'Hoy' },
    { id: 's_7', name: 'Isabella Morales', avatarLetter: 'I', color: '#24B8E8', conceptScores: { Funciones: 92, Límites: 88, Derivadas: 80, Cadena: 72, Optimización: 55 }, activeStreak: 10, lastActive: 'Ayer' },
    { id: 's_8', name: 'Thiago Rojas', avatarLetter: 'T', color: '#19C6A3', conceptScores: { Funciones: 85, Límites: 76, Derivadas: 62, Cadena: 58, Optimización: 40 }, activeStreak: 6, lastActive: 'Hoy' },
  ],
};

export const INITIAL_LEADERBOARD = [
  { rank: 1, name: 'Andrés Navarro', xp: 820, streak: 18, avatar: 'A', color: '#19C6A3' },
  { rank: 2, name: 'Valentina Cruz', xp: 790, streak: 21, avatar: 'V', color: '#7255F7' },
  { rank: 3, name: 'Sofía Ramírez (Tú)', xp: 640, streak: 12, avatar: 'S', color: '#FF6B91', isUser: true },
  { rank: 4, name: 'Elena Soler', xp: 580, streak: 9, avatar: 'E', color: '#FFB547' },
  { rank: 5, name: 'David Kim', xp: 540, streak: 14, avatar: 'D', color: '#24B8E8' },
  { rank: 6, name: 'Camila Torres', xp: 490, streak: 11, avatar: 'C', color: '#19C6A3' },
  { rank: 7, name: 'Mateo Gómez', xp: 460, streak: 8, avatar: 'M', color: '#FFB547' },
  { rank: 8, name: 'Lucas Fernández', xp: 410, streak: 5, avatar: 'L', color: '#7255F7' },
];
