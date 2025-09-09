"use client"

import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-rose-100 via-white to-cyan-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-6">
            {/* Logo */}
            <div className="flex items-center justify-center w-40 h-40 rounded-full border-4 border-rose-500 shadow-md bg-white dark:bg-transparent mb-6">
                <Image
                    src="/images/iglepay.png"
                    alt="Logo"
                    width={90}
                    height={90}
                    priority
                />
            </div>

            <h1 className="text-6xl font-bold text-rose-500 mb-4">404</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Página no encontrada
            </p>

            <Link
                href="/"
                className="rounded-2xl bg-rose-500 px-6 py-3 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                Volver al inicio
            </Link>
        </div>
    )
}
