"use client";
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Users, Coins, TrendingUp, Share2, Gift } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getReferrals } from '@/lib/api'
import { shareReferral } from '@/lib/telegram'

export default function InvitePage() {
  const { user } = useApp()
  const [copied, setCopied] = useState(false)
  const [summary, setSummary] = useState({ totalReferrals: 0, totalEarnings: '0' })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getReferrals()
        if (response.success) {
          setSummary(response.data.summary)
        }
      } catch (error) {
        console.error("Failed to fetch referral stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleCopy = () => {
    if (!user?.id) return
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'LotooryBot'
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'lotoory'
    const referralCode = user.referralCode || user.id
    const referralLink = `https://t.me/${botUsername}/${appName}?startapp=ref_${referralCode}`

    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (user) {
      const referralCode = user.referralCode || user.id
      shareReferral(referralCode as string)
    } else {
      alert("User not loaded yet. Please try again.")
    }
  }

  const referralCode = user?.id ? user.id.substring(0, 8).toUpperCase() : 'LOADING...'

  return (
    <div className='h-dvh flex flex-col overflow-hidden pt-[84px] pb-[99px] px-4 bg-black'>
      {/* Header - Shrunk */}
      <div className='mb-3 flex-shrink-0'>
        <h1 className='text-xl font-black text-white italic tracking-tighter'>INVITE & EARN</h1>
        <p className='text-[10px] text-purple-300 font-bold uppercase tracking-wider'>20% Commission Program</p>
      </div>

      {/* Stats Cards - Compact */}
      <div className='grid grid-cols-2 gap-2 mb-4 flex-shrink-0'>
        <div className='bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-3 border border-purple-400/20 shadow-sm'>
          <div className='flex items-center gap-1.5 mb-1'>
            <Users className='w-3.5 h-3.5 text-blue-400' />
            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Total Referrals</p>
          </div>
          <p className='text-lg font-black text-white leading-none'>{summary.totalReferrals}</p>
          <p className='text-[8px] text-green-500 mt-1 font-bold uppercase'>Joined</p>
        </div>

        <div className='bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-3 border border-yellow-400/20 shadow-sm'>
          <div className='flex items-center gap-1.5 mb-1'>
            <Coins className='w-3.5 h-3.5 text-yellow-400' />
            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Total Earned</p>
          </div>
          <p className='text-lg font-black text-white leading-none'>{Number(summary.totalEarnings).toLocaleString()}</p>
          <p className='text-[8px] text-green-500 mt-1 font-bold uppercase'>Commission</p>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4 space-y-4">
        {/* Main Invite Section - Compact */}
        <div className='bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg relative overflow-hidden'>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Gift className="w-16 h-16 text-yellow-500" />
          </div>

          <div className='mb-4'>
            <h2 className='text-base font-black text-white mb-1'>
              Your Referral Network
            </h2>
            <p className='text-[10px] text-gray-400 font-medium'>
              Earn <span className="text-[#D2F10C] font-black italic">20% commission</span> on every coin your friends tap for life.
            </p>
          </div>

          {/* Referral Link & Invite Buttons */}
          <div className='space-y-3'>
            <div className='grid grid-cols-2 gap-3'>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`group flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black transition-all border ${copied
                  ? 'bg-green-500/20 border-green-500 text-green-500'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
              >
                {copied ? <Check size={14} className="animate-in zoom-in" /> : <Copy size={14} />}
                {copied ? 'COPIED!' : 'COPY LINK'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className='flex items-center justify-center gap-2 bg-gradient-to-r from-[#6A00BB] to-[#460A73] py-3.5 rounded-xl text-[10px] font-black text-white shadow-lg shadow-purple-500/20 border border-purple-500/30 hover:brightness-110 active:brightness-90 transition-all'
              >
                <Share2 size={14} />
                INVITE FRIEND
              </motion.button>
            </div>

            <div className='bg-black/40 rounded-xl p-2.5 border border-white/5 flex items-center justify-between group'>
              <div className='flex flex-col'>
                <span className='text-[8px] text-gray-500 font-bold uppercase tracking-wider'>Your ID</span>
                <p className='text-xs font-black text-white/50 tracking-widest truncate max-w-[150px]'>
                  {user?.id || 'LOADING...'}
                </p>
              </div>
              <div className='bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-[8px] text-gray-400 font-bold'>
                REV {user?.id?.substring(0, 4).toUpperCase() || '####'}
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Compact List */}
        <div className='bg-blue-600/10 rounded-2xl p-4 border border-blue-400/20'>
          <h3 className='text-xs font-black text-white mb-3 flex items-center gap-1.5'>
            <TrendingUp className='w-4 h-4 text-blue-400' />
            HOW IT WORKS
          </h3>
          <div className='space-y-3 px-1'>
            {[
              { id: 1, title: 'Share Link', desc: 'Copy your unique invite link' },
              { id: 2, title: 'Friends Join', desc: 'They start their journey' },
              { id: 3, title: 'Get Paid', desc: 'Earn 20% on every tap' }
            ].map((step) => (
              <div key={step.id} className='flex items-start gap-2.5'>
                <div className='bg-blue-500/20 rounded-lg w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-400/20'>
                  <span className='text-blue-400 font-black text-[10px]'>{step.id}</span>
                </div>
                <div>
                  <p className='text-[10px] text-white font-black leading-none mb-0.5'>{step.title}</p>
                  <p className='text-[9px] text-gray-500 font-medium'>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Card */}
        <div className='bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-2xl p-4 border border-yellow-400/20'>
          <h3 className='text-xs font-black text-white mb-2'>JOINING BONUS</h3>
          <p className='text-[10px] text-gray-400 font-bold'>
            Both you and your friend get <span className='text-yellow-400'>5,000 Coins</span> instantly when they join via your link!
          </p>
        </div>
      </div>
    </div>
  )
}
