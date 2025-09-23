"use client"
import { useState } from "react"
import Link from "next/link"
import Modal from "@/components/ModalGeneral"
import { useAssistance } from "@/hooks/attendance/useAttendace"
import * as yup from "yup"

const GeneralAssistance = () => {
    const {
        assists,
        services,
        families,
        loading,
        error,
        refresh,
        createAssist,
        updateAssist,
        deleteAssist,
    } = useAssistance()

    const [searchQuery, setSearchQuery] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingAssist, setEditingAssist] = useState(null) // null = crear

    const [familia, setFamilia] = useState("")
    const [servicio, setServicio] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [fechaServicio, setFechaServicio] = useState("")

    const filteredAssists = assists.filter((assist) =>
        Object.values(assist)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
    )

    // Abrir modal para crear
    const openCreateModal = () => {
        setEditingAssist(null)
        setFamilia("")
        setServicio("")
        setCantidad("")
        setFechaServicio("")
        setModalOpen(true)
    }

    // Abrir modal para editar
    const openEditModal = (assist) => {
        setEditingAssist(assist)
        setFamilia(assist.familia?.idfamilia || "")
        setServicio(assist.servicio?.idservicio || "")
        setCantidad(assist.totalAsistentes || "")
        setFechaServicio(
            assist.fechaServicio ? assist.fechaServicio.split("T")[0] : "",
        )
        setModalOpen(true)
    }

    const asistenciaSchema = yup.object().shape({
        idfamilia: yup
            .number()
            .moreThan(0, "Selecciona una familia válida")
            .required(),
        idservicio: yup
            .number()
            .moreThan(0, "Selecciona un servicio válido")
            .required(),
        cantidadAsistentes: yup.number().required().min(1),
        fechaServicio: yup
            .date()
            .required()
            .transform(
                (value, originalValue) => new Date(originalValue + "T00:00:00"),
            ),
    })

    const handleSave = async () => {
        try {
            const dto = await asistenciaSchema.validate({
                idfamilia: Number(familia),
                idservicio: Number(servicio),
                cantidadAsistentes: Number(cantidad),
                fechaServicio,
            })

            if (editingAssist) {
                await updateAssist(editingAssist.idasistencia, dto)
            } else {
                await createAssist(dto)
            }

            setModalOpen(false)
            refresh()
        } catch (err) {
            console.error("Error validando asistencia:", err)
            alert(err.message || "Error al guardar la asistencia")
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar esta asistencia?")) return
        try {
            await deleteAssist(id)
            refresh()
        } catch (err) {
            console.error(err)
            alert("Error al eliminar la asistencia")
        }
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-2xl font-bold">
                Listado de Asistencia General
            </h2>

            <div className="flex gap-2 mt-2">
                <Link href={"/control"} className="btn btn-primary btn-sm">
                    Regresar
                </Link>
                <button
                    className="btn btn-accent btn-sm"
                    onClick={openCreateModal}>
                    <i className="fas fa-plus mr-1"></i> Agregar
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por servicio o fecha"
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

            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                {error && <div className="alert alert-error">{error}</div>}
                {loading ? (
                    <div className="p-6 text-center">Cargando...</div>
                ) : (
                    <table className="table table-zebra text-sm text-center">
                        <thead className="bg-base-300">
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Servicio</th>
                                <th>Total Asistentes</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssists
                                .slice(0, rowsPerPage)
                                .map((assist, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>{" "}
                                        {/* índice visible */}
                                        <td>
                                            {assist.fechaServicio?.split(
                                                "T",
                                            )[0] || "—"}
                                        </td>
                                        <td>
                                            {assist.servicio?.horario || "—"}
                                        </td>
                                        <td>{assist.totalAsistentes || "—"}</td>
                                        <td className="flex gap-2 justify-center">
                                            <Link
                                                href={`/control/attendance/summary?idservicio=${assist.servicio.idservicio}&fechaServicio=${assist.fechaServicio?.split("T")[0]}`}
                                                className="btn btn-info btn-xs">
                                                <i className="fas fa-eye"></i>
                                            </Link>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() =>
                                                    handleDelete(
                                                        assist.idasistencia,
                                                    )
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

            {modalOpen && (
                <Modal
                    title={
                        editingAssist
                            ? "Editar Asistencia"
                            : "Agregar Asistencia"
                    }
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                    saveLabel={editingAssist ? "Actualizar" : "Guardar"}>
                    <select
                        value={familia}
                        onChange={(e) => setFamilia(e.target.value)}
                        className="select select-bordered w-full">
                        <option value="">Seleccionar familia</option>
                        {families.map((f) => (
                            <option key={f.idfamilia} value={f.idfamilia}>
                                {f.nombreFamilia}
                            </option>
                        ))}
                    </select>

                    <select
                        value={servicio}
                        onChange={(e) => setServicio(e.target.value)}
                        className="select select-bordered w-full">
                        <option value="">Seleccionar servicio</option>
                        {services.map((s) => (
                            <option key={s.idservicio} value={s.idservicio}>
                                {s.horario}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <input
                        type="date"
                        value={fechaServicio}
                        onChange={(e) => setFechaServicio(e.target.value)}
                        className="input input-bordered w-full"
                    />
                </Modal>
            )}
        </div>
    )
}

export default GeneralAssistance
