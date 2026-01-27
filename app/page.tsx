"use client";
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Coins, TrendingUp, Loader2, Bug, ChevronUp, ChevronDown, X, Gift, Star, Crown } from 'lucide-react'
import { getInitData, initTelegram } from '@/lib/telegram'
import { loginWithTelegram, apiRequest, updateUserStats } from '@/lib/api'
import { useRouter } from 'next/navigation'
import LevelUpModal from '@/components/game/LevelUpModal'

export default function TelegramMiniApp() {
  const [coins, setCoins] = useState(0)
  const [energy, setEnergy] = useState(0)
  const [maxEnergy, setMaxEnergy] = useState(1000)
  const [tapCount, setTapCount] = useState(0)
  const [coinsPerTap, setCoinsPerTap] = useState(10)
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [xpToNextLevel] = useState(1000)
  const [floatingCoins, setFloatingCoins] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [user, setUser] = useState<{
    username: string;
    telegramId?: string;
    coins?: string;
    level?: number;
    xp?: number;
    energy?: number;
    maxEnergy?: number;
    tapPower?: number;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [debugLog, setDebugLog] = useState<string[]>([])
  const [showConsole, setShowConsole] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)

  const addLog = (msg: string) => {
    setDebugLog(prev => [`${new Date().toLocaleTimeString()}: ${msg}`, ...prev].slice(0, 50))
    console.log(msg)
  }
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()

  // Refs to track last synced values to avoid redundant calls
  const lastSyncedStats = useRef({ coins: 0, xp: 0, level: 0, energy: 0 });

  useEffect(() => {
    const authenticate = async () => {
      try {
        addLog("Starting authentication...")
        initTelegram();
        const initData = getInitData();
        addLog(`initData: ${initData ? "Found (len: " + initData.length + ")" : "Empty"}`);

        if (initData) {
          addLog("Calling /auth/telegram...");
          const authData = await loginWithTelegram(initData);
          addLog(`Auth success: ${authData.success}`);
          if (authData.success) {
            const userData = authData.data.user;
            setUser(userData);
            addLog(`User authenticated: ${userData.username}`);

            // Sync local game stats with backend
            if (userData.coins) setCoins(Number(userData.coins));
            if (userData.level) setLevel(userData.level);
            if (userData.xp !== undefined) setXp(userData.xp);
            if (userData.energy !== undefined) setEnergy(userData.energy);
            if (userData.maxEnergy) setMaxEnergy(userData.maxEnergy);
            if (userData.tapPower) setCoinsPerTap(userData.tapPower);

            // Initialize lastSyncedStats with fetched data
            lastSyncedStats.current = {
              coins: Number(userData.coins || 0),
              xp: userData.xp || 0,
              level: userData.level || 1,
              energy: userData.energy || 0
            };
          }
        } else {
          addLog("No initData, checking for local token...");
          const token = localStorage.getItem("accessToken");
          if (token) {
            addLog("Token found, calling /auth/user...");
            const userInfo = await apiRequest("/auth/user");
            addLog(`User Info success: ${userInfo.success}`);
            if (userInfo.success) {
              const userData = userInfo.data;
              setUser(userData);

              // Sync local game stats with backend
              if (userData.coins) setCoins(Number(userData.coins));
              if (userData.level) setLevel(userData.level);
              if (userData.xp !== undefined) setXp(userData.xp);
              if (userData.energy !== undefined) setEnergy(userData.energy);
              if (userData.maxEnergy) setMaxEnergy(userData.maxEnergy);
              if (userData.tapPower) setCoinsPerTap(userData.tapPower);

              // Initialize lastSyncedStats with fetched data
              lastSyncedStats.current = {
                coins: Number(userData.coins || 0),
                xp: userData.xp || 0,
                level: userData.level || 1,
                energy: userData.energy || 0
              };
            }
          } else {
            addLog("No token or initData found. Redirecting to dev login...");
            // Redirect to development login page
            router.push('/dev-login');
            return;
          }
        }
      } catch (error: any) {
        addLog(`❌ Error: ${error.message}`);
        console.error("Authentication failed:", error);
        setAuthError(error.message || "Failed to connect to server");
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  // Refs to track last synced values to avoid redundant calls
  const latestStatsRef = useRef({ coins, xp, level, energy });

  // Update latest stats ref whenever state changes
  useEffect(() => {
    latestStatsRef.current = { coins, xp, level, energy };
  }, [coins, xp, level, energy]);

  // Sync data with backend when stats change
  useEffect(() => {
    if (!user || isLoading) return;

    const syncWithBackend = async () => {
      const statsToSync = latestStatsRef.current;
      if (
        lastSyncedStats.current.coins === statsToSync.coins &&
        lastSyncedStats.current.xp === statsToSync.xp &&
        lastSyncedStats.current.level === statsToSync.level &&
        lastSyncedStats.current.energy === statsToSync.energy
      ) {
        return;
      }

      try {
        await updateUserStats(statsToSync);
        lastSyncedStats.current = { ...statsToSync };
      } catch (error) {
        console.error("Sync failed:", error);
      }
    };

    const syncTimeout = setTimeout(syncWithBackend, 3000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') syncWithBackend();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(syncTimeout);
      // Attempt a quick sync on unmount if there are changes
      const statsToSync = latestStatsRef.current;
      if (
        lastSyncedStats.current.coins !== statsToSync.coins ||
        lastSyncedStats.current.xp !== statsToSync.xp ||
        lastSyncedStats.current.level !== statsToSync.level ||
        lastSyncedStats.current.energy !== statsToSync.energy
      ) {
        updateUserStats(statsToSync).catch(console.error);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, isLoading]);

  const handleTap = () => {
    if (energy > 0) {
      setCoins((prev) => prev + coinsPerTap)
      setTapCount((prev) => prev + 1)
      setEnergy((prev) => Math.max(0, prev - 1))
      setXp((prev) => prev + 2)

      const newCoin = {
        id: Date.now(),
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }
      setFloatingCoins((prev) => [...prev, newCoin])

      setTimeout(() => {
        setFloatingCoins((prev) => prev.filter((coin) => coin.id !== newCoin.id))
      }, 1000)
    }
  }

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(maxEnergy, prev + 5))
    }, 1000)
    return () => clearInterval(interval)
  }, [maxEnergy])

  // Level up check
  useEffect(() => {
    if (xp >= xpToNextLevel) {
      const leftoverXp = xp - xpToNextLevel;
      setLevel((prev) => prev + 1)
      setXp(leftoverXp)
      setShowLevelUp(true)
    }
  }, [xp, xpToNextLevel])

  const energyPercentage = (energy / maxEnergy) * 100

  return (
    <div className='h-dvh flex flex-col overflow-hidden px-4 pt-[84px] pb-[99px]'>
      {/* Persistent Debug Overlay - Minimal */}
      <div className="fixed top-2 right-2 z-[60]">
        {!showConsole ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowConsole(true)}
            className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 text-white/40 shadow-lg"
          >
            <Bug size={16} />
          </motion.button>
        ) : (
          <div className={`bg-black/95 text-[10px] text-green-400 font-mono rounded-xl border border-white/10 overflow-hidden shadow-2xl transition-all w-56 ${isMinimized ? 'h-8' : 'h-40'}`}>
            <div className="flex justify-between items-center p-2 bg-white/5 border-b border-white/5">
              <span className="font-bold flex items-center gap-1 opacity-50"><Bug size={12} /> DEBUG</span>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/40 hover:text-white">
                  {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button onClick={() => setShowConsole(false)} className="text-white/40 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            </div>
            {!isMinimized && (
              <div className="p-2 overflow-y-auto h-28 flex flex-col-reverse custom-scrollbar">
                {debugLog.length === 0 ? <div>Waiting for logs...</div> : debugLog.map((log, i) => <div key={i} className="mb-0.5 border-l border-green-500/40 pl-1">{log}</div>)}
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-medium">Lotoory is loading...</p>
          </div>
        </div>
      )}

      {/* Level Up Reward Modal */}
      <LevelUpModal
        isOpen={showLevelUp}
        level={level}
        onClose={() => setShowLevelUp(false)}
      />

      {/* Top Section: Profile & Dashboard (Grown) */}
      <div className="flex flex-col gap-3 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-[1.5rem] p-4 border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/avatar.jpg"
                alt="avatar"
                width={48}
                height={48}
                className='rounded-2xl w-12 h-12 object-cover border-2 border-white/20'
              />
              <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-br from-yellow-400 to-orange-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-black shadow-lg">
                {level}
              </div>
            </div>
            <div>
              <h2 className='text-base font-black text-white leading-none flex items-center gap-1.5 mb-1'>
                {user?.username || "Guest"}
                {level > 5 && <Crown size={14} className="text-yellow-400" />}
              </h2>
              <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 w-fit">
                {level < 5 ? 'Novice' : level < 15 ? 'Warrior' : 'Elite'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className='flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/30'>
              <Coins className='w-4 h-4 text-yellow-400' />
              <motion.span
                key={coins}
                className='text-lg font-black text-white italic tracking-tight'
              >
                {coins.toLocaleString()}
              </motion.span>
            </div>
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Balance</span>
          </div>
        </div>

        {/* Experience Bar - Centerpiece (Thicker) */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-inner">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em]">Progression</span>
            <span className="text-[10px] text-purple-400 font-black tracking-widest">{xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
          </div>
          <div className='relative w-full h-3 bg-black/50 rounded-full overflow-hidden p-[2px] border border-white/10'>
            <motion.div
              className='h-full relative rounded-full'
              initial={{ width: 0 }}
              animate={{ width: `${(xp / xpToNextLevel) * 100}%` }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-shimmer" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Tap Area - Dominant focus (Larger Button) */}
      <div className='flex-1 flex flex-col justify-center items-center relative py-6'>
        {/* Decorative background glows (Enhanced) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/15 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-600/10 blur-[60px] rounded-full pointer-events-none" />

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleTap}
          className="relative z-10 flex items-center justify-center rounded-full p-2 group"
          aria-label="Tap to Earn"
        >
          {/* Outer Pulse Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/5 group-active:border-purple-500/20 scale-125 transition-all" />

          <div className="relative p-2 bg-gradient-to-tr from-white/10 to-white/20 rounded-full backdrop-blur-md shadow-[0_0_60px_rgba(168,85,247,0.2)] active:shadow-none transition-all border border-white/20">
            <Image
              src="/Tap.png"
              alt="tap"
              width={240}
              height={240}
              className="w-52 h-52 xs:w-64 xs:h-64 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform"
            />
          </div>

          <AnimatePresence>
            {floatingCoins.map((coin) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ opacity: 0, x: coin.x, y: coin.y - 80, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute text-yellow-400 font-black text-2xl pointer-events-none z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              >
                +{coinsPerTap}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 font-black uppercase tracking-[0.25em] flex items-center gap-2">
            <Star size={12} className="text-yellow-400 animate-pulse" />
            REWARD: <span className="text-green-400">+{coinsPerTap}C / +2XP</span>
            <Star size={12} className="text-yellow-400 animate-pulse" />
          </p>
        </div>
      </div>

      {/* Bottom Section: Energy & Quick Actions */}
      <div className="mt-auto flex flex-col gap-4 pb-4">
        {/* Energy Bar (Thicker) */}
        <div className='bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <Zap className='w-4 h-4 text-yellow-400 fill-yellow-400/20' />
              <span className='text-xs text-white font-black uppercase tracking-widest'>Energy</span>
            </div>
            <span className='text-xs text-white font-black'>{energy} <span className="text-gray-500">/ {maxEnergy}</span></span>
          </div>
          <div className='w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5'>
            <motion.div
              className='h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-[length:200%_100%]'
              initial={{ width: 0 }}
              animate={{
                width: `${energyPercentage}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Quick Actions Grid (Grown buttons) */}
        <div className='grid grid-cols-2 gap-3'>
          <Link href="/boosters">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 text-center border border-white/20 shadow-xl shadow-purple-900/40 relative overflow-hidden group'
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
              <p className='text-xs text-white font-black flex items-center justify-center gap-2 tracking-widest'>
                <TrendingUp size={16} /> UPGRADE
              </p>
            </motion.div>
          </Link>
          <Link href="/tasks">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-4 text-center border border-white/20 shadow-xl shadow-blue-900/40 relative overflow-hidden group'
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
              <p className='text-xs text-white font-black flex items-center justify-center gap-2 tracking-widest'>
                <Gift size={16} /> EARN LOOT
              </p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}
