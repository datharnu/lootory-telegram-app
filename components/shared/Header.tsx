"use client";
import React from "react";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header className={`flex justify-between fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md py-4 px-6 items-center bg-[#4B0481]/80 backdrop-blur-md z-50 ${className}`}>
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Lotoory Logo"
          className="w-20"
        />
      </div>
    </header>
  );
};

export default Header;
