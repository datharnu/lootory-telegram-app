"use client";

import React from "react";

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  return (
    <div className="text-center mt-4">
      <p className="text-gray-300 text-sm">Your Balance</p>
      <h2 className="text-2xl font-bold text-yellow-400">{balance.toLocaleString()} pts</h2>
    </div>
  );
};

export default BalanceDisplay;
