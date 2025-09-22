"use client"
import { useState } from "react"
import Link from "next/link"

const initialEvents = [
    { id: 1, HoraEvento: "Domingo 9:00 AM", descripcion: "Devocional" },
    { id: 2, HoraEvento: "Domingo 7:00 PM", descripcion: "Noche de Jóvenes" },
]

const Hours = () => {
    const [events, setEvents] = useState(initialEvents)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")
    const [modalOpen, setModalOpen] = useState(false)

    // Campos del formulario
    const [horaEvento, setHoraEvento] = useState("")
    const [descripcion, setDescripcion] = useState("")

    // Filtrar eventos según búsqueda
    const filteredEvents = events.filter((event) =>
        Object.values(event)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
    )

    // Guardar nuevo evento
    const handleAddEvent = () => {
        if (!horaEvento || !descripcion) return
        const newEvent = {
            id: events.length + 1,
            HoraEvento: horaEvento,
            descripcion,
        }
        setEvents([...events, newEvent])
        setHoraEvento("")
        setDescripcion("")
        setModalOpen(false)
    }

    return (
        <div className="flex flex-col w-full h-full p-6 bg-base-100 ">
            {/* Controles superiores */}
            <h2 className="text-center text-xl font-bold">
                Listado de Horarios de Servicios
            </h2>
            <Link
                href={"/control"}
                className="btn btn-primary btn-sm mt-4 w-24 rounded-xl">
                <span>Regresar</span>
            </Link>
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2 mt-5 ">
                <div className="flex gap-2 flex-wrap">
                    <button
                        className="btn btn-accent btn-sm"
                        onClick={() => setModalOpen(true)}>
                        <i className="fas fa-plus mr-1"></i> Agregar
                    </button>
                    <button className="btn btn-secondary btn-sm">
                        <i className="fas fa-file-excel mr-1"></i> Excel
                    </button>
                    <button className="btn btn-warning btn-sm">
                        <i className="fas fa-print mr-1"></i> Imprimir
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2">
                    <input
                        type="text"
                        placeholder="Buscar por hora o descripción"
                        className="input input-sm input-bordered w-full md:w-70"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        className="select select-sm w-30">
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={events.length}>Todos</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-box border border-base-content/5 ">
                <table className="table table-zebra w-full text-sm text-center">
                    <thead className="bg-base-300">
                        <tr>
                            <th>ID</th>
                            <th>Hora</th>
                            <th>Descripción</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.slice(0, rowsPerPage).map((event) => (
                            <tr key={event.id}>
                                <td>{event.id}</td>
                                <td>{event.HoraEvento}</td>
                                <td>{event.descripcion}</td>
                                <td className="flex gap-2 justify-center">
                                    <button className="btn btn-info btn-xs">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="btn btn-warning btn-xs">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="btn btn-error btn-xs">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Agregar Evento</h3>
                        <div className="mt-4 flex flex-col gap-3">
                            <input
                                type="text"
                                value={horaEvento}
                                onChange={(e) => setHoraEvento(e.target.value)}
                                placeholder="Hora del evento"
                                className="input input-bordered w-full"
                            />
                            <input
                                type="text"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Descripción"
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="modal-action">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="btn btn-ghost">
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddEvent}
                                className="btn btn-primary">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Hours
