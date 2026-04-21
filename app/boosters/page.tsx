"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, Coins, Lock, Check, Flame, Pickaxe, Timer, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  getBoosterStatus,
  purchaseTapBooster as apiPurchaseTap,
  purchasePassiveBooster as apiPurchasePassive,
  claimPassiveBooster as apiClaimPassive,
} from '@/lib/api';
import {
  TAP_BOOSTER_LIST,
  PASSIVE_BOOSTER_LIST,
  TapBoosterSpec,
  PassiveBoosterSpec,
  TapBoosterType,
  PassiveBoosterType,
  estimatePassivePending,
  formatCountdown,
  getActiveTapMultiplier,
} from '@/lib/boosterSystem';

type Tab = 'tap' | 'miner';

export default function BoostersPage() {
  const { stats, setStats } = useApp();
  const [tab, setTab] = useState<Tab>('tap');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null); // id of booster being purchased/claimed
  const [now, setNow] = useState(() => new Date());

  // Tick every second so countdowns & pending-points stay live.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch authoritative state on mount; merge into global stats.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getBoosterStatus();
        if (!cancelled && res.success) {
          const { state } = res.data;
          setStats(prev => ({
            ...prev,
            coins: Number(state.coins ?? prev.coins),
            tapBooster: state.tapBooster ?? null,
            passiveBooster: state.passiveBooster ?? null,
          }));
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load boosters');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [setStats]);

  const tapBooster = stats.tapBooster ?? null;
  const passiveBooster = stats.passiveBooster ?? null;
  const tapMultiplier = getActiveTapMultiplier(tapBooster, now);
  const coins = stats.coins;

  const tapTimeLeftMs = useMemo(() => {
    if (!tapBooster?.expiresAt) return 0;
    return Math.max(0, new Date(tapBooster.expiresAt).getTime() - now.getTime());
  }, [tapBooster, now]);

  const passivePending = useMemo(
    () => estimatePassivePending(passiveBooster, now),
    [passiveBooster, now]
  );

  const passiveTimeLeftMs = useMemo(() => {
    if (!passiveBooster?.expiresAt) return 0;
    return Math.max(0, new Date(passiveBooster.expiresAt).getTime() - now.getTime());
  }, [passiveBooster, now]);

  const handleBuyTap = useCallback(async (spec: TapBoosterSpec) => {
    if (busy) return;
    if (coins < spec.price) { setError(`Need ${spec.price} coins`); return; }
    setBusy(`tap:${spec.id}`);
    setError(null);
    try {
      const res = await apiPurchaseTap(spec.id as TapBoosterType);
      if (res.success) {
        setStats(prev => ({
          ...prev,
          coins: Number(res.data.coins ?? prev.coins),
          tapBooster: res.data.tapBooster,
          passiveBooster: res.data.passiveBooster,
        }));
      }
    } catch (e: any) {
      setError(e?.message || 'Purchase failed');
    } finally {
      setBusy(null);
    }
  }, [busy, coins, setStats]);

  const handleBuyPassive = useCallback(async (spec: PassiveBoosterSpec) => {
    if (busy || spec.locked) return;
    if (coins < spec.price) { setError(`Need ${spec.price} coins`); return; }
    setBusy(`miner:${spec.id}`);
    setError(null);
    try {
      const res = await apiPurchasePassive(spec.id as PassiveBoosterType);
      if (res.success) {
        setStats(prev => ({
          ...prev,
          coins: Number(res.data.coins ?? prev.coins),
          tapBooster: res.data.tapBooster,
          passiveBooster: res.data.passiveBooster,
        }));
      }
    } catch (e: any) {
      setError(e?.message || 'Purchase failed');
    } finally {
      setBusy(null);
    }
  }, [busy, coins, setStats]);

  const handleClaim = useCallback(async () => {
    if (busy) return;
    setBusy('claim');
    setError(null);
    try {
      const res = await apiClaimPassive();
      if (res.success) {
        setStats(prev => ({
          ...prev,
          coins: Number(res.data.coins ?? prev.coins),
          tapBooster: res.data.tapBooster,
          passiveBooster: res.data.passiveBooster,
        }));
      }
    } catch (e: any) {
      setError(e?.message || 'Claim failed');
    } finally {
      setBusy(null);
    }
  }, [busy, setStats]);

  return (
    <div className="h-dvh flex flex-col overflow-hidden pt-[84px] pb-[99px] px-4">
      <div className="mb-3 flex-shrink-0">
        <h1 className="text-xl font-black text-white italic tracking-tighter">BOOSTERS & MINERS</h1>
        <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
          Tap multipliers · Passive earners
        </p>
      </div>

      {/* Balance */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 mb-3 flex-shrink-0 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-yellow-400/10 p-2 rounded-xl border border-yellow-400/20">
              <Coins className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Your Balance</p>
              <p className="text-lg font-black text-white leading-none">{coins.toLocaleString()}</p>
            </div>
          </div>
          {tapMultiplier > 1 && (
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-yellow-300 text-[10px] font-black uppercase tracking-widest">
                <Flame size={12} /> {tapMultiplier}× Active
              </div>
              <p className="text-[9px] text-gray-400 font-bold">{formatCountdown(tapTimeLeftMs)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-3 flex-shrink-0">
        <button
          onClick={() => setTab('tap')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            tab === 'tap'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-white/20 shadow-md'
              : 'bg-white/5 text-gray-400 border-white/5'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5"><Zap size={12} /> Tap Boosters</span>
        </button>
        <button
          onClick={() => setTab('miner')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            tab === 'miner'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-white/20 shadow-md'
              : 'bg-white/5 text-gray-400 border-white/5'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5"><Pickaxe size={12} /> Miners</span>
        </button>
      </div>

      {error && (
        <div className="mb-2 text-[10px] text-red-400 font-bold bg-red-500/10 border border-red-500/20 rounded-lg p-2">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-[11px] font-bold">
            <Loader2 className="animate-spin mr-2" size={14} /> Loading...
          </div>
        ) : tab === 'tap' ? (
          <TapBoosterTab
            specs={TAP_BOOSTER_LIST}
            activeType={tapBooster?.type ?? null}
            activeMultiplier={tapMultiplier}
            timeLeftMs={tapTimeLeftMs}
            coins={coins}
            busy={busy}
            onBuy={handleBuyTap}
          />
        ) : (
          <PassiveBoosterTab
            specs={PASSIVE_BOOSTER_LIST}
            activeType={passiveBooster?.type ?? null}
            pending={passivePending}
            timeLeftMs={passiveTimeLeftMs}
            isExpired={passiveBooster?.isExpired ?? false}
            coins={coins}
            busy={busy}
            onBuy={handleBuyPassive}
            onClaim={handleClaim}
          />
        )}
      </div>
    </div>
  );
}

// ── Tap Booster Tab ─────────────────────────────────────────────────────────

interface TapTabProps {
  specs: TapBoosterSpec[];
  activeType: string | null;
  activeMultiplier: number;
  timeLeftMs: number;
  coins: number;
  busy: string | null;
  onBuy: (spec: TapBoosterSpec) => void;
}

function TapBoosterTab({ specs, activeType, activeMultiplier, timeLeftMs, coins, busy, onBuy }: TapTabProps) {
  return (
    <>
      {activeType && activeMultiplier > 1 && (
        <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] text-purple-300 font-black uppercase tracking-widest">Active</p>
              <p className="text-base font-black text-white">{activeMultiplier}× Tap Booster</p>
            </div>
            <div className="flex items-center gap-1 text-yellow-300 text-[11px] font-black">
              <Timer size={12} /> {formatCountdown(timeLeftMs)}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {specs.map((spec, i) => {
          const isActive = activeType === spec.id;
          const canAfford = coins >= spec.price;
          const isBusy = busy === `tap:${spec.id}`;
          return (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white/5 backdrop-blur-sm rounded-2xl p-3 border ${
                isActive ? 'border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/5'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-purple-500/10 p-2.5 rounded-xl text-2xl flex-shrink-0">{spec.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-xs font-black text-white">{spec.name}</h3>
                    {isActive && (
                      <span className="bg-green-500/20 text-green-400 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase flex items-center gap-0.5">
                        <Check size={8} /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-gray-500 font-medium mb-1.5">{spec.tagline}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[8px] text-purple-400 font-black uppercase bg-purple-500/10 px-1.5 py-0.5 rounded">
                      {spec.multiplier}× coins
                    </span>
                    <span className="text-[8px] text-yellow-400 font-black uppercase bg-yellow-500/10 px-1.5 py-0.5 rounded">
                      24h
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onBuy(spec)}
                disabled={!canAfford || !!busy}
                className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
                  isBusy
                    ? 'bg-purple-700 text-white'
                    : canAfford
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-900/40'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isBusy ? (
                  <span className="flex items-center justify-center gap-1.5"><Loader2 className="animate-spin" size={12}/> WORKING</span>
                ) : isActive ? (
                  <span>EXTEND 24H · {spec.price.toLocaleString()}</span>
                ) : (
                  <span>ACTIVATE · {spec.price.toLocaleString()} COINS</span>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 bg-blue-600/10 rounded-2xl p-4 border border-blue-400/20">
        <h3 className="text-[10px] font-black text-white mb-2 flex items-center gap-1.5 uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 text-yellow-400" /> How it works
        </h3>
        <ul className="text-[9px] text-gray-500 font-bold space-y-1.5 px-1">
          <li>• Multipliers apply instantly to every tap for 24h.</li>
          <li>• They don&apos;t stack — buying again resets the 24h timer.</li>
          <li>• Upgrading to a stronger booster replaces the current one.</li>
        </ul>
      </div>
    </>
  );
}

// ── Passive Miner Tab ───────────────────────────────────────────────────────

interface PassiveTabProps {
  specs: PassiveBoosterSpec[];
  activeType: string | null;
  pending: number;
  timeLeftMs: number;
  isExpired: boolean;
  coins: number;
  busy: string | null;
  onBuy: (spec: PassiveBoosterSpec) => void;
  onClaim: () => void;
}

function PassiveBoosterTab({ specs, activeType, pending, timeLeftMs, isExpired, coins, busy, onBuy, onClaim }: PassiveTabProps) {
  return (
    <>
      {activeType && (
        <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-400/30">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[9px] text-emerald-300 font-black uppercase tracking-widest">Mining</p>
              <p className="text-base font-black text-white capitalize">{activeType} Miner</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                {isExpired ? 'Cycle ended' : 'Ends in'}
              </p>
              <p className="text-[11px] text-white font-black">
                {isExpired ? '—' : formatCountdown(timeLeftMs)}
              </p>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-2.5 flex items-center justify-between border border-white/5">
            <div>
              <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Pending</p>
              <p className="text-lg font-black text-emerald-300 leading-none">{pending.toLocaleString()}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClaim}
              disabled={pending <= 0 || !!busy}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                pending > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              {busy === 'claim' ? (
                <span className="flex items-center gap-1.5"><Loader2 className="animate-spin" size={12}/> CLAIM</span>
              ) : (
                'CLAIM'
              )}
            </motion.button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {specs.map((spec, i) => {
          const isActive = activeType === spec.id;
          const locked = !!spec.locked;
          const canAfford = coins >= spec.price;
          const isBusy = busy === `miner:${spec.id}`;
          return (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white/5 backdrop-blur-sm rounded-2xl p-3 border ${
                isActive ? 'border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-white/5'
              } ${locked ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-2xl flex-shrink-0">{spec.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <h3 className="text-xs font-black text-white">{spec.name}</h3>
                    {isActive && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase">
                        Running
                      </span>
                    )}
                    {locked && (
                      <span className="bg-white/5 text-gray-500 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase flex items-center gap-0.5">
                        <Lock size={8} /> Soon
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-gray-500 font-medium mb-1.5">{spec.tagline}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[8px] text-emerald-400 font-black uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {spec.ratePerHour}/hr
                    </span>
                    <span className="text-[8px] text-blue-400 font-black uppercase bg-blue-500/10 px-1.5 py-0.5 rounded">
                      {spec.totalPoints.toLocaleString()} / 7d
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onBuy(spec)}
                disabled={locked || !canAfford || !!busy}
                className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
                  locked
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : isBusy
                    ? 'bg-emerald-700 text-white'
                    : canAfford
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-900/40'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                {locked ? (
                  <span className="flex items-center justify-center gap-1.5"><Lock size={12} /> LOCKED</span>
                ) : isBusy ? (
                  <span className="flex items-center justify-center gap-1.5"><Loader2 className="animate-spin" size={12}/> WORKING</span>
                ) : isActive ? (
                  <span>EXTEND 7D · {spec.price.toLocaleString()}</span>
                ) : activeType ? (
                  <span>UPGRADE · {spec.price.toLocaleString()} COINS</span>
                ) : (
                  <span>START MINING · {spec.price.toLocaleString()} COINS</span>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 bg-blue-600/10 rounded-2xl p-4 border border-blue-400/20">
        <h3 className="text-[10px] font-black text-white mb-2 flex items-center gap-1.5 uppercase tracking-widest">
          <Pickaxe className="w-3.5 h-3.5 text-emerald-400" /> How mining works
        </h3>
        <ul className="text-[9px] text-gray-500 font-bold space-y-1.5 px-1">
          <li>• Miners earn points every hour for 7 days.</li>
          <li>• After 7 days, accrual stops — claim to collect.</li>
          <li>• Only one miner runs at a time — upgrading auto-claims pending points first.</li>
        </ul>
      </div>
    </>
  );
}
