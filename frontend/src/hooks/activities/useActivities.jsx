"use client"
import { useState, useEffect } from "react"
import { useTenants } from "../tenants/useTenants"
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function useActivities() {
    const { user } = useTenants()
    const [activities, setActivities] = useState([])
    const [miembros, setMiembros] = useState([])
    const [grupos, setGrupos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            fetch(`${API_URL}/actividades`).then((res) => res.json()),
            fetch(`${API_URL}/actividades/miembros`).then((res) => res.json()),
            fetch(`${API_URL}/actividades/grupos`).then((res) => res.json()),
        ])
            .then(([activitiesData, miembrosData, gruposData]) => {
                setActivities(activitiesData)
                setMiembros(miembrosData)
                setGrupos(gruposData)
            })
            .catch(() => setError("Error al cargar datos"))
            .finally(() => setLoading(false))
    }, [])

    const createActivity = (data) => {
        if (!user?.idTenant) {
            setError("No hay usuario logueado")
            return
        }

        const payload = {
            ...data,
            fechaActividad: data.fecha ? new Date(data.fecha) : null,
            idMiembro: Number(data.idMiembro),
            idGrupo: data.idGrupo ? Number(data.idGrupo) : null,
            idTenant: user.idTenant,
            descripcion: data.descripcion || "",
        }

        return fetch(`${API_URL}/actividades`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((newActivity) => {
                setActivities((prev) => [...prev, newActivity])
                return newActivity
            })
            .catch(() => setError("Error al crear actividad"))
    }

    const updateActivity = (id, data) => {
        const payload = {
            ...data,
            fechaActividad: data.fecha ? new Date(data.fecha) : null,
            idMiembro: Number(data.idMiembro),
            idGrupo: data.idGrupo ? Number(data.idGrupo) : null,
            idTenant: user.idTenant,
            descripcion: data.descripcion || "",
        }

        return fetch(`${API_URL}/actividades/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((updatedActivity) => {
                setActivities((prev) =>
                    prev.map((a) =>
                        a.idActividad === id ? updatedActivity : a,
                    ),
                )
                return updatedActivity
            })
            .catch(() => setError("Error al actualizar actividad"))
    }

    const deleteActivity = (id) => {
        return fetch(`${API_URL}/actividades/${id}`, { method: "DELETE" })
            .then(() =>
                setActivities((prev) =>
                    prev.filter((a) => a.idActividad !== id),
                ),
            )
            .catch(() => setError("Error al eliminar actividad"))
    }

    return {
        activities,
        miembros,
        grupos,
        loading,
        error,
        createActivity,
        updateActivity,
        deleteActivity,
    }
}
