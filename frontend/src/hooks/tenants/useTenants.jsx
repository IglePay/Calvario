"use client"

import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useTenants() {
    const [tenants, setTenants] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // ✅ Cargar lista de iglesias
    const fetchTenants = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/tenants`) // 👈 ajusta el endpoint según tu backend
            if (!res.ok) throw new Error("Error al cargar iglesias")
            const data = await res.json()
            setTenants(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // ✅ Crear o actualizar iglesia
    const createOrUpdateTenant = async (tenant) => {
        try {
            const method = tenant.id_tenant ? "PUT" : "POST"

            // 👇 normalizamos la fecha antes de enviarla
            const payload = {
                ...tenant,
                fecha_inicio: tenant.fecha_inicio
                    ? new Date(tenant.fecha_inicio).toISOString() // <-- convierte YYYY-MM-DD a ISO válido
                    : null,
            }

            const res = await fetch(
                tenant.id_tenant
                    ? `${API_URL}/tenants/${tenant.id_tenant}`
                    : `${API_URL}/tenants`,
                {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload), // 👈 enviamos el payload corregido
                },
            )
            if (!res.ok) throw new Error("Error al guardar iglesia")
            await fetchTenants()
        } catch (err) {
            setError(err.message)
            throw err
        }
    }

    // ✅ Eliminar iglesia
    const deleteTenant = async (id) => {
        try {
            const res = await fetch(`${API_URL}/tenants/${id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Error al eliminar iglesia")
            await fetchTenants()
        } catch (err) {
            setError(err.message)
            throw err
        }
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
