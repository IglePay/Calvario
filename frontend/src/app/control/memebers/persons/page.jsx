"use client"
import { useState } from "react"
import Link from "next/link"
const membersData = [
    {
        id: 1,
        nombre: "Cy Ganderton",
        edad: 28,
        telefono: "123456789",
        direccion: "Canada",
        añoLlegada: 2020,
        bautismo: "Sí",
        procesos: "Terminados",
        areas: "Área 1",
    },
    {
        id: 2,
        nombre: "Brice Swyre",
        edad: 32,
        telefono: "987654321",
        direccion: "China",
        añoLlegada: 2019,
        bautismo: "No",
        procesos: "En curso",
        areas: "Área 2",
    },
]

const Persons = () => {
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
                Listado de Miembros
            </h2>
            <Link
                href={"/control"}
                className="btn btn-primary btn-sm mt-4 w-24 rounded-xl">
                <span>Regresar</span>
            </Link>
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
                        placeholder="Buscar por nombre, teléfono, año"
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
                    <thead className="bg-base-300 text-center">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Año de llegada</th>
                            <th>Bautismo</th>
                            <th>Procesos terminados</th>
                            <th>Áreas de servicios</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers
                            .slice(0, rowsPerPage)
                            .map((member, index) => (
                                <tr key={member.id} className="text-center">
                                    <td>{member.id}</td>
                                    <td>{member.nombre}</td>
                                    <td>{member.edad}</td>
                                    <td>{member.telefono}</td>
                                    <td>{member.direccion}</td>
                                    <td>{member.añoLlegada}</td>
                                    <td>{member.bautismo}</td>
                                    <td>{member.procesos}</td>
                                    <td>{member.areas}</td>
                                    <td className="flex gap-2 items-center justify-center">
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

export default Persons
