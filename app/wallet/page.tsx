"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Coins, TrendingUp, Download, FileText, Info, ExternalLink, Copy, Check, Settings, ShieldCheck, Zap } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react'
import { updateWalletAddress as syncWalletToBackend } from '@/lib/api'

interface Transaction {
  id: number
  type: 'earned' | 'spent' | 'referral'
  amount: number
  description: string
  timestamp: string
  status: 'completed' | 'pending'
}

export default function WalletPage() {
  const { user, setUser, stats } = useApp()
  const [copied, setCopied] = useState(false)
  const tonAddress = useTonAddress()
  const [isSyncing, setIsSyncing] = useState(false)

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

  // Sync wallet address to backend when it changes
  useEffect(() => {
    if (tonAddress && tonAddress !== user?.walletAddress) {
      handleSyncWallet(tonAddress)
    }
  }, [tonAddress, user?.walletAddress])

  const handleSyncWallet = async (address: string) => {
    setIsSyncing(true)
    try {
      await syncWalletToBackend(address)
      if (user) {
        setUser({ ...user, walletAddress: address })
      }
      console.log('Wallet synced to backend successfully')
    } catch (error) {
      console.error('Failed to sync wallet:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleCopyAddress = () => {
    if (tonAddress) {
      navigator.clipboard.writeText(tonAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`
  }

  return (
    <div className='h-dvh flex flex-col overflow-hidden pt-[84px] pb-[99px] px-4 bg-gradient-to-b from-[#1c0130] to-black'>
      <div className='mb-4 flex-shrink-0 flex justify-between items-end'>
        <div>
          <h1 className='text-2xl font-black text-white italic tracking-tighter leading-tight'>ASSETS</h1>
          <p className='text-[10px] text-purple-400 font-bold uppercase tracking-widest'>Your Web3 Identity</p>
        </div>
        <div className='flex items-center gap-2'>
          <div className="scale-90 origin-right">
            <TonConnectButton />
          </div>
        </div>
      </div>

      <div className='bg-white/5 backdrop-blur-xl rounded-3xl p-5 mb-4 border border-white/10 shadow-2xl flex-shrink-0 relative overflow-hidden'>
        {/* Decorative elements */}
        <div className='absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl' />

        <div className='flex items-center gap-4 mb-5 relative z-10'>
          <div className='relative'>
            <Image
              src="/avatar.jpg"
              alt="Profile"
              width={56}
              height={56}
              className='rounded-2xl w-14 h-14 object-cover border-2 border-purple-500/40 shadow-lg'
            />
            <div className='absolute -bottom-1 -right-1 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-[#1c0130] shadow-sm' />
          </div>
          <div className='flex-1 min-w-0'>
            <h2 className='text-lg font-black text-white truncate leading-none mb-2 tracking-tight'>
              {user?.username || "Guest User"}
            </h2>
            <div className='flex items-center gap-2'>
              <span className='text-[10px] text-white font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 px-2 py-0.5 rounded-md shadow-sm italic'>LVL {stats.level}</span>
              <div className='flex items-center gap-1 text-[9px] text-gray-400 font-bold'>
                <ShieldCheck className='w-3 h-3 text-green-500' />
                <span>Verified Holder</span>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/5 group transition-all duration-300 hover:border-purple-500/30'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <div className='p-1.5 bg-blue-500/10 rounded-lg'>
                <Wallet className='w-3.5 h-3.5 text-blue-400' />
              </div>
              <span className='text-[9px] text-gray-400 font-black uppercase tracking-widest'>TON Network Address</span>
            </div>
            {tonAddress && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyAddress}
                className='p-1.5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white'
              >
                {copied ? <Check className='w-3.5 h-3.5 text-green-400' /> : <Copy className='w-3.5 h-3.5' />}
              </motion.button>
            )}
          </div>

          <div className='px-1'>
            {tonAddress ? (
              <p className='text-xs text-white font-mono tracking-tight break-all font-medium'>
                {formatAddress(tonAddress)}
              </p>
            ) : (
              <p className='text-[10px] text-gray-500 italic font-medium'>
                Wallet not connected. Connect to secure your rewards.
              </p>
            )}
          </div>

          {isSyncing && (
            <div className='mt-2 flex items-center gap-2 px-1'>
              <div className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse' />
              <span className='text-[8px] text-yellow-500 font-black uppercase tracking-widest'>Syncing with server...</span>
            </div>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3 mb-5 flex-shrink-0'>
        <div className='bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-transparent rounded-2xl p-4 border border-yellow-500/20 shadow-lg relative overflow-hidden group'>
          <div className='absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity'>
            <Coins className='w-12 h-12 text-yellow-500' />
          </div>
          <div className='flex items-center gap-2 mb-2'>
            <Coins className='w-4 h-4 text-yellow-400' />
            <p className='text-[9px] text-yellow-500/80 font-black uppercase tracking-[0.15em]'>Balance</p>
          </div>
          <p className='text-2xl font-black text-white leading-none tracking-tight'>{stats.coins.toLocaleString()}</p>
          <div className='flex items-center gap-1 mt-2'>
            <p className='text-[9px] text-gray-500 font-bold'>Pending claim:</p>
            <span className='text-[9px] text-green-400 font-black'>0.00</span>
          </div>
        </div>

        <div className='bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent rounded-2xl p-4 border border-purple-500/20 shadow-lg relative overflow-hidden group'>
          <div className='absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity'>
            <Zap className='w-12 h-12 text-purple-500' />
          </div>
          <div className='flex items-center gap-2 mb-2'>
            <TrendingUp className='w-4 h-4 text-purple-400' />
            <p className='text-[9px] text-purple-500/80 font-black uppercase tracking-[0.15em]'>Progress</p>
          </div>
          <p className='text-2xl font-black text-white leading-none tracking-tight'>{stats.xp.toLocaleString()}</p>
          <div className='flex items-center gap-1 mt-2'>
            <div className='w-full bg-gray-800 h-1 rounded-full overflow-hidden'>
              <div className='bg-purple-500 h-full w-[40%]' />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4 space-y-4">
        {/* Info Banner */}
        <div className='bg-blue-500/10 rounded-2xl p-3 border border-blue-500/20 flex gap-3 items-start'>
          <div className='bg-blue-500/20 p-2 rounded-xl'>
            <Info className='w-4 h-4 text-blue-400' />
          </div>
          <div>
            <h4 className='text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1'>TGE & Claim Info</h4>
            <p className='text-[9px] text-blue-300/70 leading-relaxed font-bold'>
              All coins earned are off-chain points. You can convert them to $LOOT tokens during the upcoming Token Generation Event. Connect your TON wallet to participate.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <Link href="/about" className='block'>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/5 cursor-pointer hover:bg-white/10 transition-all hover:border-white/20'
            >
              <div className='flex items-center gap-3'>
                <div className='bg-blue-500/10 p-2 rounded-xl'>
                  <Info className='w-4 h-4 text-blue-400' />
                </div>
                <p className='text-[11px] text-white font-black uppercase tracking-widest'>Whitepaper</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/about#whitepaper" className='block'>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/5 cursor-pointer hover:bg-white/10 transition-all hover:border-white/20'
            >
              <div className='flex items-center gap-3'>
                <div className='bg-purple-500/10 p-2 rounded-xl'>
                  <FileText className='w-4 h-4 text-purple-400' />
                </div>
                <p className='text-[11px] text-white font-black uppercase tracking-widest'>Ecosystem</p>
              </div>
            </motion.div>
          </Link>
        </div>

        <div>
          <div className='flex items-center justify-between mb-4 px-1'>
            <h2 className='text-xs font-black text-white uppercase tracking-[0.2em]'>Recent Activity</h2>
            <div className='px-2 py-0.5 bg-white/5 rounded-md'>
              <span className='text-[8px] text-gray-500 font-black uppercase'>{transactions.length} ITEMS</span>
            </div>
          </div>

          <div className='space-y-2'>
            <AnimatePresence mode='popLayout'>
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className='bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center justify-between group hover:bg-white/[0.07] transition-colors'
                >
                  <div className='flex items-center gap-4 flex-1 min-w-0'>
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${transaction.type === 'earned' || transaction.type === 'referral'
                      ? 'bg-green-500/10'
                      : 'bg-red-500/10'
                      }`}>
                      {transaction.type === 'referral' ? (
                        <TrendingUp className='w-4 h-4 text-green-400' />
                      ) : (
                        <Coins className={`w-4 h-4 ${transaction.type === 'earned'
                          ? 'text-green-400'
                          : 'text-red-400'
                          }`} />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-[11px] font-black text-white truncate leading-tight mb-1'>{transaction.description}</p>
                      <p className='text-[9px] text-gray-500 font-bold tracking-tight'>{transaction.timestamp}</p>
                    </div>
                  </div>
                  <div className='text-right flex-shrink-0 ml-3'>
                    <p className={`text-xs font-black ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                    </p>
                    <span className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter ${transaction.status === 'completed'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                      {transaction.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
