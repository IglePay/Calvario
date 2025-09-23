"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuth } from "../../hooks/auth/useAuth"

export function useAssistance() {
    const { user } = useAuth()
    const [assists, setAssists] = useState([])
    const [services, setServices] = useState([])
    const [families, setFamilies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Obtener resumen de asistencias
    const getResumenServicios = () => {
        if (!user) return Promise.resolve([])

        setLoading(true)
        setError("")

        return apiFetch(
            `/asistencia/resumen-servicios?tenantId=${user.tenantId}`,
        )
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener los servicios")
                return res.json()
            })
            .then((data) => {
                const mapped = Array.isArray(data)
                    ? data.map((d, idx) => ({
                          key: idx, // clave interna solo para React
                          fechaServicio: d.fechaServicio,
                          servicio: {
                              idservicio: d.idservicio,
                              horario: d.horario,
                          },
                          totalAsistentes: d.total,
                      }))
                    : []

                setAssists(mapped)
                return mapped
            })
            .catch((err) => {
                console.error("Error getResumenServicios:", err)
                setError(err.message || "Error al cargar los datos")
                setAssists([])
                return []
            })
            .finally(() => setLoading(false))
    }

    // Obtener familias por servicio + fecha
    const getFamiliasPorServicio = (idservicio, fechaServicio) => {
        if (!user || !idservicio || !fechaServicio) {
            console.warn(
                "No se puede llamar a familias-por-servicio sin idservicio y fechaServicio",
            )
            return Promise.resolve([])
        }

        setLoading(true)
        setError("")

        return apiFetch(
            `/asistencia/familias-por-servicio?idservicio=${idservicio}&fechaServicio=${fechaServicio}`,
        )
            .then((res) =>
                res.ok
                    ? res.json()
                    : Promise.reject("Error al obtener familias"),
            )
            .then((data) => {
                setFamilies(Array.isArray(data) ? data : [])
                return data
            })
            .catch((err) => {
                console.error("Error getFamiliasPorServicio:", err)
                setError(err.message || "Error al cargar familias")
                setFamilies([])
                return []
            })
            .finally(() => setLoading(false))
    }

    // Obtener servicios disponibles
    const getServices = () => {
        return apiFetch("/service")
            .then((res) =>
                res.ok
                    ? res.json()
                    : Promise.reject("Error al obtener los servicios"),
            )
            .then((data) => {
                setServices(Array.isArray(data) ? data : [])
                return data
            })
            .catch((err) => {
                console.error(err)
                setServices([])
                return []
            })
    }

    // Obtener familias disponibles
    const getFamilies = () => {
        return apiFetch("/family")
            .then((res) =>
                res.ok
                    ? res.json()
                    : Promise.reject("Error al obtener las familias"),
            )
            .then((data) => {
                setFamilies(Array.isArray(data) ? data : [])
                return data
            })
            .catch((err) => {
                console.error(err)
                setFamilies([])
                return []
            })
    }

    // Crear asistencia
    const createAssist = (dto) => {
        if (!user) return Promise.reject("Usuario no autenticado")
        return apiFetch("/asistencia", {
            method: "POST",
            body: JSON.stringify(dto),
        })
            .then((res) =>
                res.ok ? res.json() : res.json().then((e) => Promise.reject(e)),
            )
            .then((data) => {
                refresh()
                return data
            })
    }

    // Actualizar asistencia
    const updateAssist = (id, dto) => {
        if (!user) return Promise.reject("Usuario no autenticado")
        return apiFetch(`/asistencia/${id}`, {
            method: "PATCH",
            body: JSON.stringify(dto),
        })
            .then((res) =>
                res.ok ? res.json() : res.json().then((e) => Promise.reject(e)),
            )
            .then((data) => {
                refresh()
                return data
            })
    }

    // Eliminar asistencia
    const deleteAssist = (id) => {
        if (!user) return Promise.reject("Usuario no autenticado")
        return apiFetch(`/asistencia/${id}`, { method: "DELETE" })
            .then((res) =>
                res.ok ? res.json() : res.json().then((e) => Promise.reject(e)),
            )
            .then((data) => {
                refresh()
                return data
            })
    }

    // Refrescar todo
    const refresh = () => {
        return Promise.all([
            getResumenServicios(),
            getServices(),
            getFamilies(),
        ])
    }

    useEffect(() => {
        if (user) refresh()
    }, [user])

    return {
        assists,
        services,
        families,
        loading,
        error,
        refresh,
        createAssist,
        updateAssist,
        deleteAssist,
        getFamiliasPorServicio,
        getResumenServicios,
    }
}
