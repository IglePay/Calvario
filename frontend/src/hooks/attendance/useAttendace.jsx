"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export function useAssistance() {
    const { user } = useAuthContext()

    const [assists, setAssists] = useState([])
    const [services, setServices] = useState([])
    const [families, setFamilies] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Estados de paginación
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    // Obtener resumen de asistencias
    const getResumenServicios = async (
        search = "",
        pageArg = page,
        limitArg = rowsPerPage,
    ) => {
        if (!user) return []

        setLoading(true)
        setError("")

        try {
            const res = await apiFetch(
                `/asistencia/resumen-servicios?page=${pageArg}&limit=${limitArg}&search=${search}`,
            )

            if (!res.ok) throw new Error("Error al obtener los servicios")
            const data = await res.json()

            const mapped = Array.isArray(data.data)
                ? data.data.map((d, idx) => ({
                      key: idx,
                      fechaServicio: d.fechaServicio,
                      servicio: {
                          idservicio: d.idservicio,
                          horario: d.horario,
                      },
                      totalAsistentes: d.total,
                  }))
                : []

            setAssists(mapped)
            setTotal(data.total || 0)
            setTotalPages(data.totalPages || 1)
            setPage(data.page || 1)

            return mapped
        } catch (err) {
            console.error("Error getResumenServicios:", err)
            setError(err.message || "Error al cargar los datos")
            setAssists([])
            return []
        } finally {
            setLoading(false)
        }
    }

    // Obtener familias por servicio + fecha
    const getFamiliasPorServicio = async (
        idservicio,
        fechaServicio,
        search = "",
        pageArg = page,
        limitArg = rowsPerPage,
    ) => {
        if (!user || !idservicio || !fechaServicio) {
            console.warn("Faltan parámetros para getFamiliasPorServicio")
            return []
        }

        setLoading(true)
        setError("")

        try {
            const res = await apiFetch(
                `/asistencia/familias-por-servicio?idservicio=${idservicio}&fechaServicio=${fechaServicio}&page=${pageArg}&limit=${limitArg}&search=${search}`,
            )

            if (!res.ok) throw new Error("Error al obtener familias")
            const data = await res.json()

            setFamilies(data.data || [])
            setTotal(data.total || 0)
            setTotalPages(data.totalPages || 1)
            setPage(data.page || 1)

            return data.data || []
        } catch (err) {
            console.error("Error getFamiliasPorServicio:", err)
            setError(err.message || "Error al cargar familias")
            setFamilies([])
            return []
        } finally {
            setLoading(false)
        }
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
        //datos
        assists,
        services,
        families,
        // estados de paginación
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        total,
        totalPages,
        //estados generales
        loading,
        error,
        refresh,
        //funciones
        createAssist,
        updateAssist,
        deleteAssist,
        getFamiliasPorServicio,
        getResumenServicios,
    }
}
