import React from 'react';

interface NexoOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isThinking?: boolean;
  className?: string;
  isNightMode?: boolean;
}

export const NexoOrb: React.FC<NexoOrbProps> = ({ 
  size = 'md', 
  isThinking = false, 
  className = '',
  isNightMode = false,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-24 h-24',
    xl: 'w-44 h-44',
  };

  const eyeSizeMap = {
    sm: 'w-1 h-2',
    md: 'w-1.5 h-3',
    lg: 'w-3 h-6',
    xl: 'w-4.5 h-9',
  };

  const eyeGapMap = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-3',
    xl: 'gap-4',
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer ambient glow with nocturnal aura */}
      <div 
        className={`absolute rounded-full filter blur-xl opacity-75 transition-all duration-700 ${sizeMap[size]}`}
        style={{
          background: isThinking 
            ? 'radial-gradient(circle, #24B8E8 0%, #7255F7 80%)'
            : isNightMode
            ? 'radial-gradient(circle, #A78BFA 0%, #7255F7 60%, #38BDF8 100%)'
            : 'radial-gradient(circle, #9378FF 0%, #7255F7 70%, #24B8E8 100%)'
        }}
      />

      {/* 3D Orb Body with subtle depth gradient & soft shadow */}
      <div 
        className={`relative rounded-full flex items-center justify-center transition-transform duration-300 ${sizeMap[size]} ${isThinking ? 'animate-pulse' : 'animate-float-orb'}`}
        style={{
          background: isNightMode
            ? 'radial-gradient(circle at 35% 30%, #B8A3FF 0%, #7255F7 45%, #3B1B9E 85%, #1F0D68 100%)'
            : 'radial-gradient(circle at 35% 30%, #A58EFF 0%, #7255F7 50%, #462AB8 90%, #2D1488 100%)',
          boxShadow: isNightMode
            ? 'inset -4px -6px 14px rgba(10, 2, 45, 0.7), inset 4px 6px 14px rgba(255, 255, 255, 0.45), 0 10px 30px -5px rgba(114, 85, 247, 0.7)'
            : 'inset -4px -6px 12px rgba(20, 5, 70, 0.45), inset 4px 6px 12px rgba(255, 255, 255, 0.35), 0 10px 25px -5px rgba(114, 85, 247, 0.5)'
        }}
      >
        {/* Specular highlight */}
        <div 
          className="absolute rounded-full bg-white opacity-40 blur-[1px]"
          style={{
            top: '18%',
            left: '28%',
            width: '24%',
            height: '14%',
            transform: 'rotate(-20deg)',
          }}
        />

        {/* Nexo Eyes: Two vertical pills glowing softly with blink animation */}
        <div className={`flex items-center justify-center ${eyeGapMap[size]}`}>
          <span 
            className={`rounded-full bg-white shadow-[0_0_8px_#ffffff] transition-all duration-300 animate-blink ${eyeSizeMap[size]} ${isThinking ? 'bg-[#24B8E8] shadow-[0_0_10px_#24B8E8]' : ''}`} 
          />
          <span 
            className={`rounded-full bg-white shadow-[0_0_8px_#ffffff] transition-all duration-300 animate-blink ${eyeSizeMap[size]} ${isThinking ? 'bg-[#24B8E8] shadow-[0_0_10px_#24B8E8]' : ''}`} 
          />
        </div>
      </div>
    </div>
  );
};
