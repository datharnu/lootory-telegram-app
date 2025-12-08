"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
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
    <div className='min-h-screen pb-24 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-white mb-2'>Friends & Leaderboard</h1>
        <p className='text-gray-300'>Track your referrals and compete globally</p>
      </div>

      {/* Stats Summary */}
      <div className='grid grid-cols-2 gap-3 mb-6'>
        <div className='bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl p-4 border border-purple-400/20'>
          <div className='flex items-center gap-2 mb-2'>
            <Users className='w-5 h-5 text-blue-400' />
            <p className='text-xs text-gray-300'>Active Referrals</p>
          </div>
          <p className='text-2xl font-bold text-white'>{activeReferrals}</p>
          <p className='text-xs text-gray-400 mt-1'>{referrals.length} total</p>
        </div>
        
        <div className='bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-xl p-4 border border-yellow-400/20'>
          <div className='flex items-center gap-2 mb-2'>
            <Coins className='w-5 h-5 text-yellow-400' />
            <p className='text-xs text-gray-300'>Earned from Referrals</p>
          </div>
          <p className='text-2xl font-bold text-white'>{totalEarnedFromReferrals.toLocaleString()}</p>
          <p className='text-xs text-green-400 mt-1'>20% commission</p>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 mb-6 bg-gray-800/30 rounded-xl p-1'>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'referrals'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'text-gray-400'
          }`}
        >
          My Referrals
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'text-gray-400'
          }`}
        >
          <Trophy className='w-4 h-4 inline mr-2' />
          Leaderboard
        </button>
      </div>

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <div className='space-y-3'>
          {referrals.length === 0 ? (
            <div className='text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50'>
              <Users className='w-16 h-16 text-gray-600 mx-auto mb-4' />
              <p className='text-gray-400 mb-2'>No referrals yet</p>
              <p className='text-sm text-gray-500'>Invite friends to start earning!</p>
            </div>
          ) : (
            referrals.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-4 border-2 border-purple-400/30'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='relative'>
                      <Image
                        src={friend.avatar}
                        alt={friend.name}
                        width={50}
                        height={50}
                        className='rounded-full w-12 h-12 object-cover border-2 border-purple-400'
                      />
                      {friend.status === 'active' && (
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-purple-600'></div>
                      )}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='text-lg font-bold text-white'>{friend.name}</h3>
                        {friend.status === 'active' && (
                          <span className='text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full'>
                            Active
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-4 text-sm'>
                        <span className='text-gray-300'>Level {friend.level}</span>
                        <span className='text-gray-400'>•</span>
                        <span className='text-gray-300'>{friend.totalEarned.toLocaleString()} coins</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-gray-400 mb-1'>You Earned</p>
                    <p className='text-lg font-bold text-green-400'>
                      +{friend.yourEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className='space-y-3'>
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-4 border-2 ${
                entry.isYou
                  ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-yellow-400/50'
                  : entry.rank <= 3
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/30'
                  : 'bg-gray-800/30 border-gray-700/50'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4 flex-1'>
                  <div className='w-12 flex items-center justify-center'>
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className='relative'>
                    <Image
                      src={entry.avatar}
                      alt={entry.name}
                      width={50}
                      height={50}
                      className='rounded-full w-12 h-12 object-cover border-2 border-purple-400'
                    />
                    {entry.rank <= 3 && (
                      <div className='absolute -top-1 -right-1 bg-yellow-500 rounded-full w-5 h-5 flex items-center justify-center'>
                        <span className='text-xs font-bold text-gray-900'>{entry.rank}</span>
                      </div>
                    )}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='text-lg font-bold text-white'>{entry.name}</h3>
                      {entry.isYou && (
                        <span className='text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full'>
                          You
                        </span>
                      )}
                    </div>
                    <div className='flex items-center gap-4 text-sm'>
                      <span className='text-gray-300'>Level {entry.level}</span>
                      <span className='text-gray-400'>•</span>
                      <span className='text-gray-300'>{entry.totalCoins.toLocaleString()} coins</span>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <TrendingUp className='w-5 h-5 text-green-400 mx-auto mb-1' />
                  <p className='text-xs text-gray-400'>#{entry.rank}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Invite CTA */}
      {activeTab === 'referrals' && referrals.length < 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='mt-6 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl p-5 border border-purple-400/30 text-center'
        >
          <p className='text-white font-bold mb-2'>Invite More Friends!</p>
          <p className='text-sm text-gray-300 mb-4'>
            Earn 20% commission on all their earnings
          </p>
          <motion.a
            href="/invite"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-6 py-3 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all'
          >
            Get Referral Link
          </motion.a>
        </motion.div>
      )}
    </div>
  )
}
