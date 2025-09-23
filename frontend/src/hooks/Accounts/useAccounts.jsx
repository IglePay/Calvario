"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuth } from "../../hooks/auth/useAuth"

export const useAccounts = () => {
    const { user } = useAuth()

    // datos
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // paginación
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    // Obtener cuentas (nomenclaturas) desde la API
    const fetchAccounts = (customPage = page, customLimit = rowsPerPage) => {
        if (!user) return
        setLoading(true)
        setError("")

        return apiFetch(`/nomeclatura?page=${customPage}&limit=${customLimit}`)
            .then((res) => res.json())
            .then((data) => {
                setAccounts(data.data || [])
                setTotal(data.total || 0)
                setTotalPages(data.totalPages || 1)
                setPage(data.page || 1)
            })
            .catch((err) => {
                console.error("Error fetchAccounts:", err)
                setError("No se pudieron cargar las cuentas")
                setAccounts([])
            })
            .finally(() => setLoading(false))
    }

    // Crear nueva cuenta
    const createAccount = (codigo, nombre, tipo) => {
        if (!user) return
        return apiFetch("/nomeclatura", {
            method: "POST",
            body: JSON.stringify({ codigo, nombre, tipoIE: tipo }),
        })
            .then((res) => res.json())
            .then((newItem) => {
                // Opcional: volver a cargar la página actual
                fetchAccounts()
                return newItem
            })
    }

    // Actualizar cuenta
    const updateAccount = (id, data) => {
        return apiFetch(`/nomeclatura/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ ...data, tipoIE: data.tipo }),
        })
            .then((res) => res.json())
            .then((updated) => {
                setAccounts((prev) =>
                    prev.map((a) => (a.idnomeclatura === id ? updated : a)),
                )
                return updated
            })
    }

    // Eliminar cuenta
    const deleteAccount = (id) => {
        return apiFetch(`/nomeclatura/${id}`, { method: "DELETE" }).then(() => {
            setAccounts((prev) => prev.filter((a) => a.idnomeclatura !== id))
            // opcional: recargar si la página queda vacía
            if (accounts.length === 1 && page > 1) {
                fetchAccounts(page - 1)
            }
        })
    }

    // cargar al inicio
    useEffect(() => {
        fetchAccounts()
    }, [user, page, rowsPerPage])

    return {
        accounts,
        loading,
        error,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        total,
        fetchAccounts,
        createAccount,
        updateAccount,
        deleteAccount,
    }
}
