"use client"

import Link from "next/link"
import Image from "next/image"

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-rose-100 via-white to-cyan-100  dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-6">
            {/* Logo dentro de círculo */}
            <div className="flex items-center justify-center w-40 h-40 rounded-full border-4 border-rose-500 shadow-md bg-white dark:bg-transparent mb-6">
                <Image
                    src="/images/iglepay.png"
                    alt="Logo Calvario"
                    width={90}
                    height={90}
                    className="object-contain"
                    priority
                />
            </div>
            {/* Título */}
            <h2 className="font-bold text-3xl text-rose-500 mb-10 text-center select-none">
                Control System Iglepay
            </h2>
            {/* Cards de roles */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Card Miembro */}
                <Link
                    href="./login?role=miembro"
                    className="bg-white dark:bg-base-100  rounded-2xl shadow-lg p-8 w-64 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 border border-cyan-600">
                    <i className="fa-solid fa-users mb-4 text-6xl text-cyan-600 "></i>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 select-none">
                        Miembro
                    </h3>
                </Link>

                {/* Card Pastor */}
                <Link
                    href="./login?role=pastor"
                    className="bg-white dark:bg-base-100 rounded-2xl shadow-lg p-8 w-64 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 border border-rose-500">
                    <i className="fa-solid fa-user-tie mb-4 text-6xl text-rose-600"></i>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 select-none">
                        Pastor
                    </h3>
                </Link>

                {/* Card Admin */}
                <Link
                    href="./login?role=admin"
                    className="bg-white dark:bg-base-100 rounded-2xl shadow-lg p-8 w-64 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 border border-gray-400">
                    <i className="fa-solid fa-user-shield mb-4 text-6xl text-gray-700 dark:text-gray-200"></i>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 select-none">
                        Admin
                    </h3>
                </Link>
            </div>
        </div>
    )
}

export default Home
