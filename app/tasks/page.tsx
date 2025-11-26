import React from 'react'
import Image from 'next/image'
export default function page() {

  const tasks = [
    {
      title: 'Follow Lottory',
      
      image: '/X.svg',
    },
    {
      title: 'Follow Founder',
    
      image: '/X.svg',
    },
    {
      title: 'Follow Co-Founder',
   
      image: '/X.svg',
    },
    {
      title: 'Subscribe to Youtube',

      image: '/YouTube.svg',
    },
    {
      title: 'Follow Linkedin',
 
      image: '/LinkedIn.svg',
    },
    {
      title: 'Follow on Medium',
     
      image: '/X.svg',
    },

  ]

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>
        Task
      </h1>
      <section className='mt-5 space-y-4'>
        {tasks.map((task, index) => (
          <div key={index} className='flex items-center gap-2 bg-[#D9D9D9] p-4 rounded-2xl'>
            <Image src={task.image} alt={task.title} width={100} height={100} className='rounded-full w-14 h-10  object-cover' />
            <p className='text-xl font-medium text-[#460A73]'>{task.title}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
