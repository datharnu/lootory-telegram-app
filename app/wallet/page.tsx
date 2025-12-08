"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wallet, Coins, TrendingUp, Download, FileText, Info, ExternalLink, Copy, Check, Settings } from 'lucide-react'

interface Transaction {
  id: number
  type: 'earned' | 'spent' | 'referral'
  amount: number
  description: string
  timestamp: string
  status: 'completed' | 'pending'
}

export default function WalletPage() {
  const [copied, setCopied] = useState(false)
  const [walletAddress] = useState('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5')
  
  const [balance] = useState({
    total: 12500,
    available: 12000,
    pending: 500,
    totalEarned: 45000,
    totalSpent: 32500
  })

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
    },
    {
      id: 4,
      type: 'earned',
      amount: 300,
      description: 'Task Completed - Follow X',
      timestamp: '2 days ago',
      status: 'completed'
    },
    {
      id: 5,
      type: 'earned',
      amount: 500,
      description: 'Daily Reward',
      timestamp: '3 days ago',
      status: 'completed'
    },
  ])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='min-h-screen pb-24 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-white mb-2'>Wallet & Profile</h1>
        <p className='text-gray-300'>Manage your earnings and account</p>
      </div>

      {/* Profile Section */}
      <div className='bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-2xl p-6 mb-6 border-2 border-purple-400/30'>
        <div className='flex items-center gap-4 mb-6'>
          <Image
            src="/avatar.jpg"
            alt="Profile"
            width={80}
            height={80}
            className='rounded-full w-20 h-20 object-cover border-4 border-purple-400'
          />
          <div className='flex-1'>
            <h2 className='text-2xl font-bold text-white mb-1'>Earnest</h2>
            <p className='text-gray-300'>Level 3 Player</p>
            <p className='text-sm text-purple-300 mt-1'>Member since Jan 2024</p>
          </div>
        </div>

        {/* Wallet Address */}
        <div className='bg-gray-800/50 rounded-xl p-4 border border-purple-400/30'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <Wallet className='w-5 h-5 text-purple-400' />
              <span className='text-sm text-gray-300'>Wallet Address</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyAddress}
              className='p-2 hover:bg-gray-700 rounded-lg transition-colors'
            >
              {copied ? (
                <Check className='w-4 h-4 text-green-400' />
              ) : (
                <Copy className='w-4 h-4 text-gray-400' />
              )}
            </motion.button>
          </div>
          <p className='text-xs text-gray-400 break-all font-mono'>
            {walletAddress}
          </p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className='grid grid-cols-2 gap-3 mb-6'>
        <div className='bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-xl p-4 border border-yellow-400/20'>
          <div className='flex items-center gap-2 mb-2'>
            <Coins className='w-5 h-5 text-yellow-400' />
            <p className='text-xs text-gray-300'>Available</p>
          </div>
          <p className='text-2xl font-bold text-white'>{balance.available.toLocaleString()}</p>
          <p className='text-xs text-gray-400 mt-1'>{balance.pending} pending</p>
        </div>
        
        <div className='bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-xl p-4 border border-green-400/20'>
          <div className='flex items-center gap-2 mb-2'>
            <TrendingUp className='w-5 h-5 text-green-400' />
            <p className='text-xs text-gray-300'>Total Earned</p>
          </div>
          <p className='text-2xl font-bold text-white'>{balance.totalEarned.toLocaleString()}</p>
          <p className='text-xs text-gray-400 mt-1'>{balance.totalSpent.toLocaleString()} spent</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-2 gap-3 mb-6'>
        <Link href="/about">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-xl p-4 border border-blue-400/30 cursor-pointer'
          >
            <div className='flex items-center gap-3'>
              <div className='bg-blue-500/30 p-2 rounded-lg'>
                <Info className='w-5 h-5 text-blue-400' />
              </div>
              <div>
                <p className='text-white font-bold text-sm'>About Lootory</p>
                <p className='text-xs text-gray-400'>Learn more</p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/about#whitepaper">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl p-4 border border-purple-400/30 cursor-pointer'
          >
            <div className='flex items-center gap-3'>
              <div className='bg-purple-500/30 p-2 rounded-lg'>
                <FileText className='w-5 h-5 text-purple-400' />
              </div>
              <div>
                <p className='text-white font-bold text-sm'>White Paper</p>
                <p className='text-xs text-gray-400'>Read docs</p>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Transaction History */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold text-white'>Transaction History</h2>
          <span className='text-sm text-gray-400'>{transactions.length} transactions</span>
        </div>

        <div className='space-y-2'>
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className='bg-gray-800/30 rounded-xl p-4 border border-gray-700/50'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4 flex-1'>
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'earned' || transaction.type === 'referral'
                      ? 'bg-green-500/20'
                      : 'bg-red-500/20'
                  }`}>
                    {transaction.type === 'referral' ? (
                      <TrendingUp className='w-5 h-5 text-green-400' />
                    ) : (
                      <Coins className={`w-5 h-5 ${
                        transaction.type === 'earned'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`} />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='text-white font-semibold'>{transaction.description}</p>
                    <p className='text-xs text-gray-400'>{transaction.timestamp}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className='bg-blue-600/20 rounded-2xl p-5 border border-blue-400/30'>
        <h3 className='text-white font-bold mb-3 flex items-center gap-2'>
          <Settings className='w-5 h-5 text-blue-400' />
          Wallet Information
        </h3>
        <ul className='text-sm text-gray-300 space-y-2'>
          <li className='flex items-start gap-2'>
            <span className='text-blue-400'>•</span>
            <span>Coins are stored securely on the blockchain</span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='text-blue-400'>•</span>
            <span>Withdrawals available after reaching minimum balance</span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='text-blue-400'>•</span>
            <span>All transactions are transparent and verifiable</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

