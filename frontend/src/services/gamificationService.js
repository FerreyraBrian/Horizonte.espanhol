/**
 * Gamification Service
 * Maneja todo el sistema de puntos, logros, rachas y recompensas
 */

const STORAGE_KEY = 'gamification_state';

const ACHIEVEMENTS = {
  'first_quiz': {
    id: 'first_quiz',
    icon: '🎯',
    title: 'Primer Quiz',
    description: 'Completaste tu primer quiz',
    xp: 25,
    color: '#3b82f6',
  },
  'perfect_quiz': {
    id: 'perfect_quiz',
    icon: '💯',
    title: 'Puntuación Perfecta',
    description: 'Acertaste todas las preguntas del quiz',
    xp: 50,
    color: '#10b981',
  },
  'streak_3': {
    id: 'streak_3',
    icon: '🔥',
    title: '3 Días Consecutivos',
    description: 'Estudiaste 3 días seguidos',
    xp: 75,
    color: '#f97316',
  },
  'streak_7': {
    id: 'streak_7',
    icon: '⚔️',
    title: '7 Días Consecutivos',
    description: 'Una semana de dedicación total',
    xp: 150,
    color: '#8b5cf6',
  },
  'perfect_lesson': {
    id: 'perfect_lesson',
    icon: '⭐',
    title: 'Lección Perfecta',
    description: 'Completaste todas las actividades con 80%+ de acierto',
    xp: 100,
    color: '#fbbf24',
  },
  'voice_master': {
    id: 'voice_master',
    icon: '🎤',
    title: 'Maestro de Voz',
    description: 'Grabaste 5 respuestas de voz',
    xp: 80,
    color: '#ec4899',
  },
  'writer': {
    id: 'writer',
    icon: '✍️',
    title: 'Escritor Prolífico',
    description: 'Escribiste 5 respuestas',
    xp: 80,
    color: '#06b6d4',
  },
  'speedrun': {
    id: 'speedrun',
    icon: '⚡',
    title: 'Velocista',
    description: 'Completaste una lección en menos de 5 minutos',
    xp: 60,
    color: '#f97316',
  },
  'level_5': {
    id: 'level_5',
    icon: '🏆',
    title: 'Nivel 5',
    description: 'Alcanzaste el nivel 5',
    xp: 100,
    color: '#fbbf24',
  },
  'level_10': {
    id: 'level_10',
    icon: '👑',
    title: 'Maestro Absoluto',
    description: 'Alcanzaste el nivel 10',
    xp: 200,
    color: '#f59e0b',
  },
};

const LEVEL_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 300,
  4: 600,
  5: 1000,
  6: 1500,
  7: 2100,
  8: 2800,
  9: 3600,
  10: 5000,
};

class GamificationService {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load gamification state');
      }
    }

    return {
      totalXP: 0,
      level: 1,
      streakDays: 0,
      lastLessonDate: null,
      completedLessons: 0,
      unlockedAchievements: [],
      statistics: {
        quizzesCompleted: 0,
        writingsSubmitted: 0,
        voiceRecordings: 0,
        perfectQuizzes: 0,
      },
      dailyBonusClaimed: false,
      lastBonusDate: null,
    };
  }

  saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  addXP(amount, reason = '') {
    const oldLevel = this.state.level;
    this.state.totalXP += amount;

    // Update level
    this.state.level = this.getCurrentLevel();

    // Check for level up achievement
    if (this.state.level > oldLevel) {
      if (this.state.level === 5) this.unlockAchievement('level_5');
      if (this.state.level === 10) this.unlockAchievement('level_10');
    }

    this.saveState();
    return {
      xpAdded: amount,
      totalXP: this.state.totalXP,
      leveledUp: this.state.level > oldLevel,
      newLevel: this.state.level,
    };
  }

  getCurrentLevel() {
    for (let i = 10; i >= 1; i--) {
      if (this.state.totalXP >= LEVEL_THRESHOLDS[i]) {
        return i;
      }
    }
    return 1;
  }

  getProgressToNextLevel() {
    const current = this.getCurrentLevel();
    const nextLevel = current + 1;

    if (!LEVEL_THRESHOLDS[nextLevel]) {
      return 100; // Max level
    }

    const currentThreshold = LEVEL_THRESHOLDS[current];
    const nextThreshold = LEVEL_THRESHOLDS[nextLevel];
    const progress = this.state.totalXP - currentThreshold;
    const total = nextThreshold - currentThreshold;

    return Math.round((progress / total) * 100);
  }

  getXPForNextLevel() {
    const current = this.getCurrentLevel();
    const nextLevel = current + 1;
    return LEVEL_THRESHOLDS[nextLevel] - this.state.totalXP;
  }

  unlockAchievement(achievementId) {
    if (this.state.unlockedAchievements.includes(achievementId)) {
      return null; // Already unlocked
    }

    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return null;

    this.state.unlockedAchievements.push(achievementId);
    this.addXP(achievement.xp, `Achievement: ${achievement.title}`);

    this.saveState();
    return achievement;
  }

  completeQuiz(score, totalQuestions) {
    this.state.statistics.quizzesCompleted += 1;
    const xpEarned = Math.round((score / totalQuestions) * 30) + 10; // 10-40 XP

    const result = this.addXP(xpEarned, `Quiz completed: ${score}/${totalQuestions}`);

    // Check for achievements
    if (this.state.statistics.quizzesCompleted === 1) {
      this.unlockAchievement('first_quiz');
    }

    if (score === totalQuestions) {
      this.state.statistics.perfectQuizzes += 1;
      this.unlockAchievement('perfect_quiz');
    }

    this.saveState();
    return { ...result, xpReason: `+${xpEarned} XP - Quiz: ${score}/${totalQuestions}` };
  }

  completeListening(score, totalQuestions) {
    this.state.statistics.listeningCompleted = (this.state.statistics.listeningCompleted || 0) + 1;
    const xpEarned = Math.round((score / totalQuestions) * 50) + 20; // 20-70 XP (más que quiz)

    const result = this.addXP(xpEarned, `Listening completed: ${score}/${totalQuestions}`);

    // Check for achievements
    if (this.state.statistics.listeningCompleted === 1) {
      this.unlockAchievement('first_quiz'); // Reuse for now
    }

    if (score === totalQuestions) {
      this.state.statistics.perfectListenings = (this.state.statistics.perfectListenings || 0) + 1;
      this.unlockAchievement('perfect_quiz'); // Reuse for now
    }

    this.saveState();
    return { ...result, xpReason: `+${xpEarned} XP - Listening: ${score}/${totalQuestions}` };
  }

  submitWriting() {
    this.state.statistics.writingsSubmitted += 1;
    this.addXP(15, 'Writing submitted');

    if (this.state.statistics.writingsSubmitted === 5) {
      this.unlockAchievement('writer');
    }

    this.saveState();
  }

  recordVoice() {
    this.state.statistics.voiceRecordings += 1;
    this.addXP(20, 'Voice recording');

    if (this.state.statistics.voiceRecordings === 5) {
      this.unlockAchievement('voice_master');
    }

    this.saveState();
  }

  completeLessonSession(duration, quizScore, quizTotal) {
    // Bonus por speedrun
    if (duration < 300000) { // < 5 min
      this.unlockAchievement('speedrun');
      this.addXP(25, 'Speedrun bonus');
    }

    // Bonus por lección perfecta
    if (quizScore === quizTotal && 
        this.state.statistics.writingsSubmitted > 0 && 
        this.state.statistics.voiceRecordings > 0) {
      this.unlockAchievement('perfect_lesson');
      this.addXP(50, 'Perfect lesson bonus');
    }

    this.updateStreak();
    this.state.completedLessons += 1;
    this.saveState();
  }

  updateStreak() {
    const today = new Date().toDateString();
    const lastDate = this.state.lastLessonDate;

    if (lastDate === today) {
      return; // Ya estudió hoy
    }

    const lastDateObj = lastDate ? new Date(lastDate) : null;
    const todayObj = new Date();

    if (!lastDateObj) {
      this.state.streakDays = 1;
    } else {
      const diffDays = Math.floor(
        (todayObj - lastDateObj) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        this.state.streakDays += 1;
      } else if (diffDays > 1) {
        this.state.streakDays = 1;
      }
    }

    // Check streak achievements
    if (this.state.streakDays === 3) {
      this.unlockAchievement('streak_3');
    }
    if (this.state.streakDays === 7) {
      this.unlockAchievement('streak_7');
      this.addXP(100, '7-day streak bonus');
    }

    this.state.lastLessonDate = today;
    this.saveState();
  }

  claimDailyBonus() {
    const today = new Date().toDateString();

    if (this.state.lastBonusDate === today) {
      return { claimed: false, reason: 'Already claimed today' };
    }

    const streakBonus = this.state.streakDays * 10;
    const baseBonus = 50;
    const totalBonus = baseBonus + streakBonus;

    this.addXP(totalBonus, `Daily bonus + streak multiplier (x${this.state.streakDays})`);
    this.state.lastBonusDate = today;
    this.state.dailyBonusClaimed = true;

    this.saveState();
    return {
      claimed: true,
      totalXP: totalBonus,
      breakdown: { baseBonus, streakBonus },
    };
  }

  getStats() {
    return {
      level: this.getCurrentLevel(),
      totalXP: this.state.totalXP,
      xpForNext: this.getXPForNextLevel(),
      progressPercent: this.getProgressToNextLevel(),
      streakDays: this.state.streakDays,
      completedLessons: this.state.completedLessons,
      achievements: this.state.unlockedAchievements.length,
      statistics: this.state.statistics,
      nextLevelThreshold: LEVEL_THRESHOLDS[this.getCurrentLevel() + 1] || 'MAX',
    };
  }

  getAchievement(id) {
    return ACHIEVEMENTS[id] || null;
  }

  getAllAchievements() {
    return ACHIEVEMENTS;
  }

  getUnlockedAchievements() {
    return this.state.unlockedAchievements.map(id => ({
      ...ACHIEVEMENTS[id],
      unlockedAt: new Date().toISOString(),
    }));
  }

  resetProgress() {
    this.state = this.loadState();
    this.saveState();
  }
}

export default new GamificationService();
