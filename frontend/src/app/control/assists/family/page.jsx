"use client"
import { useState } from "react"
import Link from "next/link"

const membersData = [
    { id: 1, Familias: "Familia Perez Gonzales", Cantidadmiembros: "9" },
    { id: 2, Familias: "Familia Caal Pop", Cantidadmiembros: "12" },
]

const Family = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)

    // Filtrar miembros según búsqueda
    const filteredMembers = membersData.filter((member) =>
        Object.values(member)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase()),
    )

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            {/* Controles superiores */}
            <h2 className="text-2xl font-bold">Listado de Familias</h2>

            <div className="flex gap-2 mt-4">
                <Link href={"/control"} className="btn btn-primary btn-sm ">
                    Regresar
                </Link>

                <button
                    className="btn btn-accent btn-sm "
                    onClick={() => setModalOpen(true)}>
                    <i className="fas fa-plus mr-1"></i> Agregar
                </button>
            </div>

            {/* Buscador y rows */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar familia"
                    className="input input-sm input-bordered w-full md:flex-1"
                />
                <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="select select-sm w-36">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                <table className="table table-zebra w-full text-sm text-center">
                    <thead className="bg-base-300">
                        <tr>
                            <th>ID</th>
                            <th>Familias</th>
                            <th>Cantidad miembros</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.slice(0, rowsPerPage).map((member) => (
                            <tr key={member.id}>
                                <td>{member.id}</td>
                                <td>{member.Familias}</td>
                                <td>{member.Cantidadmiembros}</td>
                                <td className="flex gap-2 justify-center">
                                    <button className="btn btn-info btn-xs">
                                        <i className="fa-solid fa-rotate-right"></i>
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
                        <h3 className="font-bold text-lg">Agregar Familia</h3>
                        <div className="mt-4 flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Nombre de la familia"
                                className="input input-bordered w-full"
                            />
                            <input
                                type="number"
                                placeholder="Cantidad de miembros"
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="modal-action">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="btn btn-ghost">
                                Cancelar
                            </button>
                            <button className="btn btn-primary">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Family
