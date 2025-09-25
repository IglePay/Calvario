"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export const useServices = () => {
    const { user } = useAuthContext()
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchServicios = () => {
        if (!user) return
        setLoading(true)
        return apiFetch("/service")
            .then((res) => res.json())
            .then((data) => {
                setServices(Array.isArray(data) ? data : [])
            })
            .catch((err) => {
                console.error("Error fetchServicios:", err)
                setServices([])
            })
            .finally(() => setLoading(false))
    }

    const createService = (horario, descripcion) => {
        if (!user) return
        return apiFetch("/service", {
            method: "POST",
            body: JSON.stringify({ horario, descripcion }),
        })
            .then((res) => res.json())
            .then((newService) => {
                setServices((prev) => [...prev, newService])
                return newService
            })
            .catch((err) => {
                console.error("error createService:", err)
                throw err
            })
    }

    const updateService = (id, data) => {
        if (!user) return
        return apiFetch(`/service/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((updatedService) => {
                setServices((prev) =>
                    prev.map((s) => (s.idservicio === id ? updatedService : s)),
                )
                return updatedService
            })
            .catch((err) => {
                console.error("error updateService:", err)
                throw err
            })
    }

    const deleteService = (id) => {
        if (!user) return
        return apiFetch(`/service/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                setServices((prev) => prev.filter((s) => s.idservicio !== id))
            })
            .catch((err) => {
                console.error("error deleteService:", err)
                throw err
            })
    }

    useEffect(() => {
        fetchServicios()
    }, [user])
    return {
        services,
        loading,
        fetchServicios,
        createService,
        updateService,
        deleteService,
    }
}
