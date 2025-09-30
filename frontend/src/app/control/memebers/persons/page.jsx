"use client"
import Link from "next/link"
import { useState } from "react"
import { useMembers } from "@/hooks/members/useMembers"
import { exportToExcel, exportToPDF } from "@/utils/exportData"
import MembersModal from "../components/MembersModal"
import Pagination from "../../../../components/Paginacion"

const Persons = () => {
    const {
        members,
        loading,
        error,
        createMember,
        updateMember,
        deleteMember,
        grupos,
        generos,
        estados,
        bautizados,
        servidores,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        total,
        totalPages,
        search,
        setSearch,
        fetchMembers, //  forzar refetch si quieres
    } = useMembers()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editData, setEditData] = useState(null)

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

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        setPage(1) // resetear a página 1 al buscar
    }

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value))
        setPage(1) // resetear a página 1 al cambiar el límite
    }

    const exportData = members.map((member) => ({
        ID: member.idMiembro,
        Nombre: member.nombre,
        Apellido: member.apellido,
        Edad: member.edad,
        Teléfono: member.telefono,
        Dirección: member.direccion,
        "Año de llegada": member.fechaLlegada,
        Bautismo:
            bautizados.find((b) => b.idBautizado === member.idBautizado)
                ?.bautizadoEstado || "No",
        Procesos: member.procesosterminado,
        Grupo: member.grupo?.nombregrupo || "",
    }))

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h1 className="text-2xl font-bold">Listado de Miembros</h1>

            {/* Botones */}
            <div className="flex gap-2 mt-4">
                <Link href={"/control"} className="btn btn-primary btn-sm">
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
                    placeholder="Buscar por nombre, apellido, teléfono..."
                    className="input input-sm input-bordered w-full md:flex-1"
                    value={search}
                    onChange={handleSearchChange}
                />
                <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
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
                                <th>Apellido</th>
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
                            {members.map((member, index) => (
                                <tr
                                    key={member.idMiembro ?? index}
                                    className="text-center">
                                    <td>
                                        {(page - 1) * rowsPerPage + index + 1}
                                    </td>
                                    <td>{member.nombre}</td>
                                    <td>{member.apellido}</td>
                                    <td>{member.edad}</td>
                                    <td>{member.telefono}</td>
                                    <td>{member.direccion}</td>
                                    <td>{member.fechaLlegada}</td>
                                    <td>
                                        {bautizados.find(
                                            (b) =>
                                                b.idBautizado ===
                                                member.idBautizado,
                                        )?.bautizadoEstado || "No"}
                                    </td>
                                    <td>{member.procesosterminado}</td>
                                    <td>{member.grupo?.nombregrupo || ""}</td>
                                    <td className="flex gap-2 items-center justify-center">
                                        <button
                                            onClick={() => handlEdit(member)}
                                            className="btn btn-warning btn-xs">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(member.idMiembro)
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

            {/* Paginación */}
            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                onPageChange={setPage}
            />

            <MembersModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editData}
                mode={editData ? "edit" : "create"}
                grupos={grupos}
                generos={generos}
                estados={estados}
                bautizados={bautizados}
                servidores={servidores}
            />
        </div>
    )
}

export default Persons
