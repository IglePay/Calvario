"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"

export function useGrupos() {
    const [grupos, setGrupos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    //  Obtener todos los grupos
    const fetchGrupos = () => {
        setLoading(true)
        setError(null)

        apiFetch("/grupos", { method: "GET" })
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar los grupos")
                return res.json()
            })
            .then((data) => setGrupos(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }

    //  Crear grupo
    const createGrupo = (grupo) => {
        setError(null)

        apiFetch("/grupos", {
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
        setError(null)

        apiFetch(`/grupos/${idGrupo}`, {
            method: "PATCH", // PATCH es más apropiado que PUT si solo actualizas nombre
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
        setError(null)

        apiFetch(`/grupos/${idGrupo}`, { method: "DELETE" })
            .then((res) => {
                if (!res.ok) throw new Error("Error al eliminar grupo")
                return fetchGrupos()
            })
            .catch((err) => setError(err.message))
    }

    useEffect(() => {
        fetchGrupos()
    }, [])

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
