"use client"
import { useState, useEffect } from "react"

export function useChurchData() {
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const churchStats = [
            {
                id: "total-members",
                title: "Total de miembros",
                value: "122",
                icon: "fas fa-users",
                color: "bg-blue-500",
                textColor: "text-white",
            },
            {
                id: "men",
                title: "Hombres",
                value: "54",
                icon: "fas fa-mars",
                color: "bg-emerald-500",
                textColor: "text-white",
            },
            {
                id: "women",
                title: "Mujeres",
                value: "68",
                icon: "fas fa-venus",
                color: "bg-pink-400",
                textColor: "text-white",
            },
            {
                id: "servers",
                title: "Servidores",
                value: "91",
                icon: "fas fa-id-badge",
                color: "bg-green-600",
                textColor: "text-white",
            },
            {
                id: "children",
                title: "Niños",
                value: "8",
                icon: "fas fa-child",
                color: "bg-yellow-500",
                textColor: "text-white",
            },
            {
                id: "adolescents",
                title: "Adolescentes",
                value: "12",
                icon: "fas fa-smile",
                color: "bg-indigo-700",
                textColor: "text-white",
            },
            {
                id: "youth",
                title: "Jóvenes",
                value: "34",
                icon: "fas fa-glasses",
                color: "bg-orange-600",
                textColor: "text-white",
            },
            {
                id: "adults",
                title: "Adultos",
                value: "68",
                icon: "fas fa-user-tie",
                color: "bg-blue-700",
                textColor: "text-white",
            },
            {
                id: "baptized",
                title: "Miembros bautizados",
                value: "68",
                icon: "fas fa-water",
                color: "bg-cyan-500",
                textColor: "text-white",
            },
            {
                id: "not-baptized",
                title: "Miembros no bautizados",
                value: "54",
                icon: "fas fa-water",
                color: "bg-teal-500",
                textColor: "text-white",
            },
            {
                id: "married",
                title: "Casados",
                value: "36",
                icon: "fas fa-heart",
                color: "bg-red-400",
                textColor: "text-white",
            },
            {
                id: "single",
                title: "Solteros",
                value: "26",
                icon: "fas fa-user",
                color: "bg-gray-500",
                textColor: "text-white",
            },
        ]

        setStats(churchStats)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return { stats, loading, refetch: fetchData }
}
