"use client"
import { useState, useEffect, useRef } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export function useFamiliasAsistencia(idservicio, fechaServicio) {
    const { user } = useAuthContext()
    const [families, setFamilies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState("")

    const abortRef = useRef(null)
    const debounceRef = useRef(null)

    const buildUrl = (pageArg, limitArg, searchArg) => {
        const params = new URLSearchParams()
        params.set("idservicio", String(idservicio))
        params.set("fechaServicio", String(fechaServicio))
        params.set("page", String(pageArg))
        params.set("limit", String(limitArg))
        if (searchArg && String(searchArg).trim() !== "") {
            params.set("search", String(searchArg).trim())
        }
        return `/asistencia/familias-por-servicio?${params.toString()}`
    }

    const fetchData = async (
        pageArg = page,
        limitArg = rowsPerPage,
        searchArg = search,
    ) => {
        if (!user || !idservicio || !fechaServicio) return []

        // cancelar petición anterior
        if (abortRef.current) {
            try {
                abortRef.current.abort()
            } catch (e) {}
        }
        const controller = new AbortController()
        abortRef.current = controller

        setLoading(true)
        setError("")

        const url = buildUrl(pageArg, limitArg, searchArg)
        console.log("[useFamiliasAsistencia] GET URL:", url)

        try {
            const res = await apiFetch(url, { signal: controller.signal })
            console.log("[useFamiliasAsistencia] status:", res.status)

            if (!res.ok) {
                let text
                try {
                    text = await res.text()
                } catch (e) {
                    text = null
                }
                console.error("[useFamiliasAsistencia] API error body:", text)
                throw new Error(text || `Error en API (status ${res.status})`)
            }

            const data = await res.json()
            setFamilies(data.data || [])
            setTotal(data.total || 0)
            setTotalPages(data.totalPages || 1)
            setPage(data.page || 1)
            return data.data || []
        } catch (err) {
            if (err.name === "AbortError") {
                return []
            }
            console.error("[useFamiliasAsistencia] fetch error:", err)
            setError(err.message || "Error al cargar familias")
            setFamilies([])
            return []
        } finally {
            setLoading(false)
            abortRef.current = null
        }
    }

    //  Actualizar asistencia
    const updateFamiliaAsistencia = async (id, updateData) => {
        try {
            const res = await apiFetch(`/asistencia/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            })

            if (!res.ok) {
                throw new Error(`Error al actualizar (status ${res.status})`)
            }

            const updated = await res.json()

            // refrescar lista en memoria
            setFamilies((prev) =>
                prev.map((f) =>
                    f.idasistencia === id ? { ...f, ...updated } : f,
                ),
            )

            return updated
        } catch (err) {
            console.error("[useFamiliasAsistencia] update error:", err)
            setError(err.message || "Error al actualizar asistencia")
            throw err
        }
    }

    //  Eliminar asistencia
    const deleteFamiliaAsistencia = async (id) => {
        try {
            const res = await apiFetch(`/asistencia/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                throw new Error(`Error al eliminar (status ${res.status})`)
            }

            // refrescar lista en memoria
            setFamilies((prev) => prev.filter((f) => f.idasistencia !== id))

            return true
        } catch (err) {
            console.error("[useFamiliasAsistencia] delete error:", err)
            setError(err.message || "Error al eliminar asistencia")
            throw err
        }
    }

    //  Recargar cuando cambian filtros
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        debounceRef.current = setTimeout(() => {
            fetchData(page, rowsPerPage, search)
        }, 300)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [idservicio, fechaServicio, page, rowsPerPage, search, user])

    // limpiar abort al desmontar
    useEffect(() => {
        return () => {
            if (abortRef.current) {
                try {
                    abortRef.current.abort()
                } catch (e) {}
            }
        }
    }, [])

    return {
        families,
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
        getFamiliasPorServicio: fetchData,
        updateFamiliaAsistencia,
        deleteFamiliaAsistencia,
    }
}
