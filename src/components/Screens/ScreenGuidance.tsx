import React from 'react';
import { FolderCheck, MapPin, Fingerprint, CheckCircle2, ArrowRight, ArrowLeft, Volume2, Store } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../../data/translations';
import { PMUY_SCHEME } from '../../data/schemes';
import { VoiceVisualizer } from '../VoiceVisualizer';

interface ScreenGuidanceProps {
  language: LanguageCode;
  isSpeaking: boolean;
  onRepeatAudio: () => void;
  onProceedToHandoff: () => void;
  onGoBack: () => void;
}

export const ScreenGuidance: React.FC<ScreenGuidanceProps> = ({
  language,
  isSpeaking,
  onRepeatAudio,
  onProceedToHandoff,
  onGoBack,
}) => {
  const t = TRANSLATIONS[language];
  const steps = PMUY_SCHEME.applicationSteps;

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'FolderCheck':
        return <FolderCheck className="w-5 h-5 text-pink-400" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-amber-400" />;
      case 'Fingerprint':
        return <Fingerprint className="w-5 h-5 text-emerald-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-purple-400" />;
      default:
        return <Store className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <div className="flex flex-col px-4 py-3 sm:py-6 max-w-xl mx-auto w-full">
      {/* Top action bar */}
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

      {/* Guidance Header */}
      <div className="bg-gradient-to-br from-[#271239] to-[#180a24] border border-pink-500/40 rounded-3xl p-4 sm:p-5 shadow-xl mb-4">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tight">
          {t.guide_title}
        </h3>
        <p className="text-xs sm:text-sm text-pink-200/90 font-medium">
          {t.guide_subtitle}
        </p>
      </div>

      {/* 4-Step Process List */}
      <div className="flex flex-col gap-3 mb-6">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            className="p-4 rounded-2xl bg-[#200f30]/90 border border-pink-500/30 shadow-md flex items-start gap-3.5 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-950 border border-pink-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              {getStepIcon(step.icon)}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <h4 className="text-sm sm:text-base font-black text-white">
                  {t[step.titleKey] || step.titleKey}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                  {t[step.placeHintKey] || step.placeHintKey}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-pink-200/85 leading-relaxed">
                {t[step.descriptionKey] || step.descriptionKey}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Proceed to Official Handoff */}
      <button
        onClick={onProceedToHandoff}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl shadow-pink-900/50 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <span>அரசு தொடர்பு & உதவி எண் பார்க்க</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
