"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext.jsx"

export default function useActivities() {
    const { user } = useAuthContext()
    const [activities, setActivities] = useState([])
    const [miembros, setMiembros] = useState([])
    const [grupos, setGrupos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Solo ejecutar cuando user esté cargado
        if (user === null) return // user aún no cargado
        if (!user?.tenantId) {
            return
        }

        setLoading(true)
        setError(null)

        Promise.all([
            apiFetch("/actividades"),
            apiFetch("/actividades/miembros"),
            apiFetch("/actividades/grupos"),
        ])
            .then((responses) =>
                Promise.all(
                    responses.map(async (res) => {
                        if (!res.ok) throw new Error("Error al cargar datos")
                        return res.json()
                    }),
                ),
            )
            .then(([activitiesData, miembrosData, gruposData]) => {
                setActivities(activitiesData)
                setMiembros(miembrosData)
                setGrupos(gruposData)
            })
            .catch((err) => {
                setError(err.message || "Error al cargar datos")
            })
            .finally(() => setLoading(false))
    }, [user])

    const fetchActivities = () => {
        setLoading(true)
        apiFetch("/actividades")
            .then((res) => res.json())
            .then((data) => setActivities(data))
            .finally(() => setLoading(false))
    }

    //  Crear actividad
    const createActivity = (data) => {
        if (!user?.tenantId) return Promise.reject("No hay usuario logueado")

        const payload = {
            titulo: data.titulo,
            descripcion: data.descripcion || "",
            fechaActividad: data.fecha
                ? new Date(data.fecha).toISOString()
                : null,
            idMiembro: Number(data.idMiembro),
            idGrupo: data.idGrupo ? Number(data.idGrupo) : null,
        }

        return apiFetch("/actividades", {
            method: "POST",
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Error al crear actividad")
                const newActivity = await res.json()
                setActivities((prev) => [...prev, newActivity])
                return newActivity
            })
            .catch((err) => {
                console.error(err)
                setError(err.message || "Error al crear actividad")
                throw err
            })
    }

    //  Actualizar actividad
    const updateActivity = (id, data) => {
        if (!user?.tenantId) return Promise.reject("No hay usuario logueado")

        const payload = {
            titulo: data.titulo,
            descripcion: data.descripcion || "",
            fechaActividad: data.fecha
                ? new Date(data.fecha).toISOString()
                : null,
            idMiembro: Number(data.idMiembro),
            idGrupo: data.idGrupo ? Number(data.idGrupo) : null,
        }

        return apiFetch(`/actividades/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Error al actualizar actividad")
                const updatedActivity = await res.json()
                setActivities((prev) =>
                    prev.map((a) =>
                        a.idActividad === id ? updatedActivity : a,
                    ),
                )
                return updatedActivity
            })
            .catch((err) => {
                console.error(err)
                setError(err.message || "Error al actualizar actividad")
                throw err
            })
    }

    //  Eliminar actividad
    const deleteActivity = (id) => {
        return apiFetch(`/actividades/${id}`, { method: "DELETE" })
            .then((res) => {
                if (!res.ok) throw new Error("Error al eliminar actividad")
                setActivities((prev) =>
                    prev.filter((a) => a.idActividad !== id),
                )
            })
            .catch((err) => {
                console.error(err)
                setError(err.message || "Error al eliminar actividad")
                throw err
            })
    }

    // Luego en el useEffect solo llamas a esta función
    useEffect(() => {}, [user])

    return {
        user,
        activities,
        miembros,
        grupos,
        loading,
        error,
        createActivity,
        updateActivity,
        deleteActivity,
        fetchActivities,
    }
}
