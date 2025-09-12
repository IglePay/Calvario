"use client"

import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../../globals.css"
import Link from "next/link"
import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
    const [miembros, setMiembros] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState("create")

    const [modalData, setModalData] = useState({
        id: null,
        idMiembro: "",
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        gender: "M",
    })

    // 🔹 Obtener eventos y miembros
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resEvents, resMiembros] = await Promise.all([
                    fetch(`${API_URL}/limpieza`),
                    fetch(`${API_URL}/miembros`),
                ])

                const eventos = await resEvents.json()
                const miembrosData = await resMiembros.json()

                setMiembros(miembrosData)

                const formatted = eventos.map((item) => ({
                    id: item.idLimpieza,
                    title: `${item.miembro.nombre} ${item.miembro.apellido}`,
                    start: new Date(item.fechaLimpieza),
                    end: new Date(moment(item.fechaLimpieza).add(2, "hours")),
                    gender:
                        item.miembro.genero?.nombregenero === "Femenino"
                            ? "F"
                            : "M",

                    idMiembro: item.miembro.idMiembro,
                }))

                setEvents(formatted)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])

    const eventStyleGetter = (event) => {
        const gender = (event.gender || "M").toUpperCase()

        let backgroundColor = gender === "M" ? "#3B82F6" : "#F472B6"

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

    // 🔹 Seleccionar evento → abrir modal en modo EDITAR
    const handleSelectEvent = (event) => {
        setModalData({
            id: event.id,
            idMiembro: event.idMiembro,
            title: event.title,
            date: moment(event.start).format("YYYY-MM-DD"),
            startTime: moment(event.start).format("HH:mm"),
            endTime: moment(event.end).format("HH:mm"),
            gender: event.gender,
        })
        setMode("edit")
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
            idMiembro: parseInt(modalData.idMiembro),
            idTenant: 1, // ⚡ depende de quién esté logueado
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

            const miembroSel = miembros.find(
                (m) => m.idMiembro === newEvent.idMiembro,
            )

            setEvents((prev) => [
                ...prev,
                {
                    id: saved.idLimpieza,
                    title: `${miembroSel.nombre} ${miembroSel.apellido}`,
                    start,
                    end,
                    gender:
                        miembroSel.genero?.nombregenero === "Femenino"
                            ? "F"
                            : "M",
                    idMiembro: newEvent.idMiembro,
                },
            ])
        } catch (err) {
            console.error(err)
        }

        setIsOpen(false)
    }

    // 🔹 Editar limpieza
    const handleUpdateEvent = async () => {
        const start = moment(
            `${modalData.date} ${modalData.startTime}`,
            "YYYY-MM-DD HH:mm",
        ).toDate()

        const end = moment(
            `${modalData.date} ${modalData.endTime}`,
            "YYYY-MM-DD HH:mm",
        ).toDate()

        const updatedEvent = {
            idMiembro: parseInt(modalData.idMiembro),
            fechaLimpieza: start,
        }

        try {
            const res = await fetch(`${API_URL}/limpieza/${modalData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedEvent),
            })

            if (!res.ok) throw new Error("Error al actualizar limpieza")

            const miembroSel = miembros.find(
                (m) => m.idMiembro === updatedEvent.idMiembro,
            )

            setEvents((prev) =>
                prev.map((e) =>
                    e.id === modalData.id
                        ? {
                              ...e,
                              title: `${miembroSel.nombre} ${miembroSel.apellido}`,
                              start,
                              end,
                              gender:
                                  miembroSel.genero?.nombregenero === "Femenino"
                                      ? "F"
                                      : "M",
                              idMiembro: updatedEvent.idMiembro,
                          }
                        : e,
                ),
            )
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
        <div className=" items-center justify-center text-center ">
            <h1 className="text-2xl font-bold mt-3">Calendario de Limpieza</h1>

            <div className="flex gap-4  justify-center items-center mt-3">
                <Link href={"/control"} className="btn btn-primary ">
                    Regresar
                </Link>
                <button
                    onClick={() => {
                        setMode("create")
                        setModalData({
                            id: null,
                            idMiembro: "",
                            title: "",
                            date: "",
                            startTime: "",
                            endTime: "",
                            gender: "M",
                        })
                        setIsOpen(true)
                    }}
                    className="btn btn-accent ">
                    Registrar
                </button>
            </div>

            <div className="bg-base-200 p-4 rounded-xl max-shadow-lg shadow-2xl">
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
                            {mode === "create"
                                ? "Registrar Persona"
                                : "Editar / Eliminar Persona"}
                        </h2>
                        <div className="flex flex-col gap-3">
                            {/* 🔹 Dropdown de miembros */}
                            <select
                                name="idMiembro"
                                value={modalData.idMiembro}
                                onChange={handleChange}
                                className="select select-bordered w-full">
                                <option value="">Seleccione un miembro</option>
                                {miembros.map((m) => (
                                    <option
                                        key={m.idMiembro}
                                        value={m.idMiembro}>
                                        {m.nombre} {m.apellido}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="date"
                                name="date"
                                value={modalData.date}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                            <div className="flex gap-2">
                                {/* <input */}
                                {/*     type="time" */}
                                {/*     name="startTime" */}
                                {/*     value={modalData.startTime} */}
                                {/*     onChange={handleChange} */}
                                {/*     className="input input-bordered flex-1" */}
                                {/* /> */}
                                {/* <input */}
                                {/*     type="time" */}
                                {/*     name="endTime" */}
                                {/*     value={modalData.endTime} */}
                                {/*     onChange={handleChange} */}
                                {/*     className="input input-bordered flex-1" */}
                                {/* /> */}
                                <select
                                    name="gender"
                                    value={modalData.gender}
                                    onChange={handleChange}
                                    className="select select-bordered w-full">
                                    <option value="M">Hombre</option>
                                    <option value="F">Mujer</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            {mode === "create" ? (
                                <button
                                    onClick={handleAddEvent}
                                    className="btn btn-primary rounded-xl px-4">
                                    Registrar
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleUpdateEvent}
                                        className="btn btn-primary rounded-xl px-4">
                                        Editar
                                    </button>
                                    <button
                                        onClick={handleDeleteEvent}
                                        className="btn btn-error rounded-xl px-4">
                                        Eliminar
                                    </button>
                                </>
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
