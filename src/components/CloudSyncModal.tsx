import React, { useState } from 'react';
import { 
  Cloud, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  Smartphone, 
  Laptop, 
  RotateCcw, 
  Download, 
  X,
  Sparkles,
  ShieldCheck,
  Server
} from 'lucide-react';
import { CloudSyncStatus, CloudSnapshot, UserProgress } from '../types';
import { sound } from '../utils/soundEngine';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudSync: CloudSyncStatus;
  progress: UserProgress;
  onPerformSync: () => Promise<void>;
  onRestoreSnapshot: (snapshotId: string) => Promise<void>;
  onExportData: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  cloudSync,
  progress,
  onPerformSync,
  onRestoreSnapshot,
  onExportData,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSyncNow = async () => {
    setIsSyncing(true);
    sound.playClick();
    try {
      await onPerformSync();
      sound.playSyncSuccess();
      setSyncSuccessMsg(true);
      setTimeout(() => setSyncSuccessMsg(false), 2500);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestore = async (snapId: string) => {
    setRestoringId(snapId);
    sound.playClick();
    try {
      await onRestoreSnapshot(snapId);
      sound.playLevelUp();
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[var(--card-bg)] text-[var(--text-main)] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border-soft)] space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-soft)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#24B8E8]/15 text-[#24B8E8] flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl tracking-tight">
                Sincronización en la Nube
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Tu progreso, lecciones y estadísticas respaldados en tiempo real.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[var(--card-elevated)] hover:bg-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#ECE8FE]/40 via-[#EBF7FC]/40 to-[#E6F9F5]/40 border border-[#7255F7]/25 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="font-heading font-extrabold text-sm flex items-center gap-1.5">
                  <span>Nube Conectada & Sincronizada</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  Último guardado: {cloudSync.lastSyncedAt || 'Ahora mismo'}
                </div>
              </div>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white text-xs font-bold shadow-md shadow-[#7255F7]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
            </button>
          </div>

          {syncSuccessMsg && (
            <div className="p-2.5 rounded-xl bg-[#E6F9F5] text-[#059669] text-xs font-bold border border-[#19C6A3]/30 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Punto de sincronización guardado en la nube!</span>
            </div>
          )}

          {/* Sync Stats mini pill */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-soft)]">
              <div className="font-heading font-extrabold text-sm text-[#7255F7]">{progress.xp} XP</div>
              <div className="text-[10px] text-[var(--text-muted)] font-semibold">En la nube</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-soft)]">
              <div className="font-heading font-extrabold text-sm text-[#24B8E8]">Nivel {progress.level}</div>
              <div className="text-[10px] text-[var(--text-muted)] font-semibold">Calibrado</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-soft)]">
              <div className="font-heading font-extrabold text-sm text-[#19C6A3]">{cloudSync.snapshots.length}</div>
              <div className="text-[10px] text-[var(--text-muted)] font-semibold">Copias guardadas</div>
            </div>
          </div>
        </div>

        {/* Multi-Device Support Strip */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] block">
            Dispositivos Vinculados
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)] flex items-center gap-3">
              <Laptop className="w-5 h-5 text-[#7255F7]" />
              <div>
                <div className="font-heading font-bold text-xs">Navegador Web / PC</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Sesión activa · En línea</div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)] flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#24B8E8]" />
              <div>
                <div className="font-heading font-bold text-xs">Móvil PWA / Tablet</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Sincronizado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Restore Points / Snapshots List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
              Puntos de Restauración en la Nube
            </label>
            <span className="text-[11px] text-[var(--text-muted)]">
              Historial seguro
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {cloudSync.snapshots.map((snap) => (
              <div
                key={snap.id}
                className="p-3 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#7255F7] shrink-0" />
                  <div>
                    <div className="font-bold text-[var(--text-main)]">
                      {snap.formattedTime}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Nivel {snap.level} · {snap.xp} XP · {snap.summary}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRestore(snap.id)}
                  disabled={restoringId === snap.id}
                  className="px-3 py-1.5 rounded-xl border border-[#7255F7]/30 bg-[var(--card-bg)] text-[#7255F7] font-bold text-xs hover:bg-[#ECE8FE]/50 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <RotateCcw className={`w-3 h-3 ${restoringId === snap.id ? 'animate-spin' : ''}`} />
                  <span>{restoringId === snap.id ? 'Restaurando...' : 'Restaurar'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Export JSON Backup option */}
        <div className="pt-3 border-t border-[var(--border-soft)] flex items-center justify-between">
          <button
            onClick={onExportData}
            className="px-4 py-2 rounded-xl border border-[var(--border-soft)] hover:bg-[var(--card-elevated)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Archivo JSON de Respaldo</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
