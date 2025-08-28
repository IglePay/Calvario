"use client"
import Image from "next/image"
import { useState } from "react"

export default function Sidebar({ isOpen, onClose, navigation }) {
    const { menuItems, activeSection, handleNavigation } = navigation

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/75 z-40 lg:hidden"
                    onClick={onClose}></div>
            )}

            <div
                className={`bg-blue-600 text-white w-64 flex-shrink-0 fixed lg:relative h-full z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}>
                {/* Header */}
                <div className="p-4 border-b border-blue-500 flex items-center justify-center">
                    <Image
                        src="/images/48484.webp"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                    <button
                        onClick={onClose}
                        className="lg:hidden text-white hover:text-gray-200">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-4 flex-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                handleNavigation(item.id)
                                onClose()
                            }}
                            className={`w-full flex items-center px-4 py-3 text-sm hover:bg-blue-700 transition-colors text-left ${
                                activeSection === item.id
                                    ? "bg-blue-700 border-r-4 border-white"
                                    : ""
                            }`}>
                            <i className={`${item.icon} w-5 mr-3`}></i>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Settings and Logout */}
                <div className="border-t border-blue-500">
                    <a
                        href="#"
                        className="flex items-center px-4 py-3 text-sm hover:bg-blue-700 transition-colors">
                        <i className="fas fa-cog w-5 mr-3"></i>
                        Ajustes
                    </a>
                    <a
                        href="#"
                        className="flex items-center px-4 py-3 text-sm hover:bg-blue-700 transition-colors">
                        <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                        Cerrar sesión
                    </a>
                </div>
            </div>
        </>
    )
}
