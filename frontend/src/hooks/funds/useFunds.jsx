"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export function useFunds() {
    const { user } = useAuthContext()

    // datos
    const [funds, setFunds] = useState([])
    const [nomenclaturas, setNomenclaturas] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // paginación
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    // Obtener nomenclaturas
    const fetchNomenclaturas = async () => {
        if (!user) return
        try {
            const res = await apiFetch("/nomeclatura/simple")
            const json = await res.json()
            setNomenclaturas(Array.isArray(json) ? json : [])
        } catch (err) {
            console.error("Error fetching nomenclaturas:", err)
            setNomenclaturas([])
        }
    }

    // Obtener operaciones (fondos)
    const fetchFunds = (customPage = page, customLimit = rowsPerPage) => {
        if (!user) return
        setLoading(true)
        setError("")

        return apiFetch(`/funds?page=${customPage}&limit=${customLimit}`)
            .then((res) => res.json())
            .then((data) => {
                setFunds(data.data || [])
                setTotal(data.total || 0)
                setTotalPages(data.totalPages || 1)
                setPage(data.page || 1)
            })
            .catch((err) => {
                console.error("Error fetchFunds:", err)
                setError("No se pudieron cargar los fondos")
                setFunds([])
            })
            .finally(() => setLoading(false))
    }

    // Crear operación
    const createFund = (idnomeclatura, descripcion, fecha, monto) => {
        if (!user) return
        return apiFetch("/funds", {
            method: "POST",
            body: JSON.stringify({ idnomeclatura, descripcion, fecha, monto }),
        })
            .then((res) => res.json())
            .then((newItem) => {
                fetchFunds()
                return newItem
            })
    }

    // Actualizar operación
    const updateFund = (id, data) => {
        return apiFetch(`/funds/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((updated) => {
                setFunds((prev) => prev.map((f) => (f.id === id ? updated : f)))
                return updated
            })
    }

    // Eliminar operación
    const deleteFund = (id) => {
        return apiFetch(`/funds/${id}`, { method: "DELETE" }).then(() => {
            setFunds((prev) => prev.filter((f) => f.id !== id))
            if (funds.length === 1 && page > 1) {
                fetchFunds(page - 1)
            }
        })
    }

    // Restaurar operación
    const restoreFund = (id) => {
        return apiFetch(`/funds/restore/${id}`, { method: "POST" }).then(() => {
            fetchFunds()
        })
    }

    // cargar fondos cada vez que cambian página/rowsPerPage
    useEffect(() => {
        fetchFunds()
    }, [user, page, rowsPerPage])

    // cargar nomenclaturas solo una vez al montar
    useEffect(() => {
        fetchNomenclaturas()
    }, [user])

    return {
        funds,
        nomenclaturas,
        loading,
        error,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        total,
        fetchFunds,
        createFund,
        updateFund,
        deleteFund,
    }
}
