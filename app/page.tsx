"use client";
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Coins, TrendingUp, Loader2, Bug, ChevronUp, ChevronDown, X } from 'lucide-react'
import { getInitData, initTelegram } from '@/lib/telegram'
import { loginWithTelegram, apiRequest, updateUserStats } from '@/lib/api'
import { useRouter } from 'next/navigation'
import LevelUpModal from '@/components/game/LevelUpModal'
import { Trophy, Star, Sparkles, Crown } from 'lucide-react'

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
    <div className='min-h-screen pb-24'>
      {/* Persistent Debug Overlay - Kept for dev testing but more subtle */}
      <div className="fixed top-4 right-4 z-[60]">
        {!showConsole ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowConsole(true)}
            className="bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 text-white/40 shadow-lg"
          >
            <Bug size={16} />
          </motion.button>
        ) : (
          <div className={`bg-black/90 text-[10px] text-green-400 font-mono rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all w-64 ${isMinimized ? 'h-8' : 'h-48'}`}>
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
              <div className="p-2 overflow-y-auto h-32 flex flex-col-reverse custom-scrollbar">
                {debugLog.length === 0 ? <div>Waiting for logs...</div> : debugLog.map((log, i) => <div key={i} className="mb-1 border-l border-green-500/40 pl-1">{log}</div>)}
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-white font-medium">Authenticating with Lotoory...</p>
          </div>
        </div>
      )}

      {/* Level Up Reward Modal */}
      <LevelUpModal
        isOpen={showLevelUp}
        level={level}
        onClose={() => setShowLevelUp(false)}
      />

      <section className='p-6 pt-12'>
        {/* New Premium Profile Section */}
        <div className="relative mb-8 pt-4">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl blur opacity-40 animate-pulse" />
                <Image
                  src="/avatar.jpg"
                  alt="avatar"
                  width={56}
                  height={56}
                  className='relative rounded-2xl w-14 h-14 object-cover border border-white/20'
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-black">
                  LVL {level}
                </div>
              </motion.div>
              <div>
                <h2 className='text-xl font-black text-white leading-tight tracking-tight flex items-center gap-2'>
                  {user?.username || "Guest"}
                  {level > 5 && <Crown size={16} className="text-yellow-400" />}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    {level < 5 ? 'Novice' : level < 15 ? 'Warrior' : level < 30 ? 'Elite' : 'Legend'}
                  </span>
                </div>
              </div>
            </div>

            <Link href="/wallet" className="bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Star size={20} className="text-yellow-400 fill-yellow-400/20" />
            </Link>
          </div>

          {/* Redesigned XP Component */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-5 shadow-inner">
            <div className='flex justify-between items-end mb-3'>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Experience Points</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white italic">{xp.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 font-bold">/ {xpToNextLevel.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest block mb-1">To Next Level</span>
                <span className="text-xs text-white font-black">{(xpToNextLevel - xp).toLocaleString()} XP</span>
              </div>
            </div>

            <div className='relative w-full h-3 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5'>
              <motion.div
                className='h-full relative rounded-full'
                initial={{ width: 0 }}
                animate={{ width: `${(xp / xpToNextLevel) * 100}%` }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                {/* Shimmering Gradient Bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-shimmer" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Coin Counter */}
        <div className='bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-4 mb-6 border border-purple-400/20'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-yellow-400/20 p-2 rounded-full'>
                <Coins className='w-6 h-6 text-yellow-400' />
              </div>
              <div>
                <p className='text-xs text-gray-300'>Total Coins</p>
                <motion.h2
                  className='text-2xl font-bold text-white'
                  key={coins}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {coins.toLocaleString()}
                </motion.h2>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-xs text-gray-300'>Per Tap</p>
              <p className='text-lg font-semibold text-green-400'>+{coinsPerTap}</p>
            </div>
          </div>
        </div>

        {/* Energy System */}
        <div className='bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-2xl p-4 mb-6 border border-blue-400/20'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <Zap className='w-5 h-5 text-yellow-400' />
              <span className='text-white font-semibold'>Energy</span>
            </div>
            <span className='text-white font-bold'>{energy} / {maxEnergy}</span>
          </div>
          <div className='w-full bg-gray-700 rounded-full h-3 overflow-hidden'>
            <motion.div
              className='h-full bg-gradient-to-r from-yellow-400 to-orange-400'
              initial={{ width: 0 }}
              animate={{ width: `${energyPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Tap Button */}
        <div className='flex justify-center relative my-4'>
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-600/10 blur-[60px] rounded-full pointer-events-none" />

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleTap}
            className="relative z-10 inline-flex items-center justify-center rounded-full p-4 group"
            aria-label="Tap to Earn"
          >
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/5 group-hover:border-purple-500/20 transition-colors" />

            <div className="relative p-2 bg-gradient-to-tr from-white/5 to-white/10 rounded-full backdrop-blur-sm shadow-[0_0_50px_rgba(168,85,247,0.1)] group-active:shadow-none transition-all">
              <Image
                src="/Tap.png"
                alt="tap"
                width={180}
                height={180}
                className="w-44 h-44 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform"
              />
            </div>

            <AnimatePresence>
              {floatingCoins.map((coin) => (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x: coin.x, y: coin.y - 50, scale: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute text-yellow-400 font-bold text-xl pointer-events-none"
                >
                  +{coinsPerTap}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className='mt-8 grid grid-cols-2 gap-3'>
          <Link href="/boosters">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-center border border-purple-400/30 cursor-pointer'
            >
              <p className='text-white font-bold'>⚡ Upgrade</p>
              <p className='text-xs text-gray-200 mt-1'>Boost Earnings</p>
            </motion.div>
          </Link>
          <Link href="/tasks">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-4 text-center border border-blue-400/30 cursor-pointer'
            >
              <p className='text-white font-bold'>🎁 Earn</p>
              <p className='text-xs text-gray-200 mt-1'>Daily Rewards</p>
            </motion.div>
          </Link>
        </div>
      </section>
    </div>
  )
}
