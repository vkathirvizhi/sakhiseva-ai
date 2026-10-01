import React, { useState } from 'react';
import { Volume2, Mic, MicOff, ArrowLeft, ArrowRight, HelpCircle, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../../data/translations';
import { PMUY_SCHEME, EligibilityQuestion } from '../../data/schemes';
import { VoiceVisualizer } from '../VoiceVisualizer';

interface ScreenEligibilityProps {
  language: LanguageCode;
  isSpeaking: boolean;
  isListening: boolean;
  onRepeatAudio: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onProceedToDocuments: () => void;
  onGoBack: () => void;
  lastTranscript?: string;
  isProcessing?: boolean;
}

export const ScreenEligibility: React.FC<ScreenEligibilityProps> = ({
  language,
  isSpeaking,
  isListening,
  onRepeatAudio,
  onStartListening,
  onStopListening,
  onProceedToDocuments,
  onGoBack,
  lastTranscript,
  isProcessing,
}) => {
  const t = TRANSLATIONS[language];
  const questions = PMUY_SCHEME.eligibilityQuestions;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | 'unknown'>>({});
  const [showWhy, setShowWhy] = useState(false);
  const [mismatchNotice, setMismatchNotice] = useState<string | null>(null);

  const currentQ: EligibilityQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const isFinished = currentIdx >= questions.length;

  const handleAnswer = (answer: 'yes' | 'no' | 'unknown') => {
    const updated = { ...answers, [currentQ.id]: answer };
    setAnswers(updated);

    // Check if the answer creates an eligibility constraint
    if (answer !== 'unknown' && answer !== currentQ.expectedAnswer) {
      // Show empathetic advisory explanation
      const noticeKey = currentQ.explanationIfMismatchKey;
      setMismatchNotice(t[noticeKey] || 'குறிப்பு: அரசு வழிகாட்டுதலின்படி கூடுதல் விவரம் தேவைப்படலாம்.');
    } else {
      setMismatchNotice(null);
      // Move to next question or finish
      if (isLastQuestion) {
        setCurrentIdx(questions.length); // trigger finished view
      } else {
        setCurrentIdx((prev) => prev + 1);
        setShowWhy(false);
      }
    }
  };

  const handleAcknowledgeNoticeAndProceed = () => {
    setMismatchNotice(null);
    if (isLastQuestion) {
      setCurrentIdx(questions.length);
    } else {
      setCurrentIdx((prev) => prev + 1);
      setShowWhy(false);
    }
  };

  const handlePrevQuestion = () => {
    setMismatchNotice(null);
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    } else {
      onGoBack();
    }
  };

  // Completion view when all 4 questions answered
  if (isFinished) {
    return (
      <div className="flex flex-col items-center text-center px-4 py-6 max-w-xl mx-auto w-full">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-950/50 animate-bounce">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          {t.eligibility_success_title}
        </h3>
        <p className="text-sm sm:text-base text-pink-200/90 leading-relaxed mb-6 bg-[#210f32] p-4 rounded-2xl border border-pink-500/30">
          {t.eligibility_success_desc}
        </p>

        <button
          onClick={onProceedToDocuments}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/50 active:scale-[0.98] transition-transform cursor-pointer"
        >
          <span>{t.see_documents_btn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentIdx(0)}
          className="mt-3 text-xs text-gray-400 hover:text-white font-semibold underline underline-offset-4"
        >
          {t.start_over}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-3 sm:py-6 max-w-xl mx-auto w-full">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          onClick={handlePrevQuestion}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.go_back}</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
          {t.step_of.replace('{current}', String(currentIdx + 1)).replace('{total}', String(questions.length))}
        </span>

        <button
          onClick={onRepeatAudio}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/40 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Volume2 className="w-3.5 h-3.5 text-pink-400" />
          <span>{t.repeat_audio}</span>
        </button>
      </div>

      <VoiceVisualizer isListening={isListening} isSpeaking={isSpeaking} />

      {/* Main Question Card */}
      <div className="bg-gradient-to-br from-[#2a123e] to-[#1c0c29] border border-pink-500/40 rounded-3xl p-5 sm:p-6 shadow-xl mb-4 relative">
        <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center justify-between">
          <span>கேள்வி {currentIdx + 1}</span>
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="text-[11px] text-pink-300/80 hover:text-pink-200 font-semibold underline flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{t.why_we_ask}</span>
          </button>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-white leading-relaxed mb-3">
          {t[currentQ.questionKey] || currentQ.questionKey}
        </h3>

        {/* Why we ask explanatory box */}
        {showWhy && (
          <div className="p-3 rounded-2xl bg-black/30 border border-pink-500/20 text-xs text-pink-200/90 leading-relaxed mb-3 animate-fadeIn">
            💡 {t[currentQ.whyWeAskKey] || currentQ.whyWeAskKey}
          </div>
        )}

        {/* Speech input transcript status */}
        {isListening && (
          <div className="mt-2 pt-2 border-t border-pink-500/20 text-center">
            <span className="text-xs text-rose-300 font-bold uppercase tracking-wider animate-pulse">
              {t.listening}
            </span>
            <p className="text-xs text-white font-medium italic mt-0.5">
              {lastTranscript || '...'}
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="mt-2 text-xs text-amber-300 font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{t.processing}</span>
          </div>
        )}
      </div>

      {/* If an advisory mismatch notice popped up */}
      {mismatchNotice ? (
        <div className="bg-amber-950/50 border border-amber-500/50 rounded-3xl p-4 sm:p-5 mb-4 shadow-lg animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-200 mb-1">
                முக்கிய வழிகாட்டல்
              </h4>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed mb-3">
                {mismatchNotice}
              </p>
              <button
                onClick={handleAcknowledgeNoticeAndProceed}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm transition-colors"
              >
                சரி, புரிந்தது. அடுத்த கேள்விக்கு செல்
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* BIG ACCESSIBLE ANSWER BUTTONS */
        <div className="flex flex-col gap-2.5 mb-4">
          <div className="grid grid-cols-2 gap-2.5">
            {/* YES button */}
            <button
              onClick={() => handleAnswer('yes')}
              className="py-4 sm:py-5 px-4 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-black text-lg sm:text-xl shadow-lg shadow-emerald-950/50 border border-emerald-400/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>👍 {t.yes}</span>
            </button>

            {/* NO button */}
            <button
              onClick={() => handleAnswer('no')}
              className="py-4 sm:py-5 px-4 rounded-2xl bg-rose-700/90 hover:bg-rose-600 text-white font-black text-lg sm:text-xl shadow-lg shadow-rose-950/50 border border-rose-400/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>👎 {t.no}</span>
            </button>
          </div>

          {/* I DON'T KNOW button */}
          <button
            onClick={() => handleAnswer('unknown')}
            className="w-full py-3 px-4 rounded-2xl bg-[#261239] hover:bg-[#34184e] text-pink-200 font-bold text-sm border border-pink-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-pink-400" />
            <span>{t.i_dont_know}</span>
          </button>
        </div>
      )}

      {/* Persistent Voice Answering Option */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <button
          onClick={isListening ? onStopListening : onStartListening}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
              : 'bg-white/10 hover:bg-white/15 text-pink-200 border border-white/10'
          }`}
        >
          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          <span>{isListening ? t.tap_to_stop : 'குரலில் பதில் சொல்லவும் (Speak answer)'}</span>
        </button>
      </div>
    </div>
  );
};
