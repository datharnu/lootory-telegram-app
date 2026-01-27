"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Gift, Check, Clock, Coins, ExternalLink, Calendar, Loader2, TrendingUp, Sparkles } from 'lucide-react'
import { apiRequest } from '@/lib/api'

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
  const [coins, setCoins] = useState(0)
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

  // Fetch user balance and stats
  const fetchUserBalance = async () => {
    try {
      const response = await apiRequest('/tasks/balance')
      if (response.success) {
        setCoins(Number(response.data.currentBalance))
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

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchUserBalance(),
        fetchTasks(),
        fetchDailyRewards()
      ])
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleTaskAction = async (task: Task) => {
    if (task.isCompleted) return

    if (task.status === 'idle') {
      try {
        // Step 1: Start Task
        const response = await apiRequest('/tasks/start', {
          method: 'POST',
          body: JSON.stringify({ taskId: task.id })
        })

        if (response.success) {
          // Open Link
          if (task.actionUrl) window.open(task.actionUrl, '_blank')

          // Update local status
          setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, status: 'pending', startTime: new Date().toISOString() } : t
          ))
        }
      } catch (err: any) {
        alert(err.message || 'Failed to start task')
      }
    } else if (task.status === 'pending') {
      try {
        // Step 2: Verify Task
        const response = await apiRequest('/tasks/complete', {
          method: 'POST',
          body: JSON.stringify({ taskId: task.id })
        })

        if (response.success) {
          setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, status: 'completed', isCompleted: true, coinsEarned: Number(response.data.coinsEarned) } : t
          ))
          setCoins(Number(response.data.newBalance))
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
        await Promise.all([
          fetchDailyRewards(),
          fetchUserBalance()
        ])
      }
    } catch (err: any) {
      alert(err.message || 'Failed to claim reward')
    }
  }

  const completedTasks = tasks.filter(t => t.isCompleted).length
  const totalTaskRewards = tasks.reduce((sum, task) => sum + (task.isCompleted ? task.coinReward : 0), 0)

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 text-purple-500 animate-spin mx-auto mb-4' />
          <p className='text-white font-medium'>Loading Lotoory Tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen pb-32 p-6 '>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-black text-white mb-2 italic tracking-tighter'>EARN & WIN</h1>
        <p className='text-purple-300 font-medium'>Level up your balance with social power</p>
      </div>

      {/* Balance Display */}
      <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 mb-8 shadow-inner'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-yellow-400/20 p-3 rounded-2xl shadow-[0_0_15px_rgba(234,179,8,0.2)]'>
              <Coins className='w-7 h-7 text-yellow-400' />
            </div>
            <div>
              <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>Your Loot</p>
              <p className='text-3xl font-black text-white tracking-tight leading-none'>{coins.toLocaleString()}</p>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-[10px] text-purple-400 font-black uppercase tracking-widest'>Progress</p>
            <p className='text-lg font-black text-green-400 italic'>{completedTasks} / {tasks.length}</p>
          </div>
        </div>
      </div>

      {/* Daily Rewards Section */}
      <div className='mb-10'>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl font-black text-white flex items-center gap-2'>
            <Calendar className='w-5 h-5 text-yellow-400' />
            STREAK REWARDS
          </h2>
          <span className='px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs font-black border border-yellow-400/20'>
            {currentStreak} DAY STREAK
          </span>
        </div>

        <div className='grid grid-cols-7 gap-1.5'>
          {dailyRewards.map((reward) => (
            <motion.button
              key={reward.day}
              whileHover={{ scale: reward.isClaimable && !reward.isClaimed ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDailyReward(reward.day)}
              disabled={!reward.isClaimable || reward.isClaimed}
              className={`relative flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${reward.isClaimed
                ? 'bg-green-500/10 border-green-500/20 opacity-60'
                : reward.isClaimable
                  ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-400/40 shadow-lg shadow-yellow-500/10'
                  : 'bg-white/5 border-white/5 opacity-40'
                }`}
            >
              <span className='text-[10px] font-black opacity-60 mb-1'>D{reward.day}</span>
              <Gift className={`w-5 h-5 mb-1 ${reward.isClaimed ? 'text-green-400' : reward.isClaimable ? 'text-yellow-400' : 'text-gray-500'}`} />
              <span className='text-[10px] font-black'>+{reward.coinReward}</span>
              {reward.isClaimed && <Check className='absolute top-1 right-1 w-3 h-3 text-green-400' />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <h2 className='text-xl font-black text-white mb-6 flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-purple-400' />
          SOCIAL MISSIONS
        </h2>

        <div className='space-y-4'>
          {tasks.map((task, index) => {
            const isPending = task.status === 'pending';
            const startTime = task.startTime ? new Date(task.startTime).getTime() : 0;
            const remaining = Math.max(0, Math.ceil(15 - (now - startTime) / 1000));
            const canVerify = isPending && remaining === 0;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative overflow-hidden bg-white/5 backdrop-blur-sm border-2 rounded-[2rem] p-5 transition-all ${task.isCompleted ? 'border-green-500/20' : 'border-white/5'}`}
              >
                <div className='flex items-center gap-5'>
                  <div className={`p-4 rounded-2xl ${task.isCompleted ? 'bg-green-500/10' : 'bg-purple-500/10'}`}>
                    <div className='text-4xl'>{task.icon}</div>
                  </div>

                  <div className='flex-1'>
                    <h3 className='text-lg font-black text-white leading-tight mb-1'>{task.title}</h3>
                    <div className='flex items-center gap-3'>
                      <span className='text-[10px] font-black text-yellow-500 uppercase flex items-center gap-1'>
                        <Coins className='w-3 h-3' /> +{task.coinReward}
                      </span>
                      <span className='text-[10px] font-black text-blue-400 uppercase flex items-center gap-1'>
                        <TrendingUp className='w-3 h-3' /> +{task.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTaskAction(task)}
                    disabled={task.isCompleted || (isPending && !canVerify)}
                    className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg ${task.isCompleted
                      ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                      : isPending
                        ? canVerify
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/20'
                          : 'bg-white/10 text-white/40 cursor-wait'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/20'
                      }`}
                  >
                    {task.isCompleted ? (
                      <><Check size={16} /> DONE</>
                    ) : isPending ? (
                      canVerify ? 'VERIFY' : `WAIT ${remaining}s`
                    ) : (
                      <><ExternalLink size={14} /> START</>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
