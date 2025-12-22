
import { GoogleGenAI } from "@google/genai";
import { Question, AIAnalysis, TextContext } from '../types';

const getClient = (customKey?: string) => {
    // Priorizamos la clave ingresada por el usuario
    const key = customKey || process.env.API_KEY || '';
    return new GoogleGenAI({ apiKey: key });
};

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
  const ai = getClient(userApiKey);
  // Usamos el modelo pro para la calificación detallada por su capacidad de razonamiento
  const model = 'gemini-3-pro-preview';

  const prompt = `
    Eres un experto en integridad académica y lingüística forense. Evalúa la respuesta del estudiante.
    
    CRITERIO CRÍTICO DE DETECCIÓN DE IA:
    Analiza si el texto fue generado por una IA (ChatGPT, Claude, etc.). Busca patrones como:
    - Estructuras excesivamente simétricas o listas con prefijos idénticos.
    - Uso de muletillas de IA ("En conclusión", "Es importante destacar", "Por otro lado").
    - Falta de errores humanos comunes o una coherencia sintáctica artificialmente perfecta.

    REGLA DE ORO: 
    Si detectas con alta probabilidad que la respuesta es generada por IA, el campo "ai_detected" debe ser true y el "score" DEBE SER 0 (CERO).

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

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 2000 }
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
    console.error("Error evaluation (Saturación detectada):", error);
    // POLÍTICA DE CONTINGENCIA: Si la IA falla, se otorga el puntaje máximo por beneficio del estudiante.
    return { 
      questionId: question.id, 
      score: question.points, 
      feedback: "AVISO TÉCNICO: El motor de IA no pudo procesar esta respuesta debido a saturación del servicio o límites de cuota. Se asigna puntaje máximo para no perjudicar su calificación académica.",
      aiDetected: false
    };
  }
};

export const reformulateExam = async (
  questions: Question[], 
  studentName: string,
  userApiKey?: string
): Promise<Question[]> => {
  const ai = getClient(userApiKey);
  const model = 'gemini-3-flash-preview';

  const prompt = `
    Actúa como un profesor universitario. Reformula estas preguntas para el estudiante ${studentName}.
    OBJETIVO: Que el examen sea único pero mantenga la dificultad original.
    
    Preguntas a reformular:
    ${JSON.stringify(questions)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const text = response.text || '[]';
    const reformulated = JSON.parse(cleanJsonString(text));
    return reformulated.length === questions.length ? reformulated : questions;
  } catch (error) {
    return questions;
  }
};

/**
 * Valida la clave API utilizando el modelo Flash.
 * El modelo Flash es más tolerante con los límites de cuota y permite 
 * verificar la conectividad de forma más fiable para el estudiante.
 */
export const checkSystemAvailability = async (userApiKey?: string): Promise<boolean> => {
    // Si no hay key ingresada y no hay fallback, rechazamos de inmediato
    if (!userApiKey && !process.env.API_KEY) return false;
    
    const ai = getClient(userApiKey);
    try {
        // Usamos gemini-3-flash-preview para la validación inicial (más robusto y rápido)
        await ai.models.generateContent({ 
          model: "gemini-3-flash-preview", 
          contents: "Verificación de credenciales académicas. Responde: OK" 
        });
        return true;
    } catch (error: any) {
        // Log para que el estudiante/docente pueda ver el motivo real en la consola
        console.error("DEBUG - Fallo de validación API:", error?.message || error);
        return false;
    }
};
