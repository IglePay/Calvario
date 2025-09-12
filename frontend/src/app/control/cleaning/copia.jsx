"use client"

import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../../globals.css"
import Link from "next/link"
import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Configuramos moment en español
moment.locale("es")
const localizer = momentLocalizer(moment)

const messages = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
}

export default function CleaningCalendar() {
    const [events, setEvents] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [modalData, setModalData] = useState({
        id: null,
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        gender: "M",
    })

    // 🔹 Obtener eventos del backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_URL}/limpieza`)
                if (!res.ok) throw new Error("Error al obtener eventos")
                const data = await res.json()

                const formatted = data.map((item) => ({
                    id: item.idLimpieza,
                    title: `${item.miembro.nombre} ${item.miembro.apellido}`,
                    start: new Date(item.fechaLimpieza),
                    end: new Date(moment(item.fechaLimpieza).add(2, "hours")),
                    gender: item.miembro.genero?.codigo ?? "M",
                }))

                setEvents(formatted)
            } catch (err) {
                console.error(err)
            }
        }

        fetchEvents()
    }, [])

    const eventStyleGetter = (event) => {
        let backgroundColor = event.gender === "M" ? "#3B82F6" : "#F472B6"
        return {
            style: {
                backgroundColor,
                borderRadius: "6px",
                border: "none",
                padding: "2px 4px",
                fontSize: "0.85rem",
                color: "white",
            },
        }
    }

    const handleSelectEvent = (event) => {
        setModalData({
            id: event.id,
            title: event.title,
            date: moment(event.start).format("YYYY-MM-DD"),
            startTime: moment(event.start).format("HH:mm"),
            endTime: moment(event.end).format("HH:mm"),
            gender: event.gender,
        })
        setIsOpen(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setModalData((prev) => ({ ...prev, [name]: value }))
    }

    // 🔹 Registrar limpieza
    const handleAddEvent = async () => {
        const start = moment(
            `${modalData.date} ${modalData.startTime}`,
            "YYYY-MM-DD HH:mm",
        ).toDate()

        const end = moment(
            `${modalData.date} ${modalData.endTime}`,
            "YYYY-MM-DD HH:mm",
        ).toDate()

        const newEvent = {
            idMiembro: 1, // ⚡ deberías traer este valor real
            idTenant: 1, // ⚡ según el usuario logueado
            fechaLimpieza: start,
        }

        try {
            const res = await fetch(`${API_URL}/limpieza`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent),
            })

            if (!res.ok) throw new Error("Error al registrar limpieza")

            const saved = await res.json()

            setEvents((prev) => [
                ...prev,
                {
                    id: saved.idLimpieza,
                    title: modalData.title,
                    start,
                    end,
                    gender: modalData.gender,
                },
            ])
        } catch (err) {
            console.error(err)
        }

        setIsOpen(false)
    }

    // 🔹 Eliminar limpieza
    const handleDeleteEvent = async () => {
        try {
            const res = await fetch(`${API_URL}/limpieza/${modalData.id}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Error al eliminar limpieza")

            setEvents((prev) => prev.filter((e) => e.id !== modalData.id))
        } catch (err) {
            console.error(err)
        }

        setIsOpen(false)
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Calendario de Limpieza</h1>

            <div className="flex gap-2 mb-4">
                <Link href={"/control"} className="btn btn-primary rounded-xl">
                    Regresar
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-accent rounded-xl">
                    Registrar
                </button>
            </div>

            <div className="bg-base-100 p-4 rounded-xl shadow-lg">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    culture="es"
                    messages={messages}
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={handleSelectEvent}
                    popup
                />
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-base-200 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            Registrar / Eliminar Persona
                        </h2>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                name="title"
                                placeholder="Nombre"
                                value={modalData.title}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                            <input
                                type="date"
                                name="date"
                                value={modalData.date}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    name="startTime"
                                    value={modalData.startTime}
                                    onChange={handleChange}
                                    className="input input-bordered flex-1"
                                />
                                <input
                                    type="time"
                                    name="endTime"
                                    value={modalData.endTime}
                                    onChange={handleChange}
                                    className="input input-bordered flex-1"
                                />
                            </div>
                            <select
                                name="gender"
                                value={modalData.gender}
                                onChange={handleChange}
                                className="select select-bordered w-full">
                                <option value="M">Hombre</option>
                                <option value="F">Mujer</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={handleAddEvent}
                                className="btn btn-primary rounded-xl px-4">
                                Registrar
                            </button>
                            {modalData.id && (
                                <button
                                    onClick={handleDeleteEvent}
                                    className="btn btn-error rounded-xl px-4">
                                    Eliminar
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-ghost rounded-xl px-4">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
