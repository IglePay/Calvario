"use client"
import { useState } from "react"
import Link from "next/link"
import Modal from "@/components/ModalGeneral"
import Pagination from "@/components/Paginacion"
import { useAssistance } from "@/hooks/attendance/useAttendace"
import * as yup from "yup"
import { exportToExcel, exportToPDF } from "@/utils/exportData"

const GeneralAssistance = () => {
    const {
        assists,
        loading,
        error,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        total,
        getResumenServicios,
        services,
        families,
        refresh,
        createAssist,
        updateAssist,
        deleteAssist,
    } = useAssistance()

    // const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editingAssist, setEditingAssist] = useState(null) // null = crear

    const [familia, setFamilia] = useState("")
    const [servicio, setServicio] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [fechaServicio, setFechaServicio] = useState("")

    const filteredAssists = assists.filter((assist) => {
        let fecha = ""
        if (assist.fechaServicio) {
            const d = new Date(assist.fechaServicio)
            const yyyy = d.getFullYear()
            const mm = String(d.getMonth() + 1).padStart(2, "0")
            const dd = String(d.getDate()).padStart(2, "0")
            fecha = `${yyyy}-${mm}-${dd}`
        }

        const horario = assist.servicio?.horario || ""
        const familia = assist.familia?.nombreFamilia || ""

        return (
            fecha.includes(searchQuery) ||
            horario.toLowerCase().includes(searchQuery.toLowerCase()) ||
            familia.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    // Abrir modal para crear
    const openCreateModal = () => {
        setEditingAssist(null)
        setFamilia("")
        setServicio("")
        setCantidad("")
        setFechaServicio("")

        //fecha autmatico
        const today = new Date().toISOString().split("T")[0] //yyyy-mm-dd
        setFechaServicio(today)

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

    const exportData = filteredAssists.map((f) => ({
        Servicio:
            f.servicio?.horario || f.servicio?.nombre || f.servicio?.idservicio,
        Fecha: f.fechaServicio ? f.fechaServicio.split("T")[0] : "",
        "Total de Asistencia": f.totalAsistentes || f.cantidad_asistentes || 0,
    }))

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
                <button
                    onClick={() =>
                        exportToExcel(exportData, "AsistenciaGeneral.xlsx")
                    }
                    className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button
                    onClick={() =>
                        exportToPDF(exportData, "AsistenciaGeneral.pdf")
                    }
                    className="btn bg-rose-800 text-white btn-sm">
                    <i className="fas fa-print mr-1"></i> PDF
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    onChange={(e) => {
                        const value = e.target.value
                        setSearchQuery(value)
                        setPage(1)
                        getResumenServicios(value, 1, rowsPerPage) //  backend filtra
                    }}
                    placeholder="Buscar por servicio"
                    className="input input-sm input-bordered w-full md:flex-1"
                />
                <select
                    onChange={(e) => {
                        const value = Number(e.target.value)
                        setRowsPerPage(value)
                        setPage(1)
                        getResumenServicios(searchQuery, 1, value) //  consulta API con nuevo limit
                    }}
                    className="select select-sm w-36">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
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
                                    <tr key={`${assist.idasistencia}-${idx}`}>
                                        <td>
                                            {(page - 1) * rowsPerPage + idx + 1}
                                        </td>
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
            {/* Paginación */}
            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                onPageChange={(newPage) => {
                    setPage(newPage)
                    getResumenServicios(searchQuery, newPage, rowsPerPage)
                }}
            />

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

                    {/* <input */}
                    {/*     type="date" */}
                    {/*     value={fechaServicio} */}
                    {/*     onChange={(e) => setFechaServicio(e.target.value)} */}
                    {/*     className="input input-bordered w-full" */}
                    {/* /> */}
                </Modal>
            )}
        </div>
    )
}

export default GeneralAssistance
