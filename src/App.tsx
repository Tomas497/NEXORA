import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { MobileTabBar } from './components/MobileTabBar';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LessonPlayerModal } from './components/LessonPlayerModal';
import { LevelUpModal } from './components/LevelUpModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { CloudSyncModal } from './components/CloudSyncModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardView } from './pages/DashboardView';
import { TutorView } from './pages/TutorView';
import { LaboratoriesView } from './pages/LaboratoriesView';
import { ProgressView } from './pages/ProgressView';
import { MissionsView } from './pages/MissionsView';
import { LeaguesView } from './pages/LeaguesView';
import { TeacherStudioView } from './pages/TeacherStudioView';
import { ShopView } from './pages/ShopView';
import { SettingsView } from './pages/SettingsView';
import { TasksView } from './pages/TasksView';

import { 
  UserProfile, 
  UserProgress, 
  ConceptMastery, 
  DailyMission, 
  WeeklyMission, 
  Achievement, 
  Classroom,
  Language, 
  Lesson,
  UserThemeConfig,
  CloudSyncStatus,
  StudyTask
} from './types';
import { CURRICULUM_SUBJECTS } from './data/curriculum';
import { sound } from './utils/soundEngine';

const DEFAULT_THEME_CONFIG: UserThemeConfig = {
  mode: 'dark-midnight',
  accent: 'purple',
  highContrastNight: false,
  eyeCareFilter: false,
  soundEnabled: true,
  soundVolume: 0.7,
  ambientSound: 'none',
};

const DEFAULT_CLOUD_SYNC: CloudSyncStatus = {
  status: 'synced',
  lastSyncedAt: 'Ahora mismo',
  pendingChangesCount: 0,
  cloudBackupCount: 3,
  snapshots: [
    {
      id: 'snap_live',
      timestamp: new Date().toISOString(),
      formattedTime: 'Hoy · Reciente',
      device: 'Navegador Web actual',
      level: 5,
      xp: 2340,
      streak: 12,
      summary: 'Sesión nocturna sincronizada: Regla de la cadena y Cálculo',
    },
    {
      id: 'snap_yesterday',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      formattedTime: 'Ayer · 23:45',
      device: 'NEXORA Mobile App',
      level: 5,
      xp: 2210,
      streak: 11,
      summary: 'Laboratorio de Algoritmos completado',
    },
    {
      id: 'snap_backup',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      formattedTime: 'Hace 3 días',
      device: 'Tablet iPad Pro',
      level: 4,
      xp: 1950,
      streak: 9,
      summary: 'Punto de restauración automático de seguridad',
    },
  ],
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [concepts, setConcepts] = useState<ConceptMastery[]>([]);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<WeeklyMission[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [inventory, setInventory] = useState<string[]>([]);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [cloudSync, setCloudSync] = useState<CloudSyncStatus>(DEFAULT_CLOUD_SYNC);

  const [themeConfig, setThemeConfig] = useState<UserThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('nexora_theme_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_THEME_CONFIG;
  });

  const [language, setLanguage] = useState<Language>('es');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isLanding, setIsLanding] = useState<boolean>(false);
  
  // Modals state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('register');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showCloudModal, setShowCloudModal] = useState<boolean>(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ level: number; title: string } | null>(null);

  // Apply theme to DOM
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    // Clean previous theme classes
    body.classList.remove('theme-dark-midnight', 'theme-dark-amoled', 'theme-dark-warm', 'dark', 'high-contrast-night', 'anti-fatigue-filter');
    html.classList.remove('theme-dark-midnight', 'theme-dark-amoled', 'theme-dark-warm', 'dark');

    if (themeConfig.mode !== 'light') {
      body.classList.add(`theme-${themeConfig.mode}`);
      html.classList.add(`theme-${themeConfig.mode}`);
      body.classList.add('dark');
      html.classList.add('dark');
    }

    if (themeConfig.highContrastNight) {
      body.classList.add('high-contrast-night');
    }
    if (themeConfig.eyeCareFilter) {
      body.classList.add('anti-fatigue-filter');
    }

    body.setAttribute('data-accent', themeConfig.accent);

    // Sync sound engine state
    sound.setMuted(!themeConfig.soundEnabled);

    // Save to localStorage
    try {
      localStorage.setItem('nexora_theme_config', JSON.stringify(themeConfig));
    } catch {}
  }, [themeConfig]);

  // Load state from backend server
  const loadState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProgress(data.progress);
        setConcepts(data.concepts || []);
        setDailyMissions(data.dailyMissions || []);
        setWeeklyMissions(data.weeklyMissions || []);
        setAchievements(data.achievements || []);
        setInventory(data.inventory || []);
        setClassroom(data.classroom || null);
        setLeaderboard(data.leaderboard || []);
        if (data.tasks) setTasks(data.tasks);
        if (data.cloudSync) setCloudSync(data.cloudSync);
        if (data.user?.language) setLanguage(data.user.language);
        if (data.user?.themeConfig) {
          setThemeConfig((prev) => ({ ...prev, ...data.user.themeConfig }));
        }

        // If user is brand new and has not completed onboarding
        if (data.user && !data.user.onboardingDone) {
          setShowOnboarding(true);
        }
      }
    } catch (err) {
      console.error('Error fetching state from server:', err);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  // Update theme configuration
  const handleUpdateTheme = (updated: Partial<UserThemeConfig>) => {
    setThemeConfig((prev) => {
      const next = { ...prev, ...updated };
      // Sync to backend asynchronously
      fetch('/api/user/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeConfig: next }),
      }).catch(() => {});
      return next;
    });
  };

  // Quick toggle between Light and Dark Midnight
  const handleQuickToggleTheme = () => {
    sound.playClick();
    const nextMode = themeConfig.mode === 'light' ? 'dark-midnight' : 'light';
    handleUpdateTheme({ mode: nextMode });
  };

  // Switch demo account
  const handleSwitchUser = async (userId: string) => {
    try {
      sound.playClick();
      await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      await loadState();
      setIsLanding(false);
      setCurrentTab(userId === 'user_teacher' ? 'teacher' : 'home');
    } catch (err) {
      console.error('Error switching demo user:', err);
    }
  };

  // Task Actions
  const handleToggleTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const isCompleting = task && !task.completed;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );

      if (isCompleting) {
        sound.playTaskDone();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#7255F7', '#24B8E8', '#19C6A3'],
        });
      } else {
        sound.playClick();
      }

      const res = await fetch('/api/tasks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tasks) setTasks(data.tasks);
        if (data.progress) setProgress(data.progress);
        if (data.cloudSync) setCloudSync(data.cloudSync);
      }
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleCreateTask = async (task: Partial<StudyTask>) => {
    try {
      sound.playClick();
      const res = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tasks) setTasks(data.tasks);
        if (data.cloudSync) setCloudSync(data.cloudSync);
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      sound.playClick();
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      const res = await fetch('/api/tasks/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tasks) setTasks(data.tasks);
        if (data.cloudSync) setCloudSync(data.cloudSync);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleGenerateDynamicTasks = async () => {
    try {
      sound.playClick();
      const res = await fetch('/api/tasks/generate-dynamic', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.tasks) setTasks(data.tasks);
        if (data.cloudSync) setCloudSync(data.cloudSync);
        sound.playLevelUp();
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#7255F7', '#24B8E8', '#19C6A3', '#EC4899'],
        });
      }
    } catch (err) {
      console.error('Error generating dynamic tasks:', err);
    }
  };

  // Complete Pomodoro Session
  const handleCompletePomodoro = async (minutes: number) => {
    try {
      sound.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#FFB547', '#7255F7', '#19C6A3', '#24B8E8'],
      });

      const res = await fetch('/api/pomodoro/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutes }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.progress) setProgress(data.progress);
        if (data.cloudSync) setCloudSync(data.cloudSync);
      }
    } catch (err) {
      console.error('Error completing pomodoro session:', err);
    }
  };

  // Cloud Synchronization Actions
  const handlePerformSync = async () => {
    setCloudSync((prev) => ({ ...prev, status: 'syncing' }));
    const res = await fetch('/api/cloud-sync/sync', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setCloudSync(data.cloudSync);
    } else {
      setCloudSync((prev) => ({ ...prev, status: 'error' }));
    }
  };

  const handleRestoreSnapshot = async (snapshotId: string) => {
    const res = await fetch('/api/cloud-sync/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snapshotId }),
    });
    if (res.ok) {
      sound.playSyncSuccess();
      await loadState();
      setShowCloudModal(false);
    }
  };

  // Submit Answer to Server
  const handleSubmitAnswer = async (params: any) => {
    const res = await fetch('/api/lesson/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const result = await res.json();
    if (result.progress) {
      setProgress(result.progress);
    }
    if (result.isCorrect) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
    if (result.leveledUp) {
      sound.playLevelUp();
      setLevelUpData({ level: result.newLevel, title: result.newTitle });
    }
    return result;
  };

  // Onboarding completion
  const handleCompleteOnboarding = async (onboardingData: any) => {
    try {
      sound.playLevelUp();
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });
      setShowOnboarding(false);
      await loadState();
    } catch (err) {
      console.error('Error completing onboarding:', err);
    }
  };

  // Buy Shop Item
  const handleBuyItem = async (itemId: string, costGems: number) => {
    try {
      sound.playGemPickup();
      const res = await fetch('/api/store/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, costGems }),
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
        setInventory(data.inventory);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Award XP helper
  const handleAwardXP = async (amount: number, reason: string) => {
    if (!progress) return;
    sound.playStreakFire();
    const newXP = progress.xp + amount;
    setProgress({ ...progress, xp: newXP });
  };

  // Start specific lesson
  const handleStartLesson = (lessonId?: string) => {
    sound.playClick();
    const calculus = CURRICULUM_SUBJECTS[0];
    const unit2 = calculus.units[1];
    const lesson = unit2.lessons[0];
    setActiveLesson(lesson);
  };

  // Open Tutor with context
  const handleOpenTutor = (mode = 'explain', conceptId = 'c_regla_cadena') => {
    sound.playClick();
    setCurrentTab('tutor');
  };

  // Open Labs
  const handleOpenLabs = (tab?: string) => {
    sound.playClick();
    setCurrentTab('labs');
  };

  // Open Knowledge Map
  const handleOpenMap = () => {
    sound.playClick();
    setCurrentTab('progress');
  };

  // Quick challenge solver from home
  const handleQuickChallengeSubmit = async () => {
    await handleSubmitAnswer({
      exerciseId: 'ex_c_chain_1',
      answer: 'opt_ch2',
      exerciseType: 'multiple_choice',
      conceptId: 'c_regla_cadena',
    });
  };

  // Export User JSON
  const handleExportData = () => {
    sound.playClick();
    window.open('/api/user/export', '_blank');
  };

  // Delete User Account
  const handleDeleteAccount = async () => {
    await fetch('/api/user/delete', { method: 'DELETE' });
    await loadState();
    setIsLanding(true);
  };

  if (isLanding || !user || !progress) {
    return (
      <>
        <LandingPage
          language={language}
          setLanguage={setLanguage}
          onStartFree={() => {
            sound.playClick();
            setAuthInitialMode('register');
            setShowAuthModal(true);
          }}
          onLogin={() => {
            sound.playClick();
            setAuthInitialMode('login');
            setShowAuthModal(true);
          }}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          language={language}
          initialMode={authInitialMode}
          onAuthSuccess={async (newUser) => {
            setUser(newUser);
            setShowAuthModal(false);
            setIsLanding(false);
            await loadState();
          }}
          onQuickDemoSwitch={handleSwitchUser}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          sound.playClick();
          if (tab === 'landing') {
            setIsLanding(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        language={language}
        setLanguage={setLanguage}
        user={user}
        progress={progress}
        themeConfig={themeConfig}
        cloudSync={cloudSync}
        onSwitchUser={handleSwitchUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={() => setIsLanding(true)}
        onOpenThemeModal={() => {
          sound.playClick();
          setShowThemeModal(true);
        }}
        onOpenCloudModal={() => {
          sound.playClick();
          setShowCloudModal(true);
        }}
        onQuickToggleTheme={handleQuickToggleTheme}
        onSelectAccent={(accent) => handleUpdateTheme({ accent })}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-28 md:pb-8">
        {currentTab === 'home' && (
          <DashboardView
            user={user}
            progress={progress}
            concepts={concepts}
            language={language}
            leaderboard={leaderboard}
            onStartLesson={handleStartLesson}
            onOpenTutor={handleOpenTutor}
            onOpenLabs={handleOpenLabs}
            onOpenMap={handleOpenMap}
            onQuickChallengeSubmit={handleQuickChallengeSubmit}
          />
        )}

        {currentTab === 'tasks' && (
          <TasksView
            user={user}
            progress={progress}
            tasks={tasks}
            themeConfig={themeConfig}
            onToggleTask={handleToggleTask}
            onCreateTask={handleCreateTask}
            onDeleteTask={handleDeleteTask}
            onGenerateDynamicTasks={handleGenerateDynamicTasks}
            onCompletePomodoro={handleCompletePomodoro}
            onOpenThemeModal={() => setShowThemeModal(true)}
          />
        )}

        {currentTab === 'tutor' && (
          <TutorView
            user={user}
            progress={progress}
            concepts={concepts}
            language={language}
            onOpenLabs={handleOpenLabs}
            onOpenMap={handleOpenMap}
            onAwardXP={handleAwardXP}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'labs' && (
          <LaboratoriesView
            progress={progress}
            language={language}
            onAwardXP={handleAwardXP}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            user={user}
            progress={progress}
            concepts={concepts}
            language={language}
            onOpenTutorForConcept={(cid) => handleOpenTutor('explain', cid)}
            onOpenLabs={handleOpenLabs}
          />
        )}

        {currentTab === 'missions' && (
          <MissionsView
            user={user}
            progress={progress}
            dailyMissions={dailyMissions}
            weeklyMissions={weeklyMissions}
            achievements={achievements}
            language={language}
            onGoToDashboard={() => setCurrentTab('home')}
            onGoToTutor={() => setCurrentTab('tutor')}
            onGoToLabs={() => setCurrentTab('labs')}
            onClaimDailyMission={() => {}}
          />
        )}

        {currentTab === 'leagues' && (
          <LeaguesView
            progress={progress}
            leaderboard={leaderboard}
            language={language}
            onAwardXP={handleAwardXP}
          />
        )}

        {currentTab === 'store' && (
          <ShopView
            progress={progress}
            inventory={inventory}
            language={language}
            onBuyItem={handleBuyItem}
          />
        )}

        {currentTab === 'teacher' && classroom && (
          <TeacherStudioView
            classroom={classroom}
            language={language}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            user={user}
            language={language}
            setLanguage={setLanguage}
            onUpdateProfile={(data) => {
              setUser({ ...user, ...data });
              fetch('/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
            }}
            onExportData={handleExportData}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
      />

      {/* Theme & Nocturnal Customizer Modal */}
      <ThemeSelectorModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        themeConfig={themeConfig}
        onUpdateTheme={handleUpdateTheme}
      />

      {/* Cloud Synchronization Modal */}
      <CloudSyncModal
        isOpen={showCloudModal}
        onClose={() => setShowCloudModal(false)}
        cloudSync={cloudSync}
        progress={progress}
        onPerformSync={handlePerformSync}
        onRestoreSnapshot={handleRestoreSnapshot}
        onExportData={handleExportData}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        language={language}
        initialMode={authInitialMode}
        onAuthSuccess={(newUser) => {
          setUser(newUser);
          setShowOnboarding(true);
        }}
        onQuickDemoSwitch={handleSwitchUser}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        language={language}
        onComplete={handleCompleteOnboarding}
      />

      {/* Interactive Lesson Modal */}
      {activeLesson && (
        <LessonPlayerModal
          isOpen={true}
          lesson={activeLesson}
          energy={progress.energy}
          language={language}
          onClose={() => setActiveLesson(null)}
          onSubmitAnswer={handleSubmitAnswer}
          onOpenTutorWithExercise={(exercise, failedAns) => {
            setActiveLesson(null);
            setCurrentTab('tutor');
          }}
          onLessonFinished={(summary) => {
            loadState();
          }}
        />
      )}

      {/* Level Up Celebration Modal */}
      {levelUpData && (
        <LevelUpModal
          isOpen={true}
          level={levelUpData.level}
          title={levelUpData.title}
          onClose={() => setLevelUpData(null)}
        />
      )}
    </div>
  );
}
