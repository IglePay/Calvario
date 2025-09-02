import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata = {
    title: "IglePay",
    description: "Sistema de gestión para iglesias",
    manifest: "/manifest.json",
    icons: {
        apple: "/icon.png",
    },
    themeColor: "#000000",
    viewport: {
        width: "device-width",
        initialScale: 1,
        minimumScale: 1,
        userScalable: false,
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    )
}
