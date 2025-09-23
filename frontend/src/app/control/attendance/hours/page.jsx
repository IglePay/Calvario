"use client"
import { useState } from "react"
import Link from "next/link"
import * as Yup from "yup"
import Modal from "@/components/ModalGeneral"
import { validateForm } from "@/utils/validator"
import { useServices } from "../../../../hooks/servicios/useServices"
import { exportToExcel, exportToPDF } from "@/utils/exportData"

// Schema de validación
const serviceSchema = Yup.object().shape({
    horario: Yup.string().required("Horario requerido"),
    descripcion: Yup.string().required("Descripción requerida"),
})

const Hours = () => {
    const { services, loading, createService, updateService, deleteService } =
        useServices()

    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)

    // Campos del formulario
    const [horaEvento, setHoraEvento] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [errors, setErrors] = useState({})

    // Filtrar servicios según búsqueda
    const filteredServices = services
        .filter((s) =>
            Object.values(s)
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase()),
        )
        .slice(0, rowsPerPage)

    // Guardar o actualizar servicio
    const handleSave = async () => {
        const values = { horario: horaEvento, descripcion }
        const validationErrors = await validateForm(serviceSchema, values)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        try {
            if (editingId) {
                await updateService(editingId, values)
                setEditingId(null)
            } else {
                await createService(horaEvento, descripcion)
            }

            setHoraEvento("")
            setDescripcion("")
            setErrors({})
            setModalOpen(false)
        } catch (err) {
            console.error("Error al guardar servicio:", err)
        }
    }

    const handleEdit = (service) => {
        setEditingId(service.idservicio)
        setHoraEvento(service.horario)
        setDescripcion(service.descripcion)
        setErrors({})
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("¿Seguro quieres eliminar este servicio?")) return
        try {
            await deleteService(id)
        } catch (err) {
            console.error("Error al eliminar servicio:", err)
        }
    }

    const exportData = filteredServices.map((s) => ({
        ID: s.idservicio,
        "Horario de Servicios": s.horario,
        Descripcion: s.descripcion,
    }))

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-2xl font-bold">
                Listado de Horarios de Servicios
            </h2>

            {/* Botones */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2 mt-5">
                <div className="flex gap-2 mt-2">
                    <Link href={"/control"} className="btn btn-primary btn-sm">
                        Regresar
                    </Link>
                    <button
                        className="btn btn-accent btn-sm"
                        onClick={() => {
                            setEditingId(null)
                            setHoraEvento("")
                            setDescripcion("")
                            setErrors({})
                            setModalOpen(true)
                        }}>
                        <i className="fas fa-plus mr-1"></i> Agregar
                    </button>
                    <button
                        onClick={() =>
                            exportToExcel(exportData, "HorarioServicio.xlsx")
                        }
                        className="btn btn-secondary btn-sm">
                        <i className="fas fa-file-excel mr-1"></i> Excel
                    </button>
                    <button
                        onClick={() =>
                            exportToPDF(exportData, "HorarioServicio.pdf")
                        }
                        className="btn bg-rose-800 text-white btn-sm">
                        <i className="fas fa-print mr-1"></i> PDF
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar servicio"
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
                            <th>Horario</th>
                            <th>Descripción</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4}>Cargando...</td>
                            </tr>
                        ) : (
                            filteredServices.map((service) => (
                                <tr key={service.idservicio}>
                                    <td>{service.idservicio}</td>
                                    <td>{service.horario}</td>
                                    <td>{service.descripcion}</td>
                                    <td className="flex gap-2 justify-center">
                                        <button
                                            className="btn btn-warning btn-xs"
                                            onClick={() => handleEdit(service)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-error btn-xs"
                                            onClick={() =>
                                                handleDelete(service.idservicio)
                                            }>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal usando componente ModalGeneral */}
            <Modal
                title={editingId ? "Editar Servicio" : "Agregar Servicio"}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}>
                <input
                    type="text"
                    value={horaEvento}
                    onChange={(e) => setHoraEvento(e.target.value)}
                    placeholder="Horario 06:00 AM"
                    className="input input-bordered w-full"
                />
                {errors.horario && (
                    <p className="text-red-500 text-sm">{errors.horario}</p>
                )}

                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción"
                    className="input input-bordered w-full"
                />
                {errors.descripcion && (
                    <p className="text-red-500 text-sm">{errors.descripcion}</p>
                )}
            </Modal>
        </div>
    )
}

export default Hours
