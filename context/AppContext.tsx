"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserStats {
    coins: number;
    xp: number;
    level: number;
    energy: number;
    maxEnergy: number;
    tapPower: number;
}

export interface User {
    id?: string;
    username: string;
    telegramId?: string;
}

interface AppContextType {
    isInitialLoad: boolean;
    setIsInitialLoad: (value: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    stats: UserStats;
    setStats: React.Dispatch<React.SetStateAction<UserStats>>;
    isDataLoaded: boolean;
    setIsDataLoaded: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<UserStats>({
        coins: 0,
        xp: 0,
        level: 1,
        energy: 1000,
        maxEnergy: 1000,
        tapPower: 10
    });

    // Try to load cached stats from localStorage for instant display
    useEffect(() => {
        const cachedStats = localStorage.getItem('user_stats');
        const cachedUser = localStorage.getItem('user_data');
        if (cachedStats) {
            try {
                setStats(JSON.parse(cachedStats));
            } catch (e) {
                console.error('Failed to parse cached stats');
            }
        }
        if (cachedUser) {
            try {
                setUser(JSON.parse(cachedUser));
            } catch (e) {
                console.error('Failed to parse cached user');
            }
        }
    }, []);

    // Sync stats to localStorage whenever they change
    useEffect(() => {
        if (user) {
            localStorage.setItem('user_stats', JSON.stringify(stats));
            localStorage.setItem('user_data', JSON.stringify(user));
        }
    }, [stats, user]);

    return (
        <AppContext.Provider value={{
            isInitialLoad,
            setIsInitialLoad,
            user,
            setUser,
            stats,
            setStats,
            isDataLoaded,
            setIsDataLoaded
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
