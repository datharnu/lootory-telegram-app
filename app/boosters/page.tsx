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
    <div className='h-dvh flex flex-col overflow-hidden pt-[84px] pb-[99px] px-4'>
      {/* Header - Shrunk */}
      <div className='mb-3 flex-shrink-0'>
        <h1 className='text-xl font-black text-white italic tracking-tighter'>MINE & UPGRADE</h1>
        <p className='text-[10px] text-purple-300 font-bold uppercase tracking-wider'>Power-up your earnings</p>
      </div>

      {/* Balance Display - Compact */}
      <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 mb-4 flex-shrink-0 shadow-inner'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='bg-yellow-400/10 p-2 rounded-xl border border-yellow-400/20'>
              <Coins className='w-5 h-5 text-yellow-400' />
            </div>
            <div>
              <p className='text-[8px] text-gray-500 font-black uppercase tracking-widest'>Your Savings</p>
              <p className='text-lg font-black text-white leading-none'>{coins.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        {/* Boosters Grid - Compact Cards */}
        <div className='grid grid-cols-1 gap-3'>
          {boosters.map((booster, index) => {
            const canAfford = coins >= booster.cost
            const isMaxLevel = booster.level >= booster.maxLevel
            const isOwned = booster.owned || booster.level > 0

            return (
              <motion.div
                key={booster.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl p-3 border ${isOwned ? 'border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]' : 'border-white/5'
                  }`}
              >
                <div className='flex items-start gap-3 mb-3'>
                  <div className='bg-purple-500/10 p-2.5 rounded-xl text-2xl flex-shrink-0'>
                    {booster.icon}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-1.5 mb-0.5'>
                      <h3 className='text-xs font-black text-white truncate'>{booster.name}</h3>
                      {isOwned && (
                        <span className='bg-green-500/20 text-green-400 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase'>Owned</span>
                      )}
                    </div>
                    <p className='text-[9px] text-gray-500 font-medium line-clamp-1 mb-1.5'>{booster.description}</p>
                    <div className='flex items-center gap-3'>
                      <span className='text-[8px] text-purple-400 font-black uppercase bg-purple-500/10 px-1.5 py-0.5 rounded'>
                        {booster.effect}
                      </span>
                      {isOwned && (
                        <span className='text-[8px] text-gray-500 font-black uppercase'>
                          LVL {booster.level} / {booster.maxLevel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar - Shrunk */}
                {isOwned && !isMaxLevel && (
                  <div className='mb-3'>
                    <div className='w-full bg-black/40 rounded-full h-1 overflow-hidden border border-white/5'>
                      <motion.div
                        className='h-full bg-gradient-to-r from-purple-500 to-pink-500'
                        initial={{ width: 0 }}
                        animate={{ width: `${(booster.level / booster.maxLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button - Compact */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => isOwned ? handleUpgrade(booster) : handlePurchase(booster)}
                  disabled={!canAfford || isMaxLevel}
                  className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${isMaxLevel
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : canAfford
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-900/40'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed'
                    }`}
                >
                  {isMaxLevel ? (
                    <span className='flex items-center justify-center gap-1.5 opacity-50'>
                      <Lock size={12} /> MAXED
                    </span>
                  ) : isOwned ? (
                    <span className='flex items-center justify-center gap-1.5'>
                      UPGRADE • {booster.cost.toLocaleString()}
                    </span>
                  ) : (
                    <span className='flex items-center justify-center gap-1.5'>
                      PURCHASE • {booster.cost.toLocaleString()}
                    </span>
                  )}
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Tips Section - Compact */}
        <div className='mt-4 bg-blue-600/10 rounded-2xl p-4 border border-blue-400/20'>
          <h3 className='text-[10px] font-black text-white mb-2 flex items-center gap-1.5 uppercase tracking-widest'>
            <Zap className='w-3.5 h-3.5 text-yellow-400' />
            UPGRADE TIPS
          </h3>
          <ul className='text-[9px] text-gray-500 font-bold space-y-1.5 px-1'>
            <li className="flex items-center gap-2">• <span className="text-gray-400">Costs increase by 50% each level</span></li>
            <li className="flex items-center gap-2">• <span className="text-gray-400">Upgrades stack for maximum output</span></li>
            <li className="flex items-center gap-2">• <span className="text-gray-400">Prioritize Coin Multiplier first</span></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
