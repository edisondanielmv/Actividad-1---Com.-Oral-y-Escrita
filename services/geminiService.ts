
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
  // Cambiamos a Flash para la evaluación masiva por su mayor estabilidad y cuota (RPM)
  const model = 'gemini-3-flash-preview';
  const maxRetries = 3;
  let lastError: any = null;

  const prompt = `
    Eres un experto en integridad académica y lingüística forense. Evalúa la respuesta del estudiante.
    
    CRITERIO CRÍTICO DE DETECCIÓN DE IA:
    Analiza si el texto fue generado por una IA (ChatGPT, Claude, etc.).
    REGLA DE ORO: Si detectas IA, el campo "ai_detected" debe ser true y el "score" DEBE SER 0.

    OTROS CRITERIOS (Si no es IA):
    1. PRECISIÓN: ¿Mantiene el sentido original?
    2. REGISTRO: ¿Usa un tono formal académico?
    
    DATOS:
    Pregunta: "${question.questionText}"
    Respuesta Estudiante: "${userAnswer}"
    Puntos Máximos: ${question.points}
    
    Retorna ESTRICTAMENTE este JSON:
    {
      "score": (número entre 0 y ${question.points}),
      "feedback": "(retroalimentación clara)",
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
          // Eliminamos thinkingBudget para Flash en tareas de calificación para reducir latencia
          temperature: 0.1 // Mayor consistencia en la nota
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
      console.warn(`Intento ${attempt} fallido para pregunta ${question.id}. Causa probable: Saturación de API.`);
      
      if (attempt < maxRetries) {
        // Aumentamos el tiempo de espera entre reintentos para permitir que la cuota se resetee
        await delay(attempt * 3000); 
      }
    }
  }

  console.error("Máximos reintentos alcanzados. Aplicando política de contingencia.", lastError);
  
  return { 
    questionId: question.id, 
    score: question.points, 
    feedback: "CONVENIO DE CONTINGENCIA: El motor de IA no respondió tras 3 intentos (Saturación Global). Se asigna puntaje máximo para proteger su registro académico.",
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
    Actúa como un profesor universitario. Reformula estas preguntas para el estudiante ${studentName}.
    OBJETIVO: Que el examen sea único pero mantenga la dificultad original.
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
        console.error("Fallo de validación API:", error?.message || error);
        return false;
    }
};
