"use client"
import Link from "next/link"
import { useState } from "react"
import { useGrupos } from "../../../hooks/Groups/useGrupos.jsx"
import GrupoModal from "./components/GrupoModal.jsx"
import { exportToExcel, exportToPDF } from "@/utils/exportData"

export default function Groups() {
    const { grupos, loading, createGrupo, updateGrupo, deleteGrupo, error } =
        useGrupos()

    const [modalOpen, setModalOpen] = useState(false)
    const [editingGrupo, setEditingGrupo] = useState(null)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")

    const openModal = (grupo = null) => {
        setEditingGrupo(grupo)
        setModalOpen(true)
    }

    const handleSave = (data) => {
        if (editingGrupo) {
            updateGrupo(editingGrupo.idGrupo, data)
        } else {
            createGrupo(data)
        }
    }

    const exportData = grupos.map((g) => ({
        ID: g.idGrupo,
        Nombre: g.nombregrupo,
    }))

    return (
        <div className=" flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Listado de Ministerios</h2>

            <div className="flex gap-4 mt-4">
                <Link
                    href={"/control"}
                    className="btn btn-primary btn-sm w-24 ">
                    {" "}
                    Regresar
                </Link>
                <button
                    onClick={() => openModal()}
                    className="btn btn-accent btn-sm">
                    <i className="fas fa-plus"></i> Agregar
                </button>
                <button
                    onClick={() =>
                        exportToExcel(exportData, "Ministerios.xlsx")
                    }
                    className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button
                    onClick={() => exportToPDF(exportData, "Ministerios.pdf")}
                    className="btn bg-rose-800 text-white btn-sm">
                    <i className="fas fa-print mr-1"></i> PDF
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grupos.map((grupo) => (
                                <tr key={grupo.idGrupo} className="text-center">
                                    <td>{grupo.idGrupo}</td>
                                    <td>{grupo.nombregrupo}</td>
                                    <td className="flex gap-2 items-center justify-center">
                                        <button
                                            className="btn btn-warning btn-xs"
                                            onClick={() => openModal(grupo)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-error btn-xs"
                                            onClick={() =>
                                                deleteGrupo(grupo.idGrupo)
                                            }>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <GrupoModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                initialData={editingGrupo}
            />
        </div>
    )
}
