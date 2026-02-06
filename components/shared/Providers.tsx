'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AppProvider } from "@/context/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TonConnectUIProvider manifestUrl="https://lotoory.dev/tonconnect-manifest.json">
            <AppProvider>
                {children}
            </AppProvider>
        </TonConnectUIProvider>
    );
}
