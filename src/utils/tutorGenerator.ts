import { GoogleGenAI } from '@google/genai';
import { StudyTask, ConceptMastery } from '../types';
import { 
  getSemanticAnswer, 
  evaluateBasicMath, 
  generateUniversalPedagogicalAnswer 
} from './knowledgeEngine';

// Returns a configured GoogleGenAI instance if a genuine API key is present
function getGenAIClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface TutorChallengeData {
  badge?: string;
  xp?: number;
  problem: string;
  formula?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TutorCardResponse {
  mode: 'explain' | 'challenge' | 'analyze_error' | 'test_level';
  title?: string;
  analogy?: string;
  steps?: string[];
  challenge?: TutorChallengeData;
  errorAnalysis?: {
    codeOrMath: string[];
    errorLineIndex: number;
    conceptErrorName: string;
    correctionGuide: string[];
  };
  textResponse?: string;
}

// Procedural challenge bank with varied formulas and topics
const CHALLENGE_POOLS: Record<string, (() => TutorChallengeData)[]> = {
  // 1. Regla de la Cadena
  c_regla_cadena: [
    () => {
      const a = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const n = [3, 4, 5][Math.floor(Math.random() * 3)];
      const coef = n * 2 * a;
      return {
        badge: 'RETO ADAPTADO · CADENA',
        xp: 50,
        problem: `Calcula la derivada de la función f(x) = (${a}x² + 1)^${n}:`,
        formula: `f(x) = (${a}x² + 1)^${n}`,
        options: [
          `${n}(${a}x² + 1)^${n - 1}`,
          `${coef}x(${a}x² + 1)^${n - 1}`,
          `${a * n}x(${a}x² + 1)^${n - 1}`,
        ],
        correctIndex: 1,
        explanation: `¡Correcto! Capa exterior: ${n}(${a}x² + 1)^${n - 1}. Capa interior: d/dx(${a}x² + 1) = ${2 * a}x. Multiplicando ambas: ${coef}x(${a}x² + 1)^${n - 1}.`,
      };
    },
    () => {
      const k = [2, 3, 5, 7][Math.floor(Math.random() * 4)];
      return {
        badge: 'RETO TRIGONOMÉTRICO · CADENA',
        xp: 55,
        problem: `Encuentra la derivada de y = sin(${k}x³):`,
        formula: `y = sin(${k}x³)`,
        options: [
          `cos(${k}x³)`,
          `${3 * k}x² · cos(${k}x³)`,
          `-${3 * k}x² · cos(${k}x³)`,
        ],
        correctIndex: 1,
        explanation: `¡Excelente! d/du(sin u) = cos(u) y du/dx = ${3 * k}x². Por la regla de la cadena, y' = ${3 * k}x² · cos(${k}x³).`,
      };
    },
    () => {
      const m = [2, 4, 6][Math.floor(Math.random() * 3)];
      return {
        badge: 'RETO EXPONENCIAL · CADENA',
        xp: 60,
        problem: `Aplica la regla de la cadena para derivar f(x) = e^(${m}x² - 3):`,
        formula: `f(x) = e^(${m}x² - 3)`,
        options: [
          `${2 * m}x · e^(${m}x² - 3)`,
          `e^(${m}x² - 3)`,
          `${m}x² · e^(${m}x² - 3)`,
        ],
        correctIndex: 0,
        explanation: `¡Perfecto! La derivada de e^u es e^u · u'. Aquí u = ${m}x² - 3, por lo que u' = ${2 * m}x.`,
      };
    },
    () => {
      return {
        badge: 'RETO RADICAL · CADENA',
        xp: 55,
        problem: '¿Cuál es la derivada de g(x) = √(3x² + 4)?',
        formula: 'g(x) = √(3x² + 4) = (3x² + 4)^(1/2)',
        options: [
          '3x / √(3x² + 4)',
          '6x / √(3x² + 4)',
          '1 / (2√(3x² + 4))',
        ],
        correctIndex: 0,
        explanation: '¡Muy bien! g\'(x) = (1/2)(3x² + 4)^(-1/2) · (6x) = (6x) / (2√(3x² + 4)) = 3x / √(3x² + 4).',
      };
    },
  ],

  // 2. Límites y Continuidad
  c_limites: [
    () => {
      const a = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const a2 = a * a;
      return {
        badge: 'RETO DE LÍMITES · INDETERMINACIÓN 0/0',
        xp: 45,
        problem: `Evalúa el límite indeterminado cuando x tiende a ${a}:`,
        formula: `lim (x → ${a}) [ (x² - ${a2}) / (x - ${a}) ]`,
        options: [
          `${2 * a}`,
          `${a}`,
          '0',
          'Indefinido',
        ],
        correctIndex: 0,
        explanation: `¡Exacto! Factorizando el numerador por diferencia de cuadrados: (x - ${a})(x + ${a}) / (x - ${a}) = x + ${a}. Al evaluar en x = ${a}: ${a} + ${a} = ${2 * a}.`,
      };
    },
    () => {
      const k = [3, 4, 6, 8][Math.floor(Math.random() * 4)];
      return {
        badge: 'LÍMITE TRIGONOMÉTRICO NOTABLE',
        xp: 50,
        problem: `Determina el valor del límite: lim (x → 0) [ sin(${k}x) / x ]`,
        formula: `lim (x → 0) [ sin(${k}x) / x ]`,
        options: [
          `${k}`,
          '1',
          '0',
          `${k / 2}`,
        ],
        correctIndex: 0,
        explanation: `¡Correcto! Usando el límite notable lim (u → 0) [sin(u)/u] = 1, multiplicamos y dividimos por ${k}: ${k} · lim [sin(${k}x)/(${k}x)] = ${k} · 1 = ${k}.`,
      };
    },
  ],

  // 3. Optimización y Derivadas
  c_optimizacion: [
    () => {
      const p = [40, 80, 120, 200][Math.floor(Math.random() * 4)];
      const side = p / 4;
      const area = side * side;
      return {
        badge: 'RETO DE OPTIMIZACIÓN · MÁXIMO',
        xp: 60,
        problem: `Se dispone de ${p} metros de cerca para delimitar un terreno rectangular. ¿Cuál es el área máxima posible?`,
        formula: `Perímetro = 2x + 2y = ${p}  ==>  Área A(x) = x(${p / 2} - x)`,
        options: [
          `${area} m²`,
          `${area * 0.8} m²`,
          `${p * 2} m²`,
        ],
        correctIndex: 0,
        explanation: `¡Excelente! A'(x) = ${p / 2} - 2x = 0  ==>  x = ${side}. Con dimensiones ${side} x ${side} (un cuadrado), el área máxima es ${side} · ${side} = ${area} m².`,
      };
    },
  ],

  // 4. Algoritmos y Programación
  c_bucles: [
    () => {
      return {
        badge: 'RETO DE ALGORITMOS · COMPLEJIDAD',
        xp: 45,
        problem: '¿Cuál es la complejidad temporal asintótica del siguiente código?',
        formula: 'for i in range(n):\n    for j in range(n):\n        total += i * j',
        options: [
          'O(n²)',
          'O(n)',
          'O(n log n)',
          'O(1)',
        ],
        correctIndex: 0,
        explanation: '¡Correcto! El bucle exterior se ejecuta n veces y para cada iteración el bucle interior se ejecuta n veces, resultando en n * n = O(n²) operaciones.',
      };
    },
    () => {
      return {
        badge: 'RETO PYTHON · LIST COMPREHENSION',
        xp: 40,
        problem: '¿Cuál es el resultado de evaluar: sum([x for x in range(6) if x % 2 == 0])?',
        formula: 'sum([x for x in range(6) if x % 2 == 0])',
        options: [
          '6  (0 + 2 + 4)',
          '12 (0 + 2 + 4 + 6)',
          '9',
          '0',
        ],
        correctIndex: 0,
        explanation: '¡Muy bien! range(6) genera [0, 1, 2, 3, 4, 5]. Los pares son 0, 2, 4. Su suma es 0 + 2 + 4 = 6. (Recuerda que range(6) no incluye el 6).',
      };
    },
  ],

  // 5. Recursión
  c_recursion: [
    () => {
      return {
        badge: 'RETO DE RECURSIÓN · CASO BASE',
        xp: 50,
        problem: '¿Qué ocurre al ejecutar la siguiente función con factorial(3)?',
        formula: 'def factorial(n):\n    return n * factorial(n - 1)',
        options: [
          'RecursionError: Stack Overflow (falta el caso base)',
          'Retorna 6',
          'Retorna 0',
        ],
        correctIndex: 0,
        explanation: '¡Exacto! Sin una condición de parada (como if n <= 1: return 1), la función sigue llamándose con números negativos hasta desbordar la pila de llamadas.',
      };
    },
  ],

  // 6. Física y Cinemática
  c_cinematica: [
    () => {
      const v0 = [20, 30, 40][Math.floor(Math.random() * 3)];
      const hMax = (v0 * v0) / (2 * 10);
      return {
        badge: 'RETO DE FÍSICA · TIRO VERTICAL',
        xp: 50,
        problem: `Un proyectil se lanza verticalmente hacia arriba con v₀ = ${v0} m/s (g = 10 m/s²). ¿Cuál es su altura máxima?`,
        formula: `v² = v₀² - 2g·h  ==>  h_max = v₀² / (2g)`,
        options: [
          `${hMax} m`,
          `${hMax * 1.5} m`,
          `${v0 * 2} m`,
        ],
        correctIndex: 0,
        explanation: `¡Correcto! En la altura máxima v = 0. Por tanto: 0 = ${v0}² - 2(10)h  ==>  h = ${v0 * v0} / 20 = ${hMax} metros.`,
      };
    },
  ],
};

// Error Analysis pool
const ERROR_ANALYSIS_POOL: TutorCardResponse['errorAnalysis'][] = [
  {
    codeOrMath: [
      'Línea 1: Sea f(x) = (3x² + 5)⁴',
      'Línea 2: f\'(x) = 4(3x² + 5)³           <-- ERROR: No se multiplicó por u\'(x)',
      'Línea 3: f\'(x) = 4(3x² + 5)³ · (6x)    [Corrección paso a paso]',
      'Línea 4: f\'(x) = 24x(3x² + 5)³         [Resultado simplificado]'
    ],
    errorLineIndex: 1,
    conceptErrorName: 'Omisión de la derivada interna u\'(x) en funciones polinomiales compuestas',
    correctionGuide: [
      '1. Descompón siempre f(u) = u⁴ y u(x) = 3x² + 5.',
      '2. Calcula la derivada interior por separado: u\'(x) = 6x.',
      '3. Aplica la fórmula formal: [f(u(x))]\' = f\'(u) · u\'(x).',
      '4. Multiplica los coeficientes numéricos exteriores: 4 · 6x = 24x.'
    ]
  },
  {
    codeOrMath: [
      'Línea 1: Sea y = cos(4x)',
      'Línea 2: y\' = sin(4x) · 4             <-- ERROR: La derivada de cos(u) es -sin(u)',
      'Línea 3: y\' = -sin(4x) · 4            [Corrección de signo]',
      'Línea 4: y\' = -4 · sin(4x)            [Resultado final]'
    ],
    errorLineIndex: 1,
    conceptErrorName: 'Error de signo en la derivada de funciones trigonométricas con coseno',
    correctionGuide: [
      '1. Recuerda la regla fundamental: d/dx[cos(x)] = -sin(x) con signo negativo.',
      '2. Deriva el argumento interior: d/dx(4x) = 4.',
      '3. Une ambos términos: (-sin(4x)) · 4 = -4 sin(4x).'
    ]
  },
  {
    codeOrMath: [
      'Línea 1: def suma_pares(n):',
      'Línea 2:     total = 0',
      'Línea 3:     for i in range(1, n):     <-- ERROR: Excluye el valor n (Off-by-one)',
      'Línea 4:         if i % 2 == 0:',
      'Línea 5:             total += i',
      'Línea 6:     return total'
    ],
    errorLineIndex: 2,
    conceptErrorName: 'Error de límites Off-By-One en bucle de Python (range excluye el extremo superior)',
    correctionGuide: [
      '1. Para incluir el número n en el cálculo, usa range(1, n + 1).',
      '2. Alternativamente, puedes usar paso 2: range(2, n + 1, 2) para mayor eficiencia.',
      '3. Verifica siempre los casos de prueba en los extremos (n=2, n=4).'
    ]
  },
  {
    codeOrMath: [
      'Línea 1: Sea lim (x → 2) [ (x² - 4) / (x - 2) ]',
      'Línea 2: Evaluando directo: (2² - 4)/(2 - 2) = 0/0',
      'Línea 3: "Como da 0/0, el límite no existe"  <-- ERROR: 0/0 es indeterminación, no inexistencia',
      'Línea 4: Factorizando: (x - 2)(x + 2) / (x - 2) = x + 2  ==>  2 + 2 = 4 [Correcto]'
    ],
    errorLineIndex: 2,
    conceptErrorName: 'Confusión entre indeterminación 0/0 e inexistencia de un límite',
    correctionGuide: [
      '1. 0/0 indica que existe un factor común que anula numerador y denominador.',
      '2. Aplica factorización algebraica (diferencia de cuadrados, trinomio) o regla de L\'Hôpital.',
      '3. Cancela el factor (x - a) y vuelve a evaluar.'
    ]
  }
];

// Explanations bank with varied analogies
const EXPLANATION_POOL = [
  {
    title: 'La regla de la cadena: el efecto dominó y los engranajes',
    analogy: 'Imagina dos engranajes acoplados: un engranaje pequeño gira dentro de uno grande. La velocidad a la que se mueve el exterior depende directamente del producto de las velocidades de ambos engranajes.',
    steps: [
      'Paso 1: Identifica la función exterior f(u) y la interior u(x).',
      'Paso 2: Deriva la función exterior como si u fuera una sola variable: f\'(u).',
      'Paso 3: Deriva la función interior respecto a x: u\'(x).',
      'Paso 4: Multiplica ambas derivadas: f\'(u) · u\'(x).'
    ]
  },
  {
    title: 'La regla de la cadena: el modelo de las Muñecas Rusas (Matrioshkas)',
    analogy: 'Una función compuesta es como una muñeca rusa dentro de otra: para conocer el ritmo de cambio de toda la estructura, debes abrir la muñeca exterior, ver qué hay dentro, y multiplicarlo por el cambio de la muñeca interior.',
    steps: [
      'Paso 1: Capa exterior: Deriva la cáscara exterior sin tocar lo de adentro.',
      'Paso 2: Capa interior: Multiplica por la derivada de lo que estaba guardado adentro.',
      'Paso 3: Simplifica los factores constantes al inicio de la expresión.'
    ]
  },
  {
    title: 'Límites: Acercarse sin tocar (La lupa matemática)',
    analogy: 'Un límite es como observar la trayectoria de un tren que se acerca a una estación: no importa si la estación está cerrada o en obras en ese punto exacto, lo que importa es hacia qué coordenada apuntan los rieles conforme nos aproximamos.',
    steps: [
      'Paso 1: Evalúa por sustitución directa.',
      'Paso 2: Si obtienes 0/0, factoriza el numerador y denominador.',
      'Paso 3: Simplifica el término problemático (x - a).',
      'Paso 4: Vuelve a sustituir para hallar el valor real del límite.'
    ]
  },
  {
    title: 'Optimización: La cima de la colina y la tangente horizontal',
    analogy: 'Imagina caminar por una colina en la niebla. ¿Cómo sabes cuándo alcanzaste el punto más alto? Justo en la cima, el suelo se vuelve perfectamente plano (pendiente cero) antes de empezar a descender.',
    steps: [
      'Paso 1: Plantea la función objetivo que deseas maximizar o minimizar (Área, Costo, Ganancia).',
      'Paso 2: Expresa la función en términos de una sola variable usando las restricciones.',
      'Paso 3: Calcula la primera derivada y resuélvela igual a cero: f\'(x) = 0.',
      'Paso 4: Usa el criterio de la segunda derivada f\'\'(x) < 0 para confirmar que es un máximo.'
    ]
  }
];

/**
 * Main Dynamic Generator for Nexo Tutor
 */
export async function generateTutorResponse(params: {
  mode: 'explain' | 'challenge' | 'analyze_error' | 'test_level';
  message?: string;
  conceptId?: string;
  language?: string;
}): Promise<{ card?: TutorCardResponse; textResponse?: string }> {
  const { mode, message, conceptId = 'c_regla_cadena', language = 'es' } = params;

  // 1. Try Gemini API if valid key is configured
  const ai = getGenAIClient();
  if (ai && message && message.trim().length > 1) {
    try {
      const prompt = `Eres Nexo, el Tutor IA integrado de la plataforma educativa STEM NEXORA.
Tu misión es educar, inspirar y responder con rigor didáctico a CUALQUIER pregunta del estudiante, desde preguntas básicas cotidianas (saludos, conceptos elementales de ciencia, matemáticas, física, biología, química, programación y tecnología), hasta dudas complejas y retos de nivel universitario.

Idioma: ${language === 'en' ? 'Inglés' : language === 'pt' ? 'Portugués' : 'Español'}
Tema activo de contexto: ${conceptId}
Modo solicitado: ${mode}
Pregunta o mensaje del estudiante: "${message}"

INSTRUCCIONES DE RESPUESTA:
1. Responde SIEMPRE con exactitud pedagógica a la pregunta concreta que te formula el estudiante.
2. Si el estudiante hace una pregunta conceptual o básica (ej: "¿qué es la fotosíntesis?", "¿qué es la gravedad?", "¿por qué el cielo es azul?", "¿qué es una función?", "¿cómo funciona un bucle?", "hola", "cuánto es 15 por 8"), responde de forma clara, motivadora y amena con ejemplos del mundo real.
3. Si el estudiante pide explícitamente un reto ("reto", "desafío", "ejercicio") o el modo es "challenge" / "test_level", genera un reto interactivo con 3 opciones y explicación.
4. Devuelve SIEMPRE Y ÚNICAMENTE un objeto JSON válido con la siguiente estructura (sin formato markdown previo ni posterior):
{
  "textResponse": "Tu respuesta explicativa completa y didáctica...",
  "card": {
    "mode": "explain",
    "title": "Título del concepto si aplica",
    "analogy": "Analogía cotidiana para comprenderlo con intuición",
    "steps": ["Paso o punto clave 1", "Paso o punto clave 2", "Paso 3"]
  }
}
Si es una respuesta conversacional o cálculo breve, "card" puede ser un objeto "explain" con el resumen o null si no se requiere tarjeta.`;

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 4500)
      );

      const geminiRes = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        }),
        timeoutPromise,
      ]);

      const responseText = geminiRes.text?.trim() || '';
      const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.textResponse || parsed.card) {
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini API call skipped or errored, falling back to integrated knowledge engine:', err);
    }
  }

  // 2. Integrated Semantic Knowledge Engine & Arithmetic Calculator
  if (message && message.trim().length > 0) {
    const rawMsg = message.trim();
    const isExplicitChallenge = mode === 'challenge' || mode === 'test_level' || 
      /\b(reto|desafio|desafío|ejercicio|prueba|test|pregunta de examen)\b/i.test(rawMsg);
    const isExplicitErrorAnalysis = mode === 'analyze_error' || 
      /\b(error|analiza mi error|depuracion|depuración|bug)\b/i.test(rawMsg);

    // A. If user wants a challenge, deliver randomized procedural challenge
    if (isExplicitChallenge) {
      const pool = CHALLENGE_POOLS[conceptId] || CHALLENGE_POOLS.c_regla_cadena;
      const generatorFn = pool[Math.floor(Math.random() * pool.length)] ?? CHALLENGE_POOLS.c_regla_cadena[0];
      const generated = generatorFn() ?? CHALLENGE_POOLS.c_regla_cadena[0]();
      const challengeData = { ...generated };
      if (mode === 'test_level') {
        challengeData.badge = 'DIAGNÓSTICO ADAPTATIVO';
        challengeData.xp = 40;
      }
      return {
        card: {
          mode: 'challenge',
          challenge: challengeData,
        },
        textResponse: '¡Aquí tienes un nuevo reto generado especialmente para ti! Elige la opción correcta para ganar XP.',
      };
    }

    // B. If user wants error analysis, deliver procedural error analysis
    if (isExplicitErrorAnalysis) {
      const errorData = ERROR_ANALYSIS_POOL[Math.floor(Math.random() * ERROR_ANALYSIS_POOL.length)];
      return {
        card: {
          mode: 'analyze_error',
          errorAnalysis: errorData,
        },
        textResponse: 'He preparado un caso real donde muchos estudiantes suelen tropezar. Examina las líneas y detecta el error.',
      };
    }

    // C. Detect arithmetic, percentage, or linear equation calculations
    const mathAnswer = evaluateBasicMath(rawMsg);
    if (mathAnswer) {
      return mathAnswer;
    }

    // D. Search semantic knowledge base for matching educational concepts
    const semanticAnswer = getSemanticAnswer(rawMsg);
    if (semanticAnswer) {
      return semanticAnswer;
    }

    // E. Universal pedagogical answer for any other basic question
    return generateUniversalPedagogicalAnswer(rawMsg, conceptId);
  }

  // 3. Fallback when no message was typed (user clicked a mode tab button)
  if (mode === 'challenge' || mode === 'test_level') {
    const pool = CHALLENGE_POOLS[conceptId] || CHALLENGE_POOLS.c_regla_cadena;
    const generatorFn = pool[Math.floor(Math.random() * pool.length)] ?? CHALLENGE_POOLS.c_regla_cadena[0];
    const generated = generatorFn() ?? CHALLENGE_POOLS.c_regla_cadena[0]();
    const challengeData = { ...generated };
    if (mode === 'test_level') {
      challengeData.badge = 'DIAGNÓSTICO ADAPTATIVO';
      challengeData.xp = 40;
    }
    return {
      card: {
        mode,
        challenge: challengeData,
      },
      textResponse: '¡Aquí tienes un nuevo reto generado especialmente para ti! Elige la opción correcta para ganar XP.',
    };
  }

  if (mode === 'analyze_error') {
    const errorData = ERROR_ANALYSIS_POOL[Math.floor(Math.random() * ERROR_ANALYSIS_POOL.length)];
    return {
      card: {
        mode: 'analyze_error',
        errorAnalysis: errorData,
      },
      textResponse: 'He preparado un caso real donde muchos estudiantes suelen tropezar. Examina las líneas y detecta el error.',
    };
  }

  // Default: Explain
  const expData = EXPLANATION_POOL[Math.floor(Math.random() * EXPLANATION_POOL.length)];
  return {
    card: {
      mode: 'explain',
      title: expData.title,
      analogy: expData.analogy,
      steps: expData.steps,
    },
    textResponse: 'Te explico este concepto con una analogía visual paso a paso para que lo domines con solidez.',
  };
}

/**
 * Dynamic Study Tasks Generator
 */
export function generateAdaptiveTasks(concepts: ConceptMastery[]): StudyTask[] {
  const lowMastery = concepts.filter(c => c.mastery < 70);
  const targetConcept = lowMastery.length > 0 ? lowMastery[0] : concepts[0];
  const conceptName = targetConcept?.name?.es || 'Cálculo';

  const now = Date.now();
  return [
    {
      id: `task_dyn_${now}_1`,
      title: `Práctica Nocturna: 3 ejercicios de ${conceptName}`,
      subject: conceptName,
      priority: 'high',
      completed: false,
      dueDate: 'Hoy · Sesión nocturna',
      xpReward: 65,
      estimatedMinutes: 20,
      isNightTask: true,
      notes: 'Enfocado en reforzar tu precisión conceptual en zonas con dudas recientes.',
    },
    {
      id: `task_dyn_${now}_2`,
      title: 'Reto de Código: Resolver problema con Bucles y Recursión',
      subject: 'Programación',
      priority: 'medium',
      completed: false,
      dueDate: 'Mañana',
      xpReward: 50,
      estimatedMinutes: 25,
      isNightTask: false,
      notes: 'Supera las pruebas automáticas en el laboratorio interactivo.',
    },
    {
      id: `task_dyn_${now}_3`,
      title: 'Diagnóstico Rápido: Comprobación de nivel en Límites',
      subject: 'Límites',
      priority: 'medium',
      completed: false,
      dueDate: 'En 2 días',
      xpReward: 45,
      estimatedMinutes: 15,
      isNightTask: true,
      notes: 'Prueba de 3 preguntas con el Tutor IA Nexo.',
    },
  ];
}
