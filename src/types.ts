export type Language = 'es' | 'en' | 'pt';

export type UserRole = 'student' | 'teacher';

export type ThemeMode = 'light' | 'dark-midnight' | 'dark-amoled' | 'dark-warm';

export type AccentColor = 'purple' | 'blue' | 'mint' | 'orange' | 'pink' | 'emerald';

export type AmbientSoundType = 'none' | 'lofi-rain' | 'binaural-focus' | 'white-noise';

export interface UserThemeConfig {
  mode: ThemeMode;
  accent: AccentColor;
  highContrastNight: boolean;
  eyeCareFilter: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  ambientSound: AmbientSoundType;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  isTeacherApproved?: boolean;
  bio?: string;
  language: Language;
  educationLevel: string;
  learningStyle: 'visual' | 'practical' | 'reading' | 'conversation';
  dailyGoalXP: number;
  isProfilePublic: boolean;
  reducedMotion: boolean;
  onboardingDone: boolean;
  themeConfig: UserThemeConfig;
  avatar: {
    bgColor: string;
    letter?: string;
    frameId?: string;
  };
}

export interface UserProgress {
  xp: number;
  level: number;
  currentLevelXP: number;
  xpForNextLevel: number;
  streak: number;
  bestStreak: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  currentLeague: string;
  leagueRank: number;
  streakProtectors: number;
  todayXP: number;
  weeklyXP: number;
  checkInDays: number;
  lastCheckInDate?: string;
  weeklyAttendance?: boolean[];
  pomodoroMinutesToday: number;
  pomodoroSessionsCompleted: number;
}

export interface ConceptMastery {
  conceptId: string;
  subjectId: string;
  name: Record<Language, string>;
  mastery: number; // 0 - 100
  status: 'locked' | 'next_step' | 'in_progress' | 'reinforce' | 'mastered';
  commonError?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  xpReward: number;
  estimatedMinutes: number;
  notes?: string;
  isNightTask?: boolean;
}

export interface CloudSnapshot {
  id: string;
  timestamp: string;
  formattedTime: string;
  device: string;
  level: number;
  xp: number;
  streak: number;
  summary: string;
}

export interface CloudSyncStatus {
  status: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: string;
  pendingChangesCount: number;
  cloudBackupCount: number;
  snapshots: CloudSnapshot[];
}

export interface Exercise {
  id: string;
  conceptId: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'order_steps' | 'spot_error' | 'interactive_graph' | 'numeric';
  question: Record<Language, string>;
  explanation: Record<Language, string>;
  options?: { id: string; text: string }[];
  correctOptionId?: string;
  correctBoolean?: boolean;
  correctAnswer?: string | number;
  stepsToOrder?: string[];
  correctOrder?: number[];
  solutionLines?: { line: number; text: string; isError?: boolean }[];
  errorLineIndex?: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  subjectId: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  xpReward: number;
  gemsReward: number;
  estimatedMinutes: number;
  exercises: Exercise[];
  isExam?: boolean;
  isReview?: boolean;
}

export interface CurriculumUnit {
  id: string;
  title: Record<Language, string>;
  lessons: Lesson[];
}

export interface CurriculumSubject {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  iconName: string;
  color: string;
  units: CurriculumUnit[];
}

export interface DailyMission {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  actionRoute: string;
}

export interface WeeklyMission {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  current: number;
  target: number;
  rewardText: string;
  xpReward: number;
}

export interface Achievement {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StoreItem {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  costGems: number;
  category: 'streak' | 'energy' | 'booster' | 'cosmetic';
  icon: string;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  avatarLetter: string;
  color: string;
  conceptScores: Record<string, number>;
  activeStreak: number;
  lastActive: string;
}

export interface Classroom {
  id: string;
  code: string;
  name: string;
  teacherName: string;
  studentCount: number;
  averageMastery: number;
  submissionRate: number;
  alerts: {
    id: string;
    concept: string;
    description: string;
    severity: 'high' | 'medium';
  }[];
  students: ClassroomStudent[];
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'nexo';
  text?: string;
  timestamp: string;
  mode?: 'explain' | 'challenge' | 'analyze_error' | 'test_level';
  card?: {
    mode: 'explain' | 'challenge' | 'analyze_error' | 'test_level';
    title?: string;
    analogy?: string;
    steps?: string[];
    challenge?: {
      badge?: string;
      xp?: number;
      problem: string;
      formula?: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
    errorAnalysis?: {
      codeOrMath: string[];
      errorLineIndex: number;
      conceptErrorName: string;
      correctionGuide: string[];
    };
    diagnostic?: {
      topic: string;
      score: number;
      recommendation: string;
    };
  };
}

export interface StudyFeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  avatarColor: string;
  type: 'streak' | 'league' | 'assignment' | 'achievement' | 'mastery' | 'challenge' | 'post';
  title: string;
  description: string;
  timeAgo: string;
  badgeText?: string;
  badgeColor?: string;
  reactions: {
    clap: number;
    celebration: number;
    fire: number;
    heart: number;
    inspire?: number;
  };
  hasReacted?: Record<string, boolean>;
}
