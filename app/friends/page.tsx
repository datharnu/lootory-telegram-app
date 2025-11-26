import React from 'react'
import Image from 'next/image'
export default function page() {
  return (
    <div className='p-6'>
        <div className='flex flex-col  gap-5'>
<div className='flex items-center gap-3'>
      <Image src="/avatar.jpg" alt="logo" width={100} height={100} className='rounded-full w-10 h-10 object-cover' />
      <div>
        <h2 className='text-xl font-bold'>Earnest</h2>
      </div>
    </div>
<div className='space-y-2'>
<p>Level 3</p>
    <Image src="/progress.svg" alt="logo" width={100} height={100} className='rounded-full  object-cover' />

</div>
</div>

<section className='flex justify-center my-7'>
<button className='bg-[#FBBC05] text-white font-bold text-2xl py-4 px-10 rounded-full'>
    LEADERBOARD
</button>
</section>
    </div>
  )
}
