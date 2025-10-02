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

    const [families, setFamilies] = useState([])
    const [services, setServices] = useState([])

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

    const createAsistencia = async (asistenciaData) => {
        if (!user) return null
        setLoading(true)
        setError("")
        try {
            const res = await apiFetch("/asistencia", {
                method: "POST",
                body: JSON.stringify(asistenciaData),
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(
                    text || `Error al crear asistencia (status ${res.status})`,
                )
            }

            const created = await res.json()

            // refrescar lista después de crear
            await getResumenServicios()

            return created
        } catch (err) {
            console.error("[useResumenServicios] create error:", err)
            setError(err.message || "Error al crear asistencia")
            return null
        } finally {
            setLoading(false)
        }
    }

    // Obtener familias desde la API
    const fetchFamilies = () => {
        if (!user) return
        setLoading(true)
        return apiFetch("/family")
            .then((res) => res.json())
            .then((data) => {
                setFamilies(Array.isArray(data) ? data : [])
            })
            .catch((err) => {
                console.error("Error fetchFamilies:", err)
                setFamilies([])
            })
            .finally(() => setLoading(false))
    }

    const fetchServicios = () => {
        if (!user) return
        setLoading(true)
        return apiFetch("/service")
            .then((res) => res.json())
            .then((data) => {
                setServices(Array.isArray(data) ? data : [])
            })
            .catch((err) => {
                console.error("Error fetchServicios:", err)
                setServices([])
            })
            .finally(() => setLoading(false))
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
        families,
        fetchFamilies,
        services,
        fetchServicios,
        createAsistencia,
    }
}
