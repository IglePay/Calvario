"use client"
import { useEffect, useState } from "react"
import { apiFetch } from "@/utils/apiFetch"

export function useUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [roles, setRoles] = useState([])
    const [tenants, setTenants] = useState([])

    //  Cargar roles e iglesias
    const fetchRolesAndTenants = () => {
        setError(null)
        return Promise.all([
            apiFetch("/roles", { method: "GET" }),
            apiFetch("/tenants", { method: "GET" }),
        ])
            .then(([rolesRes, tenantsRes]) =>
                Promise.all([rolesRes.json(), tenantsRes.json()]),
            )
            .then(([rolesData, tenantsData]) => {
                setRoles(rolesData)
                setTenants(tenantsData)
            })
            .catch((err) => console.error(err))
    }

    //  Cargar usuarios
    const fetchUsers = () => {
        setLoading(true)
        setError(null)
        return apiFetch("/users/full", { method: "GET" })
            .then((res) => {
                if (!res.ok)
                    throw new Error("No se pudo cargar la lista de usuarios")
                return res.json()
            })
            .then((data) =>
                setUsers(Array.isArray(data) ? data : (data.data ?? [])),
            )
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }

    //  Crear o actualizar usuario
    const createOrUpdateUser = (form) => {
        setError(null)
        const method = form.id_usuario ? "PUT" : "POST"
        const url = form.id_usuario ? `/users/${form.id_usuario}` : "/users"

        const body = {
            name: form.usuario,
            email: form.email,
            ...(form.password && { password: form.password }),
            ...(form.id_rol && { roleId: parseInt(form.id_rol) }),
            ...(form.iglesia && { tenantId: parseInt(form.iglesia) }),
        }

        return apiFetch(url, {
            method,
            body: JSON.stringify(body),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al guardar usuario")
                return fetchUsers()
            })
            .catch((err) => {
                setError(err.message)
                throw err
            })
    }

    //  Eliminar usuario
    const deleteUser = (id) => {
        setError(null)
        return apiFetch(`/users/${id}`, { method: "DELETE" })
            .then((res) => {
                if (!res.ok) throw new Error("Error al eliminar usuario")
                return fetchUsers()
            })
            .catch((err) => {
                setError(err.message)
                throw err
            })
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
