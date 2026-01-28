const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

    const headers = {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "An error occurred");
        }

        return data;
    } catch (error: any) {
        console.error(`API Error calling ${endpoint}:`, error);
        throw error;
    }
};

export const loginWithTelegram = async (initData: string) => {
    const data = await apiRequest("/auth/telegram", {
        method: "POST",
        body: JSON.stringify({ initData }),
    });

    if (data.success && data.data.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
    }

    return data;
};

export const loginWithEmail = async (email: string, password: string) => {
    const data = await apiRequest("/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (data.success && data.data.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
    }

    return data;
};

export const updateUserStats = async (stats: {
    coins?: number;
    xp?: number;
    level?: number;
    energy?: number
}) => {
    return apiRequest("/auth/stats", {
        method: "PATCH",
        body: JSON.stringify(stats),
    });
};
export const getReferrals = async () => {
    return apiRequest("/auth/referrals");
};
