"use client"
import { useState } from "react"
import Link from "next/link"

const initialAssists = [
    {
        id: 1,
        familia: "Torres Catalan",
        servicio: "Domingo 9:00 AM",
        cantidad: "8",
        total: "",
    },
    {
        id: 2,
        familia: "Gonzales Caal",
        servicio: "Domingo 7:00 PM",
        cantidad: "4",
        total: "",
    },
]

const familiasOptions = ["Torres Catalan", "Gonzales Caal", "Perez Gomez"]
const serviciosOptions = [
    "Domingo 9:00 AM",
    "Domingo 7:00 PM",
    "Miércoles 7:00 PM",
]

const General_Assists = () => {
    const [assists, setAssists] = useState(initialAssists)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")
    const [modalOpen, setModalOpen] = useState(false)

    // Campos del modal
    const [familia, setFamilia] = useState("")
    const [servicio, setServicio] = useState("")
    const [cantidad, setCantidad] = useState("")

    // Filtrar registros según búsqueda
    const filteredAssists = assists.filter((assist) =>
        Object.values(assist)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
    )

    // Agregar nueva asistencia
    const handleAddAssist = () => {
        if (!familia || !servicio || !cantidad) return

        const newAssist = {
            id: assists.length + 1,
            familia,
            servicio,
            cantidad,
            total: "", // aquí luego puedes setear el total desde el endpoint
        }

        setAssists([...assists, newAssist])
        setFamilia("")
        setServicio("")
        setCantidad("")
        setModalOpen(false)
    }

    return (
        <div className="flex flex-col w-full h-full p-6 bg-base-100 ">
            {/* Controles superiores */}
            <h2 className="text-center text-xl font-bold">
                Listado de Asistencias
            </h2>
            <Link
                href={"/control"}
                className="btn btn-primary btn-sm mt-4 w-24 rounded-xl">
                <span>Regresar</span>
            </Link>
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2 mt-5">
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
                        placeholder="Buscar familia o servicio"
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
                        <option value={assists.length}>Todos</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-box border border-base-content/5 md:mt-5 bg-base-100 ">
                <table className="table table-zebra text-sm text-center">
                    <thead className="bg-base-300">
                        <tr>
                            <th>ID</th>
                            <th>Familia</th>
                            <th>Servicio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssists.slice(0, rowsPerPage).map((assist) => (
                            <tr key={assist.id}>
                                <td>{assist.id}</td>
                                <td>{assist.familia}</td>
                                <td>{assist.servicio}</td>
                                <td>{assist.cantidad}</td>
                                <td>{assist.total || "—"}</td>
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
                        <h3 className="font-bold text-lg">
                            Agregar Asistencia
                        </h3>
                        <div className="mt-4 flex flex-col gap-3">
                            {/* Selector familia */}
                            <select
                                value={familia}
                                onChange={(e) => setFamilia(e.target.value)}
                                className="select select-bordered w-full">
                                <option value="">Seleccionar familia</option>
                                {familiasOptions.map((f, i) => (
                                    <option key={i} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>

                            {/* Selector servicio */}
                            <select
                                value={servicio}
                                onChange={(e) => setServicio(e.target.value)}
                                className="select select-bordered w-full">
                                <option value="">Seleccionar servicio</option>
                                {serviciosOptions.map((s, i) => (
                                    <option key={i} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>

                            {/* Cantidad */}
                            <input
                                type="number"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                placeholder="Cantidad"
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
                                onClick={handleAddAssist}
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

export default General_Assists
