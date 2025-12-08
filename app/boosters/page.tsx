"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Coins, Lock, Check } from 'lucide-react'

interface Booster {
  id: number
  name: string
  description: string
  icon: string
  cost: number
  multiplier: number
  owned: boolean
  level: number
  maxLevel: number
  effect: string
}

export default function BoostersPage() {
  const [coins, setCoins] = useState(12500)
  const [boosters, setBoosters] = useState<Booster[]>([
    {
      id: 1,
      name: 'Energy Boost',
      description: 'Increase energy capacity by 20',
      icon: '⚡',
      cost: 500,
      multiplier: 1.2,
      owned: false,
      level: 0,
      maxLevel: 5,
      effect: '+20 Energy'
    },
    {
      id: 2,
      name: 'Coin Multiplier',
      description: 'Double your coins per tap',
      icon: '💰',
      cost: 1000,
      multiplier: 2,
      owned: false,
      level: 0,
      maxLevel: 10,
      effect: '2x Coins'
    },
    {
      id: 3,
      name: 'Auto Tapper',
      description: 'Automatically tap every 5 seconds',
      icon: '🤖',
      cost: 2500,
      multiplier: 1,
      owned: false,
      level: 0,
      maxLevel: 3,
      effect: 'Auto Tap'
    },
    {
      id: 4,
      name: 'Lucky Draw',
      description: 'Chance to win 10x coins on tap',
      icon: '🎰',
      cost: 2000,
      multiplier: 10,
      owned: false,
      level: 0,
      maxLevel: 5,
      effect: '10% Luck'
    },
    {
      id: 5,
      name: 'XP Boost',
      description: 'Earn 50% more XP per tap',
      icon: '⭐',
      cost: 1500,
      multiplier: 1.5,
      owned: false,
      level: 0,
      maxLevel: 5,
      effect: '+50% XP'
    },
    {
      id: 6,
      name: 'Energy Regen',
      description: 'Energy regenerates 2x faster',
      icon: '🔋',
      cost: 3000,
      multiplier: 2,
      owned: false,
      level: 0,
      maxLevel: 3,
      effect: '2x Regen'
    },
  ])

  const handlePurchase = (booster: Booster) => {
    if (coins >= booster.cost && booster.level < booster.maxLevel) {
      setCoins(prev => prev - booster.cost)
      setBoosters(prev => prev.map(b => 
        b.id === booster.id 
          ? { ...b, owned: true, level: b.level + 1, cost: Math.floor(b.cost * 1.5) }
          : b
      ))
    }
  }

  const handleUpgrade = (booster: Booster) => {
    if (coins >= booster.cost && booster.level < booster.maxLevel) {
      setCoins(prev => prev - booster.cost)
      setBoosters(prev => prev.map(b => 
        b.id === booster.id 
          ? { ...b, level: b.level + 1, cost: Math.floor(b.cost * 1.5) }
          : b
      ))
    }
  }

  return (
    <div className='min-h-screen pb-24 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-white mb-2'>Mine & Upgrade</h1>
        <p className='text-gray-300'>Boost your earnings with powerful upgrades</p>
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
        </div>
      </div>

      {/* Boosters Grid */}
      <div className='grid grid-cols-1 gap-4'>
        {boosters.map((booster, index) => {
          const canAfford = coins >= booster.cost
          const isMaxLevel = booster.level >= booster.maxLevel
          const isOwned = booster.owned || booster.level > 0

          return (
            <motion.div
              key={booster.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-5 border-2 ${
                isOwned ? 'border-green-400/50' : 'border-purple-400/30'
              }`}
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-4'>
                  <div className='bg-purple-500/30 p-3 rounded-xl text-3xl'>
                    {booster.icon}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='text-xl font-bold text-white'>{booster.name}</h3>
                      {isOwned && (
                        <span className='bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1'>
                          <Check className='w-3 h-3' />
                          Owned
                        </span>
                      )}
                    </div>
                    <p className='text-sm text-gray-300 mb-2'>{booster.description}</p>
                    <div className='flex items-center gap-4'>
                      <span className='text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded'>
                        {booster.effect}
                      </span>
                      {isOwned && (
                        <span className='text-xs text-yellow-300'>
                          Level {booster.level} / {booster.maxLevel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Level */}
              {isOwned && !isMaxLevel && (
                <div className='mb-4'>
                  <div className='w-full bg-gray-700 rounded-full h-2 overflow-hidden'>
                    <motion.div
                      className='h-full bg-gradient-to-r from-purple-500 to-pink-500'
                      initial={{ width: 0 }}
                      animate={{ width: `${(booster.level / booster.maxLevel) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => isOwned ? handleUpgrade(booster) : handlePurchase(booster)}
                disabled={!canAfford || isMaxLevel}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  isMaxLevel
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : canAfford
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isMaxLevel ? (
                  <span className='flex items-center justify-center gap-2'>
                    <Lock className='w-4 h-4' />
                    Max Level
                  </span>
                ) : isOwned ? (
                  <span className='flex items-center justify-center gap-2'>
                    <TrendingUp className='w-4 h-4' />
                    Upgrade - {booster.cost.toLocaleString()} Coins
                  </span>
                ) : (
                  <span className='flex items-center justify-center gap-2'>
                    <Zap className='w-4 h-4' />
                    Purchase - {booster.cost.toLocaleString()} Coins
                  </span>
                )}
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Info Section */}
      <div className='mt-8 bg-blue-600/20 rounded-2xl p-4 border border-blue-400/30'>
        <h3 className='text-white font-bold mb-2 flex items-center gap-2'>
          <Zap className='w-5 h-5 text-yellow-400' />
          Upgrade Tips
        </h3>
        <ul className='text-sm text-gray-300 space-y-1'>
          <li>• Each upgrade increases in cost by 50%</li>
          <li>• Multiple upgrades stack for maximum effect</li>
          <li>• Focus on Coin Multiplier for faster earnings</li>
          <li>• Energy upgrades help you tap more often</li>
        </ul>
      </div>
    </div>
  )
}
