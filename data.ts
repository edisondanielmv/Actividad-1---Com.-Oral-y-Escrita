import { Question, QuestionType, TextContext } from './types';

export const EXAM_TEXTS: TextContext[] = [
  {
    id: 1,
    title: "Fragmento sobre Escritura Universitaria",
    content: "En la universidad, escribir no solo sirve para entregar tareas. Es una herramienta para organizar ideas, comprender lecturas complejas y dialogar con autores. Sin embargo, muchos textos fallan porque el estudiante copia frases o reúne información sin propósito. Por eso se requiere seleccionar lo esencial, reformular con precisión e integrar fuentes con ética."
  },
  {
    id: 2,
    title: "Texto sobre Lectura Crítica",
    content: "La lectura crítica exige analizar, interpretar y evaluar información. Implica cuestionar ideas del autor, reconocer supuestos e integrar otras fuentes confiables. No se resume leyendo una sola vez; se requiere lectura profunda, distinguir ejemplos de ideas clave y reformular sin copiar la estructura del original."
  },
  {
    id: 3,
    title: "Escritura Académica y Pensamiento Crítico",
    content: "La escritura académica construye conocimiento y fortalece pensamiento crítico mediante organización, análisis y evaluación de fuentes. La planificación reduce improvisaciones, mejora la coherencia y organiza argumentos. No es una actividad mecánica, sino un proceso reflexivo de construcción del conocimiento."
  }
];

export const QUESTIONS: Question[] = [
  // --- A. SÍNTESIS TEXTUAL (Págs 1-5) ---
  {
    id: 1, category: "Síntesis", instruction: "Selección de ideas clave", textId: 1, type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Escriba: (a) el tema central del fragmento, (b) 3 ideas principales en viñetas y (c) 2 ideas secundarias.",
    expectedAnswer: "Tema: Funciones de la escritura. Principales: organización, diálogo, ética. Secundarias: entrega de tareas, falla por copia."
  },
  {
    id: 2, category: "Síntesis", instruction: "Corrección de falsa síntesis", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Texto base: 'La escritura académica construye conocimiento'. Falsa síntesis: 'Escribir ayuda a aprender'. Explique 3 problemas de esta falsa síntesis y redacte una correcta.",
    expectedAnswer: "Problemas: vaguedad, omisión de 'construir conocimiento', falta de rigor. Correcta: El ejercicio de redacción académica es un proceso reflexivo que genera saberes."
  },
  {
    id: 3, category: "Síntesis", instruction: "Reformulación (máx 35 palabras)", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Reformula sin repetir estructuras: 'En el nivel universitario, los estudiantes deben transformar información de textos ajenos para integrarla en nuevos escritos con propósito propio'.",
    expectedAnswer: "Síntesis original que mencione transformación de fuentes con voz propia."
  },
  {
    id: 4, category: "Síntesis", instruction: "Integración de fuentes", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Integra: Fuente A: 'Resumir selecciona ideas sin opinar'. Fuente B: 'Parafrasear reformula y cita'. Redacta un párrafo (5-7 líneas) con cita parentética ficticia (AutorA, 2020; AutorB, 2021).",
    expectedAnswer: "Párrafo académico con ambas ideas y citación múltiple correcta."
  },
  {
    id: 5, category: "Síntesis", instruction: "Reorganización lógica", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Reordena y justifica en 3 líneas: (1) Integración, (2) Lectura analítica, (3) Selección de ideas, (4) Reformulación.",
    expectedAnswer: "Orden: 2, 3, 4, 1. Justificación: el proceso va desde la comprensión hasta la producción."
  },

  // --- B. RESUMEN ACADÉMICO (Págs 6-10) ---
  {
    id: 11, category: "Resumen", instruction: "Objetividad académica", textId: 2, type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Redacta un resumen de 45-55 palabras sobre el Texto 2. Prohibido usar adjetivos valorativos (bueno, malo, interesante).",
    expectedAnswer: "Resumen neutro centrado en procesos de análisis y evaluación."
  },
  {
    id: 12, category: "Resumen", instruction: "Eliminación de opiniones", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Estudiante escribió: 'El texto enseña cosas valiosas sobre lectura que todos deberían aplicar'. Identifique 3 partes no académicas y reescríbalo correctamente.",
    expectedAnswer: "Eliminar: 'enseña cosas valiosas', 'todos deberían'. Reescribir con registro formal."
  },
  {
    id: 13, category: "Resumen", instruction: "Resumen en una oración", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Lee el Texto 2 una vez y escribe un resumen de exactamente 1 oración que conserve el sentido esencial.",
    expectedAnswer: "Oración única y densa informativamente."
  },
  {
    id: 15, category: "Resumen", instruction: "Identificar idea central", type: QuestionType.MULTIPLE_CHOICE, points: 1,
    questionText: "Texto: 'No se resume leyendo una vez; se requiere lectura profunda y reformular'. ¿Cuál es la idea central?",
    options: ["Leer es útil.", "El resumen exige lectura analítica, selección y reformulación.", "Subrayar es lo único.", "Resumir es reducir palabras."],
    correctOptionIndex: 1
  },

  // --- C. PARÁFRASIS ACADÉMICA (Págs 11-15) ---
  {
    id: 21, category: "Paráfrasis", instruction: "Mejora de paráfrasis", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Original: 'La planificación permite organizar ideas'. Estudiante: 'La planificación ayuda a organizar ideas'. ¿Por qué es incorrecta? Redacte una versión correcta + cita ficticia.",
    expectedAnswer: "Es incorrecta por ser calco sintáctico. Correcta: El diseño previo del escrito favorece la articulación coherente (Pérez, 2023)."
  },
  {
    id: 22, category: "Paráfrasis", instruction: "Cita narrativa vs Parentética", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Parafrasee: 'La paráfrasis expresa una idea ajena con palabras propias'. Escriba una oración con cita narrativa y otra con parentética.",
    expectedAnswer: "Narrativa: Autor (año) dice... Parentética: (...) (Autor, año)."
  },
  {
    id: 23, category: "Paráfrasis", instruction: "Restricción de vocabulario", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Parafrasee sin usar: 'importante', 'herramienta', 'universidad'. Idea: 'La escritura académica contribuye a construir conocimiento'.",
    expectedAnswer: "Uso de sinónimos: recurso, academia, esencial, fundamental."
  },

  // --- D. TEXTO CRÍTICO (Págs 16-20) ---
  {
    id: 31, category: "Texto Crítico", instruction: "Análisis y evaluación", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Convierta este texto informativo en crítico (8-10 líneas): 'El autor dice que escribir ayuda a aprender'. Incluya análisis, evaluación y postura.",
    expectedAnswer: "Debe evaluar la validez de la afirmación y proponer una visión argumentada."
  },
  {
    id: 32, category: "Texto Crítico", instruction: "Postura fundamentada", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Convierta esta opinión en postura académica: 'A mí no me gusta citar porque quita tiempo'.",
    expectedAnswer: "Debe referirse a la ética y la propiedad intelectual en lugar de gustos personales."
  },
  {
    id: 35, category: "Texto Crítico", instruction: "Detección de solo resumen", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Determine si este texto es crítico o informativo y reescríbalo para que sea crítico: 'El texto explica que citar evita el plagio'.",
    expectedAnswer: "Es informativo. Debe añadir evaluación: 'Si bien el texto explica... se ignora que la citación también...'."
  },

  // --- E. ENSAYO ACADÉMICO (Págs 21-25) ---
  {
    id: 41, category: "Ensayo", instruction: "Tesis defendible", type: QuestionType.MULTIPLE_CHOICE, points: 1,
    questionText: "¿Cuál es una tesis académicamente defendible?",
    options: ["La escritura académica.", "¿Es importante escribir?", "La escritura académica fortalece el pensamiento crítico al exigir análisis.", "Yo creo que escribir es útil."],
    correctOptionIndex: 2
  },
  {
    id: 42, category: "Ensayo", instruction: "Reparación de tesis vaga", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Tesis del estudiante: 'Escribir es muy importante hoy'. Conviértala en una tesis clara y proponga 3 argumentos.",
    expectedAnswer: "Tesis: La redacción académica es el pilar de la formación científica. Argumentos: rigor, ética, análisis."
  },
  {
    id: 44, category: "Ensayo", instruction: "Párrafo argumentativo (4 elementos)", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Redacta un párrafo sobre: 'Planificar reduce improvisación'. Debe tener: (1) oración temática, (2) explicación, (3) fundamentación, (4) cierre.",
    expectedAnswer: "Párrafo con estructura completa."
  },

  // --- F. NORMAS APA (Págs 26-29) ---
  {
    id: 51, category: "Normas APA", instruction: "Necesidad de cita", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Indique qué ideas requieren cita en: 'La escritura desarrolla el pensamiento crítico porque exige organizar ideas. Además permite construir conocimiento'.",
    expectedAnswer: "Ambas ideas son proposiciones teóricas que requieren sustento bibliográfico."
  },
  {
    id: 55, category: "Normas APA", instruction: "Corrección de cita corta", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Identifique 2 errores en: 'La escritura contribuye al desarrollo' (Pérez, 2021). Reescriba correctamente.",
    expectedAnswer: "Errores: falta de comillas y número de página. Correcta: '...' (Pérez, 2021, p. 5)."
  },
  {
    id: 58, category: "Normas APA", instruction: "Citación múltiples autores", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Redacta una oración que integre 3 autores que coinciden en una idea. Usa el formato con et al. si corresponde.",
    expectedAnswer: "Coincidencia de fuentes (Autor1, 2020; Autor2 et al., 2021; Autor3, 2022)."
  },

  // --- G. REDACCIÓN ADMINISTRATIVA ---
  {
    id: 71, category: "Redacción Administrativa", instruction: "Identificación de tipo de texto", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Clasifica y justifica: 'Se informa que el plazo vence el 15 de junio'.",
    expectedAnswer: "Administrativo/Informativo. Justificación: tono directo, impersonal, propósito de gestión."
  },
  {
    id: 78, category: "Redacción Administrativa", instruction: "Redacción de memorando", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Redacta un memorando completo (máx 10 líneas) para informar un cambio de fecha de evaluación.",
    expectedAnswer: "Estructura: PARA, DE, ASUNTO, FECHA y cuerpo con registro adecuado."
  },
  {
    id: 84, category: "Redacción Administrativa", instruction: "Identificación de plagio", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Original: 'Citar permite reconocer la autoría intelectual'. Alumno: 'Citar permite reconocer la autoría intelectual (Autor, 2020)'. ¿Hay plagio? Justifica.",
    expectedAnswer: "Sí, falta de comillas. Aunque citó al autor, copió textualmente sin el formato de cita textual."
  }
];

export const TOTAL_QUESTIONS_TO_SHOW = 20;
