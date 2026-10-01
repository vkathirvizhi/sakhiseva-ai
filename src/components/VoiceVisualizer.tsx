import React from 'react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isListening, isSpeaking }) => {
  if (!isListening && !isSpeaking) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 h-10 my-2">
      {[40, 70, 100, 60, 90, 50, 80, 45, 85, 65].map((height, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full transition-all duration-150 ${
            isListening
              ? 'bg-rose-400'
              : 'bg-purple-400'
          }`}
          style={{
            height: `${Math.max(8, height * (isListening || isSpeaking ? 0.35 : 0.1))}px`,
            animation: 'wave-bounce 0.9s ease-in-out infinite',
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
};
