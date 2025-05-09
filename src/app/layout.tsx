import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Provider from '@/lib/provider';



const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Port Monitor',
    description: 'Port environmental monitoring system',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Provider>{children}</Provider>
                
            </body>
        </html>
    );
}
