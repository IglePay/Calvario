"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"
import { useAuth } from "../../hooks/auth/useAuth"
import moment from "moment"

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
                title:
                    item.grupo?.nombregrupo ||
                    `${item.miembro.nombre} ${item.miembro.apellido}`,
                start: moment.utc(item.fechaLimpieza).toDate(),
                end: moment.utc(item.fechaLimpieza).add(2, "hours").toDate(),
                gender: item.miembro.genero?.idGenero === 2 ? "F" : "M",
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

    const fetchGrupos = async () => {
        try {
            const json = await apiFetch("/grupos").then((res) => res.json())
            const data = Array.isArray(json) ? json : []

            const gruposFiltrados = user
                ? data.filter((g) => g.tenantId === user.tenantId)
                : data

            setGrupos(gruposFiltrados)
            return gruposFiltrados
        } catch (err) {
            console.error("Error fetchGrupos:", err)
            setGrupos([])
            return []
        }
    }

    const addEvent = async (data) => {
        return apiFetch("/limpieza", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => {
                console.error(err)
                throw err
            })
    }

    const updateEvent = (id, data) => {
        return apiFetch(`/limpieza/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
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

    useEffect(() => {
        fetchData()
        fetchGrupos()
    }, [user])

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
