"use client";
import React, { useState, useEffect } from 'react';
import { Zap, Trophy, Users, FileText, Twitter, Send, Instagram, Mail, MessageCircle, Coins, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TelegramMiniApp() {
  const [activeTab, setActiveTab] = useState('tap');
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const [maxEnergy] = useState(1000);
  const [tapMultiplier, setTapMultiplier] = useState(1);
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [tapAnimation, setTapAnimation] = useState<Array<{id: number, x: number, y: number, points: number}>>([]);
  const [floatingCoins, setFloatingCoins] = useState<Array<{id: number, left: number, delay: number, duration: number}>>([]);
  const [combo, setCombo] = useState(0);

  // Generate floating coins animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingCoins(prev => [
        ...prev.slice(-8),
        {
          id: Date.now(),
          left: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 2
        }
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Simulate passive income
  useEffect(() => {
    if (passiveIncome > 0) {
      const interval = setInterval(() => {
        setPoints(prev => prev + passiveIncome);
      }, 3600000);
      return () => clearInterval(interval);
    }
  }, [passiveIncome]);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(prev + 1, maxEnergy));
    }, 1000);
    return () => clearInterval(interval);
  }, [maxEnergy]);

  // Combo reset
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCombo(0);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [combo]);

  const handleTap = (e: { currentTarget: { getBoundingClientRect: () => any; }; clientX: number; clientY: number; }) => {
    if (energy >= 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const earnedPoints = 1 * tapMultiplier;
      setPoints(prev => prev + earnedPoints);
      setEnergy(prev => prev - 1);
      setCombo(prev => prev + 1);
      
      setTapAnimation(prev => [...prev, { id: Date.now(), x, y, points: earnedPoints }]);
      setTimeout(() => {
        setTapAnimation(prev => prev.slice(1));
      }, 1000);
    }
  };

  const tasks = [
    { id: 1, title: 'Follow on Twitter', icon: <Twitter size={20} />, reward: 500, url: 'https://twitter.com', completed: false },
    { id: 2, title: 'Join Telegram Group', icon: <Send size={20} />, reward: 300, url: 'https://t.me', completed: false },
    { id: 3, title: 'Follow on Instagram', icon: <Instagram size={20} />, reward: 400, url: 'https://instagram.com', completed: false },
    { id: 4, title: 'Join Discord', icon: <MessageCircle size={20} />, reward: 500, url: 'https://discord.com', completed: false },
    { id: 5, title: 'Join Waitlist', icon: <Mail size={20} />, reward: 1000, url: '#', completed: false },
  ];

  const boosters = [
    { id: 1, name: '2x Tap Boost', multiplier: 2, cost: 5000, type: 'free', owned: false },
    { id: 2, name: '4x Tap Boost', multiplier: 4, cost: 25000, type: 'paid', owned: false },
    { id: 3, name: '10x Tap Boost', multiplier: 10, cost: 100000, type: 'paid', owned: false },
    { id: 4, name: 'Passive Income Lvl 1', income: 10, cost: 0, type: 'free', owned: false },
    { id: 5, name: 'Passive Income Lvl 2', income: 50, cost: 15000, type: 'paid', owned: false },
    { id: 6, name: 'Passive Income Lvl 3', income: 200, cost: 50000, type: 'paid', owned: false },
  ];

  const team = [
    { name: 'Ernests Rajeckis', role: 'Founder & CEO', social: 'https://twitter.com' },
  ];

  const buyBooster = (booster: { id: number; name: string; multiplier: number; cost: number; type: string; owned: boolean; income?: undefined; } | { id: number; name: string; income: number; cost: number; type: string; owned: boolean; multiplier?: undefined; }) => {
    if (points >= booster.cost) {
      setPoints(prev => prev - booster.cost);
      if (booster.multiplier) {
        setTapMultiplier(booster.multiplier);
      }
      if (booster.income) {
        setPassiveIncome(prev => prev + booster.income);
      }
    }
  };

  const TapTab = () => (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 flex flex-col items-center justify-between text-white p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
            <div className="w-full flex justify-between items-center mb-4 z-10 p-5">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">Lootory</h1>
        <div className="text-sm text-purple-300">Lv. 3 • 10,888 pts</div>
      </div>

        {/* Floating coins */}
        {floatingCoins.map(coin => (
          <div
            key={coin.id}
            className="absolute bottom-0 text-yellow-400/40"
            style={{
              left: `${coin.left}%`,
              animation: `floatUp ${coin.duration}s ease-out forwards`,
              animationDelay: `${coin.delay}s`
            }}
          >
            <Coins size={24} />
          </div>
        ))}

        {/* Sparkles */}
        <div className="absolute top-1/4 left-1/4 animate-twinkle">
          <Sparkles className="text-yellow-300/60" size={20} />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-twinkle" style={{ animationDelay: '1.5s' }}>
          <Star className="text-purple-300/60" size={16} />
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-twinkle" style={{ animationDelay: '0.7s' }}>
          <Sparkles className="text-blue-300/60" size={18} />
        </div>
      </div>

      {/* Score display with 3D effect */}
      <div className="relative z-10 text-center mb-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 blur-2xl opacity-50" />
          <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 text-transparent bg-clip-text">
            <div className="text-7xl font-black tracking-tight" style={{ textShadow: '0 4px 12px rgba(251, 191, 36, 0.3)' }}>
              {points.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-purple-200 text-lg font-semibold mt-2 flex items-center justify-center gap-2">
          <Coins className="text-yellow-400" size={20} />
          Tokens
        </div>
      </div>

      {/* Combo counter */}
      {combo > 5 && (
        <div className="absolute top-32 right-8 z-20 animate-bounce">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-2xl">
            🔥 {combo}x COMBO!
          </div>
        </div>
      )}

      {/* Main tap button with 3D effect */}
{/* Main tap button with 3D effect */}
<div className="relative mb-8 z-10 bg-purple-900/40 border border-purple-700/40 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.3)] w-full max-w-sm backdrop-blur-lg">
  <div className="flex flex-col items-center p-6 space-y-6">
    {/* Pulsing circular frame */}
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
    >
      <div className="absolute w-52 h-52 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 blur-2xl opacity-50 animate-pulse" />
      <div 
        className="relative w-44 h-44 rounded-full border-4 border-purple-400 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.8)] bg-gradient-to-b from-purple-950 via-purple-800 to-black overflow-hidden cursor-pointer"
        onClick={handleTap}
      >
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.1, 1],
            rotateY: [0, 10, 0, -10, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          {/* 3D Egg */}
          <div className="relative w-32 h-40" style={{ transformStyle: 'preserve-3d' }}>
            {/* Egg glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 blur-2xl opacity-60 animate-pulse" 
                 style={{ transform: 'translateZ(-20px)' }} />
            
            {/* Main egg body */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-purple-300 via-purple-400 to-purple-600 rounded-[50%] shadow-2xl"
              style={{
                transform: 'translateZ(10px)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                boxShadow: '0 20px 60px rgba(168, 85, 247, 0.6), inset 0 -10px 30px rgba(0, 0, 0, 0.3), inset 0 10px 30px rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Shine effect on egg */}
              <div 
                className="absolute top-8 left-8 w-16 h-20 bg-gradient-to-br from-white/60 via-white/30 to-transparent rounded-[50%] blur-sm"
                style={{
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                }}
              />
              
              {/* Sparkle effects */}
              <div className="absolute top-6 right-8 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
              <div className="absolute bottom-12 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" 
                   style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 right-6 w-2 h-2 bg-pink-300 rounded-full animate-pulse" 
                   style={{ animationDelay: '1s' }} />
            </div>

            {/* Egg highlight rim */}
            <div 
              className="absolute inset-0 rounded-[50%] border-2 border-white/30"
              style={{
                transform: 'translateZ(11px)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
              }}
            />

            {/* Center icon/symbol on egg */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: 'translateZ(15px)' }}
            >
              <Zap size={48} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        {/* Tap animations */}
        {tapAnimation.map(anim => (
          <div
            key={anim.id}
            className="absolute text-yellow-300 font-black text-3xl animate-float pointer-events-none z-20"
            style={{ 
              left: anim.x, 
              top: anim.y,
              textShadow: '0 0 10px rgba(253, 224, 71, 0.8), 0 0 20px rgba(253, 224, 71, 0.5)'
            }}
          >
            +{anim.points}
          </div>
        ))}
      </div>
    </motion.div>

    {/* Tap instruction text */}
    <div className="text-purple-200 text-sm font-medium">
      Tap the egg to collect tokens!
    </div>

    {/* Multiplier badge */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-lg font-semibold px-12 py-6 rounded-full shadow-[0_0_25px_rgba(147,51,234,0.6)]">
              Tap!
            </button>
          </motion.div>

    {/* XP Progress */}
    <div className="w-full flex flex-col items-center">
      <p className="text-xs text-purple-300 mb-1">Energy Level</p>
      <div className="w-full bg-purple-950/50 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300"
          style={{ width: `${(energy / maxEnergy) * 100}%` }}
        />
      </div>
    </div>
  </div>
</div>

      {/* Energy bar with 3D design */}
      {/* <div className="w-full max-w-md px-6 mt-12 z-10">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/30 shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-semibold flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              Energy
            </span>
            <span className="text-purple-300 font-bold">{energy}/{maxEnergy}</span>
          </div>
          <div className="relative w-full bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800" />
            <div 
              className="relative h-full bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-500 transition-all duration-300 shadow-lg"
              style={{ 
                width: `${(energy / maxEnergy) * 100}%`,
                boxShadow: '0 0 20px rgba(52, 211, 153, 0.5)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Passive income display */}
      {passiveIncome > 0 && (
        <div className="mt-6 z-10">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 text-green-300 px-6 py-3 rounded-full font-semibold text-sm shadow-xl flex items-center gap-2">
            <Sparkles size={16} className="animate-pulse" />
            Earning +{passiveIncome} tokens/hour
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );

  const TasksTab = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 p-6">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Complete Tasks</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/15 transition-all border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  {task.icon}
                </div>
                <div>
                  <div className="text-white font-semibold">{task.title}</div>
                  <div className="text-yellow-400 text-sm flex items-center gap-1">
                    <Coins size={14} />
                    +{task.reward} points
                  </div>
                </div>
              </div>
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                Start
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const BoostTab = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 p-6">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Boosters</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        {boosters.map(booster => (
          <div key={booster.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-white font-semibold">{booster.name}</div>
                <div className="text-purple-300 text-sm">
                  {booster.multiplier && `${booster.multiplier}x tap power`}
                  {booster.income && `+${booster.income} tokens/hour`}
                </div>
              </div>
              <button
                onClick={() => buyBooster(booster)}
                disabled={points < booster.cost}
                className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg ${
                  points >= booster.cost
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {booster.cost === 0 ? 'Free' : `${booster.cost.toLocaleString()} pts`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AboutTab = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 p-6">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">About Project</h2>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-purple-200">
            Building the future of Web3 gaming with innovative tap-to-earn mechanics and community-driven rewards.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Leadership Team</h3>
          {team.map((member, idx) => (
            <div key={idx} className="flex items-center justify-between py-3">
              <div>
                <div className="text-white font-semibold">{member.name}</div>
                <div className="text-purple-300 text-sm">{member.role}</div>
              </div>
              <a href={member.social} target="_blank" rel="noopener noreferrer">
                <Twitter className="text-purple-400 hover:text-purple-300" size={20} />
              </a>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
          <a
            href="#"
            className="flex items-center justify-between text-white hover:text-purple-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={24} />
              <span className="font-semibold">Read Whitepaper</span>
            </div>
            <span className="text-purple-400">→</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {activeTab === 'tap' && <TapTab />}
      {activeTab === 'tasks' && <TasksTab />}
      {activeTab === 'boost' && <BoostTab />}
      {activeTab === 'about' && <AboutTab />}

      <nav className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-purple-500/30">
        <div className="flex justify-around items-center max-w-2xl mx-auto">
          {[
            { id: 'tap', icon: Zap, label: 'Tap' },
            { id: 'tasks', icon: Trophy, label: 'Tasks' },
            { id: 'boost', icon: Users, label: 'Boost' },
            { id: 'about', icon: FileText, label: 'About' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-6 transition-all ${
                activeTab === tab.id ? 'text-purple-400' : 'text-gray-400'
              }`}
            >
              <tab.icon size={24} />
              <span className="text-xs mt-1 font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}