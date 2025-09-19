import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Googleanalytics from "@/components/Googleanalytics"
import { ThemeProvider } from "@/hooks/themeContext"

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
}

export const viewport = {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    userScalable: false,
    themeColor: "#000000",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Googleanalytics />
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    )
}
