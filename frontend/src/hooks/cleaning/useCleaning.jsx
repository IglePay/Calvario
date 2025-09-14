"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "@/utils/apiFetch"

export const useCleaning = () => {
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

    // ✅ fetchGrupos usando promesas
    const fetchGrupos = () => {
        return apiFetch("/grupos")
            .then((res) => res.json())
            .then((json) => {
                const data = Array.isArray(json) ? json : []
                setGrupos(data)
                return data
            })
            .catch((err) => {
                console.error("Error fetchGrupos:", err)
                setGrupos([])
                return []
            })
    }

    useEffect(() => {
        fetchData()
        fetchGrupos() // llamar fetchGrupos al cargar
    }, [])

    const addEvent = async (data) => {
        try {
            const saved = await apiFetch("/limpieza", {
                method: "POST",
                body: JSON.stringify(data),
            }).then((res) => res.json())

            return saved
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    const updateEvent = async (id, data) => {
        try {
            const updated = await apiFetch(`/limpieza/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }).then((res) => res.json())

            return updated
        } catch (err) {
            console.error(err)
            throw err
        }
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
        grupos, // 🔹 Exponemos los grupos
        addEvent,
        updateEvent,
        deleteEvent,
        fetchData,
        fetchGrupos, // 🔹 Exponemos fetchGrupos si se necesita refrescar
    }
}
