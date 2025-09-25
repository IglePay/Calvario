"use client"
import { ThemeContext } from "@/hooks/themeContext"
import Link from "next/link"
import { useContext, useState } from "react"
import MembersModal from "../app/control/memebers/components/MembersModal"
import { useMembers } from "@/hooks/members/useMembers"

export default function TopNavigation({ onMenuClick, navigation }) {
    const navItems = [
        { name: "Miembros", path: "/control/memebers/persons" },
        { name: "Finanzas", path: "/control/finace/funds" },
        { name: "Asistencias", path: "/control/assists" },
        { name: "Colaboradores", path: "/control/collaborator" },
    ]
    const { theme, toggleTheme } = useContext(ThemeContext)

    //  Importamos todas las funciones y datos necesarios
    const { createMember, grupos, generos, estados, bautizados, servidores } =
        useMembers()

    const [isModalOpen, setIsModalOpen] = useState(false)

    //  Solo registrar (no hay edición aquí)
    const handleSubmit = async (data) => {
        try {
            await createMember(data)
            setIsModalOpen(false)
        } catch (err) {
            console.error("Error al guardar el miembro:", err)
        }
    }

    return (
        <header className=" shadow-sm border-b border-gray-400">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
                {/* Left side - Toggle */}
                <div className="flex items-center space-x-2 md:space-x-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="text-blue-600 hover:text-blue-800 lg:hidden">
                        <i className="fas fa-bars text-lg"></i>
                    </button>
                </div>
                {/* Right side - Navigation Menu */}
                <nav className="hidden lg:flex items-center space-x-3">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.path}
                            className="text-gray-700 hover:text-blue-600 dark:text-white font-medium transition-colors whitespace-nowrap text-base">
                            {item.name}
                        </Link>
                    ))}

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Nuevo
                    </button>
                </nav>
                {/* Mobile button */}
                <div className="flex items-center space-x-2 lg:hidden">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm ml-3 md:ml-1">
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
                {/* Theme Toggle */}
                <button onClick={toggleTheme} className="rounded-md ml-2">
                    <i
                        className={`fa-solid ${theme === "light" ? "fa-moon text-gray-800" : "fa-sun text-yellow-400"} text-2xl`}
                    />
                </button>
                {/* Modal para registrar */}
                <MembersModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={null} // siempre nulo = registro
                    mode="create" //  modo registro
                    grupos={grupos}
                    generos={generos}
                    estados={estados}
                    bautizados={bautizados}
                    servidores={servidores}
                />
            </div>
        </header>
    )
}
