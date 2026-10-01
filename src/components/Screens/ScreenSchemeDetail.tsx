import React from 'react';
import { Flame, CookingPot, BadgePercent, Landmark, Volume2, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../../data/translations';
import { PMUY_SCHEME } from '../../data/schemes';
import { VoiceVisualizer } from '../VoiceVisualizer';

interface ScreenSchemeDetailProps {
  language: LanguageCode;
  isSpeaking: boolean;
  onRepeatAudio: () => void;
  onProceedToEligibility: () => void;
  onGoBack: () => void;
}

export const ScreenSchemeDetail: React.FC<ScreenSchemeDetailProps> = ({
  language,
  isSpeaking,
  onRepeatAudio,
  onProceedToEligibility,
  onGoBack,
}) => {
  const t = TRANSLATIONS[language];

  const getBenefitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-300" />;
      case 'CookingPot':
        return <CookingPot className="w-6 h-6 text-rose-300" />;
      case 'BadgePercent':
        return <BadgePercent className="w-6 h-6 text-emerald-300" />;
      case 'Landmark':
        return <Landmark className="w-6 h-6 text-purple-300" />;
      default:
        return <Flame className="w-6 h-6 text-pink-300" />;
    }
  };

  return (
    <div className="flex flex-col px-4 py-3 sm:py-6 max-w-xl mx-auto w-full">
      {/* Top Navigation & Audio Button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.go_back}</span>
        </button>

        <button
          onClick={onRepeatAudio}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/40 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Volume2 className="w-3.5 h-3.5 text-pink-400" />
          <span>{t.repeat_audio}</span>
        </button>
      </div>

      <VoiceVisualizer isListening={false} isSpeaking={isSpeaking} />

      {/* Scheme Header Card */}
      <div className="bg-gradient-to-br from-[#2a133d] to-[#1c0c29] border border-pink-500/40 rounded-3xl p-4 sm:p-5 shadow-xl mb-4 relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t.scheme_pmuy_badge}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
          {t.scheme_pmuy_simple_title}
        </h2>
        <p className="text-xs sm:text-sm text-pink-300/90 font-semibold mb-3">
          {PMUY_SCHEME.shortName} • {PMUY_SCHEME.ministry}
        </p>

        <p className="text-sm sm:text-base text-pink-100 font-medium leading-relaxed bg-black/20 p-3.5 rounded-2xl border border-white/5">
          {t.scheme_pmuy_desc}
        </p>
      </div>

      {/* Visual Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
        {PMUY_SCHEME.benefits.map((b, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#200f30]/90 border border-pink-500/30 flex items-start gap-3 shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-pink-950/60 border border-pink-500/30 flex-shrink-0">
              {getBenefitIcon(b.icon)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">
                {t[b.titleKey] || b.titleKey}
              </h4>
              <p className="text-xs text-pink-200/80 leading-snug">
                {t[b.descriptionKey] || b.descriptionKey}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Big Accessible Proceed Button */}
      <button
        onClick={onProceedToEligibility}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-pink-900/50 transition-transform active:scale-[0.98] border border-pink-400/30 cursor-pointer"
      >
        <span>{t.eligibility_title}</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      <p className="text-center text-xs text-gray-400 mt-2 font-medium">
        {t.eligibility_subtitle}
      </p>
    </div>
  );
};
