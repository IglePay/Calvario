"use client"
import { useState } from "react"
import { useFunds } from "@/hooks/funds/useFunds"
import { validateForm } from "@/utils/validator"
import Link from "next/link"
import Pagination from "@/components/Paginacion"
import Modal from "@/components/ModalGeneral"
import * as Yup from "yup"
import { exportToExcel, exportToPDF } from "@/utils/exportData"

const schema = Yup.object().shape({
    idnomeclatura: Yup.number().required("La cuenta es obligatoria"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
    fecha: Yup.date().required("La fecha es obligatoria"),
    monto: Yup.number().required("El monto es obligatorio").positive(),
})

const Funds = () => {
    const {
        nomenclaturas,
        funds,
        loading,
        error,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        total,
        fetchFunds,
        createFund,
        updateFund,
        deleteFund,
    } = useFunds()

    const [modalOpen, setModalOpen] = useState(false)
    // era false idit
    const [editingFund, setEditingFund] = useState(null)

    const [formValues, setFormValues] = useState({
        idnomeclatura: "",
        descripcion: "",
        fecha: "",
        monto: "",
    })

    const [formErrors, setFormErrors] = useState({})

    const openModal = (fund = null) => {
        if (fund) {
            setEditingFund(fund)
            setFormValues({
                idnomeclatura: fund.idnomeclatura,
                descripcion: fund.descripcion,
                fecha: fund.fecha.slice(0, 10),
                monto: fund.monto,
            })
        } else {
            setEditingFund(null)
            setFormValues({
                idnomeclatura: "",
                descripcion: "",
                fecha: "",
                monto: "",
            })
        }
        setFormErrors({})
        setModalOpen(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues((prev) => ({
            ...prev,
            [name]:
                name === "idnomeclatura" || name === "monto"
                    ? value === ""
                        ? ""
                        : Number(value)
                    : value,
        }))
    }

    const handleSave = async () => {
        const errors = await validateForm(schema, formValues)
        if (Object.keys(errors).length) {
            setFormErrors(errors)
            return
        }

        const payload = {
            ...formValues,
            idnomeclatura: Number(formValues.idnomeclatura),
            monto: Number(formValues.monto),
            fecha: new Date(formValues.fecha).toISOString(),
        }

        if (editingFund) {
            await updateFund(editingFund.id, payload)
        } else {
            await createFund(
                payload.idnomeclatura,
                payload.descripcion,
                payload.fecha,
                payload.monto,
            )
        }
        fetchFunds()
        setModalOpen(false)
    }

    const [searchQuery, setSearchQuery] = useState("")

    //  Filtrado local (sobre los datos cargados)
    const filteredFunds = funds.filter((fund) =>
        Object.values(fund)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
    )

    const exportData = funds.map((f) => ({
        Cuenta: f.nombre,
        descripción: f.descripcion,
        Fecha: f.fecha
            ? new Date(f.fecha).toLocaleDateString("es-GT", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
              })
            : "-",
        tipo: f.tipo,
        Monto: f.monto,
        Saldo: f.saldo,
    }))

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-2xl font-bold">Listado de Fondos</h2>

            <div className="flex gap-2 mt-4">
                <Link href={"/control"} className="btn btn-primary btn-sm">
                    Regresar
                </Link>
                <button
                    onClick={() => openModal()}
                    className="btn btn-accent btn-sm">
                    <i className="fas fa-plus mr-1"></i> Agregar
                </button>
                <button
                    onClick={() => exportToExcel(exportData, "fondo.xlsx")}
                    className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button
                    onClick={() => exportToPDF(exportData, "fondo.pdf")}
                    className="btn bg-rose-800 text-white btn-sm">
                    <i className="fas fa-print mr-1"></i> PDF
                </button>
            </div>

            {/* Buscador y selector filas */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    value={searchQuery} // <-- aquí estaba el error
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setPage(1) // resetear página al buscar
                    }}
                    placeholder="Buscar por Cuenta, fecha..."
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
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                </select>
            </div>

            {/* Estado de carga y errores */}
            {loading && <p className="mt-4">Cargando...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            {/* Tabla */}
            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                <table className="table table-zebra w-full text-sm">
                    <thead className="bg-base-300 text-center">
                        <tr>
                            <th>ID</th>
                            <th>Cuenta</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>tipo</th>
                            <th>Monto</th>
                            <th>Saldo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredFunds.length > 0 ? (
                            filteredFunds.map((fund, index) => (
                                <tr key={fund.id}>
                                    {/* Mostrar el índice + 1 en lugar del id de la BD */}
                                    <td>{index + 1}</td>
                                    <td>{fund.nombre}</td>
                                    <td>{fund.descripcion}</td>
                                    <td>
                                        {new Date(
                                            fund.fecha,
                                        ).toLocaleDateString("es-GT", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td>{fund.tipo}</td>
                                    <td>Q{fund.monto}</td>
                                    <td>Q{fund.saldo}</td>
                                    <td className="flex gap-2 items-center justify-center">
                                        <button
                                            className="btn btn-warning btn-xs"
                                            onClick={() => openModal(fund)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-error btn-xs"
                                            onClick={() => deleteFund(fund.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr key="no-data">
                                <td colSpan={8} className="py-4 text-center">
                                    No hay registros
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* Modal */}
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                    title={editingFund ? "Editar Fondo" : "Nuevo Fondo"}>
                    <select
                        name="idnomeclatura"
                        value={formValues.idnomeclatura.toString()}
                        onChange={handleChange}
                        className="input input-bordered w-full">
                        <option value="">Seleccione una cuenta</option>
                        {nomenclaturas.map((nome) => (
                            <option
                                key={nome.idnomeclatura}
                                value={nome.idnomeclatura.toString()}>
                                {nome.nombre}
                            </option>
                        ))}
                    </select>

                    {formErrors.idnomeclatura && (
                        <p className="text-red-500">
                            {formErrors.idnomeclatura}
                        </p>
                    )}

                    <input
                        name="descripcion"
                        placeholder="Descripción"
                        value={formValues.descripcion}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    {formErrors.descripcion && (
                        <p className="text-red-500">{formErrors.descripcion}</p>
                    )}

                    <input
                        name="fecha"
                        type="date"
                        value={formValues.fecha}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    {formErrors.fecha && (
                        <p className="text-red-500">{formErrors.fecha}</p>
                    )}

                    <input
                        name="monto"
                        type="number"
                        value={formValues.monto}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    {formErrors.monto && (
                        <p className="text-red-500">{formErrors.monto}</p>
                    )}
                </Modal>
            </div>

            {/* Paginación */}
            <Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                total={total}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
            />
        </div>
    )
}
export default Funds
