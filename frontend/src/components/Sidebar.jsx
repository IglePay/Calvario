"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useMembers } from "@/hooks/members/useMembers"
import MembersModal from "@/app/control/memebers/components/MembersModal"

export default function Sidebar({ isOpen, onClose, navigation }) {
    const {
        menuItems,
        activeSection,
        handleNavigation,
        openModal,
        setOpenModal,
    } = navigation
    const [openMenu, setOpenMenu] = useState(null)
    const [user, setUser] = useState(null)

    const { createMember, grupos, generos, estados, bautizados, servidores } =
        useMembers()

    const toggleSubmenu = (id) => {
        setOpenMenu(openMenu === id ? null : id)
    }

    // Obtener info del usuario logueado
    useEffect(() => {
        apiFetch("/auth/me")
            .then((res) => {
                if (!res.ok) throw new Error("No autorizado")
                return res.json()
            })
            .then((data) => setUser(data))
            .catch(() => setUser(null))
    }, [])

    const handleLogout = () => {
        apiFetch("/auth/logout", { method: "POST" }).then(() => {
            localStorage.removeItem("token")
            window.location.href = "/"
        })
    }

    const handleSubmit = async (data) => {
        await createMember(data)
        setOpenModal(null) // cerrar modal después de guardar
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/75 z-40 lg:hidden"
                    onClick={onClose}></div>
            )}

            <div
                className={`bg-gray-900 text-white w-64 flex-shrink-0 fixed lg:relative h-screen z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex flex-col items-center justify-center space-y-2">
                    <Image
                        src="/images/iglepay.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="rounded-full"
                        priority
                    />
                    {user && (
                        <div className="text-center text-white">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm">{user.tenant}</p>
                            <p className="text-sm">{user.role}</p>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="lg:hidden text-white hover:text-gray-300">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 bg-gray-900 overflow-y-auto">
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
                                className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-800 transition-colors text-left ${
                                    activeSection === item.id
                                        ? "bg-gray-900 border-r-4 border-r-rose-400"
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

                            {item.children && openMenu === item.id && (
                                <div className="ml-8 mt-2 space-y-1">
                                    {item.children.map((child) => (
                                        <button
                                            key={child.id}
                                            onClick={() => {
                                                handleNavigation(child)
                                                onClose()
                                            }}
                                            className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-500 rounded">
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
                <div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 text-sm bg-gray-900 hover:bg-gray-800 transition-colors w-full text-left">
                        <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {/* Modal de Miembros */}
            {openModal === "member" && (
                <MembersModal
                    isOpen={true}
                    onClose={() => setOpenModal(null)}
                    onSubmit={handleSubmit}
                    initialData={null}
                    mode="create"
                    grupos={grupos}
                    generos={generos}
                    estados={estados}
                    bautizados={bautizados}
                    servidores={servidores}
                />
            )}
        </>
    )
}
