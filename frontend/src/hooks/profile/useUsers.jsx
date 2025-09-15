"use client"
import { useEffect, useState } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuth } from "../../hooks/auth/useAuth"

export function useUsers() {
    const { user } = useAuth()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [roles, setRoles] = useState([])
    const [tenants, setTenants] = useState([])

    const fetchRolesAndTenants = () => {
        if (!user?.tenantId) return
        setError(null)

        return Promise.all([apiFetch("/roles"), apiFetch("/tenants")])
            .then(([rolesRes, tenantsRes]) =>
                Promise.all([rolesRes.json(), tenantsRes.json()]),
            )
            .then(([rolesData, tenantsData]) => {
                setRoles(rolesData)
                setTenants(tenantsData)
            })
            .catch((err) => console.error(err))
    }

    //  Cargar usuarios SOLO del tenant actual
    const fetchUsers = () => {
        if (!user?.tenantId) return //  protege

        setLoading(true)
        setError(null)

        return apiFetch(`/users/full?tenantId=${user.tenantId}`) // filtras por tenant
            .then((res) => {
                if (!res.ok) throw new Error("No se pudo cargar usuarios")
                return res.json()
            })
            .then((data) =>
                setUsers(Array.isArray(data) ? data : (data.data ?? [])),
            )
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }

    //  Crear o actualizar usuario dentro del tenant actual
    const createOrUpdateUser = (form) => {
        if (!user?.tenantId) return Promise.reject("No hay tenant activo")
        setError(null)

        const method = form.id_usuario ? "PUT" : "POST"
        const url = form.id_usuario ? `/users/${form.id_usuario}` : "/users"

        const body = {
            name: form.usuario,
            email: form.email,
            ...(form.password && { password: form.password }),
            ...(form.id_rol && { roleId: parseInt(form.id_rol) }),
            tenantId: form.iglesia ? parseInt(form.iglesia) : user.tenantId,
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
        if (!user?.tenantId) return Promise.reject("No hay tenant activo")
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
        if (user?.tenantId) {
            fetchUsers()
            fetchRolesAndTenants()
        }
    }, [user])

    return {
        user,
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
