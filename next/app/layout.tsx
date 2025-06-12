import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Punta de Flecha",
    description: "Sitio web de gestion escolar",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (    
        <html lang="es">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh`}
            >
                {children}
            </body>
        </html>
    );
}
