"use client"
import { useState, useEffect } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useGrupos() {
    const [grupos, setGrupos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Obtener todos los grupos
    const fetchGrupos = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/grupos`)
            if (!res.ok) throw new Error("Error al cargar los grupos")
            const data = await res.json()
            setGrupos(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Crear grupo
    const createGrupo = async (grupo) => {
        try {
            const res = await fetch(`${API_URL}/grupos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(grupo),
            })
            if (!res.ok) throw new Error("Error al crear grupo")
            fetchGrupos()
        } catch (err) {
            setError(err.message)
        }
    }

    // Actualizar grupo
    const updateGrupo = async (idGrupo, grupo) => {
        try {
            const res = await fetch(`${API_URL}/grupos/${idGrupo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(grupo),
            })
            if (!res.ok) throw new Error("Error al actualizar grupo")
            fetchGrupos()
        } catch (err) {
            setError(err.message)
        }
    }

    // Eliminar grupo
    const deleteGrupo = async (idGrupo) => {
        try {
            const res = await fetch(`${API_URL}/grupos/${idGrupo}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Error al eliminar grupo")
            fetchGrupos()
        } catch (err) {
            setError(err.message)
        }
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
