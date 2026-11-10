import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Moon, 
  Sun, 
  Sparkles, 
  Clock, 
  Calendar, 
  Target, 
  Flame, 
  CloudRain, 
  Headphones, 
  Volume2, 
  VolumeX, 
  Check, 
  Tag, 
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyTask, UserProfile, UserProgress, UserThemeConfig } from '../types';
import { sound } from '../utils/soundEngine';

interface TasksViewProps {
  user: UserProfile;
  progress: UserProgress;
  tasks: StudyTask[];
  themeConfig: UserThemeConfig;
  onToggleTask: (taskId: string) => Promise<void>;
  onCreateTask: (task: Partial<StudyTask>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onCompletePomodoro: (minutes: number) => Promise<void>;
  onOpenThemeModal: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  user,
  progress,
  tasks,
  themeConfig,
  onToggleTask,
  onCreateTask,
  onDeleteTask,
  onCompletePomodoro,
  onOpenThemeModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'night' | 'high' | 'pending' | 'completed'>('all');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Cálculo I');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newIsNight, setNewIsNight] = useState(true);
  const [newEstMinutes, setNewEstMinutes] = useState(25);

  // Pomodoro Timer State
  const [pomodoroDuration, setPomodoroDuration] = useState(25 * 60); // 25 min default
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'break'>('focus');

  // Pomodoro countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      sound.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      const sessionMins = Math.round(pomodoroDuration / 60);
      onCompletePomodoro(sessionMins);

      // Switch to break
      if (pomodoroMode === 'focus') {
        setPomodoroMode('break');
        setTimeLeft(5 * 60);
      } else {
        setPomodoroMode('focus');
        setTimeLeft(pomodoroDuration);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, pomodoroDuration, pomodoroMode]);

  const toggleTimer = () => {
    sound.playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(pomodoroMode === 'focus' ? pomodoroDuration : 5 * 60);
  };

  const handleSelectPomodoroPreset = (mins: number) => {
    sound.playClick();
    setIsRunning(false);
    setPomodoroDuration(mins * 60);
    setTimeLeft(mins * 60);
    setPomodoroMode('focus');
  };

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressRingPercent = ((pomodoroDuration - timeLeft) / pomodoroDuration) * 100;

  // Task actions
  const handleTaskCheck = async (task: StudyTask) => {
    if (!task.completed) {
      sound.playTaskDone();
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
      });
    } else {
      sound.playClick();
    }
    await onToggleTask(task.id);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playClick();
    await onCreateTask({
      title: newTitle.trim(),
      subject: newSubject,
      priority: newPriority,
      isNightTask: newIsNight,
      estimatedMinutes: newEstMinutes,
      xpReward: newPriority === 'high' ? 70 : newPriority === 'medium' ? 50 : 30,
    });

    setNewTitle('');
    setShowNewTaskModal(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'night') return t.isNightTask;
    if (filter === 'high') return t.priority === 'high';
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Banner: Pomodoro & Night Practice Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Pomodoro Timer Visualizer */}
        <div className="lg:col-span-7 bg-[var(--card-bg)] rounded-[28px] p-6 sm:p-8 border border-[var(--border-soft)] shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#7255F7]/15 text-[#7255F7] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7255F7]">
                  {pomodoroMode === 'focus' ? 'ENFOQUE DINÁMICO' : 'DESCANSO REPARADOR'}
                </span>
                <h3 className="font-heading font-extrabold text-xl text-[var(--text-main)]">
                  Temporizador Pomodoro Nocturno
                </h3>
              </div>
            </div>

            <button
              onClick={onOpenThemeModal}
              className="px-3 py-1.5 rounded-xl bg-[var(--card-elevated)] border border-[var(--border-soft)] text-xs font-bold text-[var(--text-muted)] hover:text-[#7255F7] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Ajustar Tonalidad</span>
            </button>
          </div>

          {/* Central Circular Timer Display */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-52 h-52 flex items-center justify-center">
              {/* Background circular track */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  className="text-[var(--border-soft)]"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  className="text-[#7255F7] transition-all duration-500 ease-out"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (progressRingPercent / 100) * 264}
                />
              </svg>

              {/* Time Numbers */}
              <div className="absolute flex flex-col items-center text-center">
                <span className="font-mono font-extrabold text-4xl sm:text-5xl tracking-tight text-[var(--text-main)]">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-bold mt-1 uppercase tracking-wider">
                  {isRunning ? 'Sesión en curso' : 'Listo para estudiar'}
                </span>
              </div>
            </div>

            {/* Play / Pause / Reset Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={toggleTimer}
                className={`px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                    : 'bg-[#7255F7] hover:bg-[#5D3DE6] text-white shadow-[#7255F7]/30 hover:scale-105 active:scale-95'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Iniciar Sesión (+25 XP)</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-3.5 rounded-2xl bg-[var(--card-elevated)] hover:bg-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-soft)] transition-colors cursor-pointer"
                title="Reiniciar temporizador"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-soft)] text-xs font-semibold">
            <span className="text-[var(--text-muted)]">Duración de la sesión:</span>
            <div className="flex gap-2">
              {[
                { mins: 15, label: '15m (Rápido)' },
                { mins: 25, label: '25m (Estándar)' },
                { mins: 45, label: '45m (Nocturno)' },
              ].map(p => (
                <button
                  key={p.mins}
                  onClick={() => handleSelectPomodoroPreset(p.mins)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    pomodoroDuration === p.mins * 60
                      ? 'bg-[#7255F7] text-white border-[#7255F7]'
                      : 'bg-[var(--card-elevated)] text-[var(--text-muted)] border-[var(--border-soft)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Productivity Metrics & Night Ambient Bar */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          {/* Metrics summary */}
          <div className="bg-[var(--card-bg)] rounded-[28px] p-6 border border-[var(--border-soft)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-extrabold text-base text-[var(--text-main)]">
                Rendimiento de Hoy
              </h4>
              <span className="px-2.5 py-1 rounded-full bg-[#E6F9F5] text-[#059669] text-xs font-extrabold">
                +18% Productividad
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)]">
                <div className="font-heading font-extrabold text-2xl text-[#7255F7]">
                  {progress.pomodoroMinutesToday} min
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Enfoque acumulado</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)]">
                <div className="font-heading font-extrabold text-2xl text-[#19C6A3]">
                  {progress.pomodoroSessionsCompleted}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Pomodoros logrados</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)]">
                <div className="font-heading font-extrabold text-2xl text-[#FFB547]">
                  {completedCount}/{tasks.length}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Tareas completadas</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--card-elevated)] border border-[var(--border-soft)]">
                <div className="font-heading font-extrabold text-2xl text-[#24B8E8]">
                  {progress.streak} días
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">Racha protegida</div>
              </div>
            </div>
          </div>

          {/* Night Ambient Player widget */}
          <div className="bg-gradient-to-r from-[#1C1A38] via-[#16142E] to-[#121026] text-white rounded-[28px] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Headphones className="w-5 h-5 text-[#24B8E8]" />
                <span className="font-heading font-extrabold text-sm text-white">
                  Audio para Prácticas Nocturnas
                </span>
              </div>
              {themeConfig.ambientSound !== 'none' && (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-[#24B8E8] rounded-full animate-sound-wave-1" />
                  <span className="w-1 h-4 bg-[#7255F7] rounded-full animate-sound-wave-2" />
                  <span className="w-1 h-2 bg-[#19C6A3] rounded-full animate-sound-wave-3" />
                </div>
              )}
            </div>

            <p className="text-xs text-white/75 leading-relaxed">
              Frecuencias continuas sintetizadas para estudiar a altas horas sin fatiga.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'lofi-rain', label: '🌧️ Lluvia Lo-Fi' },
                { id: 'binaural-focus', label: '🧠 Alfa 10Hz' },
                { id: 'white-noise', label: '🌊 Ruido Blanco' },
              ].map(amb => {
                const isActive = themeConfig.ambientSound === amb.id;
                return (
                  <button
                    key={amb.id}
                    onClick={() => {
                      if (isActive) {
                        sound.stopAmbient();
                      } else {
                        sound.startAmbient(amb.id as any);
                      }
                      onOpenThemeModal();
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center truncate ${
                      isActive
                        ? 'bg-[#7255F7] text-white shadow-sm ring-2 ring-[#24B8E8]'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    {amb.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Task Planner Section */}
      <div className="bg-[var(--card-bg)] rounded-[28px] p-6 sm:p-8 border border-[var(--border-soft)] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-xl text-[var(--text-main)]">
                Planificador de Tareas & Retos Diarios
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ECE8FE] text-[#7255F7] text-xs font-extrabold">
                {completedCount} de {tasks.length} completadas
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Completa tareas de estudio diurnas y nocturnas para ganar XP adicional y sincronizar tu progreso en la nube.
            </p>
          </div>

          <button
            onClick={() => setShowNewTaskModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#7255F7] hover:bg-[#5D3DE6] text-white font-extrabold text-xs shadow-md shadow-[#7255F7]/30 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Tarea</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {[
            { id: 'all', label: 'Todas las tareas' },
            { id: 'night', label: '🌙 Prácticas Nocturnas' },
            { id: 'high', label: '🔥 Alta Prioridad' },
            { id: 'pending', label: '⏳ Pendientes' },
            { id: 'completed', label: '✓ Completadas' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { sound.playClick(); setFilter(f.id as any); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-[var(--text-main)] text-[var(--card-bg)] shadow-xs'
                  : 'bg-[var(--card-elevated)] border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-[var(--card-elevated)] opacity-60 border-[var(--border-soft)]'
                  : 'bg-[var(--card-bg)] border-[var(--border-soft)] hover:border-[#7255F7]/40 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleTaskCheck(task)}
                  className="cursor-pointer text-[#7255F7] shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 fill-[#19C6A3] text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-[var(--border-strong)] hover:text-[#7255F7] transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-heading font-bold text-sm ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                      {task.title}
                    </span>
                    {task.isNightTask && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950/20 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold flex items-center gap-1">
                        <Moon className="w-3 h-3" />
                        Nocturna
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="font-semibold text-[#7255F7]">{task.subject}</span>
                    <span>• {task.estimatedMinutes} min</span>
                    <span>• {task.dueDate}</span>
                    {task.notes && <span className="hidden md:inline italic">• {task.notes}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                  task.priority === 'high'
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                    : task.priority === 'medium'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  +{task.xpReward} XP
                </span>

                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Eliminar tarea"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-[var(--text-muted)] space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-[#7255F7] opacity-60" />
              <p className="text-sm font-bold text-[var(--text-main)]">No hay tareas en este filtro</p>
              <p className="text-xs">¡Añade una nueva práctica o meta de estudio para seguir avanzando!</p>
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--card-bg)] text-[var(--text-main)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[var(--border-soft)] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-soft)]">
              <h3 className="font-heading font-extrabold text-lg">Nueva Tarea de Aprendizaje</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--card-elevated)] flex items-center justify-center text-[var(--text-muted)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Título de la tarea o reto:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Practicar derivadas trigonométricas con Nexo"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--card-elevated)] text-sm focus:outline-none focus:border-[#7255F7] text-[var(--text-main)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Materia:</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--card-elevated)] text-xs font-semibold text-[var(--text-main)]"
                  >
                    <option value="Cálculo I">Cálculo I</option>
                    <option value="Programación">Programación</option>
                    <option value="Física">Física</option>
                    <option value="Álgebra">Álgebra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Prioridad:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--card-elevated)] text-xs font-semibold text-[var(--text-main)]"
                  >
                    <option value="high">Alta (+70 XP)</option>
                    <option value="medium">Media (+50 XP)</option>
                    <option value="low">Baja (+30 XP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Duración estimada (minutos):
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={newEstMinutes}
                  onChange={(e) => setNewEstMinutes(parseInt(e.target.value) || 25)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--card-elevated)] text-sm text-[var(--text-main)]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--card-elevated)] border border-[var(--border-soft)]">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Programar como práctica nocturna</span>
                </div>
                <input
                  type="checkbox"
                  checked={newIsNight}
                  onChange={(e) => setNewIsNight(e.target.checked)}
                  className="w-4 h-4 accent-[#7255F7] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-soft)] text-xs font-bold text-[var(--text-muted)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#7255F7] text-white text-xs font-bold shadow-md shadow-[#7255F7]/25"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
