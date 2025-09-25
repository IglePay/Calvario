"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export function useGrupos() {
    const { user } = useAuthContext()

    const [grupos, setGrupos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    //  Obtener todos los grupos
    const fetchGrupos = () => {
        if (!user) return Promise.resolve() // si no hay user, no hace nada

        setLoading(true)
        setError(null)

        return apiFetch("/grupos", { method: "GET" })
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar los grupos")
                return res.json()
            })
            .then((data) =>
                setGrupos(Array.isArray(data) ? data : data.data || []),
            )
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }

    //  Crear grupo
    const createGrupo = (grupo) => {
        if (!user) return Promise.reject(new Error("Usuario no autenticado"))

        return apiFetch("/grupos", {
            method: "POST",
            body: JSON.stringify(grupo),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al crear grupo")
                return fetchGrupos()
            })
            .catch((err) => setError(err.message))
    }

    //  Actualizar grupo
    const updateGrupo = (idGrupo, grupo) => {
        if (!user) return Promise.reject(new Error("Usuario no autenticado"))

        return apiFetch(`/grupos/${idGrupo}`, {
            method: "PATCH",
            body: JSON.stringify(grupo),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al actualizar grupo")
                return fetchGrupos()
            })
            .catch((err) => setError(err.message))
    }

    //  Eliminar grupo
    const deleteGrupo = (idGrupo) => {
        if (!user) return Promise.reject(new Error("Usuario no autenticado"))

        return apiFetch(`/grupos/${idGrupo}`, { method: "DELETE" })
            .then((res) => {
                if (!res.ok) throw new Error("Error al eliminar grupo")
                return fetchGrupos()
            })
            .catch((err) => setError(err.message))
    }

    //  Fetch inicial solo si hay user
    useEffect(() => {
        if (user) fetchGrupos()
    }, [user])

    return {
        grupos,
        loading,
        error,
        fetchGrupos,
        createGrupo,
        updateGrupo,
        deleteGrupo,
    }
}
