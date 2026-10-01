# சகீ சேவா | SakhiSeva
### Voice-First Government Scheme Navigator for Rural Indian Women
**Built for the Hackathon Challenge: "The Invisible Woman"**

SakhiSeva empowers first-time rural women with zero digital literacy to access life-changing government schemes independently using their native tongue. For this prototype, it provides end-to-end guidance for **Pradhan Mantri Ujjwala Yojana (PMUY 2.0)** — India's landmark deposit-free LPG gas connection scheme that frees women from toxic indoor firewood smoke.

---

## 1. How to Run the App

### Prerequisites
- Node.js 18+ or 20+
- Modern web browser (Chrome, Edge, or Android Chrome recommended for Speech Recognition support)

### Development
```bash
# Install dependencies
npm install

# Start the full-stack server (runs Express with Vite dev server on port 3000)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 2. How to Configure the Gemini API Key

SakhiSeva uses Google's latest **`gemini-3.8-flash`** model via `@google/genai` to parse colloquial Tamil, Tanglish, and regional speech patterns.

1. Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. In your `.env` file (or Google AI Studio Secrets panel), add:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```
3. **Server-Side Security**: The API key is securely consumed inside `server.ts` and never exposed to the client browser.
4. **Resilient Offline Fallback**: If `GEMINI_API_KEY` is not present, SakhiSeva automatically switches to its local intent engine so testing and evaluation are never interrupted.

---

## 3. How Voice Input and Output Work

1. **Speech-to-Text (STT)**:
   - Uses the browser's native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
   - The language tag is dynamically set to the active language (e.g., `ta-IN` for Tamil, `hi-IN` for Hindi).
   - Gentle auditory chimes play via the Web Audio API on recording start and completion to guide users who cannot read status text.
   - If microphone permissions are denied, a text input fallback and clear visual buttons are always provided.

2. **Intent Recognition**:
   - The user's spoken words are sent to `POST /api/gemini/intent`.
   - Gemini classifies intent (e.g., mapping colloquial terms like *"aduppu theva"*, *"gas cylinder venum"*, *"cooking gas"* to `pmuy`).
   - Gemini returns structured JSON containing simplified regional explanations, next question, and audio text.

3. **Text-to-Speech (TTS)**:
   - Powered by the browser's `window.speechSynthesis` API with regional Tamil voice detection (`ta-IN`).
   - Speaks at a deliberate, soothing cadence (0.88x speed) designed for rural clarity and comprehension.
   - Includes a "Listen Again" (`மீண்டும் கேட்க`) button on every screen.

---

## 4. How to Replace Demo Data with Verified Government Data

All scheme parameters, eligibility questions, and document requirements are modularized in:
- `src/data/schemes.ts`
- `src/data/translations.ts`

To update with updated government gazettes or state-specific schemes:
1. Open `src/data/schemes.ts`.
2. Modify the `PMUY_SCHEME` object:
   - `benefits`: Update subsidy amounts or inclusions as announced by the Ministry of Petroleum & Natural Gas.
   - `eligibilityQuestions`: Modify the checklist rules (e.g., age, household criteria).
   - `requiredDocuments`: Add or modify verified documents.
   - `officialPortal`: Official website URL (`https://www.pmuy.gov.in`).
   - `officialTollFree`: Verified toll-free helpline (`1800-266-6696`).

---

## 5. Which Parts are Demo-Only

- **Direct Government Submission API**: 
  - In strict compliance with the hackathon rules and anti-deception standards, **SakhiSeva does NOT fabricate or fake application submission**.
  - Without an authorized API token from the Ministry/NIC, direct automated submission is unavailable.
  - The final screen performs a transparent handoff to the official government portal (`pmuy.gov.in`), CSC locator (`findmycsc.nic.in`), and toll-free helpline (`1800-266-6696`).
- **Demo Mode Bar**:
  - The amber bar at the top provides 1-click test scenarios for hackathon judges to evaluate speech reasoning and edge-case handling without requiring a real microphone.

---

## 6. How to Add Another Indian Language

SakhiSeva is built from the ground up for multilingual Indian federal governance. Currently supported: **Tamil (`ta`)**, **Hindi (`hi`)**, **Telugu (`te`)**, **Kannada (`kn`)**, **Malayalam (`ml`)**, and **English (`en`)**.

To add a new language (e.g., Marathi - `mr` or Bengali - `bn`):
1. Open `src/data/translations.ts`.
2. Add the language metadata to `SUPPORTED_LANGUAGES`:
   ```ts
   { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', speechCode: 'mr-IN' }
   ```
3. Add the dictionary key under `TRANSLATIONS`:
   ```ts
   export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
     // ...
     mr: {
       app_name: 'सखी सेवा',
       welcome_greeting: 'नमस्कार ताई! मी सखी आहे.',
       // ... copy corresponding keys
     }
   };
   ```
4. The language selector in the header will automatically render the new native language option, and the Speech API will target `mr-IN`.

---

## Hackathon Impact: "The Invisible Woman"

- **200+ Million** rural women in India still suffer from household air pollution caused by burning firewood and dung cakes in unventilated kitchens.
- Traditional web portals fail rural women due to English language dominance, dense bureaucratic vocabulary, and multi-page nested forms.
- **SakhiSeva** bridges this last-mile chasm through compassionate, voice-first, native-tongue artificial intelligence.
