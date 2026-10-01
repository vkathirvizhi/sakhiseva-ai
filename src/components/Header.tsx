import React from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle, Flame, Layers } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenJudgesModal: (tab: 'why' | 'impact' | 'future') => void;
  textSize: 'normal' | 'large' | 'xlarge';
  onCycleTextSize: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isAudioMuted,
  onToggleMute,
  isDemoMode,
  onToggleDemoMode,
  onOpenJudgesModal,
  textSize,
  onCycleTextSize,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="sticky top-0 z-40 bg-[#160b22]/90 backdrop-blur-md border-b border-pink-900/30 px-3 sm:px-6 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-900/40 text-white font-bold text-xl flex-shrink-0">
            <Flame className="w-6 h-6 text-amber-200 fill-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                {t.app_name}
              </h1>
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 hidden xs:inline-block">
                PMUY 2.0
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-pink-200/70 truncate max-w-[170px] sm:max-w-xs font-medium">
              {t.app_subtitle}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Demo mode badge toggle */}
          <button
            onClick={onToggleDemoMode}
            title={t.demo_mode_desc}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
              isDemoMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-900/40'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">DEMO</span>
          </button>

          {/* Text size selector for accessibility */}
          <button
            onClick={onCycleTextSize}
            title="எழுத்து அளவு / Font size"
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-pink-200 font-bold text-xs flex items-center justify-center transition-colors"
          >
            {textSize === 'normal' ? 'A' : textSize === 'large' ? 'A+' : 'A++'}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            title={isAudioMuted ? 'ஒலி இயக்க' : 'ஒலி நிறுத்த'}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
              isAudioMuted
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-pink-500/20 text-pink-300 border-pink-500/40'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-[#241235] text-pink-100 text-xs sm:text-sm font-semibold rounded-xl px-2.5 py-1.5 border border-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer pr-6 appearance-none shadow-sm"
              aria-label="Language selector"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#1b0d2a] text-white">
                  {lang.nativeLabel} ({lang.label})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-pink-300">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Judge / Hackathon Info */}
          <button
            onClick={() => onOpenJudgesModal('why')}
            title="ஹேக்கத்தான் தகவல் / Hackathon Info"
            className="p-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
