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
    <div className='min-h-screen pb-24 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-white mb-2'>Invite Friends</h1>
        <p className='text-gray-300'>Earn 20% of your friends' profits</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 gap-3 mb-6'>
        <div className='bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl p-4 border border-purple-400/20'>
          <div className='flex items-center gap-2 mb-2'>
            <Users className='w-5 h-5 text-blue-400' />
            <p className='text-xs text-gray-300'>Total Referrals</p>
          </div>
          <p className='text-2xl font-bold text-white'>{stats.totalReferrals}</p>
          <p className='text-xs text-green-400 mt-1'>{stats.activeReferrals} active</p>
        </div>
        
        <div className='bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-xl p-4 border border-yellow-400/20'>
          <div className='flex items-center gap-2 mb-2'>
            <Coins className='w-5 h-5 text-yellow-400' />
            <p className='text-xs text-gray-300'>Total Earned</p>
          </div>
          <p className='text-2xl font-bold text-white'>{stats.totalEarned.toLocaleString()}</p>
          <p className='text-xs text-green-400 mt-1'>+{stats.todayEarned} today</p>
        </div>
      </div>

      {/* Main Invite Section */}
      <div className='bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-6 mb-6 border-2 border-purple-400/30'>
        <div className='flex flex-col items-center text-center mb-6'>
          <div className='bg-purple-500/30 p-4 rounded-full mb-4'>
            <Gift className='w-12 h-12 text-yellow-400' />
          </div>
          <h2 className='text-2xl font-bold text-white mb-2'>
            Invite Friends & Earn
          </h2>
          <p className='text-gray-300 text-sm mb-1'>
            Share your referral link and earn
          </p>
          <p className='text-xl font-bold text-[#D2F10C] mb-4'>
            20% of your friends' profits
          </p>
        </div>

        {/* Referral Code */}
        <div className='mb-4'>
          <label className='text-sm text-gray-300 mb-2 block'>Your Referral Code</label>
          <div className='flex items-center gap-2'>
            <div className='flex-1 bg-gray-800/50 rounded-xl p-4 border border-purple-400/30'>
              <p className='text-2xl font-bold text-white text-center tracking-wider'>
                {referralCode}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className='bg-purple-600 p-4 rounded-xl text-white hover:bg-purple-700 transition-colors'
            >
              {copied ? (
                <Check className='w-6 h-6 text-green-400' />
              ) : (
                <Copy className='w-6 h-6' />
              )}
            </motion.button>
          </div>
        </div>

        {/* Referral Link */}
        <div className='mb-6'>
          <label className='text-sm text-gray-300 mb-2 block'>Your Referral Link</label>
          <div className='flex items-center gap-2'>
            <div className='flex-1 bg-gray-800/50 rounded-xl p-3 border border-purple-400/30'>
              <p className='text-sm text-gray-300 break-all'>
                {referralLink}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className='bg-purple-600 p-3 rounded-xl text-white hover:bg-purple-700 transition-colors'
            >
              <Copy className='w-5 h-5' />
            </motion.button>
          </div>
        </div>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className='w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all'
        >
          <Share2 className='w-5 h-5' />
          Share Invite Link
        </motion.button>
      </div>

      {/* How It Works */}
      <div className='bg-blue-600/20 rounded-2xl p-5 border border-blue-400/30 mb-6'>
        <h3 className='text-white font-bold mb-4 flex items-center gap-2'>
          <TrendingUp className='w-5 h-5 text-blue-400' />
          How It Works
        </h3>
        <div className='space-y-3'>
          <div className='flex items-start gap-3'>
            <div className='bg-blue-500/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5'>
              <span className='text-blue-400 font-bold text-sm'>1</span>
            </div>
            <div>
              <p className='text-white font-semibold'>Share Your Link</p>
              <p className='text-sm text-gray-300'>Copy and share your unique referral link with friends</p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <div className='bg-blue-500/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5'>
              <span className='text-blue-400 font-bold text-sm'>2</span>
            </div>
            <div>
              <p className='text-white font-semibold'>Friends Join</p>
              <p className='text-sm text-gray-300'>Your friends sign up using your referral code</p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <div className='bg-blue-500/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5'>
              <span className='text-blue-400 font-bold text-sm'>3</span>
            </div>
            <div>
              <p className='text-white font-semibold'>Earn Passive Income</p>
              <p className='text-sm text-gray-300'>Earn 20% of all coins your referrals make</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Tier */}
      <div className='bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl p-5 border border-yellow-400/30'>
        <h3 className='text-white font-bold mb-3'>Referral Rewards</h3>
        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <span className='text-gray-300'>1-5 Referrals</span>
            <span className='text-yellow-400 font-bold'>20% Commission</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-gray-300'>6-10 Referrals</span>
            <span className='text-yellow-400 font-bold'>25% Commission</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-gray-300'>11+ Referrals</span>
            <span className='text-yellow-400 font-bold'>30% Commission</span>
          </div>
        </div>
      </div>
    </div>
  )
}
