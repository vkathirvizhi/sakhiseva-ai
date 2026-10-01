import React from 'react';
import { Check, Flame, HelpCircle, FileText, CheckCircle2, PhoneCall } from 'lucide-react';
import { LanguageCode } from '../data/translations';

export type AppScreen =
  | 'welcome'
  | 'scheme_detail'
  | 'eligibility'
  | 'documents'
  | 'guidance'
  | 'handoff';

interface StepProgressProps {
  currentScreen: AppScreen;
  language: LanguageCode;
  onSelectStep?: (screen: AppScreen) => void;
}

export const StepProgress: React.FC<StepProgressProps> = ({ currentScreen, language, onSelectStep }) => {
  const steps: { id: AppScreen; number: number; labelTa: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'welcome',
      number: 1,
      labelTa: 'தேவை',
      labelEn: 'Need',
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    },
    {
      id: 'scheme_detail',
      number: 2,
      labelTa: 'திட்டம்',
      labelEn: 'Scheme',
      icon: <Flame className="w-3.5 h-3.5" />,
    },
    {
      id: 'eligibility',
      number: 3,
      labelTa: 'தகுதி',
      labelEn: 'Eligibility',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'documents',
      number: 4,
      labelTa: 'ஆவணம்',
      labelEn: 'Documents',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: 'handoff',
      number: 5,
      labelTa: 'விண்ணப்பம்',
      labelEn: 'Apply',
      icon: <PhoneCall className="w-3.5 h-3.5" />,
    },
  ];

  // Map guidance to step 5 as well
  const getActiveIndex = () => {
    switch (currentScreen) {
      case 'welcome':
        return 0;
      case 'scheme_detail':
        return 1;
      case 'eligibility':
        return 2;
      case 'documents':
        return 3;
      case 'guidance':
      case 'handoff':
        return 4;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting track line */}
        <div className="absolute left-4 right-4 top-4 h-1 bg-white/10 -z-0 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep && onSelectStep(step.id)}
              disabled={!onSelectStep || idx > activeIndex}
              className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none disabled:cursor-default"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-rose-500 text-white ring-4 ring-pink-500/30 scale-110 shadow-lg shadow-pink-900/50'
                    : isDone
                    ? 'bg-gradient-to-tr from-pink-600 to-purple-600 text-white'
                    : 'bg-[#201030] text-gray-400 border border-white/10'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
              </div>
              <span
                className={`text-[11px] sm:text-xs mt-1 font-semibold transition-colors ${
                  isCurrent ? 'text-pink-300 font-bold' : isDone ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                {language === 'ta' ? step.labelTa : step.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
