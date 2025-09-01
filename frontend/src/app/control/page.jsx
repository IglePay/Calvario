"use client"

import Link from "next/link"

const Control = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100 p-4">
            <h2 className="font-bold text-3xl text-rose-400 mb-8">
                Control System Iglepay
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Card Miembro */}
                <Link
                    href="control/login/"
                    className="bg-white rounded-xl shadow-lg p-8 w-64 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200">
                    <i className="fa-solid fa-users mb-4 text-6xl text-green-600"></i>
                    <h3 className="text-xl font-semibold">Miembro</h3>
                </Link>

                {/* Card Pastor */}
                <Link
                    href="control/login/"
                    className="bg-white rounded-xl shadow-lg p-8 w-64 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200">
                    <i className="fa-solid fa-user-tie mb-4 text-6xl text-blue-700"></i>
                    <h3 className="text-xl font-semibold">Pastor</h3>
                </Link>
                {/* admin */}
                <Link
                    href="control/login/"
                    className="bg-white rounded-xl shadow-lg p-8 w-64 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200">
                    <i className="fa-solid fa-user-secret mb-4 text-6xl text-gray-950"></i>
                    <h3 className="text-xl font-semibold">Admin</h3>
                </Link>
            </div>
        </div>
    )
}

export default Control
