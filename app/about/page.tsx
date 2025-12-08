"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Info, FileText, Coins, Zap, Users, Trophy, Gift, TrendingUp, Download, ExternalLink, Check } from 'lucide-react'

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<'about' | 'whitepaper'>('about')

  const features = [
    {
      icon: <Zap className='w-6 h-6' />,
      title: 'Tap to Earn',
      description: 'Earn coins by simply tapping. The more you tap, the more you earn!'
    },
    {
      icon: <Coins className='w-6 h-6' />,
      title: 'Multiple Earning Ways',
      description: 'Complete tasks, claim daily rewards, and upgrade your earnings'
    },
    {
      icon: <Users className='w-6 h-6' />,
      title: 'Referral Program',
      description: 'Invite friends and earn 20% commission on their earnings'
    },
    {
      icon: <Trophy className='w-6 h-6' />,
      title: 'Leaderboard',
      description: 'Compete with players worldwide and climb the ranks'
    },
  ]

  return (
    <div className='min-h-screen pb-24 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-white mb-2'>About Lootory</h1>
        <p className='text-gray-300'>Learn about our tap-to-earn lottery game</p>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 mb-6 bg-gray-800/30 rounded-xl p-1'>
        <button
          onClick={() => setActiveSection('about')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            activeSection === 'about'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'text-gray-400'
          }`}
        >
          <Info className='w-4 h-4' />
          About
        </button>
        <button
          onClick={() => setActiveSection('whitepaper')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            activeSection === 'whitepaper'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'text-gray-400'
          }`}
        >
          <FileText className='w-4 h-4' />
          White Paper
        </button>
      </div>

      {/* About Section */}
      {activeSection === 'about' && (
        <div className='space-y-6'>
          {/* Hero Section */}
          <div className='bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-2xl p-6 border-2 border-purple-400/30 text-center'>
            <div className='mb-4'>
              <Image
                src="/logo.png"
                alt="Lootory Logo"
                width={120}
                height={120}
                className='mx-auto'
              />
            </div>
            <h2 className='text-2xl font-bold text-white mb-3'>Welcome to Lootory</h2>
            <p className='text-gray-300 leading-relaxed'>
              Lootory is a revolutionary tap-to-earn game built on blockchain technology. 
              Combine the excitement of lottery mechanics with the simplicity of tap-to-earn 
              gameplay. Earn coins, complete tasks, and compete with players worldwide!
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className='text-xl font-bold text-white mb-4'>Key Features</h3>
            <div className='grid grid-cols-1 gap-4'>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='bg-gray-800/30 rounded-xl p-5 border border-gray-700/50'
                >
                  <div className='flex items-start gap-4'>
                    <div className='bg-purple-500/30 p-3 rounded-lg text-purple-400'>
                      {feature.icon}
                    </div>
                    <div className='flex-1'>
                      <h4 className='text-lg font-bold text-white mb-2'>{feature.title}</h4>
                      <p className='text-gray-300 text-sm'>{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className='bg-blue-600/20 rounded-2xl p-5 border border-blue-400/30'>
            <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
              <TrendingUp className='w-5 h-5 text-blue-400' />
              How It Works
            </h3>
            <div className='space-y-4'>
              <div className='flex items-start gap-4'>
                <div className='bg-blue-500/30 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-400 font-bold'>1</span>
                </div>
                <div>
                  <h4 className='text-white font-semibold mb-1'>Start Tapping</h4>
                  <p className='text-sm text-gray-300'>
                    Tap the coin button to earn coins. Each tap consumes energy, which regenerates over time.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='bg-blue-500/30 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-400 font-bold'>2</span>
                </div>
                <div>
                  <h4 className='text-white font-semibold mb-1'>Complete Tasks</h4>
                  <p className='text-sm text-gray-300'>
                    Complete daily tasks and claim rewards to boost your earnings.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='bg-blue-500/30 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-400 font-bold'>3</span>
                </div>
                <div>
                  <h4 className='text-white font-semibold mb-1'>Upgrade & Boost</h4>
                  <p className='text-sm text-gray-300'>
                    Purchase upgrades to increase your coins per tap and unlock new features.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='bg-blue-500/30 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-400 font-bold'>4</span>
                </div>
                <div>
                  <h4 className='text-white font-semibold mb-1'>Invite & Earn</h4>
                  <p className='text-sm text-gray-300'>
                    Invite friends and earn 20% commission on all their earnings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl p-4 border border-purple-400/20 text-center'>
              <Users className='w-8 h-8 text-purple-400 mx-auto mb-2' />
              <p className='text-2xl font-bold text-white'>10K+</p>
              <p className='text-xs text-gray-300'>Active Players</p>
            </div>
            <div className='bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-xl p-4 border border-yellow-400/20 text-center'>
              <Coins className='w-8 h-8 text-yellow-400 mx-auto mb-2' />
              <p className='text-2xl font-bold text-white'>1M+</p>
              <p className='text-xs text-gray-300'>Coins Earned</p>
            </div>
          </div>
        </div>
      )}

      {/* White Paper Section */}
      {activeSection === 'whitepaper' && (
        <div className='space-y-6'>
          {/* Download Section */}
          <div className='bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-2xl p-6 border-2 border-purple-400/30 text-center'>
            <FileText className='w-16 h-16 text-purple-400 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-white mb-3'>Lootory White Paper</h2>
            <p className='text-gray-300 mb-6'>
              Download our comprehensive white paper to learn about the technical details, 
              tokenomics, and roadmap of Lootory.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-6 py-3 text-white font-bold flex items-center gap-2 mx-auto hover:shadow-lg hover:shadow-purple-500/50 transition-all'
            >
              <Download className='w-5 h-5' />
              Download PDF
            </motion.button>
          </div>

          {/* White Paper Content */}
          <div className='space-y-6'>
            {/* Overview */}
            <div className='bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50'>
              <h3 className='text-xl font-bold text-white mb-4'>1. Overview</h3>
              <div className='space-y-3 text-gray-300 text-sm leading-relaxed'>
                <p>
                  Lootory is a blockchain-based tap-to-earn game that combines the excitement 
                  of lottery mechanics with gamified earning opportunities. Built on Telegram 
                  Mini Apps, Lootory provides an accessible and engaging way for users to earn 
                  cryptocurrency through interactive gameplay.
                </p>
                <p>
                  Our mission is to democratize access to cryptocurrency earnings while providing 
                  an entertaining and rewarding gaming experience. Lootory leverages blockchain 
                  technology to ensure transparency, security, and fair distribution of rewards.
                </p>
              </div>
            </div>

            {/* Tokenomics */}
            <div className='bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50'>
              <h3 className='text-xl font-bold text-white mb-4'>2. Tokenomics</h3>
              <div className='space-y-4'>
                <div>
                  <h4 className='text-white font-semibold mb-2'>Token Distribution</h4>
                  <div className='space-y-2 text-sm text-gray-300'>
                    <div className='flex justify-between'>
                      <span>Player Rewards</span>
                      <span className='text-purple-400 font-bold'>60%</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Liquidity Pool</span>
                      <span className='text-purple-400 font-bold'>20%</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Team & Development</span>
                      <span className='text-purple-400 font-bold'>15%</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Marketing & Partnerships</span>
                      <span className='text-purple-400 font-bold'>5%</span>
                    </div>
                  </div>
                </div>
                <div className='pt-4 border-t border-gray-700'>
                  <h4 className='text-white font-semibold mb-2'>Earning Mechanisms</h4>
                  <ul className='space-y-2 text-sm text-gray-300'>
                    <li className='flex items-start gap-2'>
                      <span className='text-purple-400'>•</span>
                      <span>Tap-to-earn: Base earning through gameplay</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-purple-400'>•</span>
                      <span>Task completion: Bonus rewards for engagement</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-purple-400'>•</span>
                      <span>Referral program: 20% commission on referrals</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-purple-400'>•</span>
                      <span>Daily rewards: Consistent daily bonuses</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technology */}
            <div className='bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50'>
              <h3 className='text-xl font-bold text-white mb-4'>3. Technology</h3>
              <div className='space-y-3 text-gray-300 text-sm leading-relaxed'>
                <p>
                  <strong className='text-white'>Blockchain:</strong> Built on a secure and 
                  scalable blockchain network ensuring transparent and immutable transactions.
                </p>
                <p>
                  <strong className='text-white'>Smart Contracts:</strong> Automated reward 
                  distribution through audited smart contracts for security and fairness.
                </p>
                <p>
                  <strong className='text-white'>Telegram Integration:</strong> Seamless 
                  integration with Telegram Mini Apps for easy access and user-friendly experience.
                </p>
                <p>
                  <strong className='text-white'>Security:</strong> Multi-layer security 
                  measures including encryption, secure wallet integration, and regular audits.
                </p>
              </div>
            </div>

            {/* Roadmap */}
            <div className='bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50'>
              <h3 className='text-xl font-bold text-white mb-4'>4. Roadmap</h3>
              <div className='space-y-4'>
                <div className='flex items-start gap-4'>
                  <div className='bg-green-500/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0'>
                    <Check className='w-5 h-5 text-green-400' />
                  </div>
                  <div>
                    <h4 className='text-white font-semibold mb-1'>Phase 1: Launch (Q1 2024)</h4>
                    <p className='text-sm text-gray-300'>Core gameplay, tap-to-earn mechanics, basic upgrades</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='bg-yellow-500/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0'>
                    <span className='text-yellow-400 font-bold'>2</span>
                  </div>
                  <div>
                    <h4 className='text-white font-semibold mb-1'>Phase 2: Expansion (Q2 2024)</h4>
                    <p className='text-sm text-gray-300'>Advanced features, NFT integration, marketplace</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='bg-purple-500/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0'>
                    <span className='text-purple-400 font-bold'>3</span>
                  </div>
                  <div>
                    <h4 className='text-white font-semibold mb-1'>Phase 3: DeFi Integration (Q3 2024)</h4>
                    <p className='text-sm text-gray-300'>Staking, yield farming, cross-chain support</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='bg-blue-500/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0'>
                    <span className='text-blue-400 font-bold'>4</span>
                  </div>
                  <div>
                    <h4 className='text-white font-semibold mb-1'>Phase 4: Global Expansion (Q4 2024)</h4>
                    <p className='text-sm text-gray-300'>Multi-language support, partnerships, mobile app</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className='bg-blue-600/20 rounded-2xl p-5 border border-blue-400/30'>
              <h3 className='text-xl font-bold text-white mb-4'>5. Contact & Resources</h3>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center gap-3'>
                  <ExternalLink className='w-5 h-5 text-blue-400' />
                  <span className='text-gray-300'>Website: lootory.com</span>
                </div>
                <div className='flex items-center gap-3'>
                  <ExternalLink className='w-5 h-5 text-blue-400' />
                  <span className='text-gray-300'>Telegram: @lootory_official</span>
                </div>
                <div className='flex items-center gap-3'>
                  <ExternalLink className='w-5 h-5 text-blue-400' />
                  <span className='text-gray-300'>Twitter: @lootory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

