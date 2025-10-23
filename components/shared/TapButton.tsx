"use client";

import React from "react";
import { motion } from "framer-motion";

interface TapButtonProps {
  onTap: () => void;
}

const TapButton: React.FC<TapButtonProps> = ({ onTap }) => {
  return (
    <div className="flex justify-center my-10">
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold py-5 px-12 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
        onClick={onTap}
      >
        TAP TO EARN 💰
      </motion.button>
    </div>
  );
};

export default TapButton;
