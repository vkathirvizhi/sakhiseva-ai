import React, { useState } from 'react';
import { ExternalLink, PhoneCall, AlertTriangle, ShieldCheck, RotateCcw, Share2, Check, MapPin, Heart } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../../data/translations';
import { PMUY_SCHEME } from '../../data/schemes';

interface ScreenHandoffProps {
  language: LanguageCode;
  onStartOver: () => void;
  onGoBack: () => void;
}

export const ScreenHandoff: React.FC<ScreenHandoffProps> = ({
  language,
  onStartOver,
  onGoBack,
}) => {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const summaryText = `சகீ சேவா (SakhiSeva) - பிரதம மந்திரி உஜ்வாலா யோஜனா (PMUY 2.0) இலவச கேஸ் திட்டம் வழிகாட்டி:
1. ஆதார் அட்டை, ரேஷன் கார்டு, வங்கி புத்தகம் மற்றும் 2 போட்டோ நகல்கள் எடுக்கவும்.
2. அருகிலுள்ள Indane / Bharatgas / HP Gas ஏஜென்சி செல்லவும்.
3. கைரேகை e-KYC இலவசமாக செய்து இலவச சிலிண்டர் & அடுப்பு பெறலாம்.
அரசு உதவி எண்: 1800-266-6696 | இணையதளம்: https://www.pmuy.gov.in`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
          <span>← {t.go_back}</span>
        </button>

        <button
          onClick={onStartOver}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/40 text-xs font-bold transition-all shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.start_over}</span>
        </button>
      </div>

      {/* Strict Transparency Disclaimer Card */}
      <div className="bg-amber-950/40 border border-amber-500/50 rounded-3xl p-4 sm:p-5 mb-5 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-amber-300 mb-1 flex items-center gap-1.5">
              <span>நேர்மை மற்றும் வெளிப்படைத்தன்மை உறுதிமொழி</span>
            </h4>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              {t.official_disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Official Government Direct Links */}
      <div className="bg-gradient-to-br from-[#271239] to-[#180a24] border border-pink-500/40 rounded-3xl p-5 shadow-xl mb-5">
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.official_source_badge}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-white mb-2">
          {t.official_handoff_title}
        </h3>

        {/* Link 1: Official PMUY Portal */}
        <a
          href={PMUY_SCHEME.officialPortal}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-between shadow-lg shadow-pink-900/40 mb-3 group transition-transform active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-pink-200" />
            <span>{t.official_portal_btn}</span>
          </span>
          <span className="text-xs bg-black/20 px-2.5 py-1 rounded-full group-hover:bg-black/30">
            pmuy.gov.in ↗
          </span>
        </a>

        {/* Link 2: CSC Rural Seva Kendra locator */}
        <a
          href="https://findmycsc.nic.in"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-3.5 rounded-2xl bg-[#231034] hover:bg-[#2e1544] border border-pink-500/40 text-pink-100 font-bold text-xs sm:text-sm flex items-center justify-between transition-colors mb-3"
        >
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{t.find_csc_btn}</span>
          </span>
          <span className="text-xs text-gray-400">findmycsc.nic.in ↗</span>
        </a>

        {/* Toll-Free Calling Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href={`tel:${PMUY_SCHEME.officialTollFree}`}
            className="p-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>{t.call_toll_free_btn}</span>
          </a>

          <a
            href={`tel:${PMUY_SCHEME.emergencyHelpline}`}
            className="p-3.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 text-rose-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <span>{t.emergency_call_btn}</span>
          </a>
        </div>
      </div>

      {/* Share / Save Summary Button */}
      <button
        onClick={handleShare}
        className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-pink-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors mb-4"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300">விவரங்கள் நகலெடுக்கப்பட்டது (Copied!)</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span>{t.share_or_save}</span>
          </>
        )}
      </button>

      {/* Empathy Footer */}
      <div className="text-center p-3 rounded-2xl bg-pink-500/5 border border-pink-500/10 text-xs text-pink-300/80 font-medium flex items-center justify-center gap-1.5">
        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        <span>சகீ சேவா • கிராமப்புற பெண்களின் தற்சார்பு மற்றும் ஆரோக்கியத்திற்கான குரல்</span>
      </div>
    </div>
  );
};
