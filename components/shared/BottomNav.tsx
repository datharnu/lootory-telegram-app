import React from 'react'
import HomePageIcon from '../icons/Home Page';
import TaskIcon from '../icons/task';
import Link from 'next/link';
import { nav } from 'framer-motion/client';
import UserIcon from '../icons/user';
import WalletIcon from '../icons/wallet';
import InviteIcon from '../icons/invite';
import LogoIcon from '../icons/Logo';

interface NavProps {
  id: number;
  name: string;
  icon?: React.ReactNode;
  href: string;
}

const BottomNavData: NavProps[] = [
  {
    id: 1,
    name: "Home",
    href: "/",
    icon: <HomePageIcon />
  },
  {
    id: 2,
    name: "Tasks",
    href: "/tasks",
    icon: <TaskIcon />
  },
  {
    id: 3,
    name: "Invite",
    href: "/invite",
    icon: <LogoIcon />
  },
  {
    id: 4,
    name: "Friends",
    href: "/friends",
    icon: <UserIcon />
  },
  {
    id: 5,
    name: "Wallet",
    href: "/wallet",
    icon: <WalletIcon />
  }
]
export default function BottomNav() {
  return (
    <nav className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50'>
      <div className='bg-[#460A73] flex justify-between items-center p-4'>
        {BottomNavData.map((item) => (
          <Link key={item.id} href={item.href} className={item.id === 3 ? 'flex flex-col items-center -mt-8 relative' : 'flex flex-col items-center'}>

            <div className={item.id === 3 ? 'bg-[#6A00BB] border-7 border-[#460A73] rounded-full p-3 shadow-lg relative z-10' : ''}>
              {item.icon}
            </div>
            <p className={`text-xs ${item.id === 3 ? 'bg-[#6A00BB] backdrop-blur-md border border-white/10 uppercase px-2 py-1 rounded-full mt-1 font-medium ' : 'text-white'}`}>{item.name}</p>
          </Link>
        ))}
      </div>
    </nav>
  )
}
