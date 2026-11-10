import React, { useState } from 'react';
import { Sparkles, Shield, Heart, Zap, Check, AlertCircle } from 'lucide-react';
import { UserProgress, Language } from '../types';
import { STORE_ITEMS } from '../data/curriculum';
import { getTranslation } from '../i18n';

interface ShopViewProps {
  progress: UserProgress;
  inventory: string[];
  language: Language;
  onBuyItem: (itemId: string, costGems: number) => Promise<boolean>;
}

export const ShopView: React.FC<ShopViewProps> = ({
  progress,
  inventory,
  language,
  onBuyItem,
}) => {
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const t = (section: string, key: string) => getTranslation(language, section, key);

  const handlePurchase = async (itemId: string, cost: number) => {
    setBuyingId(itemId);
    setMessage(null);
    try {
      const ok = await onBuyItem(itemId, cost);
      if (ok) {
        setMessage({ text: '¡Artículo adquirido y equipado con éxito!' });
      } else {
        setMessage({ text: 'No tienes suficientes gemas para esta compra.', error: true });
      }
    } catch {
      setMessage({ text: 'Error procesando la compra.', error: true });
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-[#E5E3F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#7255F7] uppercase tracking-wider block">
            {t('shop', 'title')}
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-[#202038] mt-0.5">
            Potencia tu aprendizaje
          </h2>
          <p className="text-xs text-[#7A7A9E] mt-1">
            {t('shop', 'subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#E6F9F5] border border-[#19C6A3]/30 text-[#059669] w-fit">
          <Sparkles className="w-5 h-5 fill-[#19C6A3]" />
          <div>
            <div className="text-[10px] text-[#059669]/80 font-bold uppercase">{t('shop', 'yourGems')}</div>
            <div className="font-heading font-extrabold text-xl text-[#059669]">{progress.gems}</div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-bold border ${
          message.error ? 'bg-[#FEEBED] text-[#E11D48] border-[#FF6B91]/30' : 'bg-[#E6F9F5] text-[#059669] border-[#19C6A3]/30'
        }`}>
          {message.text}
        </div>
      )}

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STORE_ITEMS.map((item: any) => {
          const isOwned = inventory.includes(item.id);
          const canAfford = progress.gems >= item.costGems;
          return (
            <div
              key={item.id}
              className="bg-[var(--card-bg)] rounded-3xl p-6 border border-[var(--border-soft)] shadow-sm flex flex-col justify-between space-y-4 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#ECE8FE] text-[#7255F7] flex items-center justify-center">
                    {item.id === 'item_streak_freeze' && <Shield className="w-6 h-6" />}
                    {item.id === 'item_energy_refill' && <Heart className="w-6 h-6 fill-[#FF6B91] text-[#FF6B91]" />}
                    {item.id === 'item_double_xp' && <Zap className="w-6 h-6 fill-[#FFB547] text-[#FFB547]" />}
                    {item.id === 'item_frame_neon' && <Sparkles className="w-6 h-6 fill-[#24B8E8] text-[#24B8E8]" />}
                  </div>
                  <div className="flex items-center gap-1 font-heading font-extrabold text-sm text-[#059669] bg-[#E6F9F5] px-2.5 py-1 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5 fill-[#19C6A3]" />
                    <span>{item.costGems}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-extrabold text-base text-[#202038]">
                    {item.title[language] || item.title.es}
                  </h4>
                  <p className="text-xs text-[#585876] mt-1 leading-relaxed">
                    {item.description[language] || item.description.es}
                  </p>
                </div>
              </div>

              <button
                disabled={buyingId === item.id || (!canAfford && !isOwned)}
                onClick={() => handlePurchase(item.id, item.costGems)}
                className={`w-full py-3 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isOwned && item.category === 'streak'
                    ? 'bg-[#E6F9F5] text-[#059669] border border-[#19C6A3]/30 cursor-default'
                    : canAfford
                    ? 'bg-[#7255F7] hover:bg-[#5D3DE6] text-white shadow-[#7255F7]/25'
                    : 'bg-[#F5F4FC] text-[#8E8EA8] border border-[#E5E3F5] cursor-not-allowed'
                }`}
              >
                {isOwned && item.category === 'streak' ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{t('shop', 'equipped')} ({progress.streakProtectors}/2)</span>
                  </>
                ) : (
                  <span>{canAfford ? t('shop', 'buy') : 'Gemas insuficientes'}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
