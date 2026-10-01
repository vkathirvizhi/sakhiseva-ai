import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send, Keyboard, HeartHandshake, Flame, ArrowRight } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../../data/translations';
import { VoiceVisualizer } from '../VoiceVisualizer';

interface ScreenWelcomeProps {
  language: LanguageCode;
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onSelectPrompt: (promptText: string) => void;
  onSpeakGreeting: () => void;
  lastTranscript?: string;
  isProcessing?: boolean;
}

export const ScreenWelcome: React.FC<ScreenWelcomeProps> = ({
  language,
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onSelectPrompt,
  onSpeakGreeting,
  lastTranscript,
  isProcessing,
}) => {
  const t = TRANSLATIONS[language];
  const [showTextInput, setShowTextInput] = useState(false);
  const [typedText, setTypedText] = useState('');

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedText.trim()) {
      onSelectPrompt(typedText.trim());
      setTypedText('');
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-4 py-3 sm:py-6 max-w-xl mx-auto w-full">
      {/* Friendly rural assistant avatar */}
      <div className="relative mb-3 sm:mb-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 p-1 shadow-xl shadow-pink-950/60 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#1e0e2e] flex flex-col items-center justify-center border-2 border-pink-400/40 relative overflow-hidden">
            {/* Sakhi Avatar Icon */}
            <div className="text-3xl sm:text-4xl select-none">👩🏽‍🦱</div>
            <div className="absolute bottom-0 w-full bg-pink-600/70 text-[9px] font-bold text-white tracking-wider py-0.5 uppercase">
              சகீ | Sakhi
            </div>
          </div>
        </div>

        {/* Listen again sound badge */}
        <button
          onClick={onSpeakGreeting}
          title={t.repeat_audio}
          className="absolute -bottom-1 -right-1 p-2 rounded-full bg-pink-500 hover:bg-pink-400 text-white shadow-md shadow-pink-900/50 transition-transform active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Spoken Greeting Card */}
      <div className="bg-gradient-to-b from-[#251236] to-[#1a0b27] border border-pink-500/30 rounded-3xl p-4 sm:p-5 shadow-xl shadow-black/40 mb-5 w-full relative">
        <h2 className="text-xl sm:text-2xl font-black text-white mb-1.5 tracking-tight">
          {t.welcome_greeting}
        </h2>
        <p className="text-base sm:text-lg font-medium text-pink-200/90 leading-relaxed mb-2">
          {t.welcome_prompt}
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
          <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
          <span>{t.no_read_needed}</span>
        </div>

        {/* Live speech feedback if user is speaking */}
        {isListening && (
          <div className="mt-3 pt-3 border-t border-pink-500/20">
            <div className="text-xs text-rose-300 font-bold uppercase tracking-wider mb-1 animate-pulse">
              {t.listening}
            </div>
            <p className="text-sm font-semibold text-white italic min-h-[24px]">
              {lastTranscript || '...'}
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="mt-3 text-xs text-amber-300 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>{t.processing}</span>
          </div>
        )}
      </div>

      {/* Voice Visualizer */}
      <VoiceVisualizer isListening={isListening} isSpeaking={isSpeaking} />

      {/* GIANT MICROPHONE BUTTON */}
      <div className="my-3 sm:my-5 flex flex-col items-center">
        <button
          onClick={isListening ? onStopListening : onStartListening}
          aria-label={isListening ? t.tap_to_stop : t.tap_to_speak}
          className={`relative group w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
            isListening
              ? 'bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 text-white ring-8 ring-rose-500/40 animate-gentle-pulse shadow-rose-900/80 scale-105'
              : 'bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 text-white hover:scale-105 shadow-pink-900/60 active:scale-95'
          }`}
        >
          {/* Inner ring */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 flex flex-col items-center justify-center backdrop-blur-xs border border-white/20">
            {isListening ? (
              <MicOff className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse text-white" />
            ) : (
              <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            )}
            <span className="text-[11px] sm:text-xs font-black tracking-wide mt-1 uppercase text-white/90">
              {isListening ? t.tap_to_stop : t.tap_to_speak}
            </span>
          </div>
        </button>

        <p className="text-xs sm:text-sm text-pink-300/80 font-bold mt-3">
          {isListening ? '🛑 ' + t.tap_to_stop : '👆 ' + t.tap_to_speak}
        </p>
      </div>

      {/* Quick sample prompt chips for low literacy users */}
      <div className="w-full mt-2">
        <p className="text-xs font-bold text-gray-400 mb-2 flex items-center justify-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.quick_samples_title}</span>
        </p>

        <div className="flex flex-col gap-2">
          {[t.sample_1, t.sample_2, t.sample_3].map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(sample)}
              className="w-full text-left p-3 rounded-2xl bg-[#200f30]/80 hover:bg-[#2c1443] border border-pink-500/30 hover:border-pink-500/60 text-pink-100 font-semibold text-sm transition-all flex items-center justify-between group active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span>{sample}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Fallback Text Input Drawer Toggle */}
      <div className="mt-4 pt-3 border-t border-white/5 w-full">
        {!showTextInput ? (
          <button
            onClick={() => setShowTextInput(true)}
            className="text-xs text-gray-400 hover:text-pink-300 font-medium inline-flex items-center gap-1.5 transition-colors p-2"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{t.text_input_fallback_btn}</span>
          </button>
        ) : (
          <form onSubmit={handleTextSubmit} className="flex gap-2 w-full mt-2">
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder={t.text_input_placeholder}
              className="flex-1 bg-[#1d0d2b] border border-pink-500/40 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm flex items-center gap-1.5 shadow-md shadow-pink-900/40"
            >
              <Send className="w-4 h-4" />
              <span>{t.submit_text}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
