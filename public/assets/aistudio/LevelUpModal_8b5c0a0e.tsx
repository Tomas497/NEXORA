import React from 'react';
import { Award, Sparkles, Gem, ArrowRight } from 'lucide-react';
import { NexoOrb } from './NexoOrb';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  title: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  level,
  title,
  onClose,
}) => {
  if (!isOpen) return null;

  const gemReward = level % 5 === 0 ? level * 10 : 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-[#E5E3F5] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-tr from-[#7255F7]/30 to-[#24B8E8]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-4">
          <NexoOrb size="lg" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECE8FE] text-[#7255F7] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          ¡Subiste de nivel!
        </div>

        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#202038] tracking-tight">
          Nivel {level}
        </h2>

        <p className="text-base text-[#585876] mt-1 font-medium">
          Nuevo título desbloqueado: <span className="font-bold text-[#7255F7]">{title}</span>
        </p>

        {/* Reward Card */}
        <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-[#F5F4FC] to-[#ECE8FE] border border-[#7255F7]/20 flex items-center justify-around">
          <div className="flex items-center gap-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#19C6A3]/15 text-[#19C6A3] flex items-center justify-center">
              <Gem className="w-5 h-5 fill-[#19C6A3]" />
            </div>
            <div>
              <div className="text-xs text-[#7A7A9E] font-medium">Recompensa</div>
              <div className="text-base font-bold text-[#202038]">+{gemReward} Gemas</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#7255F7]/15 text-[#7255F7] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#7A7A9E] font-medium">Estado</div>
              <div className="text-base font-bold text-[#7255F7]">{title}</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7255F7] to-[#5D3DE6] text-white font-bold text-base shadow-lg shadow-[#7255F7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continuar aprendiendo</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
