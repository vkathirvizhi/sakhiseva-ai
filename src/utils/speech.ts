// Speech synthesis and recognition utility for SakhiSeva

export class SoundEffects {
  private static ctx: AudioContext | null = null;

  private static getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Pleasant notification chime when microphone starts listening
  static playListeningChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio context might be restricted
    }
  }

  // Soft chime when speech is captured or completed
  static playSuccessChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2); // A5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Ignore
    }
  }
}

// Text-to-Speech service
export class TTSService {
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  static stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  static speak(
    text: string,
    langCode: string = 'ta-IN',
    rate: number = 0.9,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    this.stop();

    // Clean text of emojis or markdown symbols that could confuse TTS
    const cleanText = text
      .replace(/[✓✕✦★#*_~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = rate; // slightly slower for rural clarity
    utterance.pitch = 1.05; // warm friendly voice

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(
      (v) =>
        v.lang === langCode ||
        v.lang.replace('_', '-').startsWith(langCode.split('-')[0])
    );
    if (match) {
      utterance.voice = match;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.currentUtterance = null;
      onEnd?.();
    };

    this.currentUtterance = utterance;

    // Small delay prevents speech synthesis cancellation glitch in some browsers
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }
}

// Check if browser SpeechRecognition is available
export function getSpeechRecognition(): any {
  if (typeof window === 'undefined') return null;
  const SpeechRec =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  return SpeechRec || null;
}
