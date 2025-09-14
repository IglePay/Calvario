"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/utils/apiFetch"

export function useTenants() {
    const [tenants, setTenants] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Cargar lista de iglesias
    const fetchTenants = () => {
        setLoading(true)
        setError(null)

        apiFetch("/tenants", { method: "GET" })
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar iglesias")
                return res.json()
            })
            .then((data) => setTenants(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }

    // Crear o actualizar iglesia

    const createOrUpdateTenant = (tenant) => {
        setError(null)
        const method = tenant.id_tenant ? "PUT" : "POST"
        const url = tenant.id_tenant
            ? `/tenants/${tenant.id_tenant}`
            : "/tenants"

        //  Filtrar solo campos editables
        const payload = {
            nombre: tenant.nombre,
            dpi: tenant.dpi,
            email: tenant.email,
            telefono: tenant.telefono,
            direccion: tenant.direccion,
            fecha_inicio: tenant.fecha_inicio
                ? new Date(tenant.fecha_inicio).toISOString()
                : null,
        }

        return apiFetch(url, {
            method,
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al guardar iglesia")
                return apiFetch("/tenants", { method: "GET" })
            })
            .then((res) => res.json())
            .then((data) => setTenants(data))
            .catch((err) => {
                setError(err.message)
                throw err
            })
    }

    //  Eliminar iglesia
    const deleteTenant = (id) => {
        setError(null)

        return apiFetch(`/tenants/${id}`, { method: "DELETE" })
            .then((res) => {
                if (!res.ok) throw new Error("Error al eliminar iglesia")
                return apiFetch("/tenants", { method: "GET" })
            })
            .then((res) => res.json())
            .then((data) => setTenants(data))
            .catch((err) => {
                setError(err.message)
                throw err
            })
    }

    useEffect(() => {
        fetchTenants()
    }, [])

    return {
        tenants,
        loading,
        error,
        createOrUpdateTenant,
        deleteTenant,
    }
}
