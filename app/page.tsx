"use client";
import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

import { Boost } from '@/components/icons/Boost'

import BottomNav from '@/components/shared/BottomNav'
import { motion } from 'framer-motion'



export default function TelegramMiniApp() {

  const Features = [
    {
      icon: "/DailyTask.png",
      title: 'Daily Reward',
      data: "500"
    },
    {
      icon: "/Trophy.png",
      title: 'Leaderboard',
      data: "1000"
    },
    {
      icon: "/Boost.png",
      title: 'Boost',
      data: "1000"
    },
  ]
  return (
    <div className=''>
    {/* header */}
    <div className='flex justify-between items-center bg-[#4B0481]/57 p-6'>
      <Image src="/logo.png" alt="logo" width={100} height={100} />

    <X className='w-6 h-6' />

    </div>
    {/* balance display */}
<section className='p-6'>
<div className='flex items-center gap-3'>
      <Image src="/avatar.jpg" alt="logo" width={100} height={100} className='rounded-full w-14 h-14 object-cover' />
      <div>
        <h2 className='text-xl font-bold'>Earnest</h2>
      </div>
    </div>

<div className='flex items-center justify-between'>
  {Features.map((feature) => (
    <div key={feature.title} className='my-14 flex-col gap-5'>
<h1 className='text-2xl font-bold mb-2 '>{feature.data}</h1>
   <div className='flex flex-col'>
    <Image src={feature.icon} alt="pts" width={100} height={100} className='w-16 h-14 object-contain' />
    
    {/* {feature.icon} */}
    <p className='text-sm text-gray-300'>{feature.title}</p>
   </div>

    </div>
  ))}

</div>

{/* The Tap button */}
<div className='flex justify-center my-10'>
  <motion.button
    whileTap={{ scale: 0.9 }}
    className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 shadow-lg hover:shadow-xl active:scale-95 transition-all"
    aria-label="Tap"
  >
    <span className="flex items-center justify-center rounded-full bg-white">
      <Image src="/Tap.png" alt="tap" width={100} height={100} className="w-40 h-40 object-contain" />
    </span>
  </motion.button>
</div>
</section>
<BottomNav/>
    </div>
  )
}
