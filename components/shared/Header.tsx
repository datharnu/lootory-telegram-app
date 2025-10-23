"use client";

import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="App Logo"
          className="w-20"
        />

      </div>
    </header>
  );
};

export default Header;
