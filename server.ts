import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to protect against missing API keys on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY environment variable is not defined. AI features will require configuration.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Curated list of typical holidays for reference or API completions
const CURATED_HOLIDAYS = [
  { id: "new-year", name: "New Year's Day", date: "January 1" },
  { id: "valentine", name: "Valentine's Day", date: "February 14" },
  { id: "earth-day", name: "Earth Day", date: "April 22" },
  { id: "mother-day", name: "Mother's Day", date: "Second Sunday of May" },
  { id: "pride-month", name: "Pride Month", date: "June" },
  { id: "halloween", name: "Halloween", date: "October 31" },
  { id: "thanksgiving", name: "Thanksgiving", date: "Fourth Thursday of November" },
  { id: "christmas", name: "Christmas", date: "December 25" }
];

// Helper endpoint for curing list
app.get("/api/holidays", (req, res) => {
  res.json(CURATED_HOLIDAYS);
});

// Primary Endpoint for Social Media Content generation using Gemini 3.5 Flash
app.post("/api/generate", async (req, res): Promise<any> => {
  try {
    const { type, inputs } = req.body;
    if (!type || !inputs) {
      return res.status(400).json({ error: "Missing type or inputs parameters." });
    }

    const ai = getGeminiClient();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is missing. Please add your Gemini API Key in Settings > Secrets." 
      });
    }

    let prompt = "";
    let systemInstruction = "You are an elite Social Media Copywriter, Brand Strategist, and Art Director.";

    if (type === "caption-architect") {
      const { holiday, brandCategory, sellingPoint, tone } = inputs;
      prompt = `Draft 3 distinct high-converting social media captions for a campaign around the holiday/theme "${holiday}".
Brand Category: ${brandCategory}
Brand's Core Value or Key Selling Point/Offer: ${sellingPoint}
Desired Social Tone: ${tone}

For each caption:
- Caption 1 (Hook & Value Promo): Bold hook, clear holiday connection, active promotion, and call to action. Add 3-5 key hashtags.
- Caption 2 (Authentic Storytelling): Warm and relatable connection between the holiday spirit and the brand values, with an engaging call-to-conversation.
- Caption 3 (Interactive Question & Quick Quiz): A conversational post designed to boost comments and engagement, prompting followers to answer a holiday-related question.

Provide the response in a structured JSON format, mapping to a clean schema representation containing caption1, caption2, caption3, and a short explanation of the copywriting strategy used.`;

      systemInstruction += " Output MUST be strictly formatted as JSON according to the schema provided. Include emojis, paragraph breaks, and hashtags in the caption strings.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              caption1: { type: Type.STRING, description: "Promotional hook & sale caption with emojis and hashtags." },
              caption2: { type: Type.STRING, description: "Emotional or narrative holiday post with emojis and hashtags." },
              caption3: { type: Type.STRING, description: "Interactive or conversational engagement-driving post." },
              strategy: { type: Type.STRING, description: "Paragraph explaining why these captions match the specified brand, holiday vibe, and tone." }
            },
            required: ["caption1", "caption2", "caption3", "strategy"]
          }
        }
      });

      return res.json(JSON.parse(response.text || "{}"));

    } else if (type === "campaign-planner") {
      const { holiday, campaignNarrative, product, durationDays } = inputs;
      const days = parseInt(durationDays) || 3;
      prompt = `Create a detailed day-by-day social media micro-campaign content calendar leading up to "${holiday}".
Target Product/Service: ${product}
Campaign Vibe/Narrative: ${campaignNarrative}
Length: ${days} days

Provide a structured plan for each of the ${days} days. Each day must contain:
1. Subject theme and goal of the post.
2. Best recommendation for posting time (morning, midday, evening).
3. The exact post core message.
4. Visual asset guidelines (how the photo, illustration, or reels/video should look, framing, aesthetic).
5. Success metric to track (likes, saves, shares, shares, comments).

Format response as a JSON array corresponding to the requested days.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              campaignTitle: { type: Type.STRING, description: "A creative name for this micro-campaign." },
              targetObjective: { type: Type.STRING, description: "The primary marketing objective of this specific schedule." },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER, description: "The day number in the campaign (1, 2, 3...)." },
                    title: { type: Type.STRING, description: "The title/angle of this day's post." },
                    postingTime: { type: Type.STRING, description: "Recommended posting window." },
                    captionFocus: { type: Type.STRING, description: "Summary of what to communicate or include in this post's copy." },
                    visualPromptBrief: { type: Type.STRING, description: "Detailed briefing for the design or photography asset." },
                    primaryMetric: { type: Type.STRING, description: "The main key metric to prioritize." }
                  },
                  required: ["dayNumber", "title", "postingTime", "captionFocus", "visualPromptBrief", "primaryMetric"]
                }
              }
            },
            required: ["campaignTitle", "targetObjective", "days"]
          }
        }
      });

      return res.json(JSON.parse(response.text || "{}"));

    } else if (type === "visual-brief") {
      const { holiday, aesthetic, subjectFocus, platform } = inputs;
      prompt = `Generate a comprehensive graphic design and creative visual brief for a holiday post on "${holiday}".
Visual Aesthetic/Theme: ${aesthetic}
Subject/Product Focus: ${subjectFocus}
Platform target: ${platform}

Include:
1. Detailed Visual Mood description (atmosphere, vibes, density).
2. A harmonious color palette with exactly 4 Hex codes (with description of how to apply them).
3. Recommended font styling and typography hierarchy.
4. A highly descriptive image generation prompt.
5. Key graphic elements to place on the layout (text overlays, logos, custom vector illustrations).

Provide the output as JSON matching the schema of custom visual design guidance.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              moodDescription: { type: Type.STRING, description: "Description of the aesthetic atmosphere." },
              colorPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING, description: "Hex value code starting with #" },
                    role: { type: Type.STRING, description: "Role in layout (e.g. background, accent, text, secondary)" }
                  },
                  required: ["hex", "role"]
                }
              },
              typography: { type: Type.STRING, description: "Precise font styling guidance." },
              imageGenerationPrompt: { type: Type.STRING, description: "A detailed description suited for generating images featuring this holiday spirit and product." },
              textOverlaySuggestion: { type: Type.STRING, description: "Suggestions of exactly what text to overlay on the graphic." }
            },
            required: ["moodDescription", "colorPalette", "typography", "imageGenerationPrompt", "textOverlaySuggestion"]
          }
        }
      });

      return res.json(JSON.parse(response.text || "{}"));

    } else if (type === "trend-scout") {
      const { holiday, targetAudience, coreTopic } = inputs;
      prompt = `Brainstorm highly unique, witty, or lesser-known thematic angles and post concepts for "${holiday}".
Target Audience: ${targetAudience}
Core Topic/Brand Industry: ${coreTopic}

We want to stand out from predictable cliché themes (e.g. instead of standard 'Happy Halloween', create a hilarious horror story about server crashes or dry skincare).
Deliver:
1. 3 quirky angles connecting the holiday to this specific topic/audience.
2. 3 highly engaging "stoppers" or attention-grabbing headline hooks.
3. 2 fun audience poll ideas or interactive templates.

Format the output cleanly in JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              uniqueAngles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "The novel angle title." },
                    description: { type: Type.STRING, description: "Why it works and how it relates the topic to the holiday." }
                  },
                  required: ["title", "description"]
                }
              },
              hooks: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              interactionIdeas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pollQuestion: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["pollQuestion", "options"]
                }
              }
            },
            required: ["uniqueAngles", "hooks", "interactionIdeas"]
          }
        }
      });

      return res.json(JSON.parse(response.text || "{}"));
    } else {
      return res.status(400).json({ error: "Unsupported generation type." });
    }

  } catch (err: any) {
    console.error("Gemini Generation Error:", err);
    res.status(500).json({ 
      error: err.message || "An error occurred during Gemini AI content generation." 
    });
  }
});

// Configure Vite middleware in development or serve static build files in production
async function configureApp() {
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
    console.log(`Holiday Social Media Planner server running on http://localhost:${PORT}`);
  });
}

configureApp().catch((err) => {
  console.error("Vite/Express integration startup breakdown:", err);
});
