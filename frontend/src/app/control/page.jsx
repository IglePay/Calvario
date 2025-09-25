"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../../components/Sidebar.jsx"
import TopNavigation from "../../components/Top-navigation.jsx"
import Dashboard from "../../components/Dashboard.jsx"
import { useAuthContext } from "@/context/AuthContext"

export default function Control() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("escritorio")
    const router = useRouter()

    //  Usamos el contexto en lugar del hook directo
    const { user, loading } = useAuthContext()

    // Redirigir si no hay usuario
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login")
        }
    }, [loading, user, router])

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Cargando...</p>
            </div>
        )
    }

    return (
        <div className="flex h-screen">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                user={user} // viene del contexto
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavigation
                    onMenuClick={() => setSidebarOpen(true)}
                    activeSection={activeSection}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 ">
                    {activeSection === "escritorio" && <Dashboard />}
                    {activeSection !== "escritorio" && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <i className="fas fa-construction text-6xl text-gray-400 mb-4"></i>
                                <h2 className="text-2xl font-bold text-gray-600 mb-2">
                                    {activeSection}
                                </h2>
                                <p className="text-gray-500">
                                    Esta sección está en construcción
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
