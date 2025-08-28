"use client"
import Image from "next/image"
import { useState } from "react"

export default function Sidebar({ isOpen, onClose, navigation }) {
    const { menuItems, activeSection, handleNavigation } = navigation
    const [openMenu, setOpenMenu] = useState(null)

    const toggleSubmenu = (id) => {
        setOpenMenu(openMenu === id ? null : id)
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/75 z-40 lg:hidden"
                    onClick={onClose}></div>
            )}

            <div
                className={`bg-blue-600 text-white w-64 flex-shrink-0 fixed lg:relative h-auto z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}>
                {/* Header */}
                <div className="p-4 border-b border-blue-500 flex items-center justify-center">
                    <Image
                        src="/images/iglepay.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="rounded-full"
                        priority
                    />
                    <button
                        onClick={onClose}
                        className="lg:hidden text-white hover:text-gray-200">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-1 flex-1 bg-blue-600">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            <button
                                onClick={() => {
                                    if (item.children) {
                                        toggleSubmenu(item.id)
                                    } else {
                                        handleNavigation(item)
                                        onClose()
                                    }
                                }}
                                className={`w-full flex items-center px-4 py-3 text-sm hover:bg-blue-700 transition-colors text-left ${
                                    activeSection === item.id
                                        ? "bg-blue-700 border-r-4 border-white"
                                        : ""
                                }`}>
                                <i className={`${item.icon} w-5 mr-3`}></i>
                                {item.label}
                                {item.children && (
                                    <i
                                        className={`ml-auto fas ${
                                            openMenu === item.id
                                                ? "fa-chevron-up"
                                                : "fa-chevron-down"
                                        }`}
                                    />
                                )}
                            </button>

                            {/* Render Submenu */}
                            {item.children && openMenu === item.id && (
                                <div className="ml-8 mt-2 space-y-1">
                                    {item.children.map((child) => (
                                        <button
                                            key={child.id}
                                            onClick={() => {
                                                handleNavigation(child)
                                                onClose()
                                            }}
                                            className="w-full flex items-center px-3 py-2 text-sm hover:bg-blue-700 rounded">
                                            <i
                                                className={`${child.icon} w-4 mr-2`}></i>
                                            {child.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Settings and Logout */}
                <div className="">
                    <a
                        href="#"
                        className="flex items-center px-4 py-3 text-sm bg-blue-600 hover:bg-blue-700 transition-colors">
                        <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                        Cerrar sesión
                    </a>
                </div>
            </div>
        </>
    )
}
