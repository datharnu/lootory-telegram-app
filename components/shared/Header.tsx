"use client";

import { X } from "lucide-react";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className=" flex justify-between py-4 px-6 items-center bg-[#4B0481]/57 '">
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="App Logo"
          className="w-20"
        />

      </div>
      <X className='w-6 h-6' />
    </header>
  );
};

export default Header;
