"use client";

import React from "react";

interface BottomNavProps {
  onNavigate: (section: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onNavigate }) => {
  return (
    <nav className="flex justify-around bg-gray-900 text-white py-3 rounded-t-2xl">
      <button onClick={() => onNavigate("tasks")}>🎯 Tasks</button>
      <button onClick={() => onNavigate("boosters")}>🚀 Boosters</button>
      <button onClick={() => onNavigate("about")}>📘 About</button>
    </nav>
  );
};

export default BottomNav;
