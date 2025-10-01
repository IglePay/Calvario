"use client"
import { useState } from "react"
import Link from "next/link"
import * as Yup from "yup"
import Modal from "@/components/ModalGeneral"
import { useAccounts } from "@/hooks/Accounts/useAccounts"
import { validateForm } from "@/utils/validator"
import Pagination from "@/components/Paginacion"
import { exportToExcel, exportToPDF } from "@/utils/exportData"

const Accounts = () => {
    const {
        accounts,
        loading,
        error,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        total,
        createAccount,
        updateAccount,
        deleteAccount,
    } = useAccounts()

    const [modalOpen, setModalOpen] = useState(false)
    const [editingAccount, setEditingAccount] = useState(null)
    const [search, setSearch] = useState("")
    const [formErrors, setFormErrors] = useState({})

    // Form state
    const [codigo, setCodigo] = useState("")
    const [nombre, setNombre] = useState("")
    const [tipo, setTipo] = useState("Ingreso")

    // Schema Yup
    const schema = Yup.object().shape({
        codigo: Yup.string()
            .required("Código es requerido")
            .max(10, "Máximo 10 caracteres")
            .matches(/^[IE]\d{3,}$/, "Formato inválido (ej: I001 o E001)"),
        nombre: Yup.string()
            .required("Nombre es requerido")
            .matches(
                /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/,
                "Cada palabra debe iniciar con mayúscula",
            )
            .max(60, "Máximo 60 caracteres"),
        tipo: Yup.string()
            .required("Tipo es requerido")
            .oneOf(["Ingreso", "Egreso"], "Tipo inválido"),
    })

    const openCreateModal = () => {
        setEditingAccount(null)
        setCodigo("")
        setNombre("")
        setTipo("Ingreso")
        setFormErrors({})
        setModalOpen(true)
    }

    const openEditModal = (account) => {
        setEditingAccount(account)
        setCodigo(account.codigo)
        setNombre(account.nombre)
        setTipo(account.tipoIE)
        setFormErrors({})
        setModalOpen(true)
    }

    const handleSave = async () => {
        const values = { codigo, nombre, tipo }
        const validationErrors = await validateForm(schema, values)
        setFormErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) return

        try {
            if (editingAccount) {
                await updateAccount(editingAccount.idnomeclatura, values)
            } else {
                await createAccount(codigo, nombre, tipo)
            }
            setModalOpen(false)
        } catch (err) {
            console.error(err)
            alert("Error al guardar la cuenta")
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar esta cuenta?")) return
        try {
            await deleteAccount(id)
        } catch (err) {
            console.error(err)
            alert("Error al eliminar la cuenta")
        }
    }

    // Filtrar en la página actual
    const displayedAccounts = accounts.filter((a) =>
        Object.values(a).join(" ").toLowerCase().includes(search.toLowerCase()),
    )

    const exportData = accounts.map((acc) => ({
        Código: acc.codigo,
        Nombre: acc.nombre,
        Tipo: acc.tipoIE,
        Fecha: acc.fechaCreacion
            ? new Date(acc.fechaCreacion).toLocaleDateString("es-GT", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
              })
            : "-",
    }))

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-2xl font-bold">Listado de Cuentas</h2>

            <div className="flex gap-2 mt-4">
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
                        exportToExcel(exportData, "ListaCuentas.xlsx")
                    }
                    className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button
                    onClick={() => exportToPDF(exportData, "ListaCuentas.pdf")}
                    className="btn bg-rose-800 text-white btn-sm">
                    <i className="fas fa-print mr-1"></i> PDF
                </button>
            </div>

            {/* Buscador y selector filas */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1) // resetear página al buscar
                    }}
                    placeholder="Buscar por Código, Nombre, Tipo"
                    className="input input-sm input-bordered w-full md:flex-1"
                />
                <select
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value))
                        setPage(1) // resetear página al cambiar filas
                    }}
                    className="select select-sm w-36">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                {error && (
                    <div className="alert alert-error bg-red-500">
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="p-6 text-center">Cargando...</div>
                ) : (
                    <table className="table table-zebra w-full text-sm">
                        <thead className="bg-base-300 text-center">
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {displayedAccounts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-4">
                                        No hay cuentas
                                    </td>
                                </tr>
                            ) : (
                                displayedAccounts.map((a) => (
                                    <tr key={a.idnomeclatura}>
                                        <td>{a.codigo}</td>
                                        <td>{a.nombre}</td>
                                        <td>{a.tipoIE}</td>
                                        <td className="flex gap-2 items-center justify-center">
                                            <button
                                                className="btn btn-warning btn-xs"
                                                onClick={() =>
                                                    openEditModal(a)
                                                }>
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() =>
                                                    handleDelete(
                                                        a.idnomeclatura,
                                                    )
                                                }>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
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

            {/* Modal */}
            {modalOpen && (
                <Modal
                    title={editingAccount ? "Editar Cuenta" : "Agregar Cuenta"}
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                    saveLabel={editingAccount ? "Actualizar" : "Guardar"}>
                    <input
                        type="text"
                        placeholder="Código"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {formErrors.codigo && (
                        <p className="text-red-500 text-sm">
                            {formErrors.codigo}
                        </p>
                    )}

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    {formErrors.nombre && (
                        <p className="text-red-500 text-sm">
                            {formErrors.nombre}
                        </p>
                    )}

                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="select select-bordered w-full">
                        <option value="">---Seleccione----</option>
                        <option value="Ingreso">Ingreso</option>
                        <option value="Egreso">Egreso</option>
                    </select>
                    {formErrors.tipo && (
                        <p className="text-red-500 text-sm">
                            {formErrors.tipo}
                        </p>
                    )}
                </Modal>
            )}
        </div>
    )
}

export default Accounts
