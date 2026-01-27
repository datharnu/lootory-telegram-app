"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Lotoory is loading..." }) => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1c0130]">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-600/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: [0.8, 1.1, 1],
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut"
                    }}
                    className="relative mb-8"
                >
                    {/* Logo with Outer Glow */}
                    <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full scale-150 animate-pulse" />
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Image
                            src="/logo.png"
                            alt="Lotoory Logo"
                            width={120}
                            height={120}
                            className="object-contain relative z-20 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                            priority
                        />
                    </motion.div>
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-center"
                >
                    <p className="text-white text-lg font-black italic tracking-tighter uppercase mb-2">
                        {message}
                    </p>
                    <div className="flex gap-1 justify-center">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                                className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Version Tag or Status */}
            <div className="absolute bottom-10 left-0 right-0 text-center opacity-30">
                <p className="text-[10px] text-white font-black tracking-[0.3em] uppercase">
                    Initializing Secure Session
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;
