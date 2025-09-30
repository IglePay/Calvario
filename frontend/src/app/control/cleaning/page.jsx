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
    const [view, setView] = useState("month")
    const [errorMessage, setErrorMessage] = useState("")
    const [currentDate, setCurrentDate] = useState(new Date())
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
        date: "",
        startTime: "",
        endTime: "",
        gender: "M",
    })

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
                    gender: miembro.genero?.idGenero === 2 ? "F" : "M",
                }))
            }
        }
    }

    const handleAddOrUpdateEvent = async (isUpdate = false) => {
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

        const datePart = modalData.date
        const timePart = modalData.startTime || "12:00"
        const start = moment(`${datePart}T${timePart}`).toDate()

        const newEventData = {
            idMiembro: miembroSel.idMiembro,
            fechaLimpieza: start.toISOString(),
            idGrupo: modalData.idGrupo
                ? parseInt(modalData.idGrupo)
                : miembroSel.idGrupo || undefined,
        }

        try {
            const saved = isUpdate
                ? await updateEvent(modalData.id, newEventData)
                : await addEvent(newEventData)

            const grupoSel = grupos.find(
                (g) => g.idGrupo === newEventData.idGrupo,
            )

            const eventObj = {
                id: saved.idLimpieza,
                title:
                    grupoSel?.nombregrupo ||
                    `${miembroSel.nombre} ${miembroSel.apellido}`,
                start,
                end: moment(start).add(2, "hours").toDate(),
                gender: miembroSel.genero?.idGenero === 2 ? "F" : "M",
                idMiembro: saved.idMiembro,
                idGrupo: saved.idGrupo || null,
            }

            setEvents((prev) =>
                isUpdate
                    ? prev.map((e) => (e.id === modalData.id ? eventObj : e))
                    : [...prev, eventObj],
            )

            setIsOpen(false)
            setErrorMessage("")
        } catch (err) {
            console.error(err)
            setErrorMessage(
                `Ocurrió un error al ${isUpdate ? "actualizar" : "registrar"} la limpieza`,
            )
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
        const backgroundColor = event.gender === "F" ? "#F472B6" : "#3B82F6"
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
            <h1 className="text-2xl font-bold mt-3">Calendario General</h1>

            <div className="flex gap-2 justify-center items-center mt-3">
                <Link href="/control" className="btn text-white bg-gray-700">
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
                    date={currentDate}
                    onNavigate={(date) => setCurrentDate(date)}
                    view={view}
                    onView={(newView) => setView(newView)}
                    views={["month", "week", "day", "agenda"]}
                    defaultView="month"
                />
            </div>

            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="text-xl font-bold">
                            {mode === "create"
                                ? "Registrar Limpieza"
                                : "Editar / Eliminar Limpieza"}
                        </h2>

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
                                        {m.nombre} {m.apellido}
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
                            <input
                                type="time"
                                name="startTime"
                                value={modalData.startTime}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="flex justify-center gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setErrorMessage("")
                                }}
                                className="btn bg-gray-700 text-white rounded-xl px-4">
                                Cancelar
                            </button>
                            {mode === "create" ? (
                                <button
                                    onClick={() =>
                                        handleAddOrUpdateEvent(false)
                                    }
                                    className="btn btn-accent rounded-xl px-4">
                                    Registrar
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() =>
                                            handleAddOrUpdateEvent(true)
                                        }
                                        className="btn btn-warning btn-md rounded-xl">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={handleDeleteEvent}
                                        className="btn btn-error btn-md rounded-xl">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
