/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { StepProgress, AppScreen } from './components/StepProgress';
import { DemoBar } from './components/DemoBar';
import { JudgesModal } from './components/JudgesModal';
import { ScreenWelcome } from './components/Screens/ScreenWelcome';
import { ScreenSchemeDetail } from './components/Screens/ScreenSchemeDetail';
import { ScreenEligibility } from './components/Screens/ScreenEligibility';
import { ScreenDocuments } from './components/Screens/ScreenDocuments';
import { ScreenGuidance } from './components/Screens/ScreenGuidance';
import { ScreenHandoff } from './components/Screens/ScreenHandoff';
import { LanguageCode, SUPPORTED_LANGUAGES, TRANSLATIONS } from './data/translations';
import { TTSService, SoundEffects, getSpeechRecognition } from './utils/speech';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('ta');
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true); // Enabled by default for hackathon review
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [judgesModalOpen, setJudgesModalOpen] = useState(false);
  const [judgesModalTab, setJudgesModalTab] = useState<'why' | 'impact' | 'future'>('why');

  const recognitionRef = useRef<any>(null);
  const t = TRANSLATIONS[currentLanguage];
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  // Helper to speak text aloud if not muted
  const speakText = (text: string, rate: number = 0.88) => {
    if (isAudioMuted) return;
    TTSService.speak(
      text,
      langMeta.speechCode,
      rate,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Speak greeting on first load or language switch
  const speakGreeting = () => {
    speakText(`${t.welcome_greeting} ${t.welcome_prompt}`);
  };

  // Handle language change
  const handleLanguageChange = (lang: LanguageCode) => {
    TTSService.stop();
    setCurrentLanguage(lang);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (!isAudioMuted) {
      TTSService.stop();
      setIsAudioMuted(true);
    } else {
      setIsAudioMuted(false);
    }
  };

  // Cycle text size for accessibility
  const handleCycleTextSize = () => {
    if (textSize === 'normal') setTextSize('large');
    else if (textSize === 'large') setTextSize('xlarge');
    else setTextSize('normal');
  };

  // Speech Recognition management
  const startListening = () => {
    TTSService.stop();
    setSpeechError(null);
    setLastTranscript('');

    const SpeechRec = getSpeechRecognition();
    if (!SpeechRec) {
      setSpeechError(t.mic_denied);
      return;
    }

    try {
      SoundEffects.playListeningChime();
      const rec = new SpeechRec();
      rec.lang = langMeta.speechCode;
      rec.continuous = false;
      rec.interimResults = true;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setLastTranscript(final || interim);
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setSpeechError(t.mic_denied);
        } else if (e.error === 'no-speech') {
          setSpeechError(t.speech_failed);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        // If we captured something, process it
        if (lastTranscript.trim()) {
          SoundEffects.playSuccessChime();
          processUserSpeech(lastTranscript.trim());
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setSpeechError(t.mic_denied);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Process user speech / text through Gemini API backend
  const processUserSpeech = async (speechText: string) => {
    setIsProcessing(true);
    setSpeechError(null);

    try {
      const response = await fetch('/api/gemini/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSpeech: speechText,
          language: currentLanguage,
        }),
      });

      const data = await response.json();
      setIsProcessing(false);

      if (data.intent === 'pmuy' || data.suggestedAction === 'explain_scheme') {
        // Transition to scheme details
        setCurrentScreen('scheme_detail');
        if (data.voiceText) {
          speakText(data.voiceText);
        } else {
          speakText(t.scheme_pmuy_desc);
        }
      } else {
        // If other scheme or uncertain, explain politely
        setCurrentScreen('scheme_detail');
        speakText(data.voiceText || t.scheme_pmuy_desc);
      }
    } catch (err) {
      console.error('API intent error:', err);
      setIsProcessing(false);
      // Fallback transition directly
      setCurrentScreen('scheme_detail');
      speakText(t.scheme_pmuy_desc);
    }
  };

  // Demo Scenarios for Judges
  const handleRunDemoScenario = (scenario: 'gas_standard' | 'ujjwala_inquiry' | 'existing_gas') => {
    TTSService.stop();
    if (scenario === 'gas_standard') {
      setLastTranscript('எனக்கு கேஸ் சிலிண்டர் வேண்டும்');
      processUserSpeech('எனக்கு கேஸ் சிலிண்டர் வேண்டும்');
    } else if (scenario === 'ujjwala_inquiry') {
      setLastTranscript('உஜ்வாலா திட்டம் பற்றி சொல்லுங்க');
      processUserSpeech('உஜ்வாலா திட்டம் பற்றி சொல்லுங்க');
    } else if (scenario === 'existing_gas') {
      setCurrentScreen('eligibility');
      speakText(t.q_existing_connection);
    }
  };

  // Repeat current audio for whatever screen we are on
  const handleRepeatCurrentAudio = () => {
    switch (currentScreen) {
      case 'welcome':
        speakGreeting();
        break;
      case 'scheme_detail':
        speakText(`${t.scheme_pmuy_simple_title}. ${t.scheme_pmuy_desc}`);
        break;
      case 'eligibility':
        speakText(`${t.eligibility_title}. ${t.eligibility_subtitle}`);
        break;
      case 'documents':
        speakText(`${t.docs_title}. ${t.docs_subtitle}`);
        break;
      case 'guidance':
        speakText(`${t.guide_title}. ${t.guide_subtitle}`);
        break;
      case 'handoff':
        speakText(t.official_handoff_title);
        break;
    }
  };

  // Screen transition handlers with auto-speech
  const handleGoToEligibility = () => {
    TTSService.stop();
    setCurrentScreen('eligibility');
    speakText(`${t.eligibility_title}. ${t.eligibility_subtitle}`);
  };

  const handleGoToDocuments = () => {
    TTSService.stop();
    setCurrentScreen('documents');
    speakText(`${t.docs_title}. ${t.docs_subtitle}`);
  };

  const handleGoToGuidance = () => {
    TTSService.stop();
    setCurrentScreen('guidance');
    speakText(`${t.guide_title}. ${t.guide_subtitle}`);
  };

  const handleGoToHandoff = () => {
    TTSService.stop();
    setCurrentScreen('handoff');
    speakText(`${t.official_handoff_title}. ${t.official_disclaimer}`);
  };

  const handleStartOver = () => {
    TTSService.stop();
    setCurrentScreen('welcome');
    setLastTranscript('');
    speakGreeting();
  };

  // Text size class mappings
  const getTextSizeClass = () => {
    if (textSize === 'large') return 'text-[1.08rem]';
    if (textSize === 'xlarge') return 'text-[1.18rem]';
    return 'text-base';
  };

  return (
    <div className={`min-h-screen bg-[#0e0616] text-[#fff0f3] flex flex-col font-sans ${getTextSizeClass()}`}>
      {/* Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        isAudioMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        onOpenJudgesModal={(tab) => {
          setJudgesModalTab(tab);
          setJudgesModalOpen(true);
        }}
        textSize={textSize}
        onCycleTextSize={handleCycleTextSize}
      />

      {/* Judges Demo Mode Bar */}
      <DemoBar
        isDemoMode={isDemoMode}
        onRunScenario={handleRunDemoScenario}
        onJumpToScreen={(screen) => {
          TTSService.stop();
          setCurrentScreen(screen);
        }}
        currentScreen={currentScreen}
      />

      {/* Main Step Navigation (Visible from screen 2 onwards) */}
      {currentScreen !== 'welcome' && (
        <div className="bg-[#140820] border-b border-pink-500/20 py-1">
          <StepProgress
            currentScreen={currentScreen}
            language={currentLanguage}
            onSelectStep={(screen) => {
              TTSService.stop();
              setCurrentScreen(screen);
            }}
          />
        </div>
      )}

      {/* Speech error toast if microphone permission denied */}
      {speechError && (
        <div className="max-w-xl mx-auto px-4 mt-3 w-full">
          <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-xs sm:text-sm text-rose-200 flex items-center justify-between shadow-lg">
            <span>{speechError}</span>
            <button
              onClick={() => setSpeechError(null)}
              className="text-xs font-bold text-rose-300 underline ml-2"
            >
              சரி
            </button>
          </div>
        </div>
      )}

      {/* Screen Router */}
      <main className="flex-1 flex flex-col justify-start">
        {currentScreen === 'welcome' && (
          <ScreenWelcome
            language={currentLanguage}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            onSelectPrompt={(text) => {
              setLastTranscript(text);
              processUserSpeech(text);
            }}
            onSpeakGreeting={speakGreeting}
            lastTranscript={lastTranscript}
            isProcessing={isProcessing}
          />
        )}

        {currentScreen === 'scheme_detail' && (
          <ScreenSchemeDetail
            language={currentLanguage}
            isSpeaking={isSpeaking}
            onRepeatAudio={handleRepeatCurrentAudio}
            onProceedToEligibility={handleGoToEligibility}
            onGoBack={handleStartOver}
          />
        )}

        {currentScreen === 'eligibility' && (
          <ScreenEligibility
            language={currentLanguage}
            isSpeaking={isSpeaking}
            isListening={isListening}
            onRepeatAudio={handleRepeatCurrentAudio}
            onStartListening={startListening}
            onStopListening={stopListening}
            onProceedToDocuments={handleGoToDocuments}
            onGoBack={() => setCurrentScreen('scheme_detail')}
            lastTranscript={lastTranscript}
            isProcessing={isProcessing}
          />
        )}

        {currentScreen === 'documents' && (
          <ScreenDocuments
            language={currentLanguage}
            isSpeaking={isSpeaking}
            onRepeatAudio={handleRepeatCurrentAudio}
            onProceedToGuidance={handleGoToGuidance}
            onGoBack={() => setCurrentScreen('eligibility')}
          />
        )}

        {currentScreen === 'guidance' && (
          <ScreenGuidance
            language={currentLanguage}
            isSpeaking={isSpeaking}
            onRepeatAudio={handleRepeatCurrentAudio}
            onProceedToHandoff={handleGoToHandoff}
            onGoBack={() => setCurrentScreen('documents')}
          />
        )}

        {currentScreen === 'handoff' && (
          <ScreenHandoff
            language={currentLanguage}
            onStartOver={handleStartOver}
            onGoBack={() => setCurrentScreen('guidance')}
          />
        )}
      </main>

      {/* Judges / Hackathon Info Modal */}
      <JudgesModal
        isOpen={judgesModalOpen}
        onClose={() => setJudgesModalOpen(false)}
        initialTab={judgesModalTab}
        language={currentLanguage}
      />
    </div>
  );
}
