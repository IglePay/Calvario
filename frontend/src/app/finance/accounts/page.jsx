"use client"
import { useState } from "react"
import Link from "next/link"
const membersData = [
    {
        id: 1,
        Cuenta: "ofrenda",
        Tipo: "ingreso",
        Fondo: "Saldo General",
        Saldo: 2020,
        Fecha: "12/05/2023",
    },
    {
        id: 2,
        Cuenta: "diezmo",
        Tipo: "ingreso",
        Fondo: "Saldo General",
        Saldo: 2019,
        Fecha: "10/04/2023",
    },
]

const Accounts = () => {
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
                Listado de Cuentas
            </h2>
            <Link
                href={"/"}
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
                        placeholder="Buscar por cuenta, tipo, fecha"
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
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cuenta</th>
                            <th>Tipo</th>
                            <th>Fondo</th>
                            <th>Saldo</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers
                            .slice(0, rowsPerPage)
                            .map((member, index) => (
                                <tr key={member.id}>
                                    <td>{member.id}</td>
                                    <td>{member.Cuenta}</td>
                                    <td>{member.Tipo}</td>
                                    <td>{member.Fondo}</td>
                                    <td>{member.Saldo}</td>
                                    <td>{member.Fecha}</td>
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
export default Accounts
