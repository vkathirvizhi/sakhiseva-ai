import React, { useState } from 'react';
import { CreditCard, FileText, Building2, Camera, FileCheck, Check, ArrowRight, ArrowLeft, Volume2, ShieldCheck } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../../data/translations';
import { PMUY_SCHEME, DocumentItem } from '../../data/schemes';
import { VoiceVisualizer } from '../VoiceVisualizer';

interface ScreenDocumentsProps {
  language: LanguageCode;
  isSpeaking: boolean;
  onRepeatAudio: () => void;
  onProceedToGuidance: () => void;
  onGoBack: () => void;
}

export const ScreenDocuments: React.FC<ScreenDocumentsProps> = ({
  language,
  isSpeaking,
  onRepeatAudio,
  onProceedToGuidance,
  onGoBack,
}) => {
  const t = TRANSLATIONS[language];
  const docs = PMUY_SCHEME.requiredDocuments;

  // Track which documents user has marked as ready
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    aadhaar: true,
    ration_card: true,
  });

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getDocIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-pink-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-amber-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-emerald-400" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-blue-400" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-pink-400" />;
    }
  };

  const readyCount = Object.values(checkedDocs).filter(Boolean).length;

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

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          ✓ {readyCount} / {docs.length} தயார்
        </span>

        <button
          onClick={onRepeatAudio}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/40 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Volume2 className="w-3.5 h-3.5 text-pink-400" />
          <span>{t.repeat_audio}</span>
        </button>
      </div>

      <VoiceVisualizer isListening={false} isSpeaking={isSpeaking} />

      {/* Header Info */}
      <div className="bg-gradient-to-br from-[#271239] to-[#190a25] border border-pink-500/40 rounded-3xl p-4 sm:p-5 shadow-xl mb-4">
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.official_source_badge}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tight">
          {t.docs_title}
        </h3>
        <p className="text-xs sm:text-sm text-pink-200/90 font-medium">
          {t.docs_subtitle}
        </p>
      </div>

      {/* Interactive Document Cards */}
      <div className="flex flex-col gap-2.5 mb-6">
        {docs.map((doc: DocumentItem) => {
          const isChecked = !!checkedDocs[doc.id];

          return (
            <button
              key={doc.id}
              onClick={() => toggleDoc(doc.id)}
              className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 shadow-md cursor-pointer ${
                isChecked
                  ? 'bg-[#1b2a22] border-emerald-500/50 shadow-emerald-950/40'
                  : 'bg-[#210f30]/80 border-pink-500/30 hover:border-pink-500/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl border mt-0.5 flex-shrink-0 ${
                    isChecked
                      ? 'bg-emerald-950 border-emerald-500/40'
                      : 'bg-[#2e1544] border-pink-500/30'
                  }`}
                >
                  {getDocIcon(doc.icon)}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white mb-0.5">
                    {t[doc.nameKey] || doc.nameKey}
                  </h4>
                  <p className="text-xs text-pink-200/80 leading-snug">
                    {t[doc.villageLocationHint] || doc.villageLocationHint}
                  </p>
                </div>
              </div>

              {/* Checkbox state button */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors ${
                  isChecked
                    ? 'bg-emerald-500 border-emerald-400 text-black font-bold'
                    : 'bg-black/30 border-white/20 text-transparent'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Proceed Button */}
      <button
        onClick={onProceedToGuidance}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl shadow-pink-900/50 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <span>{t.docs_guidance_next}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
