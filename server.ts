import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  CURRICULUM_SUBJECTS, 
  INITIAL_CONCEPTS, 
  INITIAL_DAILY_MISSIONS, 
  INITIAL_WEEKLY_MISSIONS, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_CLASSROOM, 
  INITIAL_LEADERBOARD,
  INITIAL_TASKS,
  STORE_ITEMS
} from './src/data/curriculum';
import { UserProfile, UserProgress, CloudSnapshot, CloudSyncStatus } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-Memory Cloud Database state for multiple users
interface AppDatabaseState {
  user: UserProfile;
  progress: UserProgress;
  concepts: typeof INITIAL_CONCEPTS;
  dailyMissions: typeof INITIAL_DAILY_MISSIONS;
  weeklyMissions: typeof INITIAL_WEEKLY_MISSIONS;
  achievements: typeof INITIAL_ACHIEVEMENTS;
  inventory: string[];
  classroom: typeof INITIAL_CLASSROOM;
  leaderboard: typeof INITIAL_LEADERBOARD;
  tasks: typeof INITIAL_TASKS;
  cloudSync: CloudSyncStatus;
}

// User Profiles Setup
const createInitialUser = (id: string, name: string, email: string, role: 'student' | 'teacher', level: number, xp: number, streak: number): AppDatabaseState => {
  const user: UserProfile = {
    id,
    name,
    username: name.toLowerCase().replace(/\s+/g, '.'),
    email,
    role,
    isTeacherApproved: role === 'teacher',
    bio: role === 'teacher' ? 'Profesor titular de Cálculo I' : 'Estudiante apasionada por la ingeniería y las ciencias STEM',
    language: 'es',
    educationLevel: 'Universidad',
    learningStyle: 'visual',
    dailyGoalXP: 20,
    isProfilePublic: true,
    reducedMotion: false,
    onboardingDone: id !== 'user_new',
    themeConfig: {
      mode: 'light',
      accent: 'purple',
      highContrastNight: false,
      eyeCareFilter: false,
      soundEnabled: true,
      soundVolume: 0.7,
      ambientSound: 'none',
    },
    avatar: {
      bgColor: id === 'user_teacher' ? '#19C6A3' : id === 'user_sofia' ? '#D946EF' : '#7255F7',
      letter: name.charAt(0),
    },
  };

  const progress: UserProgress = {
    xp,
    level,
    currentLevelXP: xp % 500,
    xpForNextLevel: 500,
    streak,
    bestStreak: Math.max(streak, 14),
    gems: level * 15,
    energy: 5,
    maxEnergy: 5,
    currentLeague: level >= 5 ? 'Zafiro' : 'Ámbar',
    leagueRank: 3,
    streakProtectors: 1,
    todayXP: xp > 0 ? 20 : 0,
    weeklyXP: xp > 0 ? 198 : 0,
    checkInDays: streak,
    lastCheckInDate: new Date().toISOString().split('T')[0],
    weeklyAttendance: [true, true, true, true, false, false, false],
    pomodoroMinutesToday: 25,
    pomodoroSessionsCompleted: 1,
  };

  const initialSnapshots: CloudSnapshot[] = [
    {
      id: `snap_${id}_1`,
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      formattedTime: 'Ayer a las 22:45',
      device: 'NEXORA Web Cloud',
      level,
      xp,
      streak,
      summary: 'Respaldo automático tras sesión de cálculo nocturno',
    },
  ];

  const cloudSync: CloudSyncStatus = {
    status: 'synced',
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    pendingChangesCount: 0,
    cloudBackupCount: 1,
    snapshots: initialSnapshots,
  };

  return {
    user,
    progress,
    concepts: JSON.parse(JSON.stringify(INITIAL_CONCEPTS)),
    dailyMissions: JSON.parse(JSON.stringify(INITIAL_DAILY_MISSIONS)),
    weeklyMissions: JSON.parse(JSON.stringify(INITIAL_WEEKLY_MISSIONS)),
    achievements: JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS)),
    inventory: ['item_streak_freeze'],
    classroom: JSON.parse(JSON.stringify(INITIAL_CLASSROOM)),
    leaderboard: JSON.parse(JSON.stringify(INITIAL_LEADERBOARD)),
    tasks: JSON.parse(JSON.stringify(INITIAL_TASKS)),
    cloudSync,
  };
};

// Database storage dictionary
const database: Record<string, AppDatabaseState> = {
  user_sofia: createInitialUser('user_sofia', 'Sofía Ramírez', 'sofia.ramirez@demo.nexora.app', 'student', 5, 2340, 12),
  user_new: createInitialUser('user_new', 'Tomás Ortiz', 'ortizpalaciot@gmail.com', 'student', 1, 0, 1),
  user_teacher: createInitialUser('user_teacher', 'Prof. Carlos Martínez', 'carlos.martinez@demo.nexora.app', 'teacher', 8, 4800, 30),
};

// Active user tracking
let activeUserId = 'user_sofia';

const getActiveState = () => {
  if (!database[activeUserId]) {
    activeUserId = 'user_sofia';
  }
  return database[activeUserId];
};

// ================= API ROUTES =================

// Get entire state
app.get('/api/state', (req: Request, res: Response) => {
  const state = getActiveState();
  res.json(state);
});

// Switch active demo user
app.post('/api/auth/switch-user', (req: Request, res: Response) => {
  const { userId } = req.body;
  if (database[userId]) {
    activeUserId = userId;
    res.json({ ok: true, activeUser: database[userId].user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, name } = req.body;
  const existingId = Object.keys(database).find(id => database[id].user.email.toLowerCase() === email?.toLowerCase());
  
  if (existingId) {
    activeUserId = existingId;
  } else {
    const newId = `user_${Date.now()}`;
    database[newId] = createInitialUser(newId, name || 'Estudiante', email || 'estudiante@nexora.app', 'student', 1, 0, 1);
    activeUserId = newId;
  }

  res.json({ ok: true, user: database[activeUserId].user });
});

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  const newId = `user_${Date.now()}`;
  database[newId] = createInitialUser(
    newId,
    name || 'Nuevo Usuario',
    email || `user_${Date.now()}@nexora.app`,
    role === 'teacher' ? 'teacher' : 'student',
    1,
    0,
    1
  );
  activeUserId = newId;
  res.json({ ok: true, user: database[newId].user });
});

// Complete Onboarding
app.post('/api/onboarding/complete', (req: Request, res: Response) => {
  const state = getActiveState();
  const { name, educationLevel, learningStyle, dailyGoalXP } = req.body;
  if (name) state.user.name = name;
  if (educationLevel) state.user.educationLevel = educationLevel;
  if (learningStyle) state.user.learningStyle = learningStyle;
  if (dailyGoalXP) state.user.dailyGoalXP = dailyGoalXP;
  state.user.onboardingDone = true;
  res.json({ ok: true, user: state.user });
});

// Update Profile & Themes
app.post('/api/user/update-profile', (req: Request, res: Response) => {
  const state = getActiveState();
  const updates = req.body;
  Object.assign(state.user, updates);
  state.cloudSync.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  res.json({ ok: true, user: state.user });
});

// Submit Lesson Answer
app.post('/api/lesson/submit', (req: Request, res: Response) => {
  const state = getActiveState();
  const { exerciseId, answer, exerciseType, conceptId } = req.body;

  let isCorrect = true;
  let explanation = '¡Razonamiento correcto! Has dominado este paso conceptual.';

  if (exerciseType === 'multiple_choice') {
    isCorrect = answer === 'opt_ch2' || answer === 'opt_3' || answer === 1 || answer === 'opt_q2';
    if (!isCorrect) {
      explanation = 'Revisa la regla de la cadena: no olvides multiplicar por la derivada de la función interior.';
    }
  } else if (exerciseType === 'order_steps') {
    isCorrect = Array.isArray(answer) && answer.length >= 3;
  } else if (exerciseType === 'spot_error') {
    isCorrect = answer === 2;
  }

  const xpEarned = isCorrect ? 50 : 10;
  const gemsEarned = isCorrect ? 5 : 0;

  state.progress.xp += xpEarned;
  state.progress.todayXP += xpEarned;
  state.progress.weeklyXP += xpEarned;
  state.progress.gems += gemsEarned;

  // Level up calculation
  const newLevel = Math.floor(state.progress.xp / 500) + 1;
  const leveledUp = newLevel > state.progress.level;
  if (leveledUp) {
    state.progress.level = newLevel;
  }

  // Update mastery
  const concept = state.concepts.find(c => c.conceptId === conceptId);
  if (concept) {
    concept.mastery = Math.min(100, concept.mastery + (isCorrect ? 5 : -2));
  }

  // Auto cloud sync
  state.cloudSync.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  res.json({
    isCorrect,
    explanation,
    xpEarned,
    gemsEarned,
    energyRemaining: state.progress.energy,
    progress: state.progress,
    leveledUp,
    newLevel: state.progress.level,
    newTitle: state.progress.level >= 5 ? 'Estratega' : 'Explorador',
  });
});

// Tutor Chat API with Gemini fallback
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  const { mode, message, conceptId, language } = req.body;
  const state = getActiveState();

  // Structured response cards based on mode
  if (mode === 'challenge') {
    return res.json({
      card: {
        mode: 'challenge',
        challenge: {
          badge: 'RETO ADAPTADO',
          xp: 50,
          problem: 'Deriva la siguiente función compuesta aplicando la regla de la potencia y la cadena:',
          formula: 'g(x) = (x² + 1)³',
          options: [
            '3(x² + 1)²',
            '6x(x² + 1)²',
            '3x²(x² + 1)²',
          ],
          correctIndex: 1,
          explanation: '¡Excelente! Derivada exterior: 3(x² + 1)². Derivada interior: 2x. Multiplicando: 6x(x² + 1)².',
        },
      },
    });
  }

  if (mode === 'analyze_error') {
    return res.json({
      card: {
        mode: 'analyze_error',
        errorAnalysis: {
          codeOrMath: [
            'Línea 1: u = 3x² + 1, f(u) = u⁴',
            'Línea 2: f\'(x) = 4(3x² + 1)³  <-- ERROR: faltó u\'',
            'Línea 3: f\'(x) = 4(3x² + 1)³ · (6x) = 24x(3x² + 1)³ [Correcto]'
          ],
          errorLineIndex: 1,
          conceptErrorName: 'Omisión de la derivada interior en funciones polinómicas',
          correctionGuide: [
            '1. Identifica siempre u(x) y calcula su derivada u\'(x) por separado.',
            '2. Multiplica la derivada de la capa exterior f\'(u) por u\'(x).',
            '3. Simplifica los coeficientes numéricos.'
          ],
        },
      },
    });
  }

  if (mode === 'test_level') {
    return res.json({
      card: {
        mode: 'challenge',
        challenge: {
          badge: 'DIAGNÓSTICO RÁPIDO',
          xp: 40,
          problem: '¿Cuál es la derivada de h(x) = sin(4x)?',
          formula: 'h(x) = sin(4x)',
          options: [
            'cos(4x)',
            '4 · cos(4x)',
            '-4 · cos(4x)',
          ],
          correctIndex: 1,
          explanation: '¡Correcto! Exterior: d/du(sin u) = cos u. Interior: d/dx(4x) = 4. Multiplicando: 4·cos(4x).',
        },
      },
    });
  }

  // Default: explain mode
  return res.json({
    card: {
      mode: 'explain',
      title: 'La regla de la cadena: el efecto dominó de las funciones',
      analogy: 'Imagina engranajes conectados: si el engranaje interior gira a cierta velocidad y el exterior a otra, la velocidad total es el producto de ambos ritmos.',
      steps: [
        'Paso 1: Identifica la función exterior f(u) y la interior u(x).',
        'Paso 2: Deriva la función exterior respecto a su argumento u: f\'(u).',
        'Paso 3: Deriva la función interior u\'(x).',
        'Paso 4: Multiplica f\'(u) por u\'(x).'
      ],
    },
  });
});

// Task Manager & Productivity Endpoints
app.post('/api/tasks/toggle', (req: Request, res: Response) => {
  const state = getActiveState();
  const { taskId } = req.body;
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    if (task.completed) {
      state.progress.xp += task.xpReward;
      state.progress.todayXP += task.xpReward;
    }
  }
  state.cloudSync.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  res.json({ ok: true, tasks: state.tasks, progress: state.progress });
});

app.post('/api/tasks/create', (req: Request, res: Response) => {
  const state = getActiveState();
  const { title, subject, priority, isNightTask, estimatedMinutes } = req.body;
  const newTask = {
    id: `task_${Date.now()}`,
    title: title || 'Nueva sesión de estudio',
    subject: subject || 'Cálculo',
    priority: priority || 'medium',
    completed: false,
    dueDate: 'Hoy',
    xpReward: 50,
    estimatedMinutes: estimatedMinutes || 25,
    isNightTask: Boolean(isNightTask),
  };
  state.tasks.unshift(newTask);
  state.cloudSync.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  res.json({ ok: true, tasks: state.tasks });
});

app.post('/api/tasks/delete', (req: Request, res: Response) => {
  const state = getActiveState();
  const { taskId } = req.body;
  state.tasks = state.tasks.filter(t => t.id !== taskId);
  res.json({ ok: true, tasks: state.tasks });
});

// Pomodoro Focus completion
app.post('/api/pomodoro/complete', (req: Request, res: Response) => {
  const state = getActiveState();
  const { minutes } = req.body;
  const sessionMins = minutes || 25;

  state.progress.pomodoroMinutesToday += sessionMins;
  state.progress.pomodoroSessionsCompleted += 1;
  state.progress.xp += 25;
  state.progress.todayXP += 25;

  state.cloudSync.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  res.json({
    ok: true,
    progress: state.progress,
    xpAwarded: 25,
  });
});

// Cloud Sync endpoints
app.post('/api/cloud-sync/sync', (req: Request, res: Response) => {
  const state = getActiveState();
  const snapshot: CloudSnapshot = {
    id: `snap_${Date.now()}`,
    timestamp: new Date().toISOString(),
    formattedTime: `Hoy a las ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    device: 'NEXORA Cloud Sync',
    level: state.progress.level,
    xp: state.progress.xp,
    streak: state.progress.streak,
    summary: `Punto de restauración: Nivel ${state.progress.level} · ${state.progress.xp} XP`,
  };

  state.cloudSync.snapshots.unshift(snapshot);
  state.cloudSync.status = 'synced';
  state.cloudSync.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  state.cloudSync.cloudBackupCount += 1;

  res.json({
    ok: true,
    cloudSync: state.cloudSync,
  });
});

app.post(['/api/cloud-sync/restore', '/api/cloud-sync/snapshot/restore'], (req: Request, res: Response) => {
  const state = getActiveState();
  const { snapshotId } = req.body;
  const snap = state.cloudSync.snapshots.find(s => s.id === snapshotId);
  if (snap) {
    state.progress.level = snap.level;
    state.progress.xp = snap.xp;
    state.progress.streak = snap.streak;
  }
  state.cloudSync.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  res.json({ ok: true, progress: state.progress, cloudSync: state.cloudSync });
});

// Update Theme Configuration
app.post('/api/user/theme', (req: Request, res: Response) => {
  const state = getActiveState();
  const { themeConfig } = req.body;
  if (themeConfig) {
    state.user.themeConfig = { ...state.user.themeConfig, ...themeConfig };
  }
  res.json({ ok: true, themeConfig: state.user.themeConfig });
});

// Gem Store Buy
app.post('/api/store/buy', (req: Request, res: Response) => {
  const state = getActiveState();
  const { itemId, costGems } = req.body;

  if (state.progress.gems >= costGems) {
    state.progress.gems -= costGems;
    if (!state.inventory.includes(itemId)) {
      state.inventory.push(itemId);
    }
    if (itemId === 'item_streak_freeze') {
      state.progress.streakProtectors = Math.min(2, state.progress.streakProtectors + 1);
    } else if (itemId === 'item_energy_refill') {
      state.progress.energy = state.progress.maxEnergy;
    }
    return res.json({ ok: true, progress: state.progress, inventory: state.inventory });
  }

  res.status(400).json({ error: 'Gemas insuficientes' });
});

// Daily Check-in
app.post('/api/checkin', (req: Request, res: Response) => {
  const state = getActiveState();
  const today = new Date().toISOString().split('T')[0];

  const rewardGems = 10;
  state.progress.gems += rewardGems;
  state.progress.checkInDays += 1;
  state.progress.lastCheckInDate = today;

  res.json({
    ok: true,
    rewardGems,
    progress: state.progress,
  });
});

// Teacher AI Generator
app.post('/api/teacher/generate-assignment', (req: Request, res: Response) => {
  const { topic } = req.body;
  res.json({
    questions: [
      {
        question: `Deriva la función f(x) = (4x - 5)³ correspondiente a ${topic}:`,
        options: ['12(4x - 5)²', '3(4x - 5)²', '12x(4x - 5)²', '64x - 125'],
        correctIndex: 0,
      },
      {
        question: `Si g(x) = cos(x³), ¿cuál es el resultado de g'(x)?`,
        options: ['-3x² · sin(x³)', '3x² · cos(x³)', '-sin(3x²)', '3x · sin(x³)'],
        correctIndex: 0,
      },
    ],
  });
});

// Export User Data
app.get('/api/user/export', (req: Request, res: Response) => {
  const state = getActiveState();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=nexora_user_backup.json');
  res.send(JSON.stringify(state, null, 2));
});

// Delete account
app.delete('/api/user/delete', (req: Request, res: Response) => {
  delete database[activeUserId];
  activeUserId = 'user_sofia';
  res.json({ ok: true });
});

// Mount Vite in development or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXORA server running at http://localhost:${PORT}`);
  });
}

startServer();
