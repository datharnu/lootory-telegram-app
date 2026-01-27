"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, Users, Coins, TrendingUp, Crown, Medal, Award } from 'lucide-react'

interface Friend {
  id: number
  name: string
  avatar: string
  level: number
  totalEarned: number
  yourEarnings: number
  status: 'active' | 'inactive'
  rank: number
}

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  level: number
  totalCoins: number
  isYou: boolean
}

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'referrals' | 'leaderboard'>('referrals')

  const [referrals] = useState<Friend[]>([
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: '/avatar.jpg',
      level: 5,
      totalEarned: 12500,
      yourEarnings: 2500,
      status: 'active',
      rank: 1
    },
    {
      id: 2,
      name: 'Sarah Williams',
      avatar: '/avatar.jpg',
      level: 4,
      totalEarned: 9800,
      yourEarnings: 1960,
      status: 'active',
      rank: 2
    },
    {
      id: 3,
      name: 'Mike Chen',
      avatar: '/avatar.jpg',
      level: 3,
      totalEarned: 7200,
      yourEarnings: 1440,
      status: 'active',
      rank: 3
    },
    {
      id: 4,
      name: 'Emma Davis',
      avatar: '/avatar.jpg',
      level: 2,
      totalEarned: 4500,
      yourEarnings: 900,
      status: 'inactive',
      rank: 4
    },
  ])

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'CryptoMaster', avatar: '/avatar.jpg', level: 15, totalCoins: 125000, isYou: false },
    { rank: 2, name: 'CoinCollector', avatar: '/avatar.jpg', level: 12, totalCoins: 98000, isYou: false },
    { rank: 3, name: 'Earnest', avatar: '/avatar.jpg', level: 3, totalCoins: 12500, isYou: true },
    { rank: 4, name: 'TapperPro', avatar: '/avatar.jpg', level: 10, totalCoins: 87000, isYou: false },
    { rank: 5, name: 'LuckyPlayer', avatar: '/avatar.jpg', level: 8, totalCoins: 65000, isYou: false },
  ])

  const totalEarnedFromReferrals = referrals.reduce((sum, ref) => sum + ref.yourEarnings, 0)
  const activeReferrals = referrals.filter(ref => ref.status === 'active').length

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className='w-6 h-6 text-yellow-400' />
    if (rank === 2) return <Medal className='w-6 h-6 text-gray-300' />
    if (rank === 3) return <Award className='w-6 h-6 text-orange-400' />
    return <span className='text-gray-400 font-bold'>#{rank}</span>
  }

  return (
    <div className='h-dvh flex flex-col overflow-hidden pt-[84px] pb-[99px] px-4'>
      {/* Header - Shrunk */}
      <div className='mb-3 flex-shrink-0'>
        <h1 className='text-xl font-black text-white italic tracking-tighter'>FRIENDS & RANK</h1>
        <p className='text-[10px] text-purple-300 font-bold uppercase tracking-wider'>Global Leaderboard</p>
      </div>

      {/* Stats Summary - Compact */}
      <div className='grid grid-cols-2 gap-2 mb-4 flex-shrink-0'>
        <div className='bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-3 border border-purple-400/20 flex flex-col justify-center shadow-sm'>
          <div className='flex items-center gap-1.5 mb-1'>
            <Users className='w-3.5 h-3.5 text-blue-400' />
            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Active</p>
          </div>
          <p className='text-lg font-black text-white leading-none'>{activeReferrals}</p>
          <p className='text-[8px] text-gray-500 mt-1 uppercase font-bold'>{referrals.length} total</p>
        </div>

        <div className='bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-3 border border-yellow-400/20 flex flex-col justify-center shadow-sm'>
          <div className='flex items-center gap-1.5 mb-1'>
            <Coins className='w-3.5 h-3.5 text-yellow-400' />
            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Earned</p>
          </div>
          <p className='text-lg font-black text-white leading-none'>{totalEarnedFromReferrals.toLocaleString()}</p>
          <p className='text-[8px] text-green-500 mt-1 uppercase font-bold'>20% Commission</p>
        </div>
      </div>

      {/* Tabs - Shrunk */}
      <div className='flex gap-1.5 mb-4 bg-white/5 backdrop-blur-md rounded-xl p-1 flex-shrink-0 border border-white/5'>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'referrals'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
            : 'text-gray-500 hover:text-gray-300'
            }`}
        >
          Referrals
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${activeTab === 'leaderboard'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
            : 'text-gray-500 hover:text-gray-300'
            }`}
        >
          <Trophy className='w-3 h-3' />
          Board
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        {/* Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className='space-y-2'>
            {referrals.length === 0 ? (
              <div className='text-center py-8 bg-white/5 rounded-2xl border border-white/5'>
                <Users className='w-10 h-10 text-gray-600 mx-auto mb-2 opacity-30' />
                <p className='text-[10px] text-gray-500 font-black uppercase tracking-widest'>No referrals yet</p>
              </div>
            ) : (
              referrals.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className='bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/5'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='relative flex-shrink-0'>
                        <Image
                          src={friend.avatar}
                          alt={friend.name}
                          width={40}
                          height={40}
                          className='rounded-xl w-10 h-10 object-cover border-2 border-purple-500/20'
                        />
                        {friend.status === 'active' && (
                          <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black'></div>
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-xs font-black text-white truncate mb-0.5'>{friend.name}</h3>
                        <div className='flex items-center gap-2 text-[9px] font-bold text-gray-500'>
                          <span className="text-purple-400">LVL {friend.level}</span>
                          <span className='opacity-30'>|</span>
                          <span className="truncate">{friend.totalEarned.toLocaleString()} coins</span>
                        </div>
                      </div>
                    </div>
                    <div className='text-right flex-shrink-0'>
                      <p className='text-[8px] text-gray-500 font-black uppercase tracking-tight mb-0.5'>Earned</p>
                      <p className='text-sm font-black text-green-400'>
                        +{friend.yourEarnings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {/* Invite CTA Inside Scroll - Compact */}
            {referrals.length < 10 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl p-4 border border-purple-400/20 text-center'
              >
                <p className='text-[10px] text-white font-black uppercase tracking-widest mb-1'>Invite More Friends!</p>
                <p className='text-[9px] text-gray-400 font-bold mb-3'>
                  Earn 20% commission on all their earnings
                </p>
                <Link
                  href="/invite"
                  className='inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-4 py-2 text-[10px] font-black text-white shadow-lg shadow-purple-500/30'
                >
                  INVITE NOW
                </Link>
              </motion.div>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className='space-y-2'>
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl p-3 border ${entry.isYou
                  ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-400/40 shadow-md'
                  : entry.rank <= 3
                    ? 'bg-white/10 border-white/10'
                    : 'bg-white/5 border-white/5'
                  }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <div className='w-6 flex items-center justify-center flex-shrink-0'>
                      <span className={`text-[10px] font-black ${entry.rank === 1 ? 'text-yellow-400 scale-125' : 'text-gray-500'}`}>#{entry.rank}</span>
                    </div>
                    <div className='relative flex-shrink-0'>
                      <Image
                        src={entry.avatar}
                        alt={entry.name}
                        width={36}
                        height={36}
                        className={`rounded-xl w-9 h-9 object-cover ${entry.isYou ? 'border-2 border-yellow-400 shadow-sm' : 'border border-white/10'}`}
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-1.5 mb-0.5'>
                        <h3 className='text-xs font-black text-white truncate'>{entry.name}</h3>
                        {entry.isYou && (
                          <span className='text-[8px] bg-yellow-400 text-black px-1.5 py-0.5 rounded-full font-black uppercase'>You</span>
                        )}
                      </div>
                      <div className='text-[9px] font-bold text-gray-500 flex items-center gap-1.5'>
                        <span className="text-purple-400">LVL {entry.level}</span>
                        <span className='opacity-30'>•</span>
                        <span className="truncate">{entry.totalCoins.toLocaleString()} coins</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right flex-shrink-0'>
                    <TrendingUp className={`w-4 h-4 mb-0.5 mx-auto ${entry.isYou ? 'text-yellow-400' : 'text-green-500'}`} />
                    <p className='text-[8px] text-gray-500 font-black uppercase'>Growth</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
