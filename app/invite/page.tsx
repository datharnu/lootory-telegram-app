import React from 'react'
import Image from 'next/image'
export default function page() {
  return (
    <div className='p-6 '>
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
        <section className='flex flex-col justify-center items-center'>
            <Image src="/invite.svg" alt="logo" width={100} height={100} className=' w-[220px] h-full object-cover' />
   <div className='mb-4'>
   <p className='text-center text-white text-[25px] font-bold'>
            Send free gifts to your friends and <span className='text-[#D2F10C]'>earn 20%</span> of your friends profit
    </p>
   </div>
   {/* Invite Now Button */}
<div className='flex items-center'>
<button className='bg-[#5553D6] text-white font-bold text-2xl py-4 px-10 rounded-2xl'>
    INVITE NOW
</button>
<Image src="/Copy.svg" alt="logo" width={100} height={100} className=' w-[60px] h-full object-cover' />
</div>
        </section>
    </div>
  )
}
