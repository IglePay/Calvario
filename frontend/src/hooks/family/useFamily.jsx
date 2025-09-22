"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuth } from "../../hooks/auth/useAuth"

export const useFamilies = () => {
    const { user } = useAuth()
    const [families, setFamilies] = useState([])
    const [loading, setLoading] = useState(false)

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

    // Crear nueva familia
    const createFamily = (nombreFamilia, cantidadfamilia) => {
        if (!user) return
        return apiFetch("/family", {
            method: "POST",
            body: JSON.stringify({ nombreFamilia, cantidadfamilia }),
        })
            .then((res) => res.json())
            .then((newFamily) => {
                setFamilies((prev) => [...prev, newFamily])
                return newFamily
            })
            .catch((err) => {
                console.error("Error createFamily:", err)
                throw err
            })
    }

    // Actualizar familia
    const updateFamily = (id, data) => {
        return apiFetch(`/family/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((updated) => {
                setFamilies((prev) =>
                    prev.map((f) => (f.idfamilia === id ? updated : f)),
                )
                return updated
            })
            .catch((err) => {
                console.error("Error updateFamily:", err)
                throw err
            })
    }

    // Eliminar familia
    const deleteFamily = (id) => {
        return apiFetch(`/family/${id}`, { method: "DELETE" })
            .then(() => {
                setFamilies((prev) => prev.filter((f) => f.idfamilia !== id))
            })
            .catch((err) => {
                console.error("Error deleteFamily:", err)
                throw err
            })
    }

    useEffect(() => {
        fetchFamilies()
    }, [user])

    return {
        families,
        loading,
        fetchFamilies,
        createFamily,
        updateFamily,
        deleteFamily,
        deleteFamily,
    }
}
