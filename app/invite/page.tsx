"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Copy, Check, Users, Coins, TrendingUp, Share2, Gift } from 'lucide-react'

export default function InvitePage() {
  const [copied, setCopied] = useState(false)
  const [referralCode] = useState('LOOTORY2024')
  const [referralLink] = useState('https://t.me/lootory_bot?start=LOOTORY2024')

  // Mock stats
  const [stats] = useState({
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarned: 15420,
    todayEarned: 320
  })

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Lootory - Tap to Earn!',
          text: 'Join me on Lootory and earn coins by tapping! Use my referral code.',
          url: referralLink,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className='h-dvh flex flex-col overflow-hidden pt-[84px] pb-[99px] px-4'>
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
          <p className='text-lg font-black text-white leading-none'>{stats.totalReferrals}</p>
          <p className='text-[8px] text-green-500 mt-1 font-bold uppercase'>{stats.activeReferrals} Active</p>
        </div>

        <div className='bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-3 border border-yellow-400/20 shadow-sm'>
          <div className='flex items-center gap-1.5 mb-1'>
            <Coins className='w-3.5 h-3.5 text-yellow-400' />
            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Loot Earned</p>
          </div>
          <p className='text-lg font-black text-white leading-none'>{stats.totalEarned.toLocaleString()}</p>
          <p className='text-[8px] text-green-500 mt-1 font-bold uppercase'>+{stats.todayEarned} Today</p>
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

          {/* Referral Code */}
          <div className='mb-3'>
            <label className='text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block'>Your Unique Code</label>
            <div className='flex items-center gap-1.5'>
              <div className='flex-1 bg-black/40 rounded-xl p-2.5 border border-white/5'>
                <p className='text-lg font-black text-white text-center tracking-widest'>
                  {referralCode}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className='bg-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-purple-900/40 border border-purple-400/30'
              >
                {copied ? <Check className='w-5 h-5 text-green-400' /> : <Copy className='w-5 h-5' />}
              </motion.button>
            </div>
          </div>

          {/* Share Button - Large focal point */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className='w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl py-3.5 text-xs font-black text-white flex items-center justify-center gap-2 shadow-xl shadow-purple-900/40 relative overflow-hidden group border border-white/10'
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
            <Share2 className='w-4 h-4' />
            SHARE INVITE LINK
          </motion.button>
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

        {/* Commission Tiers - Sleek Badge Style */}
        <div className='bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-2xl p-4 border border-yellow-400/20'>
          <h3 className='text-xs font-black text-white mb-3'>REWARD TIERS</h3>
          <div className='space-y-1.5'>
            {[
              { range: '1-5 Friends', rate: '20%' },
              { range: '6-10 Friends', rate: '25%' },
              { range: '11+ Friends', rate: '30%' }
            ].map((tier, i) => (
              <div key={i} className='flex justify-between items-center bg-black/20 rounded-lg px-3 py-1.5 border border-white/5'>
                <span className='text-[9px] text-gray-400 font-bold'>{tier.range}</span>
                <span className='text-[10px] text-yellow-400 font-black italic'>{tier.rate} Commission</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
