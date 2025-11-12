import React from 'react'
import HomePageIcon from '../icons/Home Page';
import TaskIcon from '../icons/task';
import Link from 'next/link';
import { nav } from 'framer-motion/client';
import UserIcon from '../icons/user';
import WalletIcon from '../icons/wallet';
import InviteIcon from '../icons/invite';

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
          icon: <TaskIcon/>
    },
    {
        id: 3,
        name: "Invite",
        href: "/leaderboard",
        icon: <InviteIcon/>
    },
    {
        id: 4,
        name: "Friends",
        href: "/friends",
        icon: <UserIcon/>
    },
    {
        id: 5,
        name: "Wallet",
        href: "/wallet",
        icon: <WalletIcon/>
    }
  ]
export default function BottomNav() {
  return (
<nav className='fixed bottom-0 left-0 right-0'>
<div className='bg-[#460A73] flex justify-between items-center p-4'>
        {BottomNavData.map((item) => (
            <div key={item.id}>
              {item.icon}
              <p className='text-white text-xs'>{item.name}</p>
            </div>
        ))}
    </div>
</nav>
  )
}
