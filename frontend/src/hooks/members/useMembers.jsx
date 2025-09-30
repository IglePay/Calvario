"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuthContext } from "@/context/AuthContext"

export function useMembers() {
    const { user } = useAuthContext()

    // datos
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // paginación separada
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    // filtro
    const [search, setSearch] = useState("")

    // selects auxiliares
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

    //  Obtener miembros
    const fetchMembers = async (
        customPage = page,
        customLimit = rowsPerPage,
        customSearch = search,
    ) => {
        if (!user) return

        setLoading(true)
        setError(null)

        const query = new URLSearchParams({
            page: String(customPage),
            limit: String(customLimit),
            ...(customSearch ? { search: customSearch } : {}),
        })

        try {
            const res = await apiFetch(`/miembros/table?${query.toString()}`, {
                cache: "no-store",
            })

            if (!res.ok)
                throw new Error("No se pudo cargar la lista de miembros")

            const data = await res.json()

            setMembers(data.data.map(normalizeFlags))
            setTotal(data.meta.total)
            setTotalPages(data.meta.pages)
            setPage(data.meta.page)
            setRowsPerPage(data.meta.limit)
        } catch (e) {
            setError(e.message || "Error desconocido")
        } finally {
            setLoading(false)
        }
    }

    //  Crear miembro
    const createMember = async (member) => {
        if (!user) throw new Error("Usuario no autenticado")

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

        const res = await apiFetch("/miembros", {
            method: "POST",
            body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error("Error al crear miembro")

        await fetchMembers()
    }

    //  Actualizar miembro
    const updateMember = async (id, member) => {
        if (!user) throw new Error("Usuario no autenticado")

        const payload = { ...member }

        const res = await apiFetch(`/miembros/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error("Error al actualizar miembro")

        await fetchMembers()
    }

    //  Eliminar miembro
    const deleteMember = async (id) => {
        if (!user) throw new Error("Usuario no autenticado")

        const res = await apiFetch(`/miembros/${id}`, { method: "DELETE" })

        if (!res.ok) throw new Error("Error al eliminar miembro")

        await fetchMembers()
    }

    // 🔹 Fetch inicial: cada vez que cambian page, rowsPerPage o search
    useEffect(() => {
        if (user) fetchMembers()
    }, [user, page, rowsPerPage, search])

    // 🔹 Fetch selects auxiliares (una sola vez)
    useEffect(() => {
        if (!user) return

        setLoadingSelectors(true)
        Promise.all([
            apiFetch("/grupos").then((res) => res.json()),
            apiFetch("/genero").then((res) => res.json()),
            apiFetch("/estado-civil").then((res) => res.json()),
            apiFetch("/miembros/bautizados").then((res) => res.json()),
            apiFetch("/miembros/servidores").then((res) => res.json()),
        ])
            .then(([gr, ge, es, ba, se]) => {
                setGrupos(gr.data ?? gr)
                setGeneros(ge.data ?? ge)
                setEstados(es.data ?? es)
                setBautizados(ba.data ?? ba)
                setServidores(se.data ?? se)
            })
            .catch(console.error)
            .finally(() => setLoadingSelectors(false))
    }, [user])

    return {
        members,
        loading,
        error,
        fetchMembers,
        createMember,
        updateMember,
        deleteMember,

        // paginación separada
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        total,
        totalPages,

        // filtro
        search,
        setSearch,

        // selects auxiliares
        grupos,
        generos,
        estados,
        bautizados,
        servidores,
        loadingSelectors,
    }
}
