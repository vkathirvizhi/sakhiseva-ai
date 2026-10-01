import React, { useState } from 'react';
import { X, Sparkles, HeartHandshake, ShieldCheck, Globe, Smartphone, Flame, Users, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../data/translations';

interface JudgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'why' | 'impact' | 'future';
  language: LanguageCode;
}

export const JudgesModal: React.FC<JudgesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'why',
}) => {
  const [activeTab, setActiveTab] = useState<'why' | 'impact' | 'future'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1c0c29] border border-pink-500/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-pink-500/30 flex items-center justify-between bg-[#241035]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                SakhiSeva • Hackathon Overview
              </h3>
              <p className="text-xs text-pink-300/80 font-semibold">
                Challenge: "The Invisible Woman"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-pink-500/20 bg-[#160822] px-3 pt-2 gap-1">
          <button
            onClick={() => setActiveTab('why')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'why'
                ? 'bg-[#1c0c29] text-pink-300 border-t border-x border-pink-500/40'
                : 'text-gray-400 hover:text-pink-200'
            }`}
          >
            💡 How This Helps
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'impact'
                ? 'bg-[#1c0c29] text-pink-300 border-t border-x border-pink-500/40'
                : 'text-gray-400 hover:text-pink-200'
            }`}
          >
            🎯 Problem & Impact
          </button>
          <button
            onClick={() => setActiveTab('future')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'future'
                ? 'bg-[#1c0c29] text-pink-300 border-t border-x border-pink-500/40'
                : 'text-gray-400 hover:text-pink-200'
            }`}
          >
            🚀 Future Roadmap
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-pink-100/90 leading-relaxed">
          {activeTab === 'why' && (
            <div className="space-y-3.5">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span>Designed for Zero-Digital Literacy Women</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-500/20">
                  <div className="font-bold text-pink-300 flex items-center gap-1.5 mb-1">
                    <HeartHandshake className="w-4 h-4 text-pink-400" />
                    <span>Voice-First Architecture</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    The user can navigate the entire application without reading or writing a single word of English or Tamil. Everything is spoken aloud with browser SpeechSynthesis and Web Speech Recognition.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-500/20">
                  <div className="font-bold text-pink-300 flex items-center gap-1.5 mb-1">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>Regional Spoken Dialects</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Gemini 3.8 Flash handles colloquial Tamil, Tanglish, and village speech patterns ("gas stove venum", "kudumba thalaivi") to accurately map intent without bureaucratic friction.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-500/20">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Anti-Hallucination Policy</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    The app strictly rejects inventing subsidy amounts, deadlines, or mock submission success. When offline or handing off, it links directly to official government portals (pmuy.gov.in) and toll-free lines.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-pink-500/20">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Low-End Device Friendly</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Zero heavy WebGL/Three.js bloat. High contrast pink/dark theme for direct sunlight visibility in rural villages, large 56px touch targets, and resilient graceful offline fallbacks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-100">
                <div className="font-bold text-rose-300 text-sm flex items-center gap-2 mb-1.5">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>The Real Crisis: "The Invisible Woman"</span>
                </div>
                <p className="text-xs leading-relaxed">
                  In rural India, millions of women wake up at 4:30 AM to gather firewood and cow dung cakes. Cooking over traditional mud chulhas produces deadly fine particulate matter (PM2.5), causing respiratory diseases, cataract blindness, and premature mortality.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-100">
                <div className="font-bold text-purple-300 text-sm flex items-center gap-2 mb-1.5">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>The Digital Literacy Gap</span>
                </div>
                <p className="text-xs leading-relaxed">
                  While the Indian Government created Pradhan Mantri Ujjwala Yojana (PMUY) with deposit-free cylinders, the target beneficiaries cannot read digital portals, don't own laptops, and often get exploited or discouraged by middlemen.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100">
                <div className="font-bold text-emerald-300 text-sm flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>The SakhiSeva Solution</span>
                </div>
                <p className="text-xs leading-relaxed">
                  SakhiSeva acts like an empathetic village companion sitting right next to her. She speaks her dialect, verifies her documents step-by-step, explains what to expect at the gas agency, and connects her directly to authorized helplines.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'future' && (
            <div className="space-y-3">
              <h4 className="text-base font-black text-white">Future Expansion Roadmap</h4>
              <ul className="space-y-2 text-xs text-gray-200">
                <li className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                  <span className="text-pink-400 font-bold">1.</span>
                  <div>
                    <strong className="text-white">IVR & Missed Call Dial-in:</strong> Rural women with basic feature phones (non-smartphones) can dial a toll-free number and complete the Sakhi voice guidance via cellular audio.
                  </div>
                </li>
                <li className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                  <span className="text-pink-400 font-bold">2.</span>
                  <div>
                    <strong className="text-white">WhatsApp Audio Bot:</strong> Send voice notes in Tamil or Hindi to receive step-by-step audio notes and visual document cards.
                  </div>
                </li>
                <li className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                  <span className="text-pink-400 font-bold">3.</span>
                  <div>
                    <strong className="text-white">Expansion to 5 More Women Schemes:</strong> PM Matru Vandana Yojana (₹5,000 maternity cash assistance), PM Awas Yojana (housing in female head's name), and State-specific assistance.
                  </div>
                </li>
                <li className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                  <span className="text-pink-400 font-bold">4.</span>
                  <div>
                    <strong className="text-white">Authorized CSC Integration:</strong> Direct handshake with Common Service Center operators for biometric appointment booking with zero middlemen extortion.
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-pink-500/30 bg-[#241035] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm cursor-pointer"
          >
            சரி, மூடு (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
