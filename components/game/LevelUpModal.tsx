"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface LevelUpModalProps {
    isOpen: boolean;
    level: number;
    onClose: () => void;
}

export default function LevelUpModal({ isOpen, level, onClose }: LevelUpModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 100 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 100 }}
                        className="relative w-full max-w-sm bg-gradient-to-b from-purple-600/20 to-black border border-purple-500/30 rounded-[2.5rem] p-8 text-center overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]"
                    >
                        {/* Background Decorative Elements */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full -z-10" />

                        {/* Animated Particles/Stars */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-yellow-400"
                                    initial={{
                                        x: Math.random() * 300 - 150,
                                        y: Math.random() * 400 - 200,
                                        scale: 0,
                                        opacity: 0
                                    }}
                                    animate={{
                                        y: [null, -20, 20],
                                        scale: [0, 1, 0.5],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.4
                                    }}
                                >
                                    <Star size={12} fill="currentColor" />
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ rotate: -10, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="relative mb-6 inline-block"
                        >
                            <div className="bg-gradient-to-tr from-yellow-400 to-orange-500 p-6 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                                <Trophy size={64} className="text-white" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-2 -right-2 bg-purple-500 p-2 rounded-full border-2 border-white"
                            >
                                <Sparkles size={16} className="text-white" />
                            </motion.div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-black text-white mb-2 tracking-tight"
                        >
                            LEVEL UP!
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-purple-300 font-medium mb-8"
                        >
                            You've reached New Height
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative group"
                        >
                            <div className="text-xs text-purple-400 uppercase tracking-widest font-bold mb-1">New Rank</div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent italic">
                                Level {level}
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 group transition-all hover:shadow-[0_10px_30px_rgba(168,85,247,0.5)]"
                        >
                            AWESOME! <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
