"use client"
import { useDashboard } from "@/hooks/dashboard/useDashboard"

export default function Dashboard() {
    const { stats, loading } = useDashboard()

    const statItems = [
        {
            id: "total-members",
            title: "Total de miembros",
            icon: "fas fa-users",
            color: "bg-blue-500",
            textColor: "text-white",
            key: "total_miembros",
        },
        {
            id: "men",
            title: "Hombres",
            icon: "fas fa-mars",
            color: "bg-gray-700",
            textColor: "text-white",
            key: "hombres",
        },
        {
            id: "women",
            title: "Mujeres",
            icon: "fas fa-venus",
            color: "bg-pink-400",
            textColor: "text-white",
            key: "mujeres",
        },
        {
            id: "servers",
            title: "Servidores",
            icon: "fas fa-id-badge",
            color: "bg-yellow-600",
            textColor: "text-white",
            key: "servidores",
        },
        {
            id: "children",
            title: "Niños",
            icon: "fas fa-child",
            color: "bg-orange-500",
            textColor: "text-white",
            key: "ninos",
        },
        {
            id: "adolescents",
            title: "Adolescentes",
            icon: "fas fa-smile",
            color: "bg-purple-600",
            textColor: "text-white",
            key: "adolescentes",
        },
        {
            id: "youth",
            title: "Jóvenes",
            icon: "fas fa-glasses",
            color: "bg-indigo-500",
            textColor: "text-white",
            key: "jovenes",
        },
        {
            id: "adults",
            title: "Adultos",
            icon: "fas fa-user-tie",
            color: "bg-orange-600",
            textColor: "text-white",
            key: "adultos",
        },
        {
            id: "baptized",
            title: "Bautizados",
            icon: "fas fa-water",
            color: "bg-teal-500",
            textColor: "text-white",
            key: "bautizados",
        },
        {
            id: "not-baptized",
            title: "No bautizados",
            icon: "fas fa-water",
            color: "bg-gray-400",
            textColor: "text-white",
            key: "no_bautizados",
        },
        {
            id: "married",
            title: "Casados",
            icon: "fas fa-heart",
            color: "bg-red-400",
            textColor: "text-white",
            key: "casados",
        },
        {
            id: "single",
            title: "Solteros",
            icon: "fas fa-user",
            color: "bg-gray-600",
            textColor: "text-white",
            key: "solteros",
        },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-rose-500 mb-4"></i>
                    <p className="text-gray-600">Cargando estadísticas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {statItems.map((stat) => (
                <div
                    key={stat.id}
                    className={`${stat.color} ${stat.textColor} rounded-lg p-4 md:p-6 hover:scale-105 transition-transform duration-300 cursor-pointer`}>
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xs md:text-sm font-medium opacity-90 mb-2 truncate">
                                {stat.title}
                            </h3>
                            <p className="text-2xl md:text-3xl font-bold">
                                {stats[stat.key] ?? 0}
                            </p>
                        </div>
                        <div className="text-2xl md:text-4xl">
                            <i className={stat.icon}></i>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
