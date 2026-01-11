

import { Question, QuestionType, TextContext } from './types';

// --- TEXTOS BASE (CONTEXTOS DE LECTURA) ---
// Extraídos y consolidados del material PDF para ejercicios de comprensión.
export const EXAM_TEXTS: TextContext[] = [
  {
    id: 1,
    title: "La Escritura en la Universidad",
    content: "En la universidad, escribir no solo sirve para entregar tareas. Es una herramienta para organizar ideas, comprender lecturas complejas y dialogar con autores. Sin embargo, muchos textos fallan porque el estudiante copia frases o reúne información sin propósito. Por eso se requiere seleccionar lo esencial, reformular con precisión e integrar fuentes con ética."
  },
  {
    id: 2,
    title: "Lectura Crítica",
    content: "La lectura crítica exige analizar, interpretar y evaluar información. Implica cuestionar ideas del autor, reconocer supuestos e integrar otras fuentes confiables. No es una lectura pasiva; requiere contrastar la información nueva con saberes previos y otros textos académicos."
  },
  {
    id: 3,
    title: "La Planificación Textual",
    content: "La planificación reduce improvisaciones, mejora la coherencia y organiza argumentos. No es una actividad mecánica, sino un proceso reflexivo de construcción del conocimiento que permite definir la tesis y estructurar las ideas antes de la redacción final."
  },
  {
    id: 4,
    title: "Resumen vs. Copia",
    content: "Para estudiar, muchos copian párrafos completos. Otros subrayan todo. Lo recomendable es distinguir ejemplos de ideas principales. Un ejemplo puede ayudar a entender, pero si no es fundamental para el argumento central, se elimina en el resumen."
  }
];

export const QUESTIONS: Question[] = [
  // ==========================================
  // 1. SÍNTESIS Y RESUMEN
  // ==========================================
  {
    id: 1, category: "Síntesis", instruction: "Análisis de Texto Base", textId: 1, type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Lea el Texto 1 ('La Escritura en la Universidad') y realice lo siguiente: (a) Identifique el tema central, (b) Escriba 3 ideas principales en viñetas y (c) Mencione 2 ideas secundarias.",
    expectedAnswer: "Tema: Función epistémica de la escritura. Ideas: Organizar pensamiento, diálogo con autores, ética en fuentes. Secundarias: entregar tareas, copiar frases."
  },
  {
    id: 2, category: "Síntesis", instruction: "Corrección de Falsa Síntesis", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Texto original: 'La escritura académica permite construir conocimiento porque obliga a organizar ideas, evaluar fuentes y desarrollar pensamiento crítico.' \n\nSíntesis errónea de un estudiante: 'La escritura académica es importante porque ayuda a aprender.' \n\nTarea: Explique 3 problemas de esta síntesis errónea y redacte una versión correcta (1-2 oraciones).",
    expectedAnswer: "Errores: Vaguedad ('importante'), generalización excesiva, omisión de procesos clave (organizar, evaluar). Correcta: La escritura académica genera conocimiento mediante la organización y evaluación crítica de fuentes."
  },
  {
    id: 3, category: "Síntesis", instruction: "Reformulación sin repetición", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Reformula el siguiente texto en una síntesis de máximo 35 palabras, sin repetir la estructura original: 'En el nivel universitario, los estudiantes deben transformar información de textos ajenos para integrarla en nuevos escritos con propósito propio.'",
    expectedAnswer: "Los universitarios deben procesar fuentes externas para crear textos originales con intencionalidad académica definida."
  },
  {
    id: 8, category: "Síntesis", instruction: "Síntesis con Restricción Léxica", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Idea base: 'En la universidad se trabaja con textos ajenos y hay que transformarlos sin plagiar'. \nRedacte una síntesis formal para un informe (25-30 palabras) sin usar las palabras prohibidas: 'universidad', 'textos ajenos', 'plagio'.",
    expectedAnswer: "La producción académica rigurosa exige la reformulación ética de fuentes externas para la generación de nuevo conocimiento."
  },
  {
    id: 11, category: "Resumen", instruction: "Resumen Objetivo", textId: 2, type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Basado en el Texto 2 ('Lectura Crítica'), redacte un resumen de 45-55 palabras. Regla: No use adjetivos valorativos subjetivos (como 'bueno', 'malo', 'interesante', 'excelente').",
    expectedAnswer: "El texto define la lectura crítica como un proceso analítico que supera la decodificación literal. Implica evaluar la información, cuestionar los supuestos del autor y contrastar los datos con otras fuentes confiables."
  },
  {
    id: 15, category: "Resumen", instruction: "Selección de Idea Central", type: QuestionType.MULTIPLE_CHOICE, points: 1,
    questionText: "Texto: 'No se resume leyendo una sola vez; se requiere lectura profunda, distinguir ejemplos de ideas clave y reformular sin copiar la estructura del original.' ¿Cuál es la idea central?",
    options: [
      "A) La lectura es útil para estudiar.",
      "B) El resumen exige lectura analítica, selección esencial y reformulación.",
      "C) Subrayar es la única técnica para resumir.",
      "D) Resumir es reducir palabras rápidamente."
    ],
    correctOptionIndex: 1
  },

  // ==========================================
  // 2. PARÁFRASIS
  // ==========================================
  {
    id: 21, category: "Paráfrasis", instruction: "Corrección de Calco", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Original: 'La planificación del ensayo académico permite organizar ideas, definir tesis y estructurar argumentos con coherencia.' \nParáfrasis del estudiante: 'La planificación del ensayo académico ayuda a organizar ideas, definir tesis y estructurar argumentos.' \n\nTarea: Explique por qué esta paráfrasis es incorrecta y redacte una correcta incluyendo una cita parentética (Autor, 2024).",
    expectedAnswer: "Es plagio por calco (copia estructura y vocabulario). Correcta: El diseño previo de un esquema facilita la jerarquización lógica y la claridad argumentativa del texto (Pérez, 2024)."
  },
  {
    id: 22, category: "Paráfrasis", instruction: "Tipos de Citas", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Parafrasea la siguiente idea: 'La paráfrasis expresa una idea ajena con palabras propias y exige cita.' \n1. Escribe una versión con cita narrativa (basada en el autor).\n2. Escribe una versión con cita parentética (basada en el texto).",
    expectedAnswer: "Narrativa: Según García (2023), reformular ideas ajenas requiere atribución. Parentética: Reescribir conceptos de terceros implica acreditación obligatoria (García, 2023)."
  },
  {
    id: 23, category: "Paráfrasis", instruction: "Detección de Plagio Encubierto", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Original: 'Citar es obligatorio cuando una idea proviene de una lectura, incluso si está reformulada.' \nEstudiante: 'Es obligatorio citar cuando una idea viene de una lectura, aunque esté reformulada.' \n\n¿Existe plagio en el texto del estudiante? Justifique su respuesta.",
    expectedAnswer: "Sí, es plagio mosaico. Solo cambió conectores leves; mantiene la sintaxis y el vocabulario original sin aporte propio."
  },
  {
    id: 25, category: "Paráfrasis", instruction: "Restricción de Vocabulario", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Parafrasea la siguiente idea sin usar las palabras 'importante', 'herramienta' ni 'universidad': \n'La escritura académica contribuye a construir conocimiento y desarrollar pensamiento crítico.'",
    expectedAnswer: "La producción textual en la educación superior es fundamental para generar saberes y fomentar la capacidad analítica."
  },
  {
    id: 113, category: "Paráfrasis", instruction: "Corrección de Paráfrasis Deficiente", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Analice la siguiente transformación:\nOriginal: 'Citar es obligatorio en toda idea ajena.'\nParáfrasis: 'Es obligatorio citar todas las ideas que no son propias.'\n\nIdentifique el problema y proponga una mejora sustancial.",
    expectedAnswer: "Problema: Cambio superficial de sinónimos. Mejora: La atribución de fuentes es un requisito ineludible al utilizar propiedad intelectual de terceros."
  },

  // ==========================================
  // 3. PENSAMIENTO CRÍTICO
  // ==========================================
  {
    id: 31, category: "Texto Crítico", instruction: "De Informativo a Crítico", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Texto informativo base: 'El autor dice que la escritura académica es importante porque ayuda a aprender.' \n\nTarea: Reescríbalo como un texto crítico (8-10 líneas). Debe incluir: (a) Análisis de la afirmación, (b) Evaluación de su validez y (c) Su postura personal fundamentada.",
    expectedAnswer: "El estudiante debe trascender la repetición. Ejemplo: Si bien el autor vincula escritura y aprendizaje, esta relación no es automática; requiere estrategias metacognitivas..."
  },
  {
    id: 32, category: "Texto Crítico", instruction: "Formalización de Opinión", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Convierta estas opiniones informales en posturas académicas fundamentadas:\na) 'A mí no me gusta citar porque quita tiempo.'\nb) 'Los ensayos son difíciles y por eso deberían eliminarse.'",
    expectedAnswer: "a) Aunque la citación requiere inversión temporal, garantiza la integridad académica. b) La complejidad del ensayo justifica su uso como herramienta para evaluar competencias superiores."
  },
  {
    id: 33, category: "Texto Crítico", instruction: "Identificar Operaciones Cognitivas", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Lea el siguiente párrafo y etiquete cada oración según la operación que realiza (Analizar, Evaluar, Relacionar, Tomar postura):\n'Primero, el autor sostiene que escribir organiza ideas. Esta afirmación es coherente porque la escritura obliga a jerarquizar conceptos. Además, coincide con enfoques cognitivos. Por ello, se concluye que su enseñanza debe fortalecerse.'",
    expectedAnswer: "1. Analizar (identificar tesis). 2. Evaluar (juzgar coherencia). 3. Relacionar (conectar con otros enfoques). 4. Tomar postura (conclusión)."
  },
  {
    id: 152, category: "Pensamiento Crítico", instruction: "Detección de Generalización", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Analice esta afirmación de un estudiante: 'La escritura académica es fundamental para todo.' \na) Explique por qué es académicamente inaceptable. \nb) Redacte una versión delimitada y precisa.",
    expectedAnswer: "a) Es una generalización absoluta e imprecisa ('para todo'). b) La escritura académica es fundamental para el desarrollo de competencias investigativas y la comunicación científica."
  },

  // ==========================================
  // 4. ENSAYO Y ARGUMENTACIÓN
  // ==========================================
  {
    id: 41, category: "Ensayo", instruction: "Identificación de Tesis", type: QuestionType.MULTIPLE_CHOICE, points: 1,
    questionText: "Seleccione cuál de las siguientes opciones constituye una tesis defendible para un ensayo argumentativo:",
    options: [
      "A) La escritura académica.",
      "B) ¿Es importante escribir en la universidad?",
      "C) La escritura académica fortalece el pensamiento crítico al exigir análisis y fundamentación.",
      "D) Yo creo que escribir es útil."
    ],
    correctOptionIndex: 2
  },
  {
    id: 42, category: "Ensayo", instruction: "Reparación de Tesis Vaga", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Tesis original: 'La escritura académica es muy importante en la sociedad actual.' \nTarea: Conviértala en una tesis clara, específica y defendible. Luego, proponga 3 argumentos breves que la sustenten.",
    expectedAnswer: "Tesis: La escritura académica democratiza el acceso al conocimiento. Argumentos: 1. Validez científica. 2. Pensamiento crítico. 3. Ética intelectual."
  },
  {
    id: 44, category: "Ensayo", instruction: "Estructura de Párrafo", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Redacte un párrafo argumentativo sobre la idea: 'Planificar reduce la improvisación'. \nDebe contener obligatoriamente estos 4 elementos: \n1) Oración temática. \n2) Explicación. \n3) Fundamentación (use una cita ficticia). \n4) Cierre que conecte con la tesis global.",
    expectedAnswer: "Debe seguir la estructura lógica: Afirmación -> Razonamiento -> Evidencia (Autor, Año) -> Conclusión parcial."
  },
  {
    id: 67, category: "Ensayo", instruction: "Elaboración de Esquema", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Tema: 'El texto crítico en la universidad'. \nElabore un esquema de planificación que incluya: Introducción (con tesis), 3 Argumentos (idea principal + tipo de evidencia para cada uno) y Conclusión.",
    expectedAnswer: "Esquema jerarquizado que demuestre orden lógico: Tesis clara, argumentos distintos (autoridad, ejemplo, causalidad) y síntesis final."
  },

  // ==========================================
  // 5. NORMAS APA
  // ==========================================
  {
    id: 51, category: "Normas APA", instruction: "Necesidad de Cita", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Lea el fragmento: 'La escritura académica desarrolla el pensamiento crítico porque exige organizar ideas y evaluar información.' \n¿Esta idea requiere cita? ¿Qué tipo de cita usaría (narrativa o parentética) y por qué?",
    expectedAnswer: "Sí, requiere cita si la idea no es original del estudiante. Parentética para dar énfasis al concepto; Narrativa para resaltar al autor."
  },
  {
    id: 55, category: "Normas APA", instruction: "Corrección de Cita Textual", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "El siguiente uso de cita textual tiene errores de formato APA: \n'La escritura académica contribuye al desarrollo del pensamiento crítico del estudiante' (Pérez, 2021). \n\nIdentifique 2 errores y reescriba la cita correctamente.",
    expectedAnswer: "Errores: Faltan comillas de apertura/cierre y el número de página (p. xx). Correcto: 'La escritura...' (Pérez, 2021, p. 45)."
  },
  {
    id: 59, category: "Normas APA", instruction: "Formato de Referencia", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Corrija la siguiente referencia bibliográfica según Normas APA (7.ª ed.), asumiendo que es un libro:\n'Pérez, Juan. Escritura académica y pensamiento crítico. 2021.'",
    expectedAnswer: "Pérez, J. (2021). Escritura académica y pensamiento crítico. Editorial."
  },
  {
    id: 60, category: "Normas APA", instruction: "Coherencia Cita-Referencia", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Situación: En el cuerpo del texto aparece la cita (García, 2019), pero en la lista de referencias final NO aparece la entrada de García. \nExplique por qué esto es un error académico grave.",
    expectedAnswer: "Rompe la trazabilidad, impide la verificación de fuentes y puede considerarse una referencia falsa o plagio."
  },

  // ==========================================
  // 6. REDACCIÓN ADMINISTRATIVA
  // ==========================================
  {
    id: 71, category: "Redacción Administrativa", instruction: "Distinción de Registros", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Clasifique cada fragmento como 'Académico' o 'Administrativo' y justifique brevemente:\na) 'Se informa que el plazo vence el 15 de junio.'\nb) 'La escritura académica contribuye a la construcción del conocimiento.'",
    expectedAnswer: "a) Administrativo (informativo, impersonal, gestión). b) Académico (teórico, conceptual, analítico)."
  },
  {
    id: 76, category: "Redacción Administrativa", instruction: "Tipo de Documento", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Indica si el siguiente texto corresponde a un Oficio, Memorando, Solicitud o Informe:\n'Se informa a todo el personal que la entrega de actas se realizará impostergablemente hasta el día 20.'",
    expectedAnswer: "Memorando (comunicación interna) o Circular."
  },
  {
    id: 78, category: "Redacción Administrativa", instruction: "Redacción de Memorando", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Redacte un memorando completo (máx. 10 líneas) dirigido a estudiantes para informar un cambio de fecha de evaluación. Cuide la estructura (Para, De, Asunto, Fecha).",
    expectedAnswer: "Estructura obligatoria: Encabezado completo. Cuerpo: Saludo formal, información precisa del cambio, justificación breve, despedida."
  },
  {
    id: 79, category: "Redacción Administrativa", instruction: "Solicitud Formal", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Redacte una solicitud formal dirigida a un decano para pedir prórroga en la entrega de un trabajo, utilizando el registro adecuado y la estructura correcta.",
    expectedAnswer: "Debe incluir: Sumilla, destinatario (cargo), cuerpo expositivo (causa) y petitorio (solicitud), lugar, fecha y firma."
  },
  {
    id: 185, category: "Redacción Administrativa", instruction: "Corrección de Tono", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Corrija el tono del siguiente texto administrativo para que sea formal y profesional:\n'Esperamos que ahora sí entreguen el trabajo a tiempo.'",
    expectedAnswer: "Se solicita remitir los trabajos dentro del plazo establecido."
  },

  // ==========================================
  // 7. INTEGRACIÓN Y REVISIÓN
  // ==========================================
  {
    id: 86, category: "Revisión", instruction: "Corrección Global", type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Identifique y corrija los errores en el siguiente texto (busque repeticiones, registro informal y mal uso de citas):\n'La escritura es importante y ayuda a aprender. García dice que es importante. Yo creo que es fundamental.'",
    expectedAnswer: "Errores: Repetición léxica ('importante'), registro coloquial ('dice que', 'yo creo'), falta de precisión. Correcto: Según García (2020), la escritura es fundamental para el aprendizaje significativo..."
  },
  {
    id: 99, category: "Lógica", instruction: "Detección de Incoherencia", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Explique por qué el siguiente esquema no es coherente:\nTesis: 'La planificación es esencial para el texto académico'.\nDesarrollo: Párrafos dedicados exclusivamente a explicar el formato de márgenes APA.",
    expectedAnswer: "Falta de unidad temática (digresión). El desarrollo no sustenta la tesis propuesta; confunde planificación textual con formato editorial."
  },
  {
    id: 101, category: "Síntesis", instruction: "Síntesis Multinivel", textId: 1, type: QuestionType.OPEN_TEXT, points: 2,
    questionText: "Basado en el Texto 1 ('La Escritura en la Universidad'), redacte dos productos distintos:\na) Una síntesis de 40-50 palabras para un informe.\nb) Una síntesis comprimida de 12 palabras para un título explicativo.",
    expectedAnswer: "a) La escritura universitaria trasciende la evaluación; es una competencia epistémica que requiere procesar fuentes y reformularlas éticamente. b) La escritura universitaria como herramienta de construcción de conocimiento y ética."
  },
  {
    id: 146, category: "Reformulación", instruction: "Reformulación Abstracta", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Reformula completamente esta idea elevando el registro académico:\n'Escribir bien en la universidad requiere técnica y ética.'",
    expectedAnswer: "La excelencia en la producción discursiva académica está supeditada al dominio técnico y al rigor ético."
  },
  {
    id: 199, category: "Lógica", instruction: "Diagnóstico de Coherencia", type: QuestionType.OPEN_TEXT, points: 1,
    questionText: "Evalúe la coherencia de un trabajo que presenta:\nTesis: Sobre la importancia del Ensayo Argumentativo.\nDesarrollo: Ejemplos y análisis de Memorandos y Oficios.",
    expectedAnswer: "Incoherencia total de género discursivo. El desarrollo (administrativo) contradice el objeto de estudio de la tesis (académico)."
  }
];

export const TOTAL_QUESTIONS_TO_SHOW = 13;
