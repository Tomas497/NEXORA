import React, { useState } from 'react';
import { 
  Globe, 
  Target, 
  Shield, 
  Moon, 
  Eye, 
  Download, 
  Trash2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { UserProfile, Language } from '../types';
import { getTranslation } from '../i18n';

interface SettingsViewProps {
  user: UserProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
  onExportData: () => void;
  onDeleteAccount: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  language,
  setLanguage,
  onUpdateProfile,
  onExportData,
  onDeleteAccount,
}) => {
  const [displayName, setDisplayName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [dailyGoal, setDailyGoal] = useState<number>(user.dailyGoalXP || 20);
  const [isPublic, setIsPublic] = useState<boolean>(user.isProfilePublic ?? true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(user.reducedMotion ?? false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const t = (section: string, key: string) => getTranslation(language, section, key);

  const handleSave = () => {
    onUpdateProfile({
      name: displayName.trim() || user.name,
      bio: bio.trim(),
      dailyGoalXP: dailyGoal as any,
      isProfilePublic: isPublic,
      reducedMotion,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-3xl mx-auto">
      <div className="bg-[var(--card-bg)] rounded-[28px] p-6 sm:p-8 shadow-sm border border-[var(--border-soft)] space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-[var(--text-main)]">
            {t('settingsView', 'title')}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Personaliza tu experiencia, metas y privacidad en NEXORA.
          </p>
        </div>

        {savedMessage && (
          <div className="p-4 rounded-2xl bg-[#E6F9F5] text-[#059669] text-xs font-bold border border-[#19C6A3]/30 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Ajustes guardados correctamente.</span>
          </div>
        )}

        {/* Profile Info: Name & Bio */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#585876] mb-1.5">
              Tu Nombre
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-soft)] text-sm focus:outline-none focus:border-[#7255F7] font-semibold text-[var(--text-main)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#585876] mb-1.5">
              Biografía / Carrera o Metas
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ej: Estudiante de Ingeniería / Apasionado por STEM"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-soft)] text-sm focus:outline-none focus:border-[#7255F7] text-[var(--text-main)]"
            />
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-[#585876] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#7255F7]" />
            <span>{t('settingsView', 'languageLabel')}</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: 'es', label: 'Español' },
              { code: 'en', label: 'English' },
              { code: 'pt', label: 'Português' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code as Language)}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  language === l.code
                    ? 'border-2 border-[#7255F7] bg-[#ECE8FE] text-[#7255F7] shadow-sm'
                    : 'border-[var(--border-soft)] bg-white text-[#585876] hover:bg-[#F5F4FC]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Study Goal */}
        <div className="space-y-3 pt-4 border-t border-[#F0EEFA]">
          <label className="text-xs font-bold text-[#585876] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#FFB547]" />
            <span>{t('settingsView', 'dailyGoalLabel')}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[10, 20, 30, 50].map((goal) => (
              <button
                key={goal}
                onClick={() => setDailyGoal(goal)}
                className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  dailyGoal === goal
                    ? 'border-2 border-[#7255F7] bg-[#ECE8FE] text-[#7255F7]'
                    : 'border-[var(--border-soft)] bg-white text-[#585876] hover:bg-[#F5F4FC]'
                }`}
              >
                {goal} XP / día
              </button>
            ))}
          </div>
        </div>

        {/* Privacy & Accessibility */}
        <div className="space-y-4 pt-4 border-t border-[#F0EEFA]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#19C6A3]" />
              <div>
                <div className="text-xs font-bold text-[var(--text-main)]">{t('settingsView', 'publicProfile')}</div>
                <div className="text-[11px] text-[var(--text-muted)]">Permite competir en ligas y aparecer en el ranking</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 accent-[#7255F7] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[#24B8E8]" />
              <div>
                <div className="text-xs font-bold text-[var(--text-main)]">{t('settingsView', 'reducedMotion')}</div>
                <div className="text-[11px] text-[var(--text-muted)]">Minimiza animaciones y efectos visuales de flotación</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="w-5 h-5 accent-[#7255F7] cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white font-bold text-sm shadow-md shadow-[#7255F7]/30 transition-all cursor-pointer"
        >
          Guardar cambios
        </button>

        {/* Data Export & Account Deletion */}
        <div className="pt-6 border-t border-[#F0EEFA] flex flex-col sm:flex-row gap-3 justify-between items-center">
          <button
            onClick={onExportData}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[var(--border-soft)] text-xs font-bold text-[#585876] hover:bg-[#F5F4FC] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#7255F7]" />
            <span>{t('settingsView', 'exportData')}</span>
          </button>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-[#E11D48] hover:bg-[#FEEBED] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('settingsView', 'deleteAccount')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onDeleteAccount}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                Confirmar borrado
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
