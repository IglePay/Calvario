"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuth } from "../../hooks/auth/useAuth"
import { useAuthContext } from "@/context/AuthContext"

export const useDashboard = () => {
    const { user } = useAuthContext()

    const [stats, setStats] = useState({
        total_miembros: 0,
        hombres: 0,
        mujeres: 0,
        servidores: 0,
        ninos: 0,
        adolescentes: 0,
        jovenes: 0,
        adultos: 0,
        no_bautizados: 0,
        bautizados: 0,
        casados: 0,
        solteros: 0,
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchStats = async () => {
        if (!user) return
        setLoading(true)
        setError("")

        try {
            const res = await apiFetch("/miembros/estadisticas")
            const data = await res.json()
            setStats(data)
        } catch (err) {
            console.error("Error fetching stats:", err)
            setError("No se pudieron cargar las estadísticas")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [user])

    return { stats, loading, error, fetchStats }
}
