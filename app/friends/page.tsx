"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, Users, Coins, TrendingUp, Crown, Medal, Award, Copy, Check, Share2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getReferrals } from '@/lib/api'
import { shareReferral } from '@/lib/telegram'

interface Friend {
  username: string
  createdAt: string
  coins: string | number
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
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState<'referrals' | 'leaderboard'>('referrals')
  const [referrals, setReferrals] = useState<Friend[]>([])
  const [summary, setSummary] = useState({ totalReferrals: 0, totalEarnings: '0' })
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'CryptoMaster', avatar: '/avatar.jpg', level: 15, totalCoins: 125000, isYou: false },
    { rank: 2, name: 'CoinCollector', avatar: '/avatar.jpg', level: 12, totalCoins: 98000, isYou: false },
    { rank: 3, name: user?.username || 'Earnest', avatar: '/avatar.jpg', level: 3, totalCoins: 12500, isYou: true },
    { rank: 4, name: 'TapperPro', avatar: '/avatar.jpg', level: 10, totalCoins: 87000, isYou: false },
    { rank: 5, name: 'LuckyPlayer', avatar: '/avatar.jpg', level: 8, totalCoins: 65000, isYou: false },
  ])

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await getReferrals()
        if (response.success) {
          setReferrals(response.data.referrals)
          setSummary(response.data.summary)
        }
      } catch (error) {
        console.error("Failed to fetch referrals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReferrals()
  }, [])

  const handleShare = () => {
    if (user?.id) {
      shareReferral(user.id)
    } else {
      // Fallback if ID is missing (can happen if user not fully loaded)
      alert("User not loaded yet. Please try again.")
    }
  }

  const handleCopyLink = () => {
    if (!user?.id) return
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'LotooryBot'
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'lotoory'
    const referralLink = `https://t.me/${botUsername}/${appName}?startapp=${user.id}`

    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='h-dvh flex flex-col overflow-hidden pt-[84px] pb-[99px] px-4 bg-black'>
      {/* Header - Shrunk */}
      <div className='mb-3 flex-shrink-0'>
        <h1 className='text-xl font-black text-white italic tracking-tighter'>FRIENDS & RANK</h1>
        <p className='text-[10px] text-purple-300 font-bold uppercase tracking-wider'>Invite & Climb</p>
      </div>

      {/* Stats Summary - Compact */}
      <div className='grid grid-cols-2 gap-2 mb-4 flex-shrink-0'>
        <div className='bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-3 border border-purple-400/20 flex flex-col justify-center shadow-sm'>
          <div className='flex items-center gap-1.5 mb-1'>
            <Users className='w-3.5 h-3.5 text-blue-400' />
            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Friends</p>
          </div>
          <p className='text-lg font-black text-white leading-none'>{summary.totalReferrals}</p>
          <p className='text-[8px] text-gray-500 mt-1 uppercase font-bold'>Invited</p>
        </div>

        <div className='bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-3 border border-yellow-400/20 flex flex-col justify-center shadow-sm'>
          <div className='flex items-center gap-1.5 mb-1'>
            <Coins className='w-3.5 h-3.5 text-yellow-400' />
            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Commission</p>
          </div>
          <p className='text-lg font-black text-white leading-none'>{Number(summary.totalEarnings).toLocaleString()}</p>
          <p className='text-[8px] text-green-500 mt-1 uppercase font-bold'>20% of their taps</p>
        </div>
      </div>

      {/* Tabs */}
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
        {activeTab === 'referrals' && (
          <div className='space-y-2'>
            {/* Referral Info Card */}
            <div className='bg-white/5 rounded-2xl p-4 border border-white/10 mb-4'>
              <h3 className='text-xs font-black text-white uppercase tracking-wider mb-2'>Invite Rewards</h3>
              <div className='flex items-center gap-3 mb-3'>
                <div className='w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center flex-shrink-0'>
                  <Coins className='w-4 h-4 text-yellow-500' />
                </div>
                <div>
                  <p className='text-[10px] text-white font-black'>+5,000 Coins</p>
                  <p className='text-[8px] text-gray-500'>For you and your friend on join</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-purple-400/10 flex items-center justify-center flex-shrink-0'>
                  <TrendingUp className='w-4 h-4 text-purple-500' />
                </div>
                <div>
                  <p className='text-[10px] text-white font-black'>20% Commission</p>
                  <p className='text-[8px] text-gray-500'>From every coin your friend taps</p>
                </div>
              </div>
            </div>

            {/* Invite Buttons */}
            <div className='grid grid-cols-2 gap-2 mb-4'>
              <button
                onClick={handleShare}
                className='flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl py-2.5 text-[10px] font-black text-white shadow-lg'
              >
                <Share2 size={12} /> SHARE LINK
              </button>
              <button
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-[10px] font-black transition-all ${copied
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-white border border-white/10'
                  }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'COPIED!' : 'COPY LINK'}
              </button>
            </div>

            <h3 className='text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 mt-4 px-1'>Friends List ({referrals.length})</h3>

            {isLoading ? (
              <div className='flex justify-center py-8'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className='w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full'
                />
              </div>
            ) : referrals.length === 0 ? (
              <div className='text-center py-10 bg-white/5 rounded-2xl border border-white/5'>
                <Users className='w-12 h-12 text-gray-600 mx-auto mb-2 opacity-20' />
                <p className='text-[10px] text-gray-500 font-black uppercase tracking-widest'>No friends invited yet</p>
                <p className='text-[8px] text-gray-600 mt-1 uppercase'>Invite friends to start earning</p>
              </div>
            ) : (
              referrals.map((friend, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className='bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/5'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='relative flex-shrink-0'>
                        <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/10 text-white text-xs font-black'>
                          {friend.username.substring(0, 1).toUpperCase()}
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-xs font-black text-white truncate mb-0.5'>{friend.username}</h3>
                        <div className='flex items-center gap-2 text-[8px] font-bold text-gray-500'>
                          <span className="text-gray-400">Joined {new Date(friend.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className='text-right flex-shrink-0'>
                      <div className='flex items-center gap-1 justify-end mb-0.5'>
                        <Coins className='w-2.5 h-2.5 text-yellow-500' />
                        <span className='text-[9px] font-black text-white'>{Number(friend.coins).toLocaleString()}</span>
                      </div>
                      <p className='text-[8px] text-gray-500 font-black uppercase tracking-tight'>Tipped</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Leaderboard Tab Content remains similar but cleaned up */}
        {activeTab === 'leaderboard' && (
          <div className='space-y-2'>
            {leaderboard.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl p-3 border ${entry.isYou
                  ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-400/40 shadow-md'
                  : 'bg-white/5 border-white/5'
                  }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <div className='w-6 flex items-center justify-center flex-shrink-0'>
                      <span className={`text-[10px] font-black ${entry.rank <= 3 ? 'text-yellow-400' : 'text-gray-500'}`}>#{entry.rank}</span>
                    </div>
                    <div className='relative flex-shrink-0'>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black ${entry.isYou ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white'}`}>
                        {entry.name.substring(0, 1).toUpperCase()}
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-1.5 mb-0.5'>
                        <h3 className='text-xs font-black text-white truncate'>{entry.name}</h3>
                        {entry.isYou && (
                          <span className='text-[7px] bg-yellow-400 text-black px-1 py-0.5 rounded-sm font-black uppercase'>You</span>
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
                    {entry.rank === 1 && <Crown className='w-4 h-4 text-yellow-400 ml-auto' />}
                    {entry.rank === 2 && <Medal className='w-4 h-4 text-gray-300 ml-auto' />}
                    {entry.rank === 3 && <Award className='w-4 h-4 text-orange-400 ml-auto' />}
                    <p className='text-[8px] text-gray-500 font-black uppercase mt-0.5'>Rank</p>
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
