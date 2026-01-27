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
import LoadingScreen from '@/components/shared/LoadingScreen'
import { useApp } from '@/context/AppContext'

export default function TelegramMiniApp() {
  const { isInitialLoad, setIsInitialLoad, user, setUser, stats, setStats, isDataLoaded, setIsDataLoaded } = useApp()

  // Initialize local state from global context for immediate responsiveness
  const [coins, setCoins] = useState(stats.coins)
  const [energy, setEnergy] = useState(stats.energy)
  const [maxEnergy, setMaxEnergy] = useState(stats.maxEnergy)
  const [tapCount, setTapCount] = useState(0)
  const [coinsPerTap, setCoinsPerTap] = useState(stats.tapPower)
  const [level, setLevel] = useState(stats.level)
  const [xp, setXp] = useState(stats.xp)
  const [xpToNextLevel] = useState(1000)

  const [floatingCoins, setFloatingCoins] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isLoading, setIsLoading] = useState(!isDataLoaded)
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
  const lastSyncedStats = useRef({ coins: stats.coins, xp: stats.xp, level: stats.level, energy: stats.energy });

  // Update local state if global stats change (e.g. from background sync or other pages)
  useEffect(() => {
    if (isDataLoaded) {
      setCoins(stats.coins);
      setEnergy(stats.energy);
      setMaxEnergy(stats.maxEnergy);
      setCoinsPerTap(stats.tapPower);
      setLevel(stats.level);
      setXp(stats.xp);
    }
  }, [isDataLoaded]);

  // Sync internal local changes back to global AppContext
  useEffect(() => {
    setStats({
      coins,
      energy,
      maxEnergy,
      tapPower: coinsPerTap,
      level,
      xp
    });
  }, [coins, energy, maxEnergy, coinsPerTap, level, xp]);

  useEffect(() => {
    const authenticate = async () => {
      // If data is already loaded and we're just returning to this page, don't re-auth blocking-ly
      if (isDataLoaded) {
        setIsLoading(false);
        return;
      }

      try {
        addLog("Starting authentication...")
        initTelegram();
        const initData = getInitData();

        if (initData) {
          const authData = await loginWithTelegram(initData);
          if (authData.success) {
            const userData = authData.data.user;
            setUser({ username: userData.username, telegramId: userData.telegramId });

            const newStats = {
              coins: Number(userData.coins || 0),
              level: userData.level || 1,
              xp: userData.xp || 0,
              energy: userData.energy || 1000,
              maxEnergy: userData.maxEnergy || 1000,
              tapPower: userData.tapPower || 10
            };

            setStats(newStats);
            setIsDataLoaded(true);

            // Sync local refs
            lastSyncedStats.current = {
              coins: newStats.coins,
              xp: newStats.xp,
              level: newStats.level,
              energy: newStats.energy
            };
          }
        } else {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const userInfo = await apiRequest("/auth/user");
            if (userInfo.success) {
              const userData = userInfo.data;
              setUser({ username: userData.username, telegramId: userData.telegramId });

              const newStats = {
                coins: Number(userData.coins || 0),
                level: userData.level || 1,
                xp: userData.xp || 0,
                energy: userData.energy || 1000,
                maxEnergy: userData.maxEnergy || 1000,
                tapPower: userData.tapPower || 10
              };

              setStats(newStats);
              setIsDataLoaded(true);

              lastSyncedStats.current = {
                coins: newStats.coins,
                xp: newStats.xp,
                level: newStats.level,
                energy: newStats.energy
              };
            }
          } else {
            router.push('/dev-login');
            return;
          }
        }
      } catch (error: any) {
        addLog(`❌ Error: ${error.message}`);
        setAuthError(error.message || "Failed to connect to server");
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    authenticate();
  }, [isDataLoaded]);

  // Sync data with backend when stats change
  const latestStatsRef = useRef({ coins, xp, level, energy });
  useEffect(() => {
    latestStatsRef.current = { coins, xp, level, energy };
  }, [coins, xp, level, energy]);

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
    <div className='h-[calc(80vh-56px)] flex flex-col overflow-hidden px-4 mt-18 mb-20'>
      {/* Persistent Debug Overlay */}
      <div className="fixed top-2 right-2 z-[60]">
        {!showConsole ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowConsole(true)}
            className="bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 text-white/40 shadow-lg"
          >
            <Bug size={14} />
          </motion.button>
        ) : (
          <div className={`bg-black/95 text-[10px] text-green-400 font-mono rounded-xl border border-white/10 overflow-hidden shadow-2xl transition-all w-48 ${isMinimized ? 'h-8' : 'h-32'}`}>
            <div className="flex justify-between items-center p-1.5 bg-white/5 border-b border-white/5">
              <span className="font-bold flex items-center gap-1 opacity-50 text-[8px]"><Bug size={10} /> DEBUG</span>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/40 hover:text-white">
                  {isMinimized ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <button onClick={() => setShowConsole(false)} className="text-white/40 hover:text-red-400">
                  <X size={12} />
                </button>
              </div>
            </div>
            {!isMinimized && (
              <div className="p-1.5 overflow-y-auto h-24 flex flex-col-reverse custom-scrollbar text-[8px]">
                {debugLog.length === 0 ? <div>Waiting for logs...</div> : debugLog.map((log, i) => <div key={i} className="mb-0.5 border-l border-green-500/40 pl-1">{log}</div>)}
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading && isInitialLoad && <LoadingScreen message="Lotoory is loading..." />}

      {/* Level Up Reward Modal */}
      <LevelUpModal
        isOpen={showLevelUp}
        level={level}
        onClose={() => setShowLevelUp(false)}
      />

      {/* Top Section: Profile & Dashboard */}
      <div className="flex flex-col gap-2 mb-2 flex-shrink-0">
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-[1.2rem] p-3 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Image
                src="/avatar.jpg"
                alt="avatar"
                width={40}
                height={40}
                className='rounded-xl w-10 h-10 object-cover border-2 border-white/20'
              />
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 text-black text-[8px] font-black px-1 py-0.5 rounded-full border border-black shadow-lg">
                {level}
              </div>
            </div>
            <div>
              <h2 className='text-sm font-black text-white leading-none flex items-center gap-1.5 mb-1'>
                {user?.username || "Guest"}
                {level > 5 && <Crown size={12} className="text-yellow-400" />}
              </h2>
              <span className="text-[8px] text-purple-400 font-black uppercase tracking-widest block bg-purple-500/10 px-1.5 py-0.5 rounded-full border border-purple-500/20 w-fit">
                {level < 5 ? 'Novice' : level < 15 ? 'Warrior' : 'Elite'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <div className='flex items-center gap-1 bg-yellow-400/20 px-2 py-0.5 rounded-full border border-yellow-400/30'>
              <Coins className='w-3 h-3 text-yellow-400' />
              <motion.span
                key={coins}
                className='text-base font-black text-white italic tracking-tight'
              >
                {coins.toLocaleString()}
              </motion.span>
            </div>
            <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Balance</span>
          </div>
        </div>

        {/* Experience Bar */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-inner">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[8px] text-gray-400 font-black uppercase tracking-[0.1em]">Progression</span>
            <span className="text-[8px] text-purple-400 font-black tracking-widest">{xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
          </div>
          <div className='relative w-full h-2 bg-black/50 rounded-full overflow-hidden p-[1px] border border-white/10'>
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

      {/* Main Tap Area */}
      <div className='flex-1 flex flex-col justify-center items-center relative py-2'>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-600/5 blur-[40px] rounded-full pointer-events-none" />

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleTap}
          className="relative z-10 flex items-center justify-center rounded-full p-2 group"
          aria-label="Tap to Earn"
        >
          <div className="absolute inset-0 rounded-full border border-white/5 group-active:border-purple-500/10 scale-110 transition-all" />

          <div className="relative p-1.5 bg-gradient-to-tr from-white/10 to-white/20 rounded-full backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.15)] active:shadow-none transition-all border border-white/10">
            <Image
              src="/Tap.png"
              alt="tap"
              width={180}
              height={180}
              className="w-40 h-40 xs:w-48 xs:h-48 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform"
            />
          </div>

          <AnimatePresence>
            {floatingCoins.map((coin) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.8 }}
                animate={{ opacity: 0, x: coin.x * 0.8, y: coin.y * 0.8 - 60, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute text-yellow-400 font-black text-xl pointer-events-none z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              >
                +{coinsPerTap}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.button>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Star size={10} className="text-yellow-400 animate-pulse" />
            REWARD: <span className="text-green-400">+{coinsPerTap}C / +2XP</span>
            <Star size={10} className="text-yellow-400 animate-pulse" />
          </p>
        </div>
      </div>

      {/* Bottom Section: Unified Compact Dock */}
      <div className="mt-auto mb-2 flex-shrink-0 bg-black/40 backdrop-blur-md rounded-[1.2rem] p-2 border border-white/10 shadow-lg">
        <div className='flex items-center gap-3 px-1.5 mb-2'>
          <div className='flex items-center gap-1 flex-shrink-0'>
            <Zap className='w-3 h-3 text-yellow-400 fill-yellow-400/20' />
            <span className='text-[10px] text-white font-black tracking-tighter'>{energy}<span className="text-gray-500">/{maxEnergy}</span></span>
          </div>
          <div className='flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5'>
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

        <div className='grid grid-cols-2 gap-2'>
          <Link href="/boosters">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl py-2.5 text-center border border-white/10 shadow-md relative overflow-hidden group'
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
              <p className='text-[9px] text-white font-black flex items-center justify-center gap-1.5 tracking-tight uppercase'>
                <TrendingUp size={12} /> UPGRADE
              </p>
            </motion.div>
          </Link>
          <Link href="/tasks">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl py-2.5 text-center border border-white/10 shadow-md relative overflow-hidden group'
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
              <p className='text-[9px] text-white font-black flex items-center justify-center gap-1.5 tracking-tight uppercase'>
                <Gift size={12} /> EARN LOOT
              </p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}
