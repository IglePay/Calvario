"use client"

import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../../globals.css"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCleaning } from "@/hooks/cleaning/useCleaning"

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
    const [errorMessage, setErrorMessage] = useState("")

    const {
        events,
        setEvents,
        miembros,
        grupos: gruposHook,
        addEvent,
        updateEvent,
        deleteEvent,
        fetchData,
        fetchGrupos,
    } = useCleaning()

    const [grupos, setGrupos] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState("create")
    const [modalData, setModalData] = useState({
        id: null,
        idMiembro: "",
        idGrupo: "",
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        gender: "M",
    })

    // Traer datos iniciales
    useEffect(() => {
        fetchData()
        fetchGrupos().then((data) => setGrupos(data))
    }, [])

    const openModal = (modeType = "create", data = null) => {
        setMode(modeType)
        setErrorMessage("")
        if (data) {
            setModalData(data)
        } else {
            setModalData({
                id: null,
                idMiembro: "",
                idGrupo: "",
                title: "",
                date: "",
                startTime: "",
                endTime: "",
                gender: "M",
            })
        }
        setIsOpen(true)
    }

    const handleSelectEvent = (event) => {
        setModalData({
            id: event.id,
            idMiembro: event.idMiembro,
            idGrupo: event.idGrupo || "",
            title: event.title,
            date: moment(event.start).format("YYYY-MM-DD"),
            startTime: moment(event.start).format("HH:mm"),
            endTime: moment(event.end).format("HH:mm"),
            gender: event.gender,
        })
        setErrorMessage("")
        setMode("edit")
        setIsOpen(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setModalData((prev) => ({ ...prev, [name]: value }))

        if (name === "idMiembro") {
            const miembro = miembros.find(
                (m) => m.idMiembro === parseInt(value),
            )
            if (miembro) {
                setModalData((prev) => ({
                    ...prev,
                    gender:
                        miembro.genero?.nombregenero === "Femenino" ? "F" : "M",
                }))
            }
        }
    }

    const handleAddEvent = async () => {
        if (!modalData.idMiembro) {
            setErrorMessage("Debes seleccionar un miembro")
            return
        }

        const miembroSel = miembros.find(
            (m) => m.idMiembro === parseInt(modalData.idMiembro),
        )
        if (!miembroSel) {
            setErrorMessage("Miembro no encontrado")
            return
        }

        const start = new Date(
            `${modalData.date}T${modalData.startTime || "00:00"}`,
        )

        const newEvent = {
            idMiembro: parseInt(modalData.idMiembro),
            fechaLimpieza: start,
            idGrupo: modalData.idGrupo
                ? parseInt(modalData.idGrupo)
                : miembroSel.idGrupo || undefined,
        }

        try {
            const saved = await addEvent(newEvent)
            const grupoSel = grupos.find((g) => g.idGrupo === newEvent.idGrupo)

            setEvents((prev) => [
                ...prev,
                {
                    id: saved.idLimpieza,
                    title: grupoSel
                        ? grupoSel.nombregrupo
                        : `${miembroSel.nombre} ${miembroSel.apellido}`,
                    start,
                    end: new Date(start.getTime() + 2 * 60 * 60 * 1000),
                    gender:
                        miembroSel.genero?.nombregenero === "Femenino"
                            ? "F"
                            : "M",
                    idMiembro: newEvent.idMiembro,
                    idGrupo: newEvent.idGrupo || null,
                },
            ])
            setIsOpen(false)
            setErrorMessage("")
        } catch (err) {
            console.error(err)
            setErrorMessage("Ocurrió un error al registrar la limpieza")
        }
    }

    const handleUpdateEvent = async () => {
        if (!modalData.idMiembro) {
            setErrorMessage("Debes seleccionar un miembro")
            return
        }

        const miembroSel = miembros.find(
            (m) => m.idMiembro === parseInt(modalData.idMiembro),
        )
        if (!miembroSel) {
            setErrorMessage("Miembro no encontrado")
            return
        }

        const start = new Date(
            `${modalData.date}T${modalData.startTime || "00:00"}`,
        )

        const updatedEvent = {
            idMiembro: parseInt(modalData.idMiembro),
            fechaLimpieza: start,
            idGrupo: modalData.idGrupo
                ? parseInt(modalData.idGrupo)
                : miembroSel.idGrupo || undefined,
        }

        try {
            await updateEvent(modalData.id, updatedEvent)
            const grupoSel = grupos.find(
                (g) => g.idGrupo === updatedEvent.idGrupo,
            )

            setEvents((prev) =>
                prev.map((e) =>
                    e.id === modalData.id
                        ? {
                              ...e,
                              title: grupoSel
                                  ? grupoSel.nombregrupo
                                  : `${miembroSel.nombre} ${miembroSel.apellido}`,
                              start,
                              end: new Date(
                                  start.getTime() + 2 * 60 * 60 * 1000,
                              ),
                              gender:
                                  miembroSel.genero?.nombregenero === "Femenino"
                                      ? "F"
                                      : "M",
                              idMiembro: updatedEvent.idMiembro,
                              idGrupo: updatedEvent.idGrupo || null,
                          }
                        : e,
                ),
            )
            setIsOpen(false)
            setErrorMessage("")
        } catch (err) {
            console.error(err)
            setErrorMessage("Ocurrió un error al actualizar la limpieza")
        }
    }

    const handleDeleteEvent = async () => {
        try {
            await deleteEvent(modalData.id)
            setEvents((prev) => prev.filter((e) => e.id !== modalData.id))
            setIsOpen(false)
            setErrorMessage("")
        } catch (err) {
            console.error(err)
            setErrorMessage("Ocurrió un error al eliminar la limpieza")
        }
    }

    const eventStyleGetter = (event) => {
        const gender = (event.gender || "M").toUpperCase()
        const backgroundColor = gender === "M" ? "#3B82F6" : "#F472B6"
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

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold mt-3">Calendario de Limpieza</h1>

            <div className="flex gap-4 justify-center items-center mt-3">
                <Link href="/control" className="btn btn-primary">
                    Regresar
                </Link>
                <button
                    onClick={() => openModal("create")}
                    className="btn btn-accent">
                    Registrar
                </button>
            </div>

            <div className="bg-base-200 p-4 rounded-xl shadow-lg mt-4">
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
                        <h2 className="text-xl font-bold mb-2">
                            {mode === "create"
                                ? "Registrar Limpieza"
                                : "Editar / Eliminar Limpieza"}
                        </h2>

                        {/* Mensaje de error */}
                        {errorMessage && (
                            <div className="bg-red-100 text-red-800 p-2 rounded mb-3">
                                {errorMessage}
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
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
                                        {m.nombre} {m.apellido} (
                                        {m.genero?.nombregenero})
                                    </option>
                                ))}
                            </select>

                            <select
                                name="idGrupo"
                                value={modalData.idGrupo}
                                onChange={handleChange}
                                className="select select-bordered w-full">
                                <option value="">
                                    Seleccione un grupo (opcional)
                                </option>
                                {grupos.map((g) => (
                                    <option key={g.idGrupo} value={g.idGrupo}>
                                        {g.nombregrupo}
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
                                onClick={() => {
                                    setIsOpen(false)
                                    setErrorMessage("")
                                }}
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
