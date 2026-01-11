
import { GoogleGenAI } from "@google/genai";
import { Question, AIAnalysis, TextContext } from '../types';

const getClient = (customKey?: string) => {
    const key = customKey || process.env.API_KEY || '';
    return new GoogleGenAI({ apiKey: key });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const cleanJsonString = (str: string) => {
  if (!str) return '[]';
  let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  let start = -1; let end = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      start = firstBrace; end = clean.lastIndexOf('}');
  } else if (firstBracket !== -1) {
      start = firstBracket; end = clean.lastIndexOf(']');
  }
  return (start !== -1 && end !== -1) ? clean.substring(start, end + 1) : clean;
};

export const evaluateOpenAnswer = async (
  question: Question, 
  userAnswer: string,
  contextText?: TextContext,
  userApiKey?: string
): Promise<AIAnalysis> => {
  // Usamos Flash para evaluación rápida y eficiente
  const model = 'gemini-3-flash-preview';
  const maxRetries = 3;
  let lastError: any = null;

  // DETECCION DE TIPO DE PREGUNTA:
  // Si la pregunta es sobre CITAS o NORMAS APA, el formato es rígido y robótico por naturaleza.
  // En estos casos, DESACTIVAMOS la detección de "Sintaxis Sintética" para evitar falsos positivos.
  const isCitationTask = 
      question.category === 'Normas APA' || 
      question.questionText.toLowerCase().includes('cita') || 
      question.questionText.toLowerCase().includes('referencia') ||
      question.questionText.toLowerCase().includes('bibliografía');

  let detectionInstructions = '';

  if (isCitationTask) {
    detectionInstructions = `
    --- MODO TÉCNICO (EXCEPCIÓN DE FORMATO) ---
    ESTA PREGUNTA REQUIERE UN FORMATO RÍGIDO (CITAS/REFERENCIAS APA).
    NO REALICES DETECCIÓN DE "SINTAXIS SINTÉTICA" NI "IA".
    1. Establece "ai_detected": false OBLIGATORIAMENTE (a menos que el texto sea incoherente o spam).
    2. Evalúa EXCLUSIVAMENTE la precisión técnica del formato (puntuación, paréntesis, cursivas, orden).
    3. Si el formato APA es correcto, otorga el puntaje completo. No busques "voz humana" en una cita bibliográfica.
    `;
  } else {
    detectionInstructions = `
    --- TAREA DE DETECCIÓN DE IA (ANÁLISIS FORENSE) ---
    Debes determinar si esta respuesta fue escrita por un humano o generada por una IA (ChatGPT, etc.).
    
    PATRONES DE "SINTAXIS SINTÉTICA" (MARCAR COMO IA):
    1. **Perfección Aséptica**: Gramática y puntuación 100% perfectas y robóticas.
    2. **Estructura de 'Sandwich' Rígida**: Introducción genérica + Puntos clave perfectos + Conclusión moralizante.
    3. **Generalización Enciclopédica**: Suena a Wikipedia, sin la "voz" o duda natural de un estudiante.
    4. **Conectores de Transición Excesivos**: Uso mecánico de "Por otro lado", "Asimismo", "En conclusión".
    
    PATRONES HUMANOS (NO PENALIZAR):
    1. Errores menores de tipeo.
    2. Frases excesivamente largas o cortas (ritmo irregular).
    3. Uso de muletillas.

    --- REGLA DE DECISIÓN ---
    - Si la respuesta es **demasiado perfecta, genérica y sin alma**: ai_detected = true.
    - Si la respuesta tiene **imperfecciones, voz propia o especificidad**: ai_detected = false.
    `;
  }

  const prompt = `
    Actúa como un profesor experto en evaluación académica.
    
    --- CONTEXTO ---
    CATEGORÍA: ${question.category}
    PREGUNTA: "${question.questionText}"
    RESPUESTA DEL ESTUDIANTE: "${userAnswer}"
    VALOR MÁXIMO: ${question.points} puntos.
    RESPUESTA ESPERADA (GUÍA): "${question.expectedAnswer || 'N/A'}"
    
    ${detectionInstructions}

    --- EVALUACIÓN ACADÉMICA ---
    Si ai_detected es false: Califica de 0 a ${question.points} con decimales si es necesario.
    Si ai_detected es true: Score es 0 automáticamente.

    Retorna ESTRICTAMENTE este JSON:
    {
      "score": (número decimal),
      "feedback": "(Feedback breve y directo para el estudiante)",
      "ai_detected": (boolean)
    }
  `;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const ai = getClient(userApiKey);
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          temperature: 0.0 // Temperatura 0 para máximo rigor analítico
        }
      });
      
      const text = response.text || '{}';
      const result = JSON.parse(cleanJsonString(text));
      
      return {
        questionId: question.id,
        score: result.ai_detected ? 0 : result.score,
        feedback: result.feedback,
        aiDetected: result.ai_detected
      };
    } catch (error) {
      lastError = error;
      console.warn(`Intento ${attempt} fallido para pregunta ${question.id}.`);
      
      if (attempt < maxRetries) {
        await delay(attempt * 2500); 
      }
    }
  }

  console.error("Máximos reintentos alcanzados.", lastError);
  
  return { 
    questionId: question.id, 
    score: question.points, 
    feedback: "El sistema de calificación automática no está disponible en este momento.",
    aiDetected: false
  };
};

export const reformulateExam = async (
  questions: Question[], 
  studentName: string,
  userApiKey?: string
): Promise<Question[]> => {
  const model = 'gemini-3-flash-preview';
  const maxRetries = 2;

  const prompt = `
    Actúa como un profesor. Personaliza ligeramente estas preguntas para el estudiante ${studentName}.
    MANTÉN la dificultad, el sentido original Y SOBRE TODO LA CATEGORÍA EXACTA.
    Solo varía levemente la redacción para evitar copia.
    Preguntas: ${JSON.stringify(questions)}
  `;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const ai = getClient(userApiKey);
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '[]';
      const reformulated = JSON.parse(cleanJsonString(text));
      if (reformulated.length === questions.length) return reformulated;
    } catch (error) {
      if (attempt < maxRetries) await delay(2000);
    }
  }
  return questions;
};

export const checkSystemAvailability = async (userApiKey?: string): Promise<boolean> => {
    if (!userApiKey && !process.env.API_KEY) return false;
    
    const ai = getClient(userApiKey);
    try {
        await ai.models.generateContent({ 
          model: "gemini-3-flash-preview", 
          contents: "Ping" 
        });
        return true;
    } catch (error: any) {
        console.error("API Check Failed:", error?.message || error);
        return false;
    }
};
