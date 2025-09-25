"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export function useCollaborator() {
    const { user } = useAuthContext()
    const [collaborators, setCollaborators] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // 🔹 Traer colaboradores
    const fetchCollaborators = async () => {
        if (!user) return
        setLoading(true)
        setError(null)
        try {
            const res = await apiFetch("/colaborador")
            const data = await res.json()

            if (!res.ok) {
                // Manejo de errores backend: si el backend devuelve error, lanzamos mensaje
                throw new Error(
                    data?.message || "No se pudo cargar los colaboradores",
                )
            }

            // Filtrar solo roles 4,5,6
            const filtered = data.filter((c) => [4, 5, 6].includes(c.roleId))
            setCollaborators(filtered)
        } catch (err) {
            setError(err.message || "Error al cargar colaboradores")
        } finally {
            setLoading(false)
        }
    }

    // 🔹 Traer roles permitidos
    const fetchRoles = async () => {
        if (!user) return
        try {
            const res = await apiFetch("/colaborador/roles")
            const data = await res.json()

            if (!res.ok) {
                throw new Error(
                    data?.message || "No se pudieron cargar los roles",
                )
            }

            setRoles(data)
        } catch (err) {
            console.error("Error fetching roles:", err)
        }
    }

    // 🔹 Crear o actualizar colaborador
    const createOrUpdateCollaborator = async (form) => {
        if (!user) return
        const method = form.id ? "PUT" : "POST"
        const url = form.id ? `/colaborador/${form.id}` : "/colaborador"

        const body = {
            name: form.usuario,
            email: form.email,
            password: form.password || undefined,
            roleId: parseInt(form.id_rol, 10),
        }

        try {
            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(body),
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data?.message || "Error al guardar colaborador")
            }

            await fetchCollaborators()
        } catch (err) {
            throw new Error(err.message || "Error al guardar colaborador")
        }
    }

    // 🔹 Eliminar colaborador
    const deleteCollaborator = async (id) => {
        if (!user) return
        try {
            const res = await apiFetch(`/colaborador/${id}`, {
                method: "DELETE",
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(
                    data?.message || "Error al eliminar colaborador",
                )
            }
            await fetchCollaborators()
        } catch (err) {
            throw new Error(err.message || "Error al eliminar colaborador")
        }
    }

    useEffect(() => {
        if (user) {
            fetchRoles()
            fetchCollaborators()
        }
    }, [user])

    return {
        collaborators,
        roles,
        loading,
        error,
        fetchCollaborators,
        createOrUpdateCollaborator,
        deleteCollaborator,
    }
}
