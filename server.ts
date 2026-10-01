import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with mandated User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback logic if API key is missing or model request times out
function getFallbackIntent(speech: string, language: string = 'ta') {
  const lower = speech.toLowerCase();
  const isGasRelated =
    lower.includes('gas') ||
    lower.includes('கேஸ்') ||
    lower.includes('சிலிண்டர்') ||
    lower.includes('அடுப்பு') ||
    lower.includes('எரிவாயு') ||
    lower.includes('உஜ்வாலா') ||
    lower.includes('cylinder') ||
    lower.includes('stove') ||
    lower.includes('ujjwala') ||
    lower.includes('cooking');

  if (isGasRelated) {
    if (language === 'ta') {
      return {
        intent: 'pmuy',
        language: 'ta',
        confidence: 0.98,
        detectedTopic: 'பிரதம மந்திரி உஜ்வாலா யோஜனா (இலவச சமையல் எரிவாயு)',
        explanation: 'பிரதம மந்திரி உஜ்வாலா யோஜனா திட்டம் ஏழை குடும்ப பெண்களுக்கு இலவச கேஸ் இணைப்பு, அடுப்பு மற்றும் முதல் சிலிண்டரை இலவசமாக வழங்குகிறது.',
        nextQuestion: 'உங்களிடம் அல்லது உங்கள் குடும்பத்தில் ஏற்கனவே கேஸ் இணைப்பு இருக்கிறதா?',
        options: ['ஆம்', 'இல்லை', 'தெரியவில்லை'],
        voiceText: 'சரி. இலவச சமையல் எரிவாயு இணைப்புக்கான உதவி பற்றி பார்க்கலாம். உங்களிடம் ஏற்கனவே கேஸ் இணைப்பு இருக்கிறதா?',
        needsHumanHelp: false,
        suggestedAction: 'explain_scheme',
      };
    } else {
      return {
        intent: 'pmuy',
        language: language,
        confidence: 0.98,
        detectedTopic: 'Pradhan Mantri Ujjwala Yojana (Free LPG Gas)',
        explanation: 'PM Ujjwala Yojana provides deposit-free LPG gas connections, free stove, and the first free cylinder to eligible rural women.',
        nextQuestion: 'Do you or anyone in your household already have an LPG gas connection?',
        options: ['Yes', 'No', 'Not Sure'],
        voiceText: 'I understand you are asking about cooking gas connection. Does anyone in your home already have a gas connection?',
        needsHumanHelp: false,
        suggestedAction: 'explain_scheme',
      };
    }
  }

  // General or other scheme requested
  return {
    intent: 'other',
    language: language,
    confidence: 0.85,
    detectedTopic: speech || 'அரசு உதவி',
    explanation: 'தற்போது சகீ சேவாவில் பிரதம மந்திரி உஜ்வாலா யோஜனா (இலவச கேஸ் இணைப்பு) திட்டம் மட்டுமே நேரடி வழிகாட்டுதலில் உள்ளது. நீங்கள் சமையல் கேஸ் இணைப்பு பெற விரும்புகிறீர்களா?',
    nextQuestion: 'உங்களுக்கு இலவச சமையல் எரிவாயு (கேஸ் சிலிண்டர்) இணைப்பு பெற உதவி தேவையா?',
    options: ['ஆம், கேஸ் உதவி வேண்டும்', 'இல்லை', 'தெரியவில்லை'],
    voiceText: 'வணக்கம்! தற்போது இலவச சமையல் கேஸ் சிலிண்டர் இணைப்புக்கான உஜ்வாலா திட்ட வழிகாட்டுதல் உள்ளது. உங்களுக்கு அது தேவையா?',
    needsHumanHelp: false,
    suggestedAction: 'ask_confirmation',
  };
}

// API endpoint for voice/text intent detection using Gemini
app.post('/api/gemini/intent', async (req, res) => {
  const { userSpeech, language = 'ta' } = req.body;

  if (!userSpeech || typeof userSpeech !== 'string') {
    return res.status(400).json({ error: 'userSpeech is required' });
  }

  // If Gemini client not initialized or no key, return robust local fallback
  if (!ai) {
    const fallback = getFallbackIntent(userSpeech, language);
    return res.json({ ...fallback, _source: 'rule_fallback_no_api_key' });
  }

  try {
    const systemInstruction = `
You are SakhiSeva, an empathetic and simple voice assistant designed specifically for first-time rural Indian women with zero digital literacy.
The user speaks in colloquial Tamil, Tanglish (Tamil written in English script or mixed with English terms), or other Indian languages.

Your goal:
1. Identify if the user is asking about cooking gas, LPG cylinder, stove, Ujjwala Yojana, fire/smoke issues, kitchen safety, or general government help.
2. If gas/LPG/PMUY is mentioned or implied, map intent to "pmuy".
3. If they ask about other schemes (ration, pension, housing), politely inform that SakhiSeva currently guides through PM Ujjwala Yojana (PMUY) and ask if they need cooking gas support.
4. Keep the explanation and nextQuestion in very simple, respectful, spoken colloquial language. NEVER use dense bureaucratic vocabulary.
5. Provide 2 to 3 very simple button options.
6. Return purely valid JSON following the schema.
`;

    const prompt = `User speech/text: "${userSpeech}"
Language preference: ${language}

Analyze the user's intent and return a JSON object with:
- intent: string ("pmuy" or "other")
- language: string ("ta", "hi", etc.)
- confidence: number (0.0 to 1.0)
- detectedTopic: short friendly title of what they asked
- explanation: 1-2 short sentences in simple ${language === 'ta' ? 'Tamil' : language}
- nextQuestion: 1 simple question to guide them forward
- options: array of 2 or 3 short choices (e.g. ["ஆம்", "இல்லை", "தெரியவில்லை"])
- voiceText: clean text to be spoken aloud via Text-to-Speech in warm friendly tone
- needsHumanHelp: boolean
- suggestedAction: string ("explain_scheme" or "ask_eligibility" or "clarify")
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            language: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            detectedTopic: { type: Type.STRING },
            explanation: { type: Type.STRING },
            nextQuestion: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            voiceText: { type: Type.STRING },
            needsHumanHelp: { type: Type.BOOLEAN },
            suggestedAction: { type: Type.STRING },
          },
          required: [
            'intent',
            'language',
            'confidence',
            'detectedTopic',
            'explanation',
            'nextQuestion',
            'options',
            'voiceText',
            'needsHumanHelp',
          ],
        },
      },
    });

    const rawText = response.text || '';
    const parsed = JSON.parse(rawText);
    return res.json({ ...parsed, _source: 'gemini' });
  } catch (err: any) {
    console.error('Gemini API intent error, using graceful fallback:', err?.message);
    const fallback = getFallbackIntent(userSpeech, language);
    return res.json({ ...fallback, _source: 'rule_fallback_on_error' });
  }
});

// API endpoint for conversational answer interpretation
app.post('/api/gemini/interpret-answer', async (req, res) => {
  const { questionId, userSpeech, language = 'ta' } = req.body;

  if (!userSpeech) {
    return res.status(400).json({ error: 'userSpeech is required' });
  }

  // Quick fallback check
  const lower = userSpeech.toLowerCase().trim();
  let interpreted: 'yes' | 'no' | 'unknown' = 'unknown';

  if (
    lower.includes('ஆம்') ||
    lower.includes('ஆமாம்') ||
    lower.includes('இருக்கிறது') ||
    lower.includes('உண்டு') ||
    lower.includes('yes') ||
    lower.includes('haan') ||
    lower.includes('irukku')
  ) {
    interpreted = 'yes';
  } else if (
    lower.includes('இல்லை') ||
    lower.includes('இல்ல') ||
    lower.includes('கிடையாது') ||
    lower.includes('no') ||
    lower.includes('nahi') ||
    lower.includes('illa')
  ) {
    interpreted = 'no';
  } else if (
    lower.includes('தெரியாது') ||
    lower.includes('தெரியவில்லை') ||
    lower.includes('not sure') ||
    lower.includes('pata nahi')
  ) {
    interpreted = 'unknown';
  }

  if (!ai) {
    return res.json({
      answer: interpreted,
      confidence: 0.9,
      clarification: null,
    });
  }

  try {
    const prompt = `The user was asked an eligibility question (ID: ${questionId}).
The user responded with voice/text: "${userSpeech}"
Interpret whether the user meant "yes" (ஆம்), "no" (இல்லை), or "unknown" / "not sure" (தெரியவில்லை).
Return JSON with { answer: "yes" | "no" | "unknown", confidence: number, clarification: string | null }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            clarification: { type: Type.STRING, nullable: true },
          },
          required: ['answer', 'confidence'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    return res.json({
      answer: interpreted,
      confidence: 0.85,
      clarification: null,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!ai,
    defaultLanguage: 'ta',
    version: '1.0.0',
    app: 'SakhiSeva',
  });
});

async function main() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SakhiSeva Server running at http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start SakhiSeva server:', err);
});
