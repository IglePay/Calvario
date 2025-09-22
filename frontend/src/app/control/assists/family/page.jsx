"use client"
import { useState } from "react"
import Link from "next/link"
import * as Yup from "yup"
import { useFamilies } from "@/hooks/family/useFamily"
import Modal from "@/components/ModalGeneral"
import { validateForm } from "@/utils/validator"
import { exportToExcel, exportToPDF } from "@/utils/exportData"

const familySchema = Yup.object().shape({
    nombreFamilia: Yup.string()
        .matches(
            /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/,
            "Cada palabra debe iniciar con mayúscula",
        )
        .required("Nombre de familia requerido"),
    cantidadfamilia: Yup.number()
        .min(1, "Cantidad mínima 1")
        .required("Cantidad requerida"),
})

const Family = () => {
    const { families, loading, createFamily, updateFamily, deleteFamily } =
        useFamilies()

    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [nombre, setNombre] = useState("")
    const [cantidad, setCantidad] = useState("")
    const [editingId, setEditingId] = useState(null)

    const [errors, setErrors] = useState({
        nombreFamilia: "",
        cantidadfamilia: "",
    })

    const handleSave = async () => {
        const values = {
            nombreFamilia: nombre,
            cantidadfamilia: Number(cantidad),
        }

        // Validar usando el helper
        const validationErrors = await validateForm(familySchema, values)

        if (Object.keys(validationErrors).length > 0) {
            // Si hay errores, los seteamos y salimos
            setErrors(validationErrors)
            return
        }

        // Limpiar errores si todo está correcto
        setErrors({})

        if (editingId) {
            // Actualiza familia
            await updateFamily(editingId, values)
            setEditingId(null)
        } else {
            // Crear nueva familia
            await createFamily(values.nombreFamilia, values.cantidadfamilia)
        }

        // Limpiar inputs y cerrar modal
        setNombre("")
        setCantidad("")
        setModalOpen(false)
    }

    const handleEdit = (f) => {
        setEditingId(f.idfamilia)
        setNombre(f.nombreFamilia)
        setCantidad(f.cantidadfamilia)
        setModalOpen(true)
    }

    const handleDelete = (id) => {
        if (confirm("¿Seguro quieres eliminar esta familia?")) {
            deleteFamily(id).catch((err) => alert("Error al eliminar"))
        }
    }

    // filtrar
    const filteredFamilies = families
        .filter((f) => f && f.nombreFamilia) //  solo elementos válidos
        .filter((f) =>
            f.nombreFamilia.toLowerCase().includes(search.toLowerCase()),
        )

    const exportData = filteredFamilies.map((f) => ({
        ID: f.idfamilia,
        Familia: f.nombreFamilia,
        "cantidad de miembros": f.cantidadfamilia,
    }))

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-2xl font-bold">Listado de Familias</h2>

            <div className="flex gap-2 mt-4">
                <Link href={"/control"} className="btn btn-primary btn-sm">
                    Regresar
                </Link>
                <button
                    className="btn btn-accent btn-sm"
                    onClick={() => {
                        setEditingId(null)
                        setNombre("")
                        setCantidad("")
                        setModalOpen(true)
                    }}>
                    <i className="fas fa-plus mr-1"></i>Agregar
                </button>
                <button
                    onClick={() => exportToExcel(exportData, "Familias.xlsx")}
                    className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button
                    onClick={() => exportToPDF(exportData, "Familias.pdf")}
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

            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                <table className="table table-zebra w-full text-sm text-center">
                    <thead className="bg-base-300">
                        <tr>
                            <th>ID</th>
                            <th>Familia</th>
                            <th>Cantidad miembros</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFamilies.slice(0, rowsPerPage).map((f) => (
                            <tr key={f.idfamilia}>
                                <td>{f.idfamilia}</td>
                                <td>{f.nombreFamilia}</td>
                                <td>{f.cantidadfamilia}</td>
                                <td className="flex gap-2 justify-center">
                                    <button
                                        className="btn btn-warning btn-xs"
                                        onClick={() => handleEdit(f)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn btn-error btn-xs"
                                        onClick={() =>
                                            handleDelete(f.idfamilia)
                                        }>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {loading && (
                            <tr>
                                <td colSpan={4}>Cargando...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                title={editingId ? "Editar Familia" : "Agregar Familia"}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}>
                <input
                    type="text"
                    value={nombre}
                    onChange={async (e) => {
                        const newNombre = e.target.value
                        setNombre(newNombre)

                        const errors = await validateForm(familySchema, {
                            nombreFamilia: newNombre,
                            cantidadfamilia: Number(cantidad),
                        })
                        setErrors(errors)
                    }}
                    placeholder="Nombre de la familia"
                    className="input input-bordered w-full"
                />
                {errors.nombreFamilia && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.nombreFamilia}
                    </p>
                )}

                <input
                    type="number"
                    value={cantidad}
                    onChange={async (e) => {
                        const newCantidad = e.target.value
                        setCantidad(newCantidad)

                        const errors = await validateForm(familySchema, {
                            nombreFamilia: nombre,
                            cantidadfamilia: Number(newCantidad),
                        })
                        setErrors(errors)
                    }}
                    placeholder="Cantidad de miembros"
                    className="input input-bordered w-full"
                />
                {errors.cantidadfamilia && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.cantidadfamilia}
                    </p>
                )}
            </Modal>
        </div>
    )
}

export default Family
