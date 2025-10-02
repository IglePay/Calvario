"use client"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useFamiliasAsistencia } from "@/hooks/sumary/useFamiliasAsistencia"
import Modal from "@/components/ModalGeneral"
import Pagination from "@/components/Paginacion"
import { exportToExcel, exportToPDF } from "@/utils/exportData"
import * as Yup from "yup"

const Summary = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const idservicio = Number(searchParams.get("idservicio"))
    const fechaServicio = searchParams.get("fechaServicio")

    const {
        families,
        loading,
        error,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        total,
        totalPages,
        search,
        setSearch,
        getFamiliasPorServicio,
        updateFamiliaAsistencia,
        deleteFamiliaAsistencia,
    } = useFamiliasAsistencia(idservicio, fechaServicio)

    const [modalOpen, setModalOpen] = useState(false)
    const [editingFamily, setEditingFamily] = useState(null)
    const [nombreFamilia, setNombreFamilia] = useState("")
    const [cantidad, setCantidad] = useState(0)
    const [idServicioModal, setIdServicioModal] = useState(null)
    const [formErrors, setFormErrors] = useState({})

    const schema = Yup.object().shape({
        cantidadAsistentes: Yup.number().required().min(1),
        idservicio: Yup.number().required(),
    })

    const openEditModal = (f) => {
        setEditingFamily(f)
        setNombreFamilia(f.familia?.nombreFamilia || "")
        setCantidad(f.cantidad_asistentes || 0)
        setIdServicioModal(f.servicio?.idservicio || null)
        setFormErrors({})
        setModalOpen(true)
    }

    const handleSave = async () => {
        if (!editingFamily?.idasistencia) return

        try {
            // Validar campos
            await schema.validate(
                { cantidadAsistentes: cantidad, idservicio: idServicioModal },
                { abortEarly: false },
            )

            // Llamar al hook para actualizar en backend
            await updateFamiliaAsistencia(editingFamily.idasistencia, {
                cantidadAsistentes: cantidad,
                idfamilia: editingFamily.familia?.idfamilia,
                idservicio: idServicioModal,
                fechaServicio: editingFamily.fechaServicio,
            })

            // Cerrar modal
            setModalOpen(false)

            // Refrescar la lista en memoria y paginación
            await getFamiliasPorServicio(page, rowsPerPage, search)
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = {}
                err.inner.forEach((e) => (errors[e.path] = e.message))
                setFormErrors(errors)
            } else {
                console.error("[Summary] Error al guardar:", err)
            }
        }
    }

    const handleDelete = (id) => {
        // eliminar confirm si no quieres alerta
        deleteFamiliaAsistencia(id)
            .then(() => {
                return getFamiliasPorServicio() // refresca la tabla
            })
            .catch((err) => {
                // opcional: mostrar error en UI
                setError(err.message || "Error al eliminar asistencia")
            })
    }

    const exportData = families.map((f) => ({
        Familias: f.familia?.nombreFamilia || "",
        Servicio: f.servicio?.horario || f.servicio?.nombre,
        Cantidad: f.cantidad_asistentes || 0,
    }))

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-2xl font-bold mt-4">
                {idservicio && fechaServicio
                    ? `${families[0]?.servicio?.horario || "Horario"} del ${fechaServicio}`
                    : "Resumen de Asistentes"}
            </h2>

            <div className="flex gap-2 mt-4">
                <button
                    className="btn btn-primary btn-sm mb-4"
                    onClick={() => router.back()}>
                    Regresar
                </button>
                <button
                    onClick={() => exportToExcel(exportData, "Asistencia.xlsx")}
                    className="btn btn-secondary btn-sm">
                    Excel
                </button>
                <button
                    onClick={() => exportToPDF(exportData, "Asistencia.pdf")}
                    className="btn bg-rose-800 text-white btn-sm">
                    PDF
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    placeholder="Buscar familia"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                    }}
                    className="input input-sm input-bordered w-full md:flex-1"
                />
                <select
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value))
                        setPage(1)
                    }}
                    className="select select-sm w-36">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                {error && <div className="alert alert-error">{error}</div>}
                {loading ? (
                    <div className="p-6 text-center">Cargando...</div>
                ) : (
                    <table className="table table-zebra text-sm text-center">
                        <thead className="bg-base-300">
                            <tr>
                                <th>#</th>
                                <th>Familia</th>
                                <th>Cantidad</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {families.length > 0 ? (
                                families.map((f, idx) => (
                                    <tr key={f.idasistencia}>
                                        <td>
                                            {idx + 1 + (page - 1) * rowsPerPage}
                                        </td>
                                        <td>
                                            {f.familia?.nombreFamilia || ""}
                                        </td>
                                        <td>{f.cantidad_asistentes || 0}</td>
                                        <td className="flex gap-2 items-center justify-center">
                                            <button
                                                className="btn btn-warning btn-xs"
                                                onClick={() =>
                                                    openEditModal(f)
                                                }>
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() =>
                                                    handleDelete(f.idasistencia)
                                                }>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>
                                        No se encontraron familias
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                onPageChange={setPage}
            />

            {modalOpen && (
                <Modal
                    title={editingFamily ? "Editar Familia" : "Familia"}
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                    saveLabel={editingFamily ? "Actualizar" : "Guardar"}>
                    <input
                        type="text"
                        placeholder="Nombre Familia"
                        value={nombreFamilia}
                        onChange={(e) => setNombreFamilia(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {formErrors.nombreFamilia && (
                        <p className="text-red-500 text-sm">
                            {formErrors.nombreFamilia}
                        </p>
                    )}
                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                        className="input input-bordered w-full"
                    />
                    {formErrors.cantidad && (
                        <p className="text-red-500 text-sm">
                            {formErrors.cantidad}
                        </p>
                    )}
                </Modal>
            )}
        </div>
    )
}

export default Summary
