"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Gift, Check, Clock, Coins, ExternalLink, Calendar, Loader2, TrendingUp, Sparkles } from 'lucide-react'
import { apiRequest } from '@/lib/api'
import LoadingScreen from '@/components/shared/LoadingScreen'
import { useApp } from '@/context/AppContext'

interface Task {
  id: number
  title: string
  description: string
  icon: string
  coinReward: number
  xpReward: number
  taskType: 'social' | 'game' | 'referral' | 'special'
  actionUrl?: string | null
  status: 'idle' | 'pending' | 'completed'
  isCompleted: boolean
  startTime: string | null
  completedAt: string | null
  coinsEarned: number | null
}

interface DailyReward {
  day: number
  coinReward: number
  isClaimed: boolean
  claimedAt: string | null
  isClaimable: boolean
}

export default function TasksPage() {
  const { stats, setStats } = useApp()
  const [tasks, setTasks] = useState<Task[]>([])
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())

  // Update "now" every second for countdowns
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch and sync user balance
  const fetchUserBalance = async () => {
    try {
      const response = await apiRequest('/tasks/balance')
      if (response.success) {
        setStats(prev => ({ ...prev, coins: Number(response.data.currentBalance) }))
      }
    } catch (err: any) {
      console.error('Failed to fetch balance:', err)
    }
  }

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await apiRequest('/tasks')
      if (response.success) {
        setTasks(response.data.tasks)
      }
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err)
      setError('Failed to load tasks')
    }
  }

  // Fetch daily rewards
  const fetchDailyRewards = async () => {
    try {
      const response = await apiRequest('/daily-rewards')
      if (response.success) {
        setDailyRewards(response.data.rewards)
        setCurrentStreak(response.data.currentStreak)
      }
    } catch (err: any) {
      console.error('Failed to fetch daily rewards:', err)
      setError('Failed to load daily rewards')
    }
  }

  // Initial data load - non-blocking for the UI structure
  useEffect(() => {
    const loadData = async () => {
      // Background sync
      Promise.all([
        fetchUserBalance(),
        fetchTasks(),
        fetchDailyRewards()
      ]).finally(() => {
        setIsLoading(false)
      })
    }
    loadData()
  }, [])

  const handleTaskAction = async (task: Task) => {
    if (task.isCompleted) return

    if (task.status === 'idle') {
      try {
        const response = await apiRequest('/tasks/start', {
          method: 'POST',
          body: JSON.stringify({ taskId: task.id })
        })

        if (response.success) {
          if (task.actionUrl) window.open(task.actionUrl, '_blank')
          setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, status: 'pending', startTime: new Date().toISOString() } : t
          ))
        }
      } catch (err: any) {
        alert(err.message || 'Failed to start task')
      }
    } else if (task.status === 'pending') {
      try {
        const response = await apiRequest('/tasks/complete', {
          method: 'POST',
          body: JSON.stringify({ taskId: task.id })
        })

        if (response.success) {
          setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, status: 'completed', isCompleted: true, coinsEarned: Number(response.data.coinsEarned) } : t
          ))
          setStats(prev => ({ ...prev, coins: Number(response.data.newBalance) }))
        }
      } catch (err: any) {
        alert(err.message || 'Verification failed. Try again in a few seconds.')
      }
    }
  }

  const handleDailyReward = async (day: number) => {
    const reward = dailyRewards.find(r => r.day === day)
    if (!reward || !reward.isClaimable || reward.isClaimed) return

    try {
      const response = await apiRequest('/daily-rewards/claim', {
        method: 'POST',
        body: JSON.stringify({ day })
      })

      if (response.success) {
        fetchDailyRewards()
        fetchUserBalance()
      }
    } catch (err: any) {
      alert(err.message || 'Failed to claim reward')
    }
  }

  const completedTasks = tasks.filter(t => t.isCompleted).length

  return (
    <div className='h-dvh flex flex-col overflow-hidden pt-[84px] pb-[99px] px-4'>
      {/* Header - Shrunk */}
      <div className='mb-3 flex-shrink-0'>
        <h1 className='text-xl font-black text-white italic tracking-tighter'>EARN & WIN</h1>
        <p className='text-[10px] text-purple-300 font-bold uppercase tracking-wider'>Social Missions</p>
      </div>

      {/* Balance Display - Compact - Always visible & instant */}
      <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 mb-4 flex-shrink-0 shadow-inner'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='bg-yellow-400/10 p-2 rounded-xl border border-yellow-400/20'>
              <Coins className='w-5 h-5 text-yellow-400' />
            </div>
            <div>
              <p className='text-[8px] text-gray-500 font-black uppercase tracking-widest'>Your Loot</p>
              <p className='text-lg font-black text-white leading-none'>{stats.coins.toLocaleString()}</p>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-[8px] text-purple-400 font-black uppercase tracking-widest'>Progress</p>
            <p className='text-sm font-black text-green-400 italic'>{completedTasks} / {tasks.length || '...'}</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
        {isLoading && tasks.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Loader2 className='w-8 h-8 text-purple-500 animate-spin' />
            <p className='text-[10px] text-gray-500 font-black uppercase tracking-widest mt-4'>Syncing Missions...</p>
          </div>
        ) : (
          <>
            {/* Daily Rewards Section */}
            <div className='mb-4'>
              <div className='flex items-center justify-between mb-3'>
                <h2 className='text-xs font-black text-white flex items-center gap-1.5'>
                  <Calendar className='w-4 h-4 text-yellow-400' />
                  STREAK REWARDS
                </h2>
                <span className='px-2 py-0.5 bg-yellow-400/10 text-yellow-400 rounded-full text-[8px] font-black border border-yellow-400/20'>
                  {currentStreak} DAY STREAK
                </span>
              </div>

              <div className='grid grid-cols-7 gap-1'>
                {dailyRewards.map((reward) => (
                  <motion.button
                    key={reward.day}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDailyReward(reward.day)}
                    disabled={!reward.isClaimable || reward.isClaimed}
                    className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all ${reward.isClaimed
                      ? 'bg-green-500/10 border-green-500/20 opacity-60'
                      : reward.isClaimable
                        ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-400/40 shadow-lg shadow-yellow-500/10'
                        : 'bg-white/5 border-white/5 opacity-40'
                      }`}
                  >
                    <span className='text-[8px] font-black opacity-60 mb-1'>D{reward.day}</span>
                    <Gift className={`w-3.5 h-3.5 mb-1 ${reward.isClaimed ? 'text-green-400' : reward.isClaimable ? 'text-yellow-400' : 'text-gray-500'}`} />
                    <span className='text-[8px] font-black'>+{reward.coinReward}</span>
                    {reward.isClaimed && <Check className='absolute top-0.5 right-0.5 w-2 h-2 text-green-400' />}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div>
              <h2 className='text-xs font-black text-white mb-3 flex items-center gap-1.5'>
                <Sparkles className='w-4 h-4 text-purple-400' />
                SOCIAL MISSIONS
              </h2>

              <div className='space-y-2 pb-4'>
                {tasks.map((task, index) => {
                  const isPending = task.status === 'pending';
                  const startTime = task.startTime ? new Date(task.startTime).getTime() : 0;
                  const remaining = Math.max(0, Math.ceil(15 - (now - startTime) / 1000));
                  const canVerify = isPending && remaining === 0;

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-3 transition-all ${task.isCompleted ? 'border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]' : 'border-white/5'}`}
                    >
                      <div className='flex items-center gap-3'>
                        <div className={`p-2 rounded-xl flex-shrink-0 ${task.isCompleted ? 'bg-green-500/10' : 'bg-purple-500/10'}`}>
                          <div className='text-2xl'>{task.icon}</div>
                        </div>

                        <div className='flex-1 min-w-0'>
                          <h3 className='text-xs font-black text-white leading-tight mb-1 truncate'>{task.title}</h3>
                          <div className='flex items-center gap-2'>
                            <span className='text-[8px] font-black text-yellow-500 uppercase flex items-center gap-0.5'>
                              <Coins className='w-2 h-2' /> +{task.coinReward}
                            </span>
                            <span className='text-[8px] font-black text-blue-400 uppercase flex items-center gap-0.5'>
                              <TrendingUp className='w-2 h-2' /> +{task.xpReward} XP
                            </span>
                          </div>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTaskAction(task)}
                          disabled={task.isCompleted || (isPending && !canVerify)}
                          className={`px-3 py-1.5 rounded-xl font-black text-[9px] transition-all flex items-center gap-1 shadow-md ${task.isCompleted
                            ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                            : isPending
                              ? canVerify
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/20'
                                : 'bg-white/10 text-white/40 cursor-wait'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/20'
                            }`}
                        >
                          {task.isCompleted ? (
                            <><Check size={10} /> DONE</>
                          ) : isPending ? (
                            canVerify ? 'VERIFY' : `${remaining}s`
                          ) : (
                            <><ExternalLink size={10} /> START</>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
