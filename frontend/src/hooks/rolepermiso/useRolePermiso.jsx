"use client"
import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export const useRolPermiso = () => {
    const { user } = useAuthContext()

    const [rolesConPermisos, setRolesConPermisos] = useState([])
    const [permisosDisponibles, setPermisosDisponibles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [totalPages, setTotalPages] = useState(1)

    // -----------------------------
    // Traer roles con permisos ya anidados
    // -----------------------------
    const fetchRoles = async () => {
        if (!user?.tenantId) return
        try {
            setLoading(true)
            setError(null)

            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(search ? { search } : {}),
            })

            const resRoles = await apiFetch(
                `/rolpermiso/roles-con-permisos?${query}`,
            )
            if (!resRoles.ok) throw new Error("Error al cargar roles")
            const data = await resRoles.json()

            // Ya vienen con permisos
            setRolesConPermisos(data.data ?? [])
            setTotalPages(data.totalPages ?? 1)
        } catch (err) {
            console.error(err)
            setError("No se pudieron cargar los datos")
        } finally {
            setLoading(false)
        }
    }

    // -----------------------------
    // Traer todos los permisos disponibles (para select)
    // -----------------------------
    const fetchPermisos = async () => {
        try {
            const res = await apiFetch("/rolpermiso/permisos")
            if (!res.ok) throw new Error("Error cargando permisos")
            const data = await res.json()
            setPermisosDisponibles(data)
        } catch (err) {
            console.error(err)
        }
    }

    // -----------------------------
    // Crear permiso global
    // -----------------------------
    const createPermiso = async (nombre, descripcion) => {
        const res = await apiFetch("/rolpermiso/permisos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion }),
        })
        if (!res.ok) throw new Error("Error creando permiso")
        await fetchRoles()
        await fetchPermisos()
        return res.json()
    }

    // -----------------------------
    // Asignar permiso existente a rol
    // -----------------------------
    const assignPermisoToRol = async (roleId, permisoId) => {
        const res = await apiFetch(
            `/rolpermiso/rol/${roleId}/permiso/${permisoId}`,
            { method: "POST" },
        )
        if (!res.ok) throw new Error("Error asignando permiso a rol")
        await fetchRoles()
        return res.json()
    }

    // -----------------------------
    // Actualizar permisos de un rol
    // -----------------------------
    const updatePermisosRol = async (roleId, permisos) => {
        if (!roleId) throw new Error("Rol no definido")
        const res = await apiFetch(`/rolpermiso/rol/${roleId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ permisos }), // array de nombres de permisos
        })
        if (!res.ok) throw new Error("Error actualizando permisos del rol")
        await fetchRoles()
        return res.json()
    }

    // -----------------------------
    // Eliminar permiso de rol
    // -----------------------------
    const removePermisoFromRol = async (roleId, permisoId) => {
        const res = await apiFetch(
            `/rolpermiso/rol/${roleId}/permiso/${permisoId}`,
            { method: "DELETE" },
        )
        if (!res.ok) throw new Error("Error eliminando permiso del rol")
        await fetchRoles()
        return res.json()
    }

    // -----------------------------
    // useEffect inicial
    // -----------------------------
    useEffect(() => {
        fetchRoles()
        fetchPermisos()
    }, [user, page, limit, search])

    return {
        user,
        rolesConPermisos,
        permisosDisponibles,
        loading,
        error,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        totalPages,
        fetchRoles,
        createPermiso,
        assignPermisoToRol,
        removePermisoFromRol,
        updatePermisosRol,
    }
}
