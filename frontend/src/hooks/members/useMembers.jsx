"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export function useMembers() {
    const { user } = useAuthContext()
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [loadingSelectors, setLoadingSelectors] = useState(true)

    const [grupos, setGrupos] = useState([])
    const [generos, setGeneros] = useState([])
    const [estados, setEstados] = useState([])
    const [bautizados, setBautizados] = useState([])
    const [servidores, setServidores] = useState([])

    const normalizeFlags = (member) => ({
        ...member,
        bautismo: !!member.idBautizado,
        servidor: !!member.idServidor,
    })

    //  Obtener miembros para la tabla
    const fetchMembers = () => {
        if (!user) return Promise.resolve()

        setLoading(true)
        setError(null)

        return apiFetch("/miembros/table", { cache: "no-store" })
            .then((res) => {
                if (!res.ok)
                    throw new Error("No se pudo cargar la lista de miembros")
                return res.json()
            })
            .then((data) => {
                const miembros = Array.isArray(data) ? data : (data.data ?? [])
                setMembers(miembros.map(normalizeFlags))
            })
            .catch((e) => setError(e.message || "Error desconocido"))
            .finally(() => setLoading(false))
    }

    //  Crear miembro
    const createMember = (member) => {
        if (!user) return Promise.reject(new Error("Usuario no autenticado"))

        const payload = {
            dpi: member.dpi || null,
            nombre: member.nombre,
            apellido: member.apellido,
            email: member.email || null,
            telefono: member.telefono || null,
            fechaNacimiento: member.fechaNacimiento
                ? new Date(member.fechaNacimiento).toISOString()
                : null,
            idGenero: member.idGenero ? Number(member.idGenero) : null,
            direccion: member.direccion || null,
            idEstado: member.idEstado ? Number(member.idEstado) : null,
            fechaLlegada: member.fechaLlegada
                ? new Date(member.fechaLlegada).toISOString()
                : null,
            procesosterminado: member.procesosterminado || null,
            idGrupo: member.idGrupo ? Number(member.idGrupo) : null,
            legusta: member.legusta || null,
            fechaBautismo: member.fechaBautismo
                ? new Date(member.fechaBautismo).toISOString()
                : null,
            idBautizado: member.idBautizado ? Number(member.idBautizado) : null,
            idServidor: member.idServidor ? Number(member.idServidor) : null,
        }

        return apiFetch("/miembros", {
            method: "POST",
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al crear miembro")
                return fetchMembers()
            })
            .catch((e) => setError(e.message || "Error desconocido"))
    }

    //  Actualizar miembro
    const updateMember = (id, member) => {
        if (!user) return Promise.reject(new Error("Usuario no autenticado"))

        const payload = {
            dpi: member.dpi || null,
            nombre: member.nombre,
            apellido: member.apellido,
            email: member.email || null,
            telefono: member.telefono || null,
            fechaNacimiento: member.fechaNacimiento
                ? new Date(member.fechaNacimiento).toISOString()
                : null,
            idGenero: member.idGenero ? Number(member.idGenero) : null,
            direccion: member.direccion || null,
            idEstado: member.idEstado ? Number(member.idEstado) : null,
            fechaLlegada: member.fechaLlegada
                ? new Date(member.fechaLlegada).toISOString()
                : null,
            procesosterminado: member.procesosterminado || null,
            idGrupo: member.idGrupo ? Number(member.idGrupo) : null,
            legusta: member.legusta || null,
            fechaBautismo: member.fechaBautismo
                ? new Date(member.fechaBautismo).toISOString()
                : null,
            idBautizado: member.idBautizado ? Number(member.idBautizado) : null,
            idServidor: member.idServidor ? Number(member.idServidor) : null,
        }

        return apiFetch(`/miembros/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al actualizar miembro")
                return fetchMembers()
            })
            .catch((e) => setError(e.message || "Error desconocido"))
    }

    // 🔹 Eliminar miembro
    const deleteMember = (id) => {
        if (!user) return Promise.reject(new Error("Usuario no autenticado"))

        return apiFetch(`/miembros/${id}`, { method: "DELETE" })
            .then((res) => {
                if (!res.ok) throw new Error("Error al eliminar miembro")
                return fetchMembers()
            })
            .catch((e) => setError(e.message || "Error desconocido"))
    }

    // 🔹 Fetch inicial
    useEffect(() => {
        if (!user) return

        fetchMembers()

        setLoadingSelectors(true)
        Promise.all([
            apiFetch("/grupos")
                .then((res) => res.json())
                .then((data) =>
                    setGrupos(Array.isArray(data) ? data : data.data || []),
                ),
            apiFetch("/genero")
                .then((res) => res.json())
                .then((data) =>
                    setGeneros(Array.isArray(data) ? data : data.data || []),
                ),
            apiFetch("/estado-civil")
                .then((res) => res.json())
                .then((data) =>
                    setEstados(Array.isArray(data) ? data : data.data || []),
                ),
            apiFetch("/miembros/bautizados")
                .then((res) => res.json())
                .then((data) =>
                    setBautizados(Array.isArray(data) ? data : data.data || []),
                ),
            apiFetch("/miembros/servidores")
                .then((res) => res.json())
                .then((data) =>
                    setServidores(Array.isArray(data) ? data : data.data || []),
                ),
        ])
            .catch(console.error)
            .finally(() => setLoadingSelectors(false))
    }, [user])

    return {
        members,
        loading,
        loadingSelectors,
        error,
        fetchMembers,
        createMember,
        updateMember,
        deleteMember,
        grupos,
        generos,
        estados,
        bautizados,
        servidores,
    }
}
