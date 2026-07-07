import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI report generator will fail.");
    }
    ai = new GoogleGenAI({
      apiKey: key || "PLACEHOLDER_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// API Endpoint to generate structured TAM SAM SOM report and estimations
app.post("/api/generate-market-report", async (req, res) => {
  try {
    const { idea, target, region, pricing } = req.body;

    if (!idea || !target || !region) {
      return res.status(400).json({ error: "Missing required fields: idea, target, or region." });
    }

    const client = getGeminiClient();
    
    const prompt = `
Analiza la siguiente idea de negocio y genera un desglose cuantitativo y cualitativo detallado de su mercado TAM (Total Addressable Market), SAM (Serviceable Addressable Market) y SOM (Serviceable Obtainable Market) en la región especificada.

INFORMACIÓN DEL PROYECTO:
- Idea de Negocio: ${idea}
- Público Objetivo: ${target}
- Región Geográfica: ${region}
- Precio Estimado / Monetización: ${pricing || "No especificado (asume un valor realista del mercado)"}

Por favor, realiza estimaciones numéricas aproximadas realistas en USD ($) anuales para TAM, SAM y SOM basándote en datos típicos de mercado e industrias similares. Asegúrate de que TAM > SAM > SOM en al menos un orden de magnitud razonable.

Además, incluye advertencias específicas sobre la "Trampa del 1%" (The 1% Trap) para esta idea de negocio concreta, consejos para evitar la "Miopía del Mercado" (Market Myopia), y checklists accionables para los roles de diseño: "Investigador" (que investiga y valida) y "Líder de Estrategia" (que guía la ejecución).

El output debe ser un objeto JSON que siga exactamente el siguiente esquema. No agregues texto fuera del JSON.
`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "currency",
            "tam",
            "sam",
            "som",
            "trampa_1_percent",
            "miopia_advice",
            "investigador_checklist",
            "lider_checklist",
            "validation_strategy"
          ],
          properties: {
            currency: {
              type: Type.STRING,
              description: "Moneda usada, por defecto USD"
            },
            tam: {
              type: Type.OBJECT,
              required: ["definition", "estimated_size", "size_explanation", "sources"],
              properties: {
                definition: { type: Type.STRING, description: "Definición clara y detallada del TAM para este negocio" },
                estimated_size: { type: Type.NUMBER, description: "Tamaño estimado del mercado TAM en USD anuales (ej: 15000000)" },
                size_explanation: { type: Type.STRING, description: "Explicación detallada de cómo se calcula este TAM" },
                sources: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Fuentes o metodologías de validación sugeridas para el TAM"
                }
              }
            },
            sam: {
              type: Type.OBJECT,
              required: ["definition", "estimated_size", "size_explanation", "sources"],
              properties: {
                definition: { type: Type.STRING, description: "Definición clara y detallada del SAM para este negocio" },
                estimated_size: { type: Type.NUMBER, description: "Tamaño estimado del mercado SAM en USD anuales (ej: 2500000)" },
                size_explanation: { type: Type.STRING, description: "Explicación de cómo se calcula este SAM a partir del TAM" },
                sources: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Fuentes o metodologías de validación sugeridas para el SAM"
                }
              }
            },
            som: {
              type: Type.OBJECT,
              required: ["definition", "estimated_size", "size_explanation", "sources"],
              properties: {
                definition: { type: Type.STRING, description: "Definición clara y detallada del SOM para este negocio" },
                estimated_size: { type: Type.NUMBER, description: "Tamaño estimado del mercado SOM en USD anuales (ej: 350000)" },
                size_explanation: { type: Type.STRING, description: "Explicación de cómo se calcula este SOM a partir del SAM y capacidad inicial" },
                sources: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Fuentes o metodologías de validación sugeridas para el SOM"
                }
              }
            },
            trampa_1_percent: {
              type: Type.STRING,
              description: "Una advertencia detallada y personalizada sobre por qué la trampa de 'capturar el 1% de un mercado gigante' fallará en este caso concreto, y cuál debería ser el enfoque centrado en el usuario."
            },
            miopia_advice: {
              type: Type.STRING,
              description: "Consejo específico para evitar definir el mercado de forma tan estrecha que se ignore la competencia, o tan amplia que se pierda la diferenciación."
            },
            investigador_checklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 3 a 5 actividades prácticas para el rol de Investigador (Design Thinking) para validar estas hipótesis en el campo."
            },
            lider_checklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de 3 a 5 actividades prácticas para el rol de Líder para estructurar la solución y el lanzamiento basándose en el SOM."
            },
            validation_strategy: {
              type: Type.STRING,
              description: "Estrategia recomendada para pasar del análisis teórico a la validación de magnitud de forma ágil y real."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini API");
    }

    const data = JSON.parse(text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Error generating market report:", error);
    return res.status(500).json({ error: error.message || "Error al generar el reporte de mercado con IA." });
  }
});

// Setup Vite or Static File serving depending on environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
