import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { recommendDessertSmart, getEligibleDesserts } from './src/utils/sommelier.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Helper to initialize GoogleGenAI safely
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint to recommend ideal dessert
app.post('/api/recommend', async (req, res) => {
  try {
    const { answers, availableDesserts, recentDessertIds = [] } = req.body;

    if (!Array.isArray(availableDesserts) || availableDesserts.length === 0) {
      return res.status(400).json({ error: 'No hay postres con stock disponible para recomendar.' });
    }

    // Filter out recently recommended desserts so each test recommends a fresh one
    const eligibleDesserts = getEligibleDesserts(availableDesserts, Array.isArray(recentDessertIds) ? recentDessertIds : []);

    const ai = getGenAIClient();

    // If Gemini API is available, generate recommendation with Gemini 4 Hydrogen
    if (ai) {
      try {
        const prompt = `
Eres la Inteligencia Artificial sommelier y guía emocional de "Frada", una exclusiva marca artesanal de gelatinas y postres mágicos ("Hechos con Pasión", "Sabor que Enamora").
Tu misión es analizar las 4 respuestas profundas y sentimentales del cliente y elegir el postre ideal ÚNICAMENTE entre la lista de postres candidatos con stock disponible que te proporcionamos.
Además, debes generar un mensaje motivador, conmovedor, cálido y personalizado que le llegue directo al corazón.

Respuestas del usuario:
${JSON.stringify(answers, null, 2)}

Postres candidatos disponibles (ya filtrados para no repetir los últimos recomendados):
${JSON.stringify(eligibleDesserts.map((d: any) => ({
  id: d.id,
  name: d.name,
  price: d.price,
  description: d.description || '',
  category: d.category || '',
  flavorProfile: d.flavorProfile || ''
})), null, 2)}

Selecciona el postre de la lista anterior que mejor resuena con las emociones, recuerdos y antojo del usuario.
Genera una respuesta en JSON estricto con los siguientes campos:
- dessertId: El id exacto del postre elegido (debe coincidir exactamente con uno de los IDs de la lista de candidatos).
- dessertName: El nombre del postre elegido.
- personalityArchetype: Un arquetipo o título poético para la persona (ej: "Alma Soñadora y Resiliente", "Espíritu Dulce y Apasionado", "Corazón Radiante y Noble").
- motivationalMessage: Un mensaje motivador profundo, cariñoso, empático y conmovedor de 2 a 3 oraciones que le toque el corazón.
- matchReason: Breve explicación cálida de por qué esta gelatina es su abrazo dulce perfecto hoy.
`;

        // Run Gemini with a 5 second timeout
        const geminiPromise = ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            systemInstruction: 'Eres el sommelier emocional de Frada IA. Hablas directo al corazón del cliente con inmenso cariño, elegancia y variedad.',
            temperature: 0.9,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                dessertId: { type: Type.STRING },
                dessertName: { type: Type.STRING },
                personalityArchetype: { type: Type.STRING },
                motivationalMessage: { type: Type.STRING },
                matchReason: { type: Type.STRING },
              },
              required: ['dessertId', 'dessertName', 'personalityArchetype', 'motivationalMessage', 'matchReason'],
            },
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 5000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText);

        // Verify valid dessertId strictly within eligibleDesserts (never blindly pick index 0)
        const matched = eligibleDesserts.find((d: any) => d.id === parsed.dessertId);
        if (matched) {
          return res.json({
            dessertId: matched.id,
            dessertName: matched.name,
            personalityArchetype: parsed.personalityArchetype || 'Espíritu Dulce y Brillante',
            motivationalMessage: parsed.motivationalMessage || 'Eres una persona única, llena de calidez y dedicación. Que cada bocado te recuerde lo valioso que es tu camino.',
            matchReason: parsed.matchReason || `Elegido para consentirte con las notas perfectas de ${matched.name}.`,
            fromAI: true,
          });
        }
      } catch (geminiError) {
        console.warn('Gemini falló o tardó, usando respaldo instantáneo:', (geminiError as any)?.message);
      }
    }

    // High quality intelligent sommelier: accurately scores eligible desserts based on the 4 answers
    const smartResult = recommendDessertSmart(answers, eligibleDesserts);
    return res.json(smartResult);
  } catch (err: any) {
    console.error('Server error in /api/recommend:', err);
    res.status(500).json({ error: 'Error procesando la recomendación' });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Frada IA server running on http://0.0.0.0:${port}`);
  });
}

startServer();
