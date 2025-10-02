"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export function useResumenServicios() {
    const { user } = useAuthContext()
    const [assists, setAssists] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState("")

    const getResumenServicios = async (
        searchArg = search,
        pageArg = page,
        limitArg = rowsPerPage,
    ) => {
        if (!user) return []
        setLoading(true)
        setError("")
        try {
            const res = await apiFetch(
                `/asistencia/resumen-servicios?page=${pageArg}&limit=${limitArg}&search=${encodeURIComponent(searchArg)}`,
            )
            if (!res.ok) throw new Error("Error al obtener los servicios")
            const data = await res.json()

            setAssists(data.data || [])
            setTotal(data.total || 0)
            setTotalPages(data.totalPages || 1)
            setPage(data.page || 1)

            return data.data || []
        } catch (err) {
            setError(err.message || "Error al cargar los datos")
            setAssists([])
            return []
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) getResumenServicios()
    }, [user])

    return {
        assists,
        loading,
        error,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        total,
        totalPages,
        search,
        setSearch,
        getResumenServicios,
    }
}
