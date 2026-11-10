import React, { useState } from 'react';
import { Eye, EyeOff, X, Sparkles, GraduationCap, User } from 'lucide-react';
import { NexoOrb } from './NexoOrb';
import { Language, UserRole } from '../types';
import { getTranslation } from '../i18n';
import { sound } from '../utils/soundEngine';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAuthSuccess: (userProfile: any) => void;
  onQuickDemoSwitch: (userId: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onAuthSuccess,
  onQuickDemoSwitch,
  initialMode = 'register',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const t = (section: string, key: string) => getTranslation(language, section, key);

  const handleGoogleAuth = async () => {
    setLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'ortizpalaciot@gmail.com',
          name: 'Tomás Ortiz',
        }),
      });
      const data = await res.json();
      if (data.user) {
        sound.playLevelUp();
        onAuthSuccess(data.user);
        onClose();
      }
    } catch {
      setError('Error al conectar con Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestStart = async () => {
    setLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Estudiante',
          email: email.trim() || `estudiante_${Date.now()}@nexora.app`,
          role: 'student',
        }),
      });
      const data = await res.json();
      if (data.user) {
        sound.playLevelUp();
        onAuthSuccess(data.user);
        onClose();
      }
    } catch {
      setError('Error al iniciar como invitado.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    sound.playClick();

    if (mode === 'forgot') {
      setResetSent(true);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim() || 'Estudiante',
            email: email.trim(),
            password,
            role,
          }),
        });
        const data = await res.json();
        if (data.user) {
          sound.playLevelUp();
          onAuthSuccess(data.user);
          onClose();
        } else {
          setError(data.error || 'Error al crear la cuenta.');
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            name: name.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (data.user) {
          sound.playLevelUp();
          onAuthSuccess(data.user);
          onClose();
        } else {
          setError(data.error || 'Error al iniciar sesión.');
        }
      }
    } catch {
      setError('Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[var(--card-bg)] text-[var(--text-main)] rounded-[28px] shadow-2xl border border-[var(--border-soft)] overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[var(--card-elevated)] hover:bg-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Dark Hero Visual */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-b from-[#1C1A38] via-[#16142E] to-[#0E0C22] text-white p-8 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#7255F7]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <span className="font-heading font-extrabold text-xl tracking-tight text-white">
              NEXORA
            </span>

            <div className="inline-block bg-white text-[#202038] text-xs font-semibold px-3.5 py-1.5 rounded-2xl rounded-bl-sm shadow-md">
              ¿Lo vemos con un ejemplo?
            </div>
          </div>

          <div className="my-auto py-8 flex flex-col items-center justify-center relative z-10">
            <div className="relative w-48 h-48 rounded-full border border-dashed border-white/20 flex items-center justify-center">
              <NexoOrb size="lg" />
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-[#19C6A3] text-white text-[11px] font-extrabold shadow-md">
                +50 XP
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-2">
            <h3 className="font-heading font-extrabold text-2xl text-white tracking-tight leading-tight">
              Cada mente aprende diferente.
            </h3>
            <p className="text-xs text-white/75 leading-relaxed font-normal">
              Crea tu cuenta y Nexo diseñará una ruta de aprendizaje adaptada a ti en menos de dos minutos.
            </p>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-[var(--text-main)]">
                {mode === 'register' ? t('auth', 'createAccount') : mode === 'login' ? t('auth', 'loginTitle') : t('auth', 'forgotPassword')}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">
                {mode === 'register' ? t('auth', 'createAccountSubtitle') : t('auth', 'loginSubtitle')}
              </p>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl border border-[var(--border-soft)] hover:bg-[var(--card-elevated)] text-sm font-semibold text-[var(--text-main)] flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continuar con Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGuestStart}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#ECE8FE] hover:bg-[#DED8FD] text-xs font-bold text-[#7255F7] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Empezar de inmediato desde cero (Nivel 1, 0 XP)</span>
                </button>

                <div className="relative flex items-center justify-center pt-2">
                  <div className="w-full border-t border-[var(--border-soft)]" />
                  <span className="bg-[var(--card-bg)] px-3 text-xs text-[var(--text-muted)] uppercase font-semibold absolute">
                    {t('auth', 'orWithEmail')}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold border border-red-500/20">
                  {error}
                </div>
              )}

              {resetSent && (
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
                  Se ha enviado un enlace de recuperación a tu correo electrónico.
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                    {t('auth', 'fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo (ej: Tomás Ortiz)"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--card-elevated)] text-sm focus:outline-none focus:border-[#7255F7] text-[var(--text-main)]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  {t('auth', 'email')}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--card-elevated)] text-sm focus:outline-none focus:border-[#7255F7] text-[var(--text-main)]"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-[var(--text-muted)]">
                      {t('auth', 'password')}
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-xs font-semibold text-[#7255F7] hover:underline"
                      >
                        {t('auth', 'forgotPassword')}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[var(--border-soft)] bg-[var(--card-elevated)] text-sm focus:outline-none focus:border-[#7255F7] text-[var(--text-main)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5">
                    {t('auth', 'selectRole')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        role === 'student'
                          ? 'border-[#7255F7] bg-[#ECE8FE] text-[#7255F7] font-bold'
                          : 'border-[var(--border-soft)] text-[var(--text-muted)] hover:bg-[var(--card-elevated)]'
                      }`}
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <div className="text-xs font-semibold">{t('auth', 'studentRole')}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        role === 'teacher'
                          ? 'border-[#19C6A3] bg-[#E6F9F5] text-[#059669] font-bold'
                          : 'border-[var(--border-soft)] text-[var(--text-muted)] hover:bg-[var(--card-elevated)]'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <div className="text-xs font-semibold">{t('auth', 'teacherRole')}</div>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white font-bold text-sm shadow-lg shadow-[#7255F7]/30 transition-all cursor-pointer mt-2"
              >
                {mode === 'register'
                  ? t('auth', 'registerAction')
                  : mode === 'login'
                  ? t('auth', 'loginAction')
                  : t('auth', 'sendResetLink')}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-[var(--border-soft)] mt-4 space-y-3">
            <div className="text-center text-xs text-[var(--text-muted)]">
              {mode === 'register' ? (
                <>
                  {t('auth', 'alreadyHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-[#7255F7] hover:underline cursor-pointer"
                  >
                    {t('brand', 'login')}
                  </button>
                </>
              ) : (
                <>
                  {t('auth', 'dontHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-bold text-[#7255F7] hover:underline cursor-pointer"
                  >
                    {t('brand', 'register')}
                  </button>
                </>
              )}
            </div>

            <div className="pt-2 bg-[var(--card-elevated)] p-2.5 rounded-2xl text-[11px] text-[var(--text-muted)]">
              <span className="font-bold text-[var(--text-main)] block mb-1">Cuentas de prueba con datos precargados:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => { onQuickDemoSwitch('user_new'); onClose(); }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--border-soft)] hover:border-[#7255F7] font-semibold text-[#7255F7] cursor-pointer"
                >
                  ✨ Tomás Ortiz (Nivel 1)
                </button>
                <button
                  type="button"
                  onClick={() => { onQuickDemoSwitch('user_sofia'); onClose(); }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--border-soft)] font-semibold text-[var(--text-muted)] cursor-pointer"
                >
                  Sofía (Nivel 5)
                </button>
                <button
                  type="button"
                  onClick={() => { onQuickDemoSwitch('user_teacher'); onClose(); }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--border-soft)] font-semibold text-[#19C6A3] cursor-pointer"
                >
                  Prof. Martínez
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
