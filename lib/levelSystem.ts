/**
 * Frontend Level Progression System
 * Mirrors the backend levelSystem.ts exactly.
 *
 * HOW IT WORKS (plain English):
 *
 * LEVELS (1–100):
 *   Each level requires 5% more XP than the previous one.
 *   Level 1 needs 1000 XP, Level 2 needs 1050, Level 3 needs 1103...
 *   Formula: floor(1000 × 1.05^(level - 1))
 *
 * ENERGY CAP (maxEnergy):
 *   Every 10 levels, the energy tank gets 40% bigger.
 *   Levels  1–10  → 1,000  energy
 *   Levels 11–20  → 1,400  energy
 *   Levels 21–30  → 1,960  energy
 *   Levels 31–40  → 2,744  energy  ... all the way to...
 *   Levels 91–100 → 20,661 energy
 *   Formula: floor(1000 × 1.4^band), where band = floor((level-1)/10)
 *
 * MAX XP / 24h:
 *   The most XP a player can earn in a single day.
 *   = Energy cap (from tapping) + 600 (from social tasks)
 *   Example at Level 1: 1000 + 600 = 1600 XP/day max
 *
 * CUMULATIVE XP:
 *   Total XP earned across ALL levels combined.
 *   Used to show overall progress. Not stored on the server —
 *   the server only stores xp (within current level) and level.
 *   If you want to show it: sum up all xpToNext(l) for l < currentLevel, then add current xp.
 */

export const MAX_LEVEL = 100;
export const DAILY_SOCIAL_CAP = 600; // Fixed XP from tasks per day

/** XP required to go from `level` to `level + 1`. Returns 0 at max level. */
export function xpToNextLevel(level: number): number {
  if (level >= MAX_LEVEL) return 0;
  return Math.floor(1000 * Math.pow(1.05, level - 1));
}

/** Energy band (tier) for a given level. Changes every 10 levels. */
export function energyBand(level: number): number {
  return Math.floor((level - 1) / 10);
}

/** Maximum energy (tank size) for a given level. */
export function maxEnergyForLevel(level: number): number {
  return Math.floor(1000 * Math.pow(1.4, energyBand(level)));
}

/** Maximum total XP earnable per day at a given level. */
export function maxXpPerDay(level: number): number {
  return maxEnergyForLevel(level) + DAILY_SOCIAL_CAP;
}

/**
 * Process a local XP gain (for instant UI feedback before server sync).
 * Returns the new level, xp, and maxEnergy after applying the gain.
 */
export function processXpGain(
  currentLevel: number,
  currentXp: number,
  xpGained: number
): {
  newLevel: number;
  newXp: number;
  newMaxEnergy: number;
  leveledUp: boolean;
  levelsGained: number;
} {
  let level = currentLevel;
  let xp = currentXp + xpGained;
  let levelsGained = 0;

  while (level < MAX_LEVEL) {
    const threshold = xpToNextLevel(level);
    if (xp >= threshold) {
      xp -= threshold;
      level++;
      levelsGained++;
    } else {
      break;
    }
  }

  if (level >= MAX_LEVEL) xp = 0;

  return {
    newLevel: level,
    newXp: xp,
    newMaxEnergy: maxEnergyForLevel(level),
    leveledUp: levelsGained > 0,
    levelsGained,
  };
}

/**
 * Full level info — useful for progress screens and profile pages.
 */
export function getLevelInfo(level: number) {
  return {
    level,
    xpToNext: xpToNextLevel(level),
    energyBand: energyBand(level),
    maxEnergy: maxEnergyForLevel(level),
    dailySocialCap: DAILY_SOCIAL_CAP,
    maxXpPerDay: maxXpPerDay(level),
    isMaxLevel: level >= MAX_LEVEL,
  };
}

/**
 * Cumulative XP needed to REACH a given level (from Level 1, XP 0).
 * Used for displaying overall progress on profile/stats screens.
 */
export function cumulativeXpToReach(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) {
    total += xpToNextLevel(l);
  }
  return total;
}

/**
 * Player's total lifetime XP (cumulative).
 * = XP needed to reach current level + XP earned within current level
 */
export function totalLifetimeXp(level: number, xpWithinLevel: number): number {
  return cumulativeXpToReach(level) + xpWithinLevel;
}
