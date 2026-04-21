/**
 * Booster System — frontend mirror of the backend spec.
 *
 * Catalog & helpers for Tap Boosters (24h multipliers) and Passive Miners
 * (7-day auto-earners). Values MUST match backend/src/utils/boosterSystem.ts.
 */

export const TAP_BOOSTER_DURATION_MS = 24 * 60 * 60 * 1000;
export const PASSIVE_BOOSTER_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export type TapBoosterType = "x2" | "x3" | "x5";
export type PassiveBoosterType = "mini" | "pro" | "turbo" | "mega" | "titan";

export interface TapBoosterSpec {
    id: TapBoosterType;
    name: string;
    multiplier: number;
    durationMs: number;
    price: number;
    icon: string;
    tagline: string;
}

export interface PassiveBoosterSpec {
    id: PassiveBoosterType;
    name: string;
    ratePerHour: number;
    durationMs: number;
    pointsPerDay: number;
    totalPoints: number;
    price: number;
    icon: string;
    tagline: string;
    locked?: boolean;
}

export const TAP_BOOSTERS: Record<TapBoosterType, TapBoosterSpec> = {
    x2: {
        id: "x2",
        name: "Tap x2",
        multiplier: 2,
        durationMs: TAP_BOOSTER_DURATION_MS,
        price: 1000,
        icon: "⚡",
        tagline: "Double every tap for 24h",
    },
    x3: {
        id: "x3",
        name: "Tap x3",
        multiplier: 3,
        durationMs: TAP_BOOSTER_DURATION_MS,
        price: 2000,
        icon: "🔥",
        tagline: "Triple every tap for 24h",
    },
    x5: {
        id: "x5",
        name: "Tap x5",
        multiplier: 5,
        durationMs: TAP_BOOSTER_DURATION_MS,
        price: 7000,
        icon: "💎",
        tagline: "5× every tap for 24h",
    },
};

export const PASSIVE_BOOSTERS: Record<PassiveBoosterType, PassiveBoosterSpec> = {
    mini: {
        id: "mini",
        name: "Mini Miner",
        ratePerHour: 10,
        durationMs: PASSIVE_BOOSTER_DURATION_MS,
        pointsPerDay: 240,
        totalPoints: 1680,
        price: 1260,
        icon: "⛏️",
        tagline: "+10 pts/hr for 7 days",
    },
    pro: {
        id: "pro",
        name: "Pro Miner",
        ratePerHour: 25,
        durationMs: PASSIVE_BOOSTER_DURATION_MS,
        pointsPerDay: 600,
        totalPoints: 4200,
        price: 3150,
        icon: "🛠️",
        tagline: "+25 pts/hr for 7 days",
    },
    turbo: {
        id: "turbo",
        name: "Turbo Miner",
        ratePerHour: 60,
        durationMs: PASSIVE_BOOSTER_DURATION_MS,
        pointsPerDay: 1440,
        totalPoints: 10080,
        price: 7560,
        icon: "🚀",
        tagline: "+60 pts/hr for 7 days",
        locked: true,
    },
    mega: {
        id: "mega",
        name: "Mega Miner",
        ratePerHour: 150,
        durationMs: PASSIVE_BOOSTER_DURATION_MS,
        pointsPerDay: 3600,
        totalPoints: 25200,
        price: 18900,
        icon: "🌋",
        tagline: "+150 pts/hr for 7 days",
        locked: true,
    },
    titan: {
        id: "titan",
        name: "Titan Miner",
        ratePerHour: 400,
        durationMs: PASSIVE_BOOSTER_DURATION_MS,
        pointsPerDay: 9600,
        totalPoints: 67200,
        price: 50400,
        icon: "🪐",
        tagline: "+400 pts/hr for 7 days",
        locked: true,
    },
};

export const TAP_BOOSTER_LIST = Object.values(TAP_BOOSTERS);
export const PASSIVE_BOOSTER_LIST = Object.values(PASSIVE_BOOSTERS);

export interface ActiveTapBooster {
    active: boolean;
    type: TapBoosterType | null;
    multiplier: number;
    expiresAt: string | null;
}

export interface ActivePassiveBooster {
    type: PassiveBoosterType;
    ratePerHour: number;
    startedAt: string;
    expiresAt: string;
    lastClaimedAt: string;
    pendingPoints: number;
    isExpired: boolean;
    msRemaining: number;
}

/** Compute live multiplier on the client (handles expiry between server syncs). */
export function getActiveTapMultiplier(
    booster: ActiveTapBooster | null | undefined,
    now: Date = new Date()
): number {
    if (!booster || !booster.type || !booster.expiresAt) return 1;
    if (new Date(booster.expiresAt).getTime() <= now.getTime()) return 1;
    return booster.multiplier || TAP_BOOSTERS[booster.type]?.multiplier || 1;
}

/** Live client-side estimate of how many points the active miner has pending. */
export function estimatePassivePending(
    booster: ActivePassiveBooster | null | undefined,
    now: Date = new Date()
): number {
    if (!booster) return 0;
    const expiresAt = new Date(booster.expiresAt).getTime();
    const lastClaim = new Date(booster.lastClaimedAt).getTime();
    const effectiveEnd = Math.min(now.getTime(), expiresAt);
    const ms = Math.max(0, effectiveEnd - lastClaim);
    const hours = ms / (60 * 60 * 1000);
    return Math.floor(booster.ratePerHour * hours);
}

export function formatCountdown(ms: number): string {
    if (ms <= 0) return "0s";
    const totalSec = Math.floor(ms / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}
