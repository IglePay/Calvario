"use client"
import { useState } from "react"

const membersData = [
    {
        id: 1,
        nombre: "Caballeros",
        actividades: "ayuno, oracion, estudio biblico",
        fecha: "10/08/2023",
        hora: "19:00",
    },
    {
        id: 2,
        nombre: "Damas",
        actividades: "vigilia por la familia y el ministerio de niños",
        fecha: "11/08/2023",
        hora: "19:00",
    },
]

const Activities = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")

    // Filtrar miembros según búsqueda
    const filteredMembers = membersData.filter((member) =>
        Object.values(member)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="flex flex-col w-full h-full p-6 bg-base-100">
            {/* Controles superiores */}
            <h2 className="text-center text-xl font-bold">
                Actividades por Ministerios
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2 mt-5">
                <div className="flex gap-2 flex-wrap">
                    <button className="btn btn-accent btn-sm">
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
                        placeholder="Buscar por ministerio, actividad"
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
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                        <option value={membersData.length}>Todos</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-box border border-base-content/5 ">
                <table className="table table-zebra w-full text-sm">
                    <thead className="bg-gray-300 text-center">
                        <tr>
                            <th>ID</th>
                            <th>Ministerios</th>
                            <th>Actividades</th>
                            <th>fecha</th>
                            <th>hora</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers
                            .slice(0, rowsPerPage)
                            .map((member, index) => (
                                <tr key={member.id}>
                                    <td>{member.id}</td>
                                    <td>{member.nombre}</td>
                                    <td>{member.actividades}</td>
                                    <td>{member.fecha}</td>
                                    <td>{member.hora}</td>
                                    <td className="flex gap-2">
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
        </div>
    )
}

export default Activities
