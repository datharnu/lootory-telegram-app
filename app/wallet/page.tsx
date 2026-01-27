"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wallet, Coins, TrendingUp, Download, FileText, Info, ExternalLink, Copy, Check, Settings } from 'lucide-react'
import { useApp } from '@/context/AppContext'

interface Transaction {
  id: number
  type: 'earned' | 'spent' | 'referral'
  amount: number
  description: string
  timestamp: string
  status: 'completed' | 'pending'
}

export default function WalletPage() {
  const { user, stats } = useApp()
  const [copied, setCopied] = useState(false)
  const [walletAddress] = useState('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5')

  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'earned',
      amount: 500,
      description: 'Daily Reward Claimed',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'referral',
      amount: 1200,
      description: 'Referral Commission - Alex',
      timestamp: '5 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'spent',
      amount: -1000,
      description: 'Energy Boost Upgrade',
      timestamp: '1 day ago',
      status: 'completed'
    }
  ])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='h-dvh flex flex-col overflow-hidden pt-[84px] pb-[99px] px-4'>
      <div className='mb-3 flex-shrink-0'>
        <h1 className='text-xl font-black text-white italic tracking-tighter'>WALLET & PROFILE</h1>
        <p className='text-[10px] text-purple-300 font-bold uppercase tracking-wider'>Manage your assets</p>
      </div>

      <div className='bg-white/5 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/10 shadow-inner flex-shrink-0'>
        <div className='flex items-center gap-3 mb-4'>
          <Image
            src="/avatar.jpg"
            alt="Profile"
            width={48}
            height={48}
            className='rounded-xl w-12 h-12 object-cover border-2 border-purple-500/20 shadow-sm'
          />
          <div className='flex-1 min-w-0'>
            <h2 className='text-base font-black text-white truncate leading-none mb-1.5'>
              {user?.username || "Guest"}
            </h2>
            <div className='flex items-center gap-2'>
              <span className='text-[9px] text-purple-400 font-black uppercase tracking-widest bg-purple-500/10 px-1.5 py-0.5 rounded'>Level {stats.level}</span>
              <span className='text-[9px] text-gray-500 font-bold'>Session Active</span>
            </div>
          </div>
        </div>

        <div className='bg-black/40 rounded-xl p-2.5 border border-white/5'>
          <div className='flex items-center justify-between mb-1.5'>
            <div className='flex items-center gap-1.5'>
              <Wallet className='w-3 h-3 text-purple-400' />
              <span className='text-[8px] text-gray-500 font-black uppercase tracking-widest'>TON Wallet</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCopyAddress}
              className='p-1.5 hover:bg-white/5 rounded-lg transition-colors'
            >
              {copied ? (
                <Check className='w-3 h-3 text-green-400' />
              ) : (
                <Copy className='w-3 h-3 text-gray-500' />
              )}
            </motion.button>
          </div>
          <p className='text-[9px] text-gray-400 break-all font-mono opacity-60 px-1'>
            {walletAddress}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2 mb-4 flex-shrink-0'>
        <div className='bg-gradient-to-br from-yellow-600/10 to-orange-600/10 rounded-2xl p-3 border border-yellow-400/20 shadow-sm flex flex-col justify-center'>
          <div className='flex items-center gap-1.5 mb-1'>
            <Coins className='w-3 h-3 text-yellow-400' />
            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Available</p>
          </div>
          <p className='text-lg font-black text-white leading-none'>{stats.coins.toLocaleString()}</p>
          <p className='text-[8px] text-gray-500 mt-1 font-bold'>0 pending</p>
        </div>

        <div className='bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-2xl p-3 border border-green-400/20 shadow-sm flex flex-col justify-center'>
          <div className='flex items-center gap-1.5 mb-1'>
            <TrendingUp className='w-3 h-3 text-green-400' />
            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>XP Progress</p>
          </div>
          <p className='text-lg font-black text-white leading-none'>{stats.xp.toLocaleString()}</p>
          <p className='text-[8px] text-gray-500 mt-1 font-bold'>Level {stats.level}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4 space-y-4">
        <div className='grid grid-cols-2 gap-2'>
          <Link href="/about">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors'
            >
              <div className='flex items-center gap-2'>
                <div className='bg-blue-500/10 p-1.5 rounded-lg'>
                  <Info className='w-3.5 h-3.5 text-blue-400' />
                </div>
                <p className='text-[10px] text-white font-black uppercase tracking-widest'>About Us</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/about#whitepaper">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors'
            >
              <div className='flex items-center gap-2'>
                <div className='bg-purple-500/10 p-1.5 rounded-lg'>
                  <FileText className='w-3.5 h-3.5 text-purple-400' />
                </div>
                <p className='text-[10px] text-white font-black uppercase tracking-widest'>Docs</p>
              </div>
            </motion.div>
          </Link>
        </div>

        <div>
          <div className='flex items-center justify-between mb-3 px-1'>
            <h2 className='text-xs font-black text-white uppercase tracking-widest'>Recent Activity</h2>
            <span className='text-[8px] text-gray-500 font-black uppercase'>{transactions.length} ITEMS</span>
          </div>

          <div className='space-y-1.5'>
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className='bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center justify-between'
              >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div className={`p-2 rounded-lg flex-shrink-0 ${transaction.type === 'earned' || transaction.type === 'referral'
                    ? 'bg-green-500/10'
                    : 'bg-red-500/10'
                    }`}>
                    {transaction.type === 'referral' ? (
                      <TrendingUp className='w-3 h-3 text-green-400' />
                    ) : (
                      <Coins className={`w-3 h-3 ${transaction.type === 'earned'
                        ? 'text-green-400'
                        : 'text-red-400'
                        }`} />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[10px] font-black text-white truncate'>{transaction.description}</p>
                    <p className='text-[8px] text-gray-500 font-bold'>{transaction.timestamp}</p>
                  </div>
                </div>
                <div className='text-right flex-shrink-0 ml-2'>
                  <p className={`text-[10px] font-black ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                  </p>
                  <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase ${transaction.status === 'completed'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                    {transaction.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
