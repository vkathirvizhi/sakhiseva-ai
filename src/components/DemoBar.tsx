import React from 'react';
import { Sparkles, Play, FastForward, Info } from 'lucide-react';
import { AppScreen } from './StepProgress';

interface DemoBarProps {
  isDemoMode: boolean;
  onRunScenario: (scenario: 'gas_standard' | 'ujjwala_inquiry' | 'existing_gas') => void;
  onJumpToScreen: (screen: AppScreen) => void;
  currentScreen: AppScreen;
}

export const DemoBar: React.FC<DemoBarProps> = ({
  isDemoMode,
  onRunScenario,
  onJumpToScreen,
  currentScreen,
}) => {
  if (!isDemoMode) return null;

  return (
    <div className="bg-amber-950/70 border-b border-amber-500/40 px-3 sm:px-4 py-2 text-amber-200">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] tracking-wider shadow-sm">
            <Sparkles className="w-3 h-3" />
            JUDGES DEMO MODE
          </span>
          <span className="hidden md:inline text-amber-200/90 font-medium">
            Test full voice & logic flow in seconds without hardware dependencies:
          </span>
        </div>

        {/* Quick Test Scenarios */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onRunScenario('gas_standard')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-100 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 text-amber-400" />
            <span>Scenario 1: கேஸ் வேண்டும் (Pass)</span>
          </button>

          <button
            onClick={() => onRunScenario('existing_gas')}
            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 text-rose-400" />
            <span>Scenario 2: ஏற்கனவே உள்ளது (Mismatch)</span>
          </button>

          {/* Quick jump to steps */}
          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-amber-500/30">
            <FastForward className="w-3 h-3 text-amber-400" />
            <button
              onClick={() => onJumpToScreen('scheme_detail')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                currentScreen === 'scheme_detail' ? 'bg-amber-400 text-black font-bold' : 'text-amber-300 hover:text-white'
              }`}
            >
              திட்டம்
            </button>
            <button
              onClick={() => onJumpToScreen('eligibility')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                currentScreen === 'eligibility' ? 'bg-amber-400 text-black font-bold' : 'text-amber-300 hover:text-white'
              }`}
            >
              தகுதி
            </button>
            <button
              onClick={() => onJumpToScreen('documents')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                currentScreen === 'documents' ? 'bg-amber-400 text-black font-bold' : 'text-amber-300 hover:text-white'
              }`}
            >
              ஆவணம்
            </button>
            <button
              onClick={() => onJumpToScreen('handoff')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                currentScreen === 'handoff' ? 'bg-amber-400 text-black font-bold' : 'text-amber-300 hover:text-white'
              }`}
            >
              அரசு
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
