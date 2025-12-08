"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Coins, TrendingUp } from 'lucide-react'

export default function TelegramMiniApp() {
  const [coins, setCoins] = useState(12500)
  const [energy, setEnergy] = useState(85)
  const [maxEnergy] = useState(100)
  const [tapCount, setTapCount] = useState(0)
  const [coinsPerTap, setCoinsPerTap] = useState(10)
  const [level, setLevel] = useState(3)
  const [xp, setXp] = useState(450)
  const [xpToNextLevel] = useState(1000)
  const [floatingCoins, setFloatingCoins] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleTap = () => {
    if (energy > 0) {
      setCoins(prev => prev + coinsPerTap)
      setTapCount(prev => prev + 1)
      setEnergy(prev => Math.max(0, prev - 1))
      setXp(prev => prev + 2)
      
      // Create floating coin animation
      const newCoin = {
        id: Date.now(),
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }
      setFloatingCoins(prev => [...prev, newCoin])
      
      // Remove floating coin after animation
      setTimeout(() => {
        setFloatingCoins(prev => prev.filter(coin => coin.id !== newCoin.id))
      }, 1000)
    }
  }

  // Energy regeneration (1 energy per 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(maxEnergy, prev + 1))
    }, 30000)
    return () => clearInterval(interval)
  }, [maxEnergy])

  // Level up check
  useEffect(() => {
    if (xp >= xpToNextLevel) {
      setLevel(prev => prev + 1)
      setXp(0)
    }
  }, [xp, xpToNextLevel])

  const energyPercentage = (energy / maxEnergy) * 100

  return (
    <div className='min-h-screen pb-24'>
      <section className='p-6'>
        {/* User Profile & Stats */}
        <div className='flex flex-col gap-5 mb-6'>
          <div className='flex items-center gap-3'>
            <Image 
              src="/avatar.jpg" 
              alt="avatar" 
              width={100} 
              height={100} 
              className='rounded-full w-12 h-12 object-cover border-2 border-purple-400' 
            />
            <div className='flex-1'>
              <h2 className='text-xl font-bold text-white'>Earnest</h2>
              <p className='text-sm text-gray-300'>Level {level}</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className='space-y-2'>
            <div className='flex justify-between text-xs text-gray-300'>
              <span>XP: {xp} / {xpToNextLevel}</span>
              <span>Level {level + 1}</span>
            </div>
            <div className='w-full bg-gray-700 rounded-full h-2 overflow-hidden'>
              <motion.div
                className='h-full bg-gradient-to-r from-purple-500 to-pink-500'
                initial={{ width: 0 }}
                animate={{ width: `${(xp / xpToNextLevel) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
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
          {energy === 0 && (
            <p className='text-xs text-red-400 mt-2 text-center'>
              Energy regenerates 1 per 30 seconds
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className='grid grid-cols-3 gap-3 mb-8'>
          <div className='bg-purple-600/20 rounded-xl p-3 text-center border border-purple-400/20'>
            <TrendingUp className='w-5 h-5 text-green-400 mx-auto mb-1' />
            <p className='text-xs text-gray-300'>Taps</p>
            <p className='text-lg font-bold text-white'>{tapCount}</p>
          </div>
          <div className='bg-purple-600/20 rounded-xl p-3 text-center border border-purple-400/20'>
            <Coins className='w-5 h-5 text-yellow-400 mx-auto mb-1' />
            <p className='text-xs text-gray-300'>Earned</p>
            <p className='text-lg font-bold text-white'>{(tapCount * coinsPerTap).toLocaleString()}</p>
          </div>
          <div className='bg-purple-600/20 rounded-xl p-3 text-center border border-purple-400/20'>
            <Zap className='w-5 h-5 text-blue-400 mx-auto mb-1' />
            <p className='text-xs text-gray-300'>Efficiency</p>
            <p className='text-lg font-bold text-white'>{(coinsPerTap * 10).toFixed(0)}%</p>
          </div>
        </div>

        {/* Tap Button */}
        <div className='flex justify-center relative'>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleTap}
            disabled={energy === 0}
            className={`relative inline-flex items-center justify-center rounded-full p-2 shadow-2xl transition-all ${
              energy === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-purple-500/50 active:scale-95'
            }`}
            aria-label="Tap to Earn"
          >
            <span className="flex items-center justify-center rounded-full bg-white p-2">
              <Image 
                src="/Tap.png" 
                alt="tap" 
                width={100} 
                height={100} 
                className="w-40 h-40 object-contain" 
              />
            </span>
            
            {/* Floating Coins Animation */}
            <AnimatePresence>
              {floatingCoins.map((coin) => (
                <motion.div
                  key={coin.id}
                  initial={{ 
                    opacity: 1, 
                    x: 0, 
                    y: 0,
                    scale: 1
                  }}
                  animate={{ 
                    opacity: 0, 
                    x: coin.x, 
                    y: coin.y - 50,
                    scale: 0.5
                  }}
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
