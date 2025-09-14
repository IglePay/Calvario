"use client"

import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useMembers() {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchMembers = async () => {
        try {
            setLoading(true)
            setError(null)

            const res = await fetch(`${API_URL}/miembros`, {
                cache: "no-store",
                credentials: "include",
            })

            if (!res.ok)
                throw new Error("No se pudo cargar la lista de miembros")

            const data = await res.json()
            const miembros = Array.isArray(data) ? data : (data.data ?? [])

            // 🔹 Normalizamos "S"/"N" → true/false
            const normalizados = miembros.map((m) => ({
                ...m,
                bautismo: m.bautismo === "S",
                servidor: m.servidor === "S",
            }))

            setMembers(normalizados)
        } catch (e) {
            setError(e.message || "Error desconocido")
        } finally {
            setLoading(false)
        }
    }

    // 🔹 crear miembro
    const createMember = async (member) => {
        try {
            const payload = {
                ...member,
                bautismo: member.bautizo ? "S" : "N",
                servidor: member.servidor ? "S" : "N",
            }

            const res = await fetch(`${API_URL}/miembros`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error("Error al crear miembro")

            await fetchMembers()
        } catch (e) {
            setError(e.message || "Error desconocido")
        }
    }
    // 🔹 Actualizar miembro
    const updateMember = async (id, member) => {
        try {
            const payload = {
                ...member,
                bautismo: member.bautizo ? "S" : "N",
                servidor: member.servidor ? "S" : "N",
            }

            const res = await fetch(`${API_URL}/miembros/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error("Error al actualizar miembro")

            await fetchMembers()
        } catch (e) {
            setError(e.message || "Error desconocido")
        }
    }

    // 🔹 Eliminar miembro
    const deleteMember = async (id) => {
        try {
            const res = await fetch(`${API_URL}/miembros/${id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Error al eliminar miembro")

            await fetchMembers()
        } catch (e) {
            setError(e.message || "Error desconocido")
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    return {
        members,
        loading,
        error,
        fetchMembers,
        createMember,
        updateMember,
        deleteMember,
    }
}
