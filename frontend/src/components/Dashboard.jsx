"use client"
import { useChurchData } from "../hooks/use-church-data"

export default function Dashboard() {
    const { stats, loading } = useChurchData()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
                    <p className="text-gray-600">Cargando estadísticas...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        className={`${stat.color} ${stat.textColor} rounded-lg p-4 md:p-6 hover:scale-105 transition-transform duration-300 cursor-pointer `}>
                        <div className="flex items-center justify-between ">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xs md:text-sm font-medium opacity-90 mb-2 truncate">
                                    {stat.title}
                                </h3>
                                <p className="text-2xl md:text-3xl font-bold">
                                    {stat.value}
                                </p>
                            </div>
                            <div className="text-2xl md:text-4xl">
                                <i className={stat.icon}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
