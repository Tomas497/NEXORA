import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileTabBar } from './components/MobileTabBar';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LessonPlayerModal } from './components/LessonPlayerModal';
import { LevelUpModal } from './components/LevelUpModal';
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
import { 
  UserProfile, 
  UserProgress, 
  ConceptMastery, 
  DailyMission, 
  WeeklyMission, 
  Achievement, 
  Classroom,
  Language, 
  Lesson 
} from './types';
import { CURRICULUM_SUBJECTS } from './data/curriculum';

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

  const [language, setLanguage] = useState<Language>('es');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isLanding, setIsLanding] = useState<boolean>(false);
  
  // Modals state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('register');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ level: number; title: string } | null>(null);

  // Load state from backend server
  const loadState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProgress(data.progress);
        setConcepts(data.concepts);
        setDailyMissions(data.dailyMissions);
        setWeeklyMissions(data.weeklyMissions);
        setAchievements(data.achievements);
        setInventory(data.inventory);
        setClassroom(data.classroom);
        setLeaderboard(data.leaderboard);
        if (data.user.language) setLanguage(data.user.language);

        // If user is brand new and has not completed onboarding
        if (!data.user.onboardingDone) {
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

  // Switch demo account
  const handleSwitchUser = async (userId: string) => {
    try {
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
    if (result.leveledUp) {
      setLevelUpData({ level: result.newLevel, title: result.newTitle });
    }
    return result;
  };

  // Onboarding completion
  const handleCompleteOnboarding = async (onboardingData: any) => {
    try {
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
    const newXP = progress.xp + amount;
    setProgress({ ...progress, xp: newXP });
  };

  // Start specific lesson
  const handleStartLesson = (lessonId?: string) => {
    // Default to Calculus Unit 2 Lesson 1 (Regla de la Cadena) matching screenshot
    const calculus = CURRICULUM_SUBJECTS[0];
    const unit2 = calculus.units[1];
    const lesson = unit2.lessons[0];
    setActiveLesson(lesson);
  };

  // Open Tutor with context
  const handleOpenTutor = (mode = 'explain', conceptId = 'c_regla_cadena') => {
    setCurrentTab('tutor');
  };

  // Open Labs
  const handleOpenLabs = (tab?: string) => {
    setCurrentTab('labs');
  };

  // Open Knowledge Map
  const handleOpenMap = () => {
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
            setAuthInitialMode('register');
            setShowAuthModal(true);
          }}
          onLogin={() => {
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
    <div className={`min-h-screen bg-[#F5F4FC] text-[#202038] font-['Inter',sans-serif] ${user.theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
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
        onSwitchUser={handleSwitchUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={() => setIsLanding(true)}
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

        {currentTab === 'tutor' && (
          <TutorView
            user={user}
            progress={progress}
            concepts={concepts}
            language={language}
            onOpenLabs={handleOpenLabs}
            onOpenMap={handleOpenMap}
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

      {/* Modals */}
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

      <OnboardingModal
        isOpen={showOnboarding}
        language={language}
        onComplete={handleCompleteOnboarding}
      />

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
