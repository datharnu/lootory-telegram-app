"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Gift, Check, Clock, Coins, ExternalLink, Calendar } from 'lucide-react'

interface Task {
  id: number
  title: string
  description: string
  image: string
  reward: number
  completed: boolean
  type: 'social' | 'daily' | 'special'
}

interface DailyReward {
  day: number
  reward: number
  claimed: boolean
  available: boolean
}

export default function TasksPage() {
  const [coins, setCoins] = useState(12500)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Follow Lootory on X',
      description: 'Follow our official Twitter account',
      image: '/X.svg',
      reward: 500,
      completed: false,
      type: 'social'
    },
    {
      id: 2,
      title: 'Follow Founder',
      description: 'Follow the founder on X',
      image: '/X.svg',
      reward: 300,
      completed: false,
      type: 'social'
    },
    {
      id: 3,
      title: 'Subscribe to YouTube',
      description: 'Subscribe to our YouTube channel',
      image: '/YouTube.svg',
      reward: 400,
      completed: false,
      type: 'social'
    },
    {
      id: 4,
      title: 'Follow on LinkedIn',
      description: 'Connect with us on LinkedIn',
      image: '/LinkedIn.svg',
      reward: 350,
      completed: false,
      type: 'social'
    },
    {
      id: 5,
      title: 'Join Telegram Channel',
      description: 'Join our official Telegram channel',
      image: '/file.svg',
      reward: 600,
      completed: false,
      type: 'social'
    },
    {
      id: 6,
      title: 'Share with Friends',
      description: 'Invite 3 friends to join',
      image: '/invite.svg',
      reward: 1000,
      completed: false,
      type: 'special'
    },
  ])

  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([
    { day: 1, reward: 100, claimed: false, available: true },
    { day: 2, reward: 200, claimed: false, available: false },
    { day: 3, reward: 300, claimed: false, available: false },
    { day: 4, reward: 400, claimed: false, available: false },
    { day: 5, reward: 500, claimed: false, available: false },
    { day: 6, reward: 600, claimed: false, available: false },
    { day: 7, reward: 1000, claimed: false, available: false },
  ])

  const [currentStreak, setCurrentStreak] = useState(0)

  const handleTaskComplete = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && !task.completed) {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      ))
      setCoins(prev => prev + task.reward)
    }
  }

  const handleDailyReward = (day: number) => {
    const reward = dailyRewards.find(r => r.day === day)
    if (reward && reward.available && !reward.claimed) {
      setDailyRewards(prev => prev.map(r => 
        r.day === day ? { ...r, claimed: true } : r
      ))
      setCoins(prev => prev + reward.reward)
      setCurrentStreak(prev => prev + 1)
      
      // Unlock next day
      if (day < 7) {
        setDailyRewards(prev => prev.map(r => 
          r.day === day + 1 ? { ...r, available: true } : r
        ))
      }
    }
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const totalRewards = tasks.reduce((sum, task) => sum + (task.completed ? task.reward : 0), 0)

  return (
    <div className='min-h-screen pb-24 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-white mb-2'>Earn & Rewards</h1>
        <p className='text-gray-300'>Complete tasks and claim daily rewards</p>
      </div>

      {/* Balance Display */}
      <div className='bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-4 mb-6 border border-purple-400/20'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-yellow-400/20 p-2 rounded-full'>
              <Coins className='w-6 h-6 text-yellow-400' />
            </div>
            <div>
              <p className='text-xs text-gray-300'>Your Coins</p>
              <p className='text-2xl font-bold text-white'>{coins.toLocaleString()}</p>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-300'>Tasks Completed</p>
            <p className='text-lg font-semibold text-green-400'>{completedTasks} / {tasks.length}</p>
          </div>
        </div>
      </div>

      {/* Daily Rewards Section */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold text-white flex items-center gap-2'>
            <Calendar className='w-5 h-5 text-yellow-400' />
            Daily Rewards
          </h2>
          <span className='text-sm text-gray-300'>Streak: {currentStreak} days</span>
        </div>
        
        <div className='grid grid-cols-7 gap-2'>
          {dailyRewards.map((reward) => (
            <motion.button
              key={reward.day}
              whileHover={{ scale: reward.available && !reward.claimed ? 1.1 : 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDailyReward(reward.day)}
              disabled={!reward.available || reward.claimed}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                reward.claimed
                  ? 'bg-green-500/20 border-green-400/50'
                  : reward.available
                  ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-500/50'
                  : 'bg-gray-700/30 border-gray-600/50 opacity-50'
              }`}
            >
              <div className='text-2xl mb-1'>{reward.day}</div>
              <Gift className={`w-5 h-5 mb-1 ${
                reward.claimed ? 'text-green-400' : reward.available ? 'text-yellow-400' : 'text-gray-500'
              }`} />
              <span className={`text-xs font-bold ${
                reward.claimed ? 'text-green-400' : reward.available ? 'text-yellow-400' : 'text-gray-500'
              }`}>
                {reward.reward}
              </span>
              {reward.claimed && (
                <Check className='absolute top-1 right-1 w-4 h-4 text-green-400' />
              )}
              {reward.day === 7 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold'>
                  Bonus
                </span>
              )}
            </motion.button>
          ))}
        </div>
        <p className='text-xs text-gray-400 mt-3 text-center'>
          Claim your daily reward to maintain your streak!
        </p>
      </div>

      {/* Tasks Section */}
      <div>
        <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
          <Gift className='w-5 h-5 text-purple-400' />
          Complete Tasks
        </h2>
        
        <div className='space-y-3'>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${
                task.completed 
                  ? 'from-green-600/20 to-emerald-600/20 border-green-400/30' 
                  : 'from-purple-600/20 to-pink-600/20 border-purple-400/30'
              } rounded-2xl p-4 border-2`}
            >
              <div className='flex items-center gap-4'>
                <div className={`p-3 rounded-xl ${
                  task.completed ? 'bg-green-500/30' : 'bg-purple-500/30'
                }`}>
                  <Image 
                    src={task.image} 
                    alt={task.title} 
                    width={40} 
                    height={40} 
                    className='w-10 h-10 object-contain' 
                  />
                </div>
                
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-lg font-bold text-white'>{task.title}</h3>
                    {task.completed && (
                      <Check className='w-5 h-5 text-green-400' />
                    )}
                  </div>
                  <p className='text-sm text-gray-300 mb-2'>{task.description}</p>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded flex items-center gap-1'>
                      <Coins className='w-3 h-3' />
                      +{task.reward} coins
                    </span>
                    {task.type === 'special' && (
                      <span className='text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded'>
                        Special
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTaskComplete(task.id)}
                  disabled={task.completed}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    task.completed
                      ? 'bg-green-500/30 text-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                  }`}
                >
                  {task.completed ? (
                    <>
                      <Check className='w-4 h-4' />
                      Completed
                    </>
                  ) : (
                    <>
                      <ExternalLink className='w-4 h-4' />
                      Complete
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className='mt-8 bg-blue-600/20 rounded-2xl p-4 border border-blue-400/30'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-xs text-gray-300 mb-1'>Total Earned</p>
            <p className='text-xl font-bold text-green-400'>{totalRewards.toLocaleString()} coins</p>
          </div>
          <div>
            <p className='text-xs text-gray-300 mb-1'>Completion Rate</p>
            <p className='text-xl font-bold text-purple-400'>
              {Math.round((completedTasks / tasks.length) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
