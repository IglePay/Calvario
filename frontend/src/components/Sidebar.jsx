"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMembers } from "@/hooks/members/useMembers"
import MembersModal from "@/app/control/memebers/components/MembersModal"
import { useAuthContext } from "@/context/AuthContext"
import { apiFetch } from "@/utils/apiFetch"

export default function Sidebar({ isOpen, onClose }) {
    const router = useRouter()
    const [activeSection, setActiveSection] = useState("escritorio")
    const [openModal, setOpenModal] = useState(null)
    const [openMenu, setOpenMenu] = useState(null)

    // Usamos useAuth en lugar de fetch manual
    const { user, loading } = useAuthContext()

    const { createMember, grupos, generos, estados, bautizados, servidores } =
        useMembers()

    // Menú
    const menuItems = [
        { id: "escritorio", icon: "fas fa-desktop", label: "Escritorio" },
        {
            id: "miembros",
            icon: "fas fa-users",
            label: "Miembros",
            children: [
                {
                    id: "miembros-lista",
                    icon: "fas fa-list",
                    label: "Listado Miembros",
                    route: "/control/memebers/persons",
                },
                {
                    id: "miembros-agregar",
                    icon: "fas fa-user-plus",
                    label: "Agregar",
                    action: "openMemberModal",
                },
            ],
        },
        {
            id: "actividades",
            icon: "fa fa-solid fa-broom",
            label: "Actividades",
            route: "/control/activities",
        },
        {
            id: "limpieza",
            icon: "fas fa-calendar-alt",
            label: "Calendario",
            route: "/control/cleaning",
        },
        {
            id: "usuarios",
            icon: "fas fa-user",
            label: "Colaborador",
            route: "/control/collaborator",
        },
        {
            id: "grupos",
            icon: "fas fa-users-cog",
            label: "Grupos",
            route: "/control/groups",
        },
        {
            id: "finanzas",
            icon: "fas fa-dollar-sign",
            label: "Finanzas",
            children: [
                {
                    id: "nomeclatura",
                    icon: "fa-solid fa-wallet",
                    label: "Nomeclatura",
                    route: "/control/finance/accounts",
                },
                {
                    id: "fondos",
                    icon: "fa-solid fa-piggy-bank",
                    label: "Fondos",
                    route: "/control/finance/funds",
                },
            ],
        },
        {
            id: "asistencias",
            icon: "fas fa-clipboard-check",
            label: "Asistencias",
            children: [
                {
                    id: "Asistencia_General",
                    icon: "fas fa-users",
                    label: "Familias",
                    route: "/control/attendance/family",
                },
                {
                    id: "Assitencia_Individual",
                    icon: "fas fa-user-check",
                    label: "Asistencia",
                    route: "/control/attendance/generalAssistance",
                },
                {
                    id: "Eventos",
                    icon: "fas fa-clock",
                    label: "Horarios",
                    route: "/control/attendance/hours",
                },
            ],
        },
        {
            id: "Ajustes",
            icon: "fas fa-cog",
            label: "Ajustes",
            children: [
                {
                    id: "Perfil",
                    icon: "fas fa-user-cog",
                    label: "Perfil",
                    route: "/control/settings/profile",
                },
                {
                    id: "Preferencias",
                    icon: "fas fa-sliders-h",
                    label: "Datos de la Iglesia",
                    route: "/control/settings/church_data",
                },
            ],
        },
    ]

    // Funciones
    const handleNavigation = (section) => {
        setActiveSection(section.id)
        if (section.route) {
            router.push(section.route)
        } else if (section.action === "openMemberModal") {
            setOpenModal("member")
        }
    }

    const toggleSubmenu = (id) => setOpenMenu(openMenu === id ? null : id)

    const handleLogout = () => {
        apiFetch("/auth/logout", { method: "POST" }).then(() => {
            localStorage.removeItem("token")
            window.location.href = "/"
        })
    }

    const handleSubmit = async (data) => {
        await createMember(data)
        setOpenModal(null)
    }

    if (loading) {
        // Mientras carga el usuario, puedes mostrar un placeholder
        return (
            <div className="bg-gray-900 text-white w-64 flex-shrink-0 fixed lg:relative h-screen z-50 flex items-center justify-center">
                <i className="fas fa-spinner fa-spin text-2xl"></i>
            </div>
        )
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/75 z-40 lg:hidden"
                    onClick={onClose}></div>
            )}

            <div
                className={`bg-gray-900 text-white w-64 flex-shrink-0 fixed lg:relative h-screen z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
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
                                    if (item.children) toggleSubmenu(item.id)
                                    else {
                                        handleNavigation(item)
                                        onClose()
                                    }
                                }}
                                className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-800 transition-colors text-left ${activeSection === item.id ? "bg-gray-900 border-r-4 border-r-rose-400" : ""}`}>
                                <i className={`${item.icon} w-5 mr-3`}></i>
                                {item.label}
                                {item.children && (
                                    <i
                                        className={`ml-auto fas ${openMenu === item.id ? "fa-chevron-up" : "fa-chevron-down"}`}
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
