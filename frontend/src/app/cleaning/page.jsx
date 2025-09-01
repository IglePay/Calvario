"use client"

import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState } from "react"
import Link from "next/link"

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
    const [events, setEvents] = useState([
        {
            title: "Juan Perez",
            start: moment().hour(9).minute(0).toDate(),
            end: moment().hour(11).minute(0).toDate(),
            gender: "M",
        },
        {
            title: "Carolina Gomez",
            start: moment().hour(9).minute(0).toDate(),
            end: moment().hour(11).minute(0).toDate(),
            gender: "F",
        },
    ])

    const [isOpen, setIsOpen] = useState(false)
    const [modalData, setModalData] = useState({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        gender: "M",
    })

    const eventStyleGetter = (event) => {
        let backgroundColor = event.gender === "M" ? "#3B82F6" : "#F472B6"
        return {
            style: {
                backgroundColor,
                borderRadius: "6px",
                color: "white",
                border: "none",
                display: "block",
                padding: "2px 4px",
                fontSize: "0.85rem",
            },
        }
    }

    const handleSelectEvent = (event) => {
        alert(
            `Nombre: ${event.title}\nHora: ${moment(event.start).format(
                "HH:mm",
            )} - ${moment(event.end).format("HH:mm")}`,
        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setModalData((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddEvent = () => {
        const start = moment(
            `${modalData.date} ${modalData.startTime}`,
            "YYYY-MM-DD HH:mm",
        ).toDate()
        const end = moment(
            `${modalData.date} ${modalData.endTime}`,
            "YYYY-MM-DD HH:mm",
        ).toDate()

        const newEvent = {
            title: modalData.title,
            start,
            end,
            gender: modalData.gender,
        }

        setEvents((prev) => [...prev, newEvent])
        setIsOpen(false)

        // Aquí puedes llamar tu endpoint:
        // fetch("/api/cleaning/add", { method: "POST", body: JSON.stringify(newEvent) })
    }

    const handleDeleteEvent = () => {
        setEvents((prev) => prev.filter((e) => e.title !== modalData.title))
        setIsOpen(false)

        // Aquí puedes llamar tu endpoint:
        // fetch("/api/cleaning/delete", { method: "POST", body: JSON.stringify({ title: modalData.title }) })
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Calendario de Limpieza</h1>

            <div className="flex gap-2 mb-4">
                <Link href={"/"} className="btn btn-primary  rounded-xl">
                    <span>Regresar</span>
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-accent rounded-xl">
                    Registrar
                </button>
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-error rounded-xl">
                    Eliminar
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-lg">
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

            {/* Modal simple con Tailwind */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            Registrar / Eliminar Persona
                        </h2>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Nombre"
                                name="title"
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
                            <button
                                onClick={handleDeleteEvent}
                                className="btn btn-error rounded-xl px-4">
                                Eliminar
                            </button>
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
