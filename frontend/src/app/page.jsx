"use client"
import { useState } from "react"
import Sidebar from "../components/Sidebar"
import TopNavigation from "../components/Top-navigation"
import Dashboard from "../components/Dashboard"
import { useNavigation } from "../hooks/use-navigation"

export default function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigation = useNavigation()

    return (
        <div className="flex h-screen bg-gray-100">
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
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
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
