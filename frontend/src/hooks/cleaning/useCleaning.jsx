"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuth } from "../../hooks/auth/useAuth"

export const useCleaning = () => {
    const { user } = useAuth()

    const [events, setEvents] = useState([])
    const [miembros, setMiembros] = useState([])
    const [grupos, setGrupos] = useState([])

    const fetchData = async () => {
        try {
            const [eventosRes, miembrosData] = await Promise.all([
                apiFetch("/limpieza").then((res) => res.json()),
                apiFetch("/miembros").then((res) => res.json()),
            ])

            const eventos = Array.isArray(eventosRes) ? eventosRes : []
            setMiembros(miembrosData)

            const formatted = eventos.map((item) => ({
                id: item.idLimpieza,
                title: item.grupo?.nombregrupo
                    ? item.grupo.nombregrupo
                    : `${item.miembro.nombre} ${item.miembro.apellido}`,
                start: new Date(item.fechaLimpieza),
                end: new Date(
                    new Date(item.fechaLimpieza).getTime() + 2 * 60 * 60 * 1000,
                ),
                gender:
                    item.miembro.genero?.nombregenero === "Femenino"
                        ? "F"
                        : "M",
                idMiembro: item.miembro.idMiembro,
                idGrupo: item.grupo?.idGrupo || null,
            }))

            setEvents(formatted)
        } catch (err) {
            console.error("Error fetchData:", err)
            setEvents([])
            setMiembros([])
        }
    }

    //  fetchGrupos usando promesas
    const fetchGrupos = () => {
        return apiFetch("/grupos")
            .then((res) => res.json())
            .then((json) => {
                const data = Array.isArray(json) ? json : []

                const gruposFiltrados = user
                    ? data.filter((g) => g.tenantId === user.tenantId)
                    : data

                setGrupos(gruposFiltrados)
                return gruposFiltrados
            })
            .catch((err) => {
                console.error("Error fetchGrupos:", err)
                setGrupos([])
                return []
            })
    }

    useEffect(() => {
        fetchData()
        fetchGrupos()
    }, [user])

    const addEvent = async (data) => {
        const payload = {
            ...data,
            tenantId: user?.tenantId,
        }

        return apiFetch("/limpieza", {
            method: "POST",
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .catch((err) => {
                console.error(err)
                throw err
            })
    }

    const updateEvent = (id, data) => {
        const payload = {
            ...data,
            tenantId: user?.tenantId,
        }

        return apiFetch(`/limpieza/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .catch((err) => {
                console.error(err)
                throw err
            })
    }

    const deleteEvent = async (id) => {
        try {
            await apiFetch(`/limpieza/${id}`, { method: "DELETE" })
            return true
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    return {
        events,
        setEvents,
        miembros,
        grupos,
        addEvent,
        updateEvent,
        deleteEvent,
        fetchData,
        fetchGrupos,
    }
}
