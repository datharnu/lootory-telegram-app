"use client";
import React from 'react'
import Image from 'next/image'




import BottomNav from '@/components/shared/BottomNav'
import { motion } from 'framer-motion'
import RewardIcon from '@/components/icons/new-reward';
import CupIcon from '@/components/icons/reward cup';
import BoostIcon from '@/components/icons/task-new';




export default function TelegramMiniApp() {

  const Features = [
    {
      icon: <RewardIcon/>,
      title: 'Daily Reward',
      data: "500"
    },
    {
      icon: <CupIcon/>,
      title: 'Leaderboard',
      data: "1000"
    },
    {
      icon: <BoostIcon/>,
      title: 'Boost',
      data: "1000"
    },
  ]
  return (
    <div className=''>
    {/* header */}

    {/* balance display */}
<section className='p-6'>
<div className='flex flex-col  gap-5'>
<div className='flex items-center gap-3'>
      <Image src="/avatar.jpg" alt="logo" width={100} height={100} className='rounded-full w-10 h-10 object-cover' />
      <div>
        <h2 className='text-xl font-bold text-white'>Earnest</h2>
      </div>
    </div>
<div className='space-y-2'>
<p className='text-white'>Level 3</p>
    <Image src="/progress.svg" alt="logo" width={100} height={100} className='rounded-full  object-cover' />

</div>
</div>

<div className='flex  items-center justify-between'>
  {Features.map((feature) => (
    <div key={feature.title} className='my-14 flex-col space-y-2'>

<h1 className='text-2xl font-bold mb-2 text-center text-white '>{feature.data}</h1>

   <div className='flex flex-col items-center gap-1'>
    {feature.icon}
    <div>
<p className='text-sm text-gray-300 text'>{feature.title}</p>
</div>
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

    </div>
  )
}
