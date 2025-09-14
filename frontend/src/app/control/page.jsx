"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../../components/Sidebar.jsx"
import TopNavigation from "../../components/Top-navigation.jsx"
import Dashboard from "../../components/Dashboard.jsx"
import { useNavigation } from "../../hooks/use-navigation.jsx"

export default function Control() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const navigation = useNavigation()
    const router = useRouter()

    useEffect(() => {
        async function checkUser() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
                    {
                        credentials: "include",
                    },
                )

                if (!res.ok) {
                    router.replace("/login")
                    return
                }

                const data = await res.json()
                setUser(data)
                setLoading(false)
            } catch (err) {
                router.replace("/login")
            }
        }

        checkUser()
    }, [router])

    if (loading) {
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
                navigation={navigation}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNavigation
                    onMenuClick={() => setSidebarOpen(true)}
                    navigation={navigation}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto  p-4 md:p-6">
                    {navigation.activeSection === "escritorio" && <Dashboard />}
                    {navigation.activeSection !== "escritorio" && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <i className="fas fa-construction text-6xl text-gray-400 mb-4"></i>
                                <h2 className="text-2xl font-bold text-gray-600 mb-2">
                                    {
                                        navigation.menuItems.find(
                                            (item) =>
                                                item.id ===
                                                navigation.activeSection,
                                        )?.label
                                    }
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
