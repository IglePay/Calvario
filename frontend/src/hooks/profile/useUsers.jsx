"use client"
import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [roles, setRoles] = useState([])
    const [tenants, setTenants] = useState([])

    const fetchRolesAndTenants = async () => {
        try {
            const [rolesRes, tenantsRes] = await Promise.all([
                fetch(`${API_URL}/roles`, { credentials: "include" }),
                fetch(`${API_URL}/tenants`, { credentials: "include" }),
            ])
            if (!rolesRes.ok || !tenantsRes.ok)
                throw new Error("No se pudo cargar roles o iglesias")
            setRoles(await rolesRes.json())
            setTenants(await tenantsRes.json())
        } catch (err) {
            console.error(err)
        }
    }

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch(`${API_URL}/users/full`, {
                cache: "no-store",
                credentials: "include",
            })
            if (!res.ok)
                throw new Error("No se pudo cargar la lista de usuarios")
            const data = await res.json()
            setUsers(Array.isArray(data) ? data : (data.data ?? []))
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    const createOrUpdateUser = async (form) => {
        const method = form.id_usuario ? "PUT" : "POST"
        const url = form.id_usuario
            ? `${API_URL}/users/${form.id_usuario}`
            : `${API_URL}/users`

        const body = {
            name: form.usuario,
            email: form.email,
            ...(form.password && { password: form.password }),
            ...(form.id_rol && { roleId: parseInt(form.id_rol) }),
            ...(form.iglesia && { tenantId: parseInt(form.iglesia) }),
        }

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include",
        })
        if (!res.ok) throw new Error("Error al guardar")
        await fetchUsers()
    }

    const deleteUser = (id) => {
        fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
            credentials: "include",
        }).then((res) => res.ok && fetchUsers())
        // .catch((err) => console.error(err))
    }

    useEffect(() => {
        fetchUsers()
        fetchRolesAndTenants()
    }, [])

    return {
        users,
        loading,
        error,
        roles,
        tenants,
        fetchUsers,
        createOrUpdateUser,
        deleteUser,
    }
}
