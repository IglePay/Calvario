"use client"
import { useEffect, useState } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export function useUsers() {
    const { user } = useAuthContext()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [roles, setRoles] = useState([])
    const [tenants, setTenants] = useState([])

    // --- estados nuevos para paginado y búsqueda ---
    const [page, setPage] = useState(1) //pagina actual
    const [limit, setLimit] = useState(10) // selector: 10,25,50,100
    const [search, setSearch] = useState("") //fitrar por texto
    const [totalPages, setTotalPages] = useState(1) //boton  paginado

    // Roles y tenants (no se toca)
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

    //  Nuevo fetchUsers con paginado, búsqueda y selector
    const fetchUsers = () => {
        if (!user) return

        setLoading(true)
        setError(null)

        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search ? { search } : {}),
        })

        return apiFetch(`/miembros/asignar-rolportenant?${query}`)
            .then((res) => {
                if (!res.ok) throw new Error("No se pudo cargar usuarios")
                return res.json()
            })
            .then((data) => {
                setUsers(data.data ?? [])
                setTotalPages(data.totalPages ?? 1)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }

    // Crear o actualizar usuario
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

    // Eliminar usuario
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

    // Fetch cuando cambian user, page, limit o search
    useEffect(() => {
        if (user?.tenantId) {
            fetchUsers()
            fetchRolesAndTenants()
        }
    }, [user, page, limit, search])

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
        //  agregamos estos para manejar el frontend
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        totalPages,
    }
}
