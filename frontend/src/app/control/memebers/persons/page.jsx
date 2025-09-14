"use client"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useMembers } from "@/hooks/members/useMembers"
import MembersModal from "../components/MembersModal"

const Persons = () => {
    const {
        members,
        loading,
        error,
        createMember,
        updateMember,
        deleteMember,
    } = useMembers()

    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editData, setEditData] = useState(null)

    const filteredMembers = useMemo(() => {
        if (!members) return []
        return members.filter((member) =>
            Object.values(member)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
        )
    }, [members, searchQuery])

    const handledAdd = () => {
        setEditData(null)
        setIsModalOpen(true)
    }

    const handlEdit = (member) => {
        setEditData(member)
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (confirm("¿Seguro que desea eliminar este miembro?")) {
            await deleteMember(id)
        }
    }

    const handleSubmit = async (data) => {
        try {
            if (editData) {
                await updateMember(editData.idMiembro, data)
            } else {
                await createMember(data)
            }
            setIsModalOpen(false)
            setEditData(null)
        } catch (err) {
            console.error("Error al guardar el miembro:", err)
        }
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h1 className="text-2xl font-bold">Listado de Miembros</h1>

            {/* Botones */}
            <div className="flex gap-4 mt-4">
                <Link
                    href={"/control"}
                    className="btn btn-primary btn-sm w-24 ">
                    Regresar
                </Link>
                <button onClick={handledAdd} className="btn btn-accent btn-sm">
                    <i className="fas fa-plus"></i> Agregar
                </button>
                <button
                    onClick={() => exportToExcel(exportData, "miembros.xlsx")}
                    className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button
                    onClick={() => exportToPDF(exportData, "miembros.pdf")}
                    className="btn bg-rose-800 text-white btn-sm">
                    <i className="fas fa-print mr-1"></i> PDF
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    placeholder="Buscar por nombre, teléfono, año"
                    className="input input-sm input-bordered w-full md:flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="select select-sm w-36">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                {loading ? (
                    <div className="p-4 text-center">Cargando...</div>
                ) : error ? (
                    <div className="p-4 text-center text-error">{error}</div>
                ) : (
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
                                <th>Procesos</th>
                                <th>Grupo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers
                                .slice(0, rowsPerPage)
                                .map((member) => (
                                    <tr
                                        key={member.idMiembro}
                                        className="text-center">
                                        <td>{member.idMiembro}</td>
                                        <td>{member.nombre}</td>
                                        <td>{member.edad}</td>
                                        <td>{member.telefono}</td>
                                        <td>{member.direccion}</td>
                                        <td>{member.fechallegada}</td>
                                        <td>{member.bautismo ? "Sí" : "No"}</td>
                                        <td>{member.procesosterminado}</td>
                                        <td>
                                            {member.grupo?.nombregrupo || ""}
                                        </td>
                                        <td className="flex gap-2 items-center justify-center">
                                            <button
                                                onClick={() =>
                                                    handlEdit(member)
                                                }
                                                className="btn btn-warning btn-xs">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        member.idMiembro,
                                                    )
                                                }
                                                className="btn btn-error btn-xs">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
            <MembersModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editData}
                mode={editData ? "edit" : "create"}
                grupos={[]}></MembersModal>
        </div>
    )
}

export default Persons
