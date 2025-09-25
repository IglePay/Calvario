"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAssistance } from "@/hooks/attendance/useAttendace"
import * as Yup from "yup"
import Modal from "@/components/ModalGeneral"
import { validateForm } from "@/utils/validator"
import Pagination from "@/components/Paginacion"
import { exportToExcel, exportToPDF } from "@/utils/exportData"

const Summary = () => {
    const schema = Yup.object().shape({
        cantidadAsistentes: Yup.number()
            .required("Cantidad es requerida")
            .min(1, "Cantidad inválida"),
        idservicio: Yup.number().required("Debe seleccionar un servicio"),
    })
    const searchParams = useSearchParams()
    const router = useRouter()

    const idservicio = Number(searchParams.get("idservicio"))
    const fechaServicio = searchParams.get("fechaServicio")

    const { getFamiliasPorServicio, updateAssist, deleteAssist, services } =
        useAssistance()

    const [familias, setFamilias] = useState([])
    const [idServicioModal, setIdServicioModal] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [search, setSearch] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const filteredFamilias = familias.filter((f) =>
        f.familia.nombreFamilia.toLowerCase().includes(search.toLowerCase()),
    )

    //represcar tabla
    const refreshFamilias = async () => {
        const data = await getFamiliasPorServicio(idservicio, fechaServicio)
        setFamilias(data)
    }

    const [modalOpen, setModalOpen] = useState(false)
    const [editingFamily, setEditingFamily] = useState(null)

    //formulario
    const [nombreFamilia, setNombreFamilia] = useState("")
    const [cantidad, setCantidad] = useState(0)
    const [formErrors, setFormErrors] = useState({})
    //funciones para abrir modal

    const openEditModal = (f) => {
        console.log("Abriendo modal con:", f)
        setEditingFamily(f)
        setNombreFamilia(f.familia.nombreFamilia)
        setCantidad(f.cantidad_asistentes)
        setIdServicioModal(f.servicio.idservicio || null)
        setFormErrors({})
        setModalOpen(true)
    }

    const handleSave = async () => {
        console.log("editingFamily:", editingFamily)
        console.log("cantidad:", cantidad)
        console.log("idServicioModal:", idServicioModal)

        if (!editingFamily || !editingFamily.idasistencia) {
            alert("Asistencia inválida")
            return
        }

        const formData = {
            cantidadAsistentes: cantidad,
            idservicio: idServicioModal,
        }

        try {
            // Validar usando el schema ya definido
            await schema.validate(formData, { abortEarly: false })

            console.log("Datos validados, enviando updateAssist")

            await updateAssist(editingFamily.idasistencia, {
                cantidadAsistentes: cantidad,
                idfamilia: editingFamily.familia.idfamilia,
                idservicio: idServicioModal,
                fechaServicio: editingFamily.fechaServicio,
            })

            setModalOpen(false)
            await refreshFamilias()
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = {}
                err.inner.forEach((e) => {
                    errors[e.path] = e.message
                })
                console.log("Errores de validación:", errors)
                setFormErrors(errors)
            } else {
                console.error("Error al actualizar:", err)
                alert("Error al actualizar")
            }
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar esta asistencia?")) return
        try {
            await deleteAssist(id)
            await refreshFamilias()
        } catch (err) {
            console.error(err)
            alert("Error al eliminar")
        }
    }

    useEffect(() => {
        if (!idservicio || !fechaServicio) {
            setError("Parámetros inválidos")
            setLoading(false)
            return
        }

        const fetchFamilias = async () => {
            try {
                setLoading(true)
                setError("")
                const data = await getFamiliasPorServicio(
                    idservicio,
                    fechaServicio,
                )
                setFamilias(data)
            } catch (err) {
                console.error(err)
                setError(err.message || "Error al cargar familias")
            } finally {
                setLoading(false)
            }
        }

        fetchFamilias()
    }, [idservicio, fechaServicio])

    const exportData = filteredFamilias.map((f) => ({
        Familias: f.familia.nombreFamilia,
        Servicio:
            f.servicio?.horario || f.servicio?.nombre || f.servicio?.idservicio, //
        Cantidad: f.cantidad_asistentes,
    }))

    return (
        <div className="  flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-2xl font-bold mt-4">
                {idservicio && fechaServicio
                    ? ` ${familias[0]?.servicio?.horario || "Horario no disponible"} del ${fechaServicio}`
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
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button
                    onClick={() => exportToPDF(exportData, "Asistencia.pdf")}
                    className="btn bg-rose-800 text-white btn-sm">
                    <i className="fas fa-print mr-1"></i> PDF
                </button>
            </div>

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

            <div className="  overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}
                {loading ? (
                    <div className="p-6 text-center">Cargando...</div>
                ) : (
                    <table className="table table-zebra text-sm text-center">
                        <thead className="bg-base-300">
                            <tr>
                                <th>ID</th>
                                <th>Familia</th>
                                <th>Cantidad</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {familias.map((f, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{f.familia.nombreFamilia}</td>
                                    <td>{f.cantidad_asistentes}</td>

                                    <td className="flex gap-2 items-center justify-center">
                                        <button
                                            onClick={() => openEditModal(f)}
                                            className="btn btn-warning btn-xs">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(f.id)}
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
                    <select
                        value={idServicioModal || ""}
                        onChange={(e) =>
                            setIdServicioModal(Number(e.target.value))
                        }
                        className="select select-bordered w-full">
                        <option value="">---Seleccione Servicio---</option>
                        {services.map((s) => (
                            <option key={s.idservicio} value={s.idservicio}>
                                {s.horario}
                            </option>
                        ))}
                    </select>
                </Modal>
            )}
        </div>
    )
}

export default Summary
