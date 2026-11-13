/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TutorCardResponse } from './tutorGenerator';

/**
 * Normalizes input text for keyword and semantic matching
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[¿?¡!.,;:()_"-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detects and evaluates basic arithmetic or algebraic calculations
 */
export function evaluateBasicMath(rawQuery: string): { textResponse: string; card?: TutorCardResponse } | null {
  const q = rawQuery.toLowerCase();

  // Pattern: "cuanto es A + B", "25 * 4", "100 / 4", "cuanto es 15 % de 200"
  const percentageMatch = q.match(/(\d+(?:\.\d+)?)\s*%\s*de\s*(\d+(?:\.\d+)?)/i) || 
                          q.match(/cuanto\s+es\s+el\s+(\d+(?:\.\d+)?)\s*%\s*de\s*(\d+(?:\.\d+)?)/i);
  if (percentageMatch) {
    const pct = parseFloat(percentageMatch[1]);
    const total = parseFloat(percentageMatch[2]);
    const result = (pct / 100) * total;
    return {
      textResponse: `El ${pct}% de ${total} es exactamente **${result}**.\n\nPara calcularlo:\n1. Conviertes el porcentaje a decimal dividiendo entre 100: ${pct} / 100 = ${pct / 100}.\n2. Multiplicas por la cantidad base: ${pct / 100} × ${total} = **${result}**.`,
      card: {
        mode: 'explain',
        title: `Cálculo de Porcentaje: ${pct}% de ${total}`,
        analogy: `Piensa en el porcentaje como tomar ${pct} partes de cada 100 unidades que componen ${total}.`,
        steps: [
          `Paso 1: Expresar en fracción: ${pct}/100`,
          `Paso 2: Multiplicar por la base: (${pct}/100) × ${total}`,
          `Resultado final: ${result}`
        ]
      }
    };
  }

  // Linear equation solver: "2x + 4 = 10", "3x - 9 = 0", "5x = 25"
  const eqMatch = q.match(/([+-]?\s*\d*(?:\.\d+)?)\s*x\s*([+-]\s*\d+(?:\.\d+)?)\s*=\s*([+-]?\s*\d+(?:\.\d+)?)/i);
  if (eqMatch) {
    let aStr = eqMatch[1].replace(/\s+/g, '');
    if (aStr === '' || aStr === '+') aStr = '1';
    if (aStr === '-') aStr = '-1';
    const a = parseFloat(aStr);
    const b = parseFloat(eqMatch[2].replace(/\s+/g, ''));
    const c = parseFloat(eqMatch[3].replace(/\s+/g, ''));

    if (a !== 0) {
      const x = (c - b) / a;
      return {
        textResponse: `La solución a la ecuación **${a}x + (${b}) = ${c}** es **x = ${x}**.\n\nPasos de resolución:\n1. Restamos ${b} en ambos lados: ${a}x = ${c} - (${b}) = ${c - b}.\n2. Dividimos entre ${a}: x = ${c - b} / ${a} = **${x}**.\n3. Comprobación: ${a}(${x}) + ${b} = ${a * x + b} ✓`,
        card: {
          mode: 'explain',
          title: `Despeje de Ecuación Lineal: ${a}x + ${b} = ${c}`,
          analogy: 'Una ecuación es como una balanza de dos platillos: cualquier operación que hagas en un lado, debes repetirla en el otro para mantener el equilibrio perfecto.',
          steps: [
            `Aislar el término con x: ${a}x = ${c - b}`,
            `Dividir por el coeficiente ${a}: x = (${c - b}) / ${a}`,
            `Resultado: x = ${x}`
          ]
        }
      };
    }
  }

  // Simple arithmetic operations: "15 * 8", "120 / 6", "45 + 55", "3^4"
  const basicOpMatch = q.match(/(?:cuanto\s+es\s+|calcula\s+|resuelve\s+)?(\d+(?:\.\d+)?)\s*([+\-*x/÷^])\s*(\d+(?:\.\d+)?)/i);
  if (basicOpMatch) {
    const n1 = parseFloat(basicOpMatch[1]);
    const op = basicOpMatch[2];
    const n2 = parseFloat(basicOpMatch[3]);
    let result: number | null = null;
    let opName = '';

    if (op === '+') { result = n1 + n2; opName = 'Suma'; }
    else if (op === '-') { result = n1 - n2; opName = 'Resta'; }
    else if (op === '*' || op.toLowerCase() === 'x') { result = n1 * n2; opName = 'Multiplicación'; }
    else if (op === '/' || op === '÷') {
      if (n2 === 0) {
        return {
          textResponse: `Indeterminación: la división entre cero (${n1} / 0) no está definida en los números reales porque ningún número multiplicado por 0 puede dar ${n1}. En cálculo, si x tiende a 0, el límite diverge hacia el infinito.`,
          card: {
            mode: 'explain',
            title: 'División por Cero',
            analogy: 'Si tienes 10 manzanas y las repartes entre 0 personas, la pregunta de cuántas recibe cada una no tiene sentido matemático.',
            steps: ['Dividir entre números cada vez más pequeños acerca el cociente al infinito', 'Dividir exactamente entre 0 no produce un valor real']
          }
        };
      }
      result = n1 / n2;
      opName = 'División';
    } else if (op === '^') {
      result = Math.pow(n1, n2);
      opName = 'Potenciación';
    }

    if (result !== null) {
      return {
        textResponse: `El resultado de **${n1} ${op} ${n2}** es **${result}**.`,
        card: {
          mode: 'explain',
          title: `Operación: ${opName}`,
          steps: [
            `Término 1: ${n1}`,
            `Operación: ${op}`,
            `Término 2: ${n2}`,
            `Resultado exacto: ${result}`
          ]
        }
      };
    }
  }

  return null;
}

/**
 * Built-in Semantic Knowledge Dictionary
 */
interface KnowledgeItem {
  keywords: string[];
  title: string;
  analogy: string;
  steps: string[];
  text: string;
}

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // 1. Saludos y Presentación
  {
    keywords: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'saludos'],
    title: '¡Hola! Soy Nexo, tu Tutor IA',
    analogy: 'Piensa en mí como tu copiloto de estudio STEM 24/7. Estoy aquí para aclarar tus dudas desde lo más elemental hasta los retos más desafiantes.',
    steps: [
      'Pregúntame cualquier concepto básico de ciencia, matemáticas o programación.',
      'Pídeme un «Reto adaptado» cuando quieras poner a prueba tus habilidades.',
      'Trae tus dudas de tareas o errores para que los analicemos juntos paso a paso.'
    ],
    text: '¡Hola! Es un gusto saludarte. Soy **Nexo**, tu tutor de inteligencia artificial en NEXORA. Estoy listo para ayudarte con cualquier pregunta que tengas: desde dudas conceptuales básicas (física, álgebra, programación, biología) hasta ejercicios prácticos y retos personalizados. ¿Qué te gustaría aprender o resolver hoy?'
  },
  {
    keywords: ['quien eres', 'que eres', 'como te llamas', 'que puedes hacer', 'ayuda', 'para que sirves'],
    title: 'Capacidades de Nexo en NEXORA',
    analogy: 'Un tutor personalizado que adapta su ritmo, explicaciones y dificultad exactamente a lo que necesitas comprender en este momento.',
    steps: [
      'Explicaciones pedagógicas con analogías cotidianas y desglose paso a paso.',
      'Generación infinita de retos y problemas STEM adaptados con retroalimentación.',
      'Análisis y depuración de errores conceptuales y código.',
      'Respuestas a preguntas básicas de matemáticas, ciencias, algoritmos y técnicas de estudio.'
    ],
    text: 'Soy **Nexo**, la inteligencia artificial de aprendizaje de NEXORA. Mi objetivo es acompañarte en tu formación académica para que entiendas el *porqué* detrás de cada fórmula o algoritmo, en lugar de solo memorizar. Puedes preguntarme cualquier duda básica, pedirme retos interactivos, solicitar diagnósticos de nivel o pedirme que analicemos tus errores de estudio.'
  },

  // 2. Ciencias Naturales y Física
  {
    keywords: ['gravedad', 'que es la gravedad', 'ley de gravedad', 'como funciona la gravedad', 'fuerza gravitatoria'],
    title: 'La Gravedad: De Newton a Einstein',
    analogy: 'Imagina una cama elástica donde colocas una bola pesada de boliche: la tela se hunde hacia el centro. Si luego lanzas una pequeña canica, esta no es "atraída mágicamente", sino que rueda siguiendo la curva que la bola pesada causó en la tela.',
    steps: [
      'Visión clásica (Newton): Es una fuerza de atracción mutua entre dos cuerpos con masa: F = G · (m₁ · m₂) / r².',
      'En la Tierra: Provoca una aceleración uniforme hacia el centro del planeta de g ≈ 9.8 m/s².',
      'Visión moderna (Einstein): La masa curva el propio tejido del espacio-tiempo, y los objetos simplemente siguen las trayectorias geodésicas en ese espacio curvado.'
    ],
    text: 'La **gravedad** es la interacción fundamental que hace que los objetos con masa o energía se atraigan entre sí. En nuestra vida cotidiana, es la fuerza responsable de mantenernos con los pies sobre la Tierra, de que la Luna orbite alrededor de nuestro planeta y de que la Tierra gire alrededor del Sol. \n\nIsaac Newton descubrió que la atracción depende directamente de las masas e inversamente del cuadrado de la distancia, mientras que Albert Einstein demostró en su Relatividad General que la gravedad es en realidad la curvatura del espacio-tiempo producida por la masa.'
  },
  {
    keywords: ['fotosintesis', 'que es la fotosintesis', 'como se produce la fotosintesis'],
    title: 'La Fotosíntesis: La Fábrica Solar Biológica',
    analogy: 'Es como una cocina solar de precisión: la planta toma ingredientes del aire y de la tierra (dióxido de carbono y agua) y usa la energía solar como fuego para cocinar su propio alimento (glucosa), liberando oxígeno como un regalo al planeta.',
    steps: [
      'Captura de luz: Los cloroplastos en las hojas contienen clorofila, un pigmento que absorbe los fotones solares.',
      'Fase Luminosa: La energía solar rompe moléculas de agua (H₂O), liberando oxígeno (O₂) a la atmósfera y generando energía química (ATP y NADPH).',
      'Fase Oscura (Ciclo de Calvin): La planta usa esa energía para fijar dióxido de carbono (CO₂) y sintetizar glucosa (C₆H₁₂O₆).',
      'Ecuación global: 6 CO₂ + 6 H₂O + Luz → C₆H₁₂O₆ + 6 O₂.'
    ],
    text: 'La **fotosíntesis** es el proceso bioquímico mediante el cual las plantas, algas y ciertas bacterias transforman la energía luminosa del Sol en energía química almacenada en moléculas de glucosa. Es la base de prácticamente toda la vida en la Tierra, ya que produce el oxígeno que respiramos y fija el carbono fundamental para las cadenas alimenticias.'
  },
  {
    keywords: ['cielo azul', 'por que el cielo es azul', 'color del cielo'],
    title: 'Dispersión de Rayleigh: El Secreto del Cielo Azul',
    analogy: 'Imagina arrojar agua con una manguera contra un enrejado fino: las gotas grandes y pesadas lo atraviesan directo, pero la niebla fina de gotas chiquitas choca y se esparce en todas direcciones. La luz azul es esa niebla fina que rebota contra las moléculas del aire.',
    steps: [
      'La luz del Sol parece blanca, pero en realidad es una mezcla de todos los colores del arcoíris.',
      'Cada color viaja en ondas con distintas longitudes: el rojo tiene ondas largas y amplias; el azul tiene ondas muy cortas y apretadas.',
      'Al entrar a la atmósfera, las ondas cortas (azules y violetas) chocan contra las moléculas de nitrógeno y oxígeno y se dispersan en todas direcciones (Dispersión de Rayleigh).',
      'Nuestros ojos son mucho más sensibles al azul que al violeta, por lo que percibimos el cielo azul brillante.'
    ],
    text: 'El cielo es azul debido a un fenómeno físico llamado **Dispersión de Rayleigh**. La luz blanca del Sol contiene todos los colores del espectro visible. Al atravesar la atmósfera terrestre, la luz de longitud de onda corta (azul) choca contra las moléculas de gas y se dispersa en todas direcciones por toda la bóveda celeste mucho más que los colores de onda larga (rojo y amarillo).'
  },
  {
    keywords: ['leyes de newton', 'newton', 'primera ley de newton', 'segunda ley', 'tercera ley'],
    title: 'Las Tres Leyes del Movimiento de Newton',
    analogy: 'Son las tres reglas universales que gobiernan desde el patear una pelota de fútbol hasta el viaje de una nave espacial en el vacío.',
    steps: [
      '1ª Ley (Inercia): Todo cuerpo permanece en reposo o a velocidad constante en línea recta a menos que una fuerza externa neta actúe sobre él.',
      '2ª Ley (Fuerza fundamental): F = m · a. La aceleración que adquiere un cuerpo es directamente proporcional a la fuerza neta aplicada e inversamente proporcional a su masa.',
      '3ª Ley (Acción y Reacción): Si el cuerpo A ejerce una fuerza sobre el cuerpo B, el cuerpo B ejerce una fuerza de igual magnitud y en sentido contrario sobre el cuerpo A.'
    ],
    text: 'Las **Leyes de Newton** son los tres pilares de la mecánica clásica formulados por Isaac Newton en 1687:\n1. **Ley de Inercia**: Si no empujas un objeto (o si las fuerzas se anulan), no cambiará su estado de movimiento.\n2. **Fuerza y Aceleración (F = m·a)**: Para mover o frenar un objeto con más masa se requiere mayor fuerza.\n3. **Acción y Reacción**: Las fuerzas siempre vienen en pares opuestos (como cuando empujas el borde de una piscina para impulsarte hacia adelante).'
  },
  {
    keywords: ['atomo', 'que es un atomo', 'estructura del atomo'],
    title: 'El Átomo: Ladrillo Fundamental de la Materia',
    analogy: 'Si un átomo tuviera el tamaño de un estadio de fútbol, el núcleo sería una pequeña canica en el centro con casi todo el peso, y los electrones serían mosquitos zumbando en las gradas más altas.',
    steps: [
      'Núcleo central: Contiene protones (carga positiva +) y neutrones (carga neutra 0). Concentra más del 99.9% de la masa.',
      'Nube de electrones: Electrones (carga negativa -) orbitando en niveles de energía cuánticos alrededor del núcleo.',
      'Número atómico (Z): La cantidad de protones define de qué elemento químico se trata (ej: 1 protón = Hidrógeno, 6 protones = Carbono).'
    ],
    text: 'Un **átomo** es la unidad básica y estructural de la materia ordinaria que conserva las propiedades de un elemento químico. Está compuesto por un núcleo central densamente empaquetado con protones y neutrones, rodeado por una nube de electrones en orbitales probabilísticos.'
  },

  // 3. Matemáticas Básicas y Álgebra
  {
    keywords: ['que es una funcion', 'funcion matematica', 'concepto de funcion'],
    title: '¿Qué es una Función Matemática?',
    analogy: 'Una máquina expendedora perfecta: introduces una moneda con un código (entrada x), la máquina procesa la orden, y te entrega exactamente un producto específico (salida f(x)). Nunca puede salirte una lata y una manzana a la vez para el mismo botón.',
    steps: [
      'Dominio: El conjunto de todos los valores posibles de entrada (x) que la máquina puede procesar.',
      'Regla de correspondencia: La fórmula o procedimiento que transforma la entrada (por ejemplo: f(x) = 2x + 1).',
      'Codominio o Rango: El conjunto de valores resultantes (y = f(x)).',
      'Regla de oro: A cada elemento de entrada le corresponde un ÚNICO valor de salida.'
    ],
    text: 'En matemáticas, una **función** es una relación entre dos conjuntos donde a cada elemento del primer conjunto (llamado dominio o valor de entrada $x$) le corresponde exactamente un único elemento del segundo conjunto (llamado rango o valor de salida $f(x)$).\n\nPor ejemplo, si la función es $f(x) = x^2$, cuando introduces $x = 3$, la función te devuelve siempre $9$.'
  },
  {
    keywords: ['que es una variable', 'variable en matematicas', 'variable'],
    title: 'El Concepto de Variable',
    analogy: 'Una caja etiquetada donde puedes guardar cualquier número que aún no conoces o que puede cambiar según la situación.',
    steps: [
      'Variable independiente (x): El valor que tú decides modificar libremente (ej: las horas que estudias).',
      'Variable dependiente (y): El valor que cambia como consecuencia del valor independiente (ej: tu calificación en el examen).',
      'En álgebra: Permite formular leyes universales como Área = base × altura (A = b · h) sin importar las medidas concretas de cada figura.'
    ],
    text: 'Una **variable** es un símbolo (generalmente una letra como $x$, $y$, $z$, $t$) que representa una cantidad que puede tomar diferentes valores numéricos dentro de un conjunto. Nos permite plantear ecuaciones, formular leyes científicas y resolver problemas generalizados.'
  },
  {
    keywords: ['que es pi', 'numero pi', 'valor de pi'],
    title: 'El Número Pi (π ≈ 3.14159...)',
    analogy: 'Toma cualquier círculo del universo: una moneda, la rueda de una bicicleta o el ecuador de un planeta. Si mides su contorno con una cuerda y lo comparas con su ancho pasando por el centro, la cuerda cabe exactamente poco más de 3 veces (3.14159...) sin importar el tamaño del círculo.',
    steps: [
      'Definición geométrica: π = Circunferencia / Diámetro.',
      'Es un número irracional: Tiene infinitos decimales que nunca se repiten en un patrón periódico (3.1415926535...).',
      'Es un número trascendente: No es raíz de ningún polinomio con coeficientes enteros.',
      'Fórmulas indispensables: Perímetro = 2πr | Área = πr² | Volumen esfera = 4/3 πr³.'
    ],
    text: 'El número **Pi (π)** es una constante matemática fundamental que expresa la relación fija entre la longitud de una circunferencia y su diámetro. Su valor aproximado es **3.14159...** y es esencial en trigonometría, física cuántica, ingeniería, ondas y astronomía.'
  },
  {
    keywords: ['teorema de pitagoras', 'pitagoras', 'hipotenusa'],
    title: 'El Teorema de Pitágoras: a² + b² = c²',
    analogy: 'Si construyes tres baldosas cuadradas usando los tres lados de un triángulo rectángulo, la arena que cabe en los dos cuadrados pequeños llena exactamente al ras el cuadrado más grande.',
    steps: [
      'Aplica ÚNICAMENTE a triángulos rectángulos (que tienen un ángulo de 90°).',
      'Catetos (a y b): Los dos lados perpendiculares que forman la esquina de 90°.',
      'Hipotenusa (c): El lado opuesto al ángulo recto, que siempre es el más largo.',
      'Fórmula: c² = a² + b² → c = √(a² + b²).'
    ],
    text: 'El **Teorema de Pitágoras** establece que en todo triángulo rectángulo, el cuadrado de la longitud de la hipotenusa es igual a la suma de los cuadrados de las longitudes de los catetos ($a^2 + b^2 = c^2$). Es una de las relaciones geométricas más utilizadas en navegación, arquitectura y cálculo de distancias euclidianas.'
  },
  {
    keywords: ['numero primo', 'numeros primos', 'que es un numero primo'],
    title: 'Números Primos: Los Átomos de la Aritmética',
    analogy: 'Son como piezas de Lego elementales que no se pueden partir en bloques más chicos. Cualquier otro número (compuesto) se puede armar multiplicando números primos.',
    steps: [
      'Definición: Número entero mayor que 1 que solo tiene dos divisores distintos: el 1 y él mismo.',
      'Los primeros primos son: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...',
      'El número 2 es el ÚNICO número primo par.',
      'El número 1 NO se considera primo por convención matemática fundamental.',
      'Uso en el mundo real: Son la base de la criptografía moderna (como RSA) que protege contraseñas y compras por internet.'
    ],
    text: 'Un **número primo** es un número natural mayor que 1 que no puede formarse multiplicando otros dos números naturales menores; es decir, solo tiene dos divisores exactos: 1 y él mismo. El Teorema Fundamental de la Aritmética afirma que todo número entero mayor que 1 se puede descomponer de forma única como producto de números primos.'
  },

  // 4. Cálculo y STEM
  {
    keywords: ['que es una derivada', 'concepto de derivada', 'para que sirve la derivada', 'derivada'],
    title: '¿Qué es una Derivada? Velocidad Instantánea del Cambio',
    analogy: 'El velocímetro de tu automóvil. No te dice cuántos kilómetros recorriste en total (eso sería una integral), te dice exactamente qué tan rápido está cambiando tu posición en ESTE milisegundo preciso.',
    steps: [
      'Pendiente de la recta secante: Mide el cambio promedio entre dos puntos lejanos: Δy / Δx.',
      'El límite cuando Δx tiende a cero: Acercamos los dos puntos hasta que casi se toquen.',
      'Pendiente de la recta tangente: La derivada f\'(x) es la inclinación de la curva en un solo punto exacto.',
      'Fórmula por definición: f\'(x) = lim (h→0) [f(x + h) - f(x)] / h.'
    ],
    text: 'En cálculo, la **derivada** de una función mide la rapidez con la que cambia el valor de dicha función según cambie el valor de su variable independiente. Geométricamente, representa la pendiente de la recta tangente a la gráfica de la función en un punto dado.\n\nSirve para calcular velocidades instantáneas, optimizar costos en economía, calcular ritmos de crecimiento poblacional y entrenar redes neuronales con descenso de gradiente.'
  },
  {
    keywords: ['que es una integral', 'concepto de integral', 'antiderivada', 'area bajo la curva'],
    title: '¿Qué es una Integral? La Gran Acumulación',
    analogy: 'Imagina llenar una piscina con una llave que gotea a ritmos variables: la integral es el medidor que suma cada gotita infinitesimal a lo largo del tiempo para decirte el volumen total acumulado de agua.',
    steps: [
      'Suma de Riemann: Dividir el área irregular bajo la curva en millones de rectángulos delgados con base dx y altura f(x).',
      'Paso al límite: Al hacer la base dx infinitesimalmente pequeña, la suma se convierte en la integral ∫ f(x) dx.',
      'Teorema Fundamental del Cálculo: Demuestra que la integración y la diferenciación son operaciones inversas (como sumar y restar).',
      'Integral definida: Calcula el área exacta entre dos límites: ∫ [a a b] f(x) dx = F(b) - F(a).'
    ],
    text: 'La **integral** es el concepto matemático que generaliza la suma de infinitos sumandos infinitesimalmente pequeños. Se utiliza fundamentalmente para calcular áreas bajo curvas, volúmenes de sólidos de revolución, longitudes de trayectorias, trabajo físico y centros de masa.'
  },
  {
    keywords: ['regla de la cadena', 'como derivar funciones compuestas'],
    title: 'La Regla de la Cadena: Las Capas de la Cebolla',
    analogy: 'Como pelar una cebolla o abrir una muñeca rusa (matrioshka): primero derivas la capa de afuera dejando intacto el interior, y luego multiplicas por la derivada de lo que estaba adentro.',
    steps: [
      'Identificar la función exterior f(u) y la función interior u = g(x).',
      'Derivar la función exterior respetando su argumento interior: f\'(g(x)).',
      'Derivar la función interior por separado: g\'(x).',
      'Multiplicar ambos resultados: d/dx [f(g(x))] = f\'(g(x)) · g\'(x).'
    ],
    text: 'La **regla de la cadena** es la regla de derivación para funciones compuestas. Si tienes una función dentro de otra, como $f(g(x))$, su derivada es el producto de la derivada exterior evaluada en la interior por la derivada interior: **[f(g(x))]\' = f\'(g(x)) · g\'(x)**.'
  },

  // 5. Programación y Computación
  {
    keywords: ['algoritmo', 'que es un algoritmo', 'definicion de algoritmo'],
    title: '¿Qué es un Algoritmo? Una Receta Computacional',
    analogy: 'Una receta de cocina infalible: una lista numerada de pasos finitos y sin ambigüedades. Si sigues los pasos con los mismos ingredientes, obtienes exactamente el mismo pastel cada vez.',
    steps: [
      'Entrada (Input): Los datos que recibe para procesar (ej: una lista desordenada de nombres).',
      'Proceso: La secuencia lógica y estructurada de operaciones que transforman los datos.',
      'Salida (Output): El resultado esperado (ej: la lista ordenada alfabéticamente).',
      'Propiedades clave: Debe ser finito (debe terminar), preciso (sin ambigüedades) y determinista.'
    ],
    text: 'Un **algoritmo** es un conjunto finito, ordenado y no ambiguo de instrucciones o reglas lógicas que permiten solucionar un problema determinado o realizar una tarea específica. Todo programa de software, motor de búsqueda, sistema de recomendación o modelo de IA es, en su núcleo, una serie de algoritmos.'
  },
  {
    keywords: ['que es un bucle', 'bucle for', 'bucle while', 'loop en programacion', 'bucles'],
    title: 'Estructuras de Repetición: Bucles For y While',
    analogy: 'Como poner una canción en repetición en tu reproductor: puedes ordenarle "repítela 5 veces" (bucle for) o "repítela mientras no le dé a pausa" (bucle while).',
    steps: [
      'Bucle For: Se usa cuando conoces de antemano cuántas veces vas a iterar (ej: recorrer los 10 elementos de una lista).',
      'Bucle While: Se ejecuta de manera continua *mientras* una condición lógica sea verdadera. Es crucial actualizar la condición para no caer en un bucle infinito.',
      'Control de flujo: Comandos como "break" permiten salir de inmediato y "continue" salta a la siguiente iteración.'
    ],
    text: 'En programación, un **bucle** (o *loop*) es una estructura de control que ejecuta repetidamente un bloque de código mientras se cumpla una condición determinada. Los más comunes son el bucle **for** (ideal para rangos o colecciones conocidas) y el bucle **while** (ideal para repeticiones condicionadas a eventos).'
  },
  {
    keywords: ['recursion', 'que es la recursion', 'funcion recursiva'],
    title: 'Recursión: Resolver un Problema Dividiéndolo en Sí Mismo',
    analogy: 'Pararte entre dos espejos paralelos donde ves tu reflejo dentro de tu reflejo hasta el infinito, o abrir una serie de cajas de regalo una dentro de otra hasta encontrar la caja final.',
    steps: [
      'Caso Base: La condición de parada obligatoria que detiene la recursión sin hacer una llamada más (ej: if n <= 1 return 1). Sin él, el programa colapsa por desbordamiento de pila (Stack Overflow).',
      'Caso Recursivo: La función se llama a sí misma reduciendo el tamaño del problema hacia el caso base: factorial(n) = n * factorial(n - 1).',
      'Pila de llamadas (Call Stack): Cada llamada se apila en memoria hasta alcanzar el caso base y luego se resuelven en reversa.'
    ],
    text: 'La **recursión** es una técnica de programación en la que una función se llama a sí misma para resolver instancias más pequeñas del mismo problema. Toda función recursiva bien diseñada debe contar siempre con un **caso base** que detenga las llamadas y evite bucles infinitos.'
  },
  {
    keywords: ['que es una variable en programacion', 'variable de codigo', 'variables en codigo'],
    title: 'Variables en Programación: Contenedores con Etiqueta',
    analogy: 'Una gaveta de tu escritorio con una etiqueta pegada al frente: la etiqueta es el nombre (ej: "edad"), el tipo de gaveta determina qué cabe dentro (números, texto, listas) y el objeto guardado es su valor actual.',
    steps: [
      'Declaración y asignación: Crear el nombre y asignarle un valor inicial (ej: let vidas = 3; en JS o vidas = 3 en Python).',
      'Tipos de datos comunes: Números (enteros y flotantes), Texto (strings), Booleanos (true/false) y Estructuras (arrays, objetos).',
      'Mutabilidad: Su valor puede sobrescribirse o actualizarse durante la ejecución del programa (vidas = vidas - 1).'
    ],
    text: 'En informática, una **variable** es un espacio reservado en la memoria de la computadora al que se le asigna un nombre simbólico (identificador) y que contiene un valor que puede ser modificado durante la ejecución del programa.'
  },

  // 6. Técnicas de Productividad y Estudio
  {
    keywords: ['pomodoro', 'tecnica pomodoro', 'como funciona pomodoro'],
    title: 'La Técnica Pomodoro: Foco Máximo sin Fatiga',
    analogy: 'Como hacer series cortas de alta intensidad en el gimnasio: das el 100% de tu energía durante unos minutos sabiendo que tienes un descanso garantizado en el cronómetro.',
    steps: [
      'Paso 1: Elige una tarea específica a realizar.',
      'Paso 2: Pon un temporizador de 25 minutos y trabaja con cero distracciones (sin teléfono, sin pestañas extra).',
      'Paso 3: Cuando suene la campana, toma un descanso corto de 5 minutos (estírate, toma agua).',
      'Paso 4: Tras completar 4 pomodoros (100 min de trabajo), toma un descanso largo de 15 a 30 minutos.'
    ],
    text: 'La **Técnica Pomodoro** es un método de gestión del tiempo creado por Francesco Cirillo en la década de 1980. Consiste en dividir el trabajo en bloques de 25 minutos de concentración absoluta seguidos de descansos breves de 5 minutos. En NEXORA tienes un temporizador Pomodoro integrado con sonidos binaurales en la sección de Tareas.'
  },
  {
    keywords: ['como estudiar mejor', 'tecnicas de estudio', 'consejos de estudio', 'como memorizar'],
    title: 'Estrategias de Aprendizaje Basadas en Neurociencia',
    analogy: 'Aprender no es pintar una pared pasando una capa pasiva; es construir un músculo: requiere levantar peso (recuperación activa) y descansar para que las fibras se consoliden (práctica espaciada).',
    steps: [
      'Recuperación Activa (Active Recall): En lugar de releer tus notas, cierra el libro e intenta explicar el concepto con tus propias palabras o resolver ejercicios desde cero.',
      'Práctica Espaciada: Revisa el material en intervalos crecientes (día 1, día 3, día 7, día 15) para combatir la curva del olvido.',
      'Técnica Feynman: Si no puedes explicar un concepto a alguien de 10 años en términos sencillos, todavía no lo has comprendido por completo.',
      'Entrelazado: Alterna diferentes tipos de problemas (álgebra y código) en vez de hacer 50 iguales en bloque.'
    ],
    text: 'Para aprender más en menos tiempo, la ciencia cognitiva recomienda abandonar la relectura pasiva y el subrayado excesivo en favor de la **recuperación activa** (ponerse a prueba a uno mismo) y la **repetición espaciada**. Practicar resolviendo retos dinámicos con Nexo y los simuladores de laboratorio estimula exactamente estas conexiones neuronales.'
  }
];

/**
 * Searches the semantic knowledge base for a relevant match
 */
export function getSemanticAnswer(rawQuery: string): { textResponse: string; card?: TutorCardResponse } | null {
  const cleaned = cleanText(rawQuery);

  // Exact or keyword inclusion check
  for (const item of KNOWLEDGE_BASE) {
    const matched = item.keywords.some((kw) => {
      const cleanKw = cleanText(kw);
      return cleaned.includes(cleanKw) || cleanKw.includes(cleaned);
    });

    if (matched) {
      return {
        textResponse: item.text,
        card: {
          mode: 'explain',
          title: item.title,
          analogy: item.analogy,
          steps: item.steps,
        },
      };
    }
  }

  return null;
}

/**
 * Universal pedagogical fallback for any other general or basic question
 */
export function generateUniversalPedagogicalAnswer(rawQuery: string, conceptId?: string): { textResponse: string; card?: TutorCardResponse } {
  const query = rawQuery.trim();
  const cleaned = cleanText(rawQuery);

  // Extract core subject words
  const words = cleaned
    .replace(/\b(que|cual|como|por|que|donde|cuando|quien|es|son|un|una|el|la|los|las|de|en|para|con|me|puedes|explicar|decir|sabes)\b/g, '')
    .trim();
  const topicName = words.length > 2 ? words.charAt(0).toUpperCase() + words.slice(1) : (query || 'Concepto Fundamental');

  return {
    textResponse: `¡Excelente pregunta sobre **"${query}"**!\n\nPara abordar este concepto de manera clara y didáctica:\n\n1. **Definición central**: En ciencia y matemáticas, entender "${topicName}" comienza por identificar los elementos clave que interactúan y la regla fundamental que los gobierna.\n2. **Aplicación práctica**: Este principio se manifiesta en cómo modelamos sistemas dinámicos, procesamos información o predecimos resultados en el mundo real.\n3. **Cómo dominarlo**: La mejor manera de consolidarlo es descomponerlo en casos simples, resolver un ejercicio guiado y luego avanzar a problemas con variables.\n\n¿Te gustaría que profundicemos con un ejemplo numérico, una analogía visual cotidiana o prefieres que te plantee un reto interactivo para comprobar tu comprensión?`,
    card: {
      mode: 'explain',
      title: `Explorando: ${topicName}`,
      analogy: `Entender "${topicName}" es como armar un mecanismo de relojería: cada pieza tiene una función indispensable y al ver cómo encajan los engranajes, todo el movimiento cobra sentido.`,
      steps: [
        `Paso 1: Identificar las variables y datos fundamentales de "${topicName}".`,
        'Paso 2: Aplicar la ley física, teorema matemático o regla lógica correspondiente.',
        'Paso 3: Validar el resultado contrastándolo con el sentido común o casos límite.',
        'Paso 4: Practicar con variaciones para desarrollar intuición sólida.'
      ],
    },
  };
}
