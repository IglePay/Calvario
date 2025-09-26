"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { exportToExcel, exportToPDF } from "@/utils/exportData"
import { useTenants } from "@/hooks/tenants/useTenants"

export default function Iglesias() {
    const { tenants, loading, error, createOrUpdateTenant, deleteTenant } =
        useTenants()

    const [modalOpen, setModalOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [form, setForm] = useState({
        id_tenant: null,
        dpi: "",
        nombre: "",
        email: "",
        telefono: "",
        fecha_inicio: "",
        direccion: "",
    })

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const openModal = (tenant = null) => {
        setForm(
            tenant ?? {
                dpi: "",
                nombre: "",
                email: "",
                telefono: "",
                fecha_inicio: "",
                direccion: "",
            },
        )
        setModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await createOrUpdateTenant(form)
        setModalOpen(false)
    }

    const handleDelete = (id) => deleteTenant(id)

    const filteredTenants = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return tenants
        return tenants.filter((t) =>
            [t.dpi, t.nombre, t.email, t.telefono, t.direccion]
                .filter(Boolean)
                .some((v) => v.toLowerCase().includes(q)),
        )
    }, [tenants, search])

    // Genera datos planos para exportar
    const exportData = filteredTenants.map((t) => ({
        // ID: t.id_tenant,
        NIT: t.dpi,
        Nombre: t.nombre,
        Correo: t.email,
        Teléfono: t.telefono ?? "",
        "Año inicio": t.fecha_inicio
            ? new Date(t.fecha_inicio).toLocaleDateString("es-GT")
            : "",
        // Dirección: t.direccion ?? "",
        // "Fecha creación": t.fecha_creacion
        //     ? new Date(t.fecha_creacion).toLocaleDateString("es-GT")
        //     : "",
    }))

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h1 className="text-2xl font-bold">Datos de la Iglesia</h1>

            {/* Botones */}
            <div className="flex gap-4 mt-4">
                <Link href={"/control"} className="btn btn-primary btn-sm  ">
                    Regresar
                </Link>
                <button
                    onClick={() => openModal()}
                    className="btn btn-accent btn-sm">
                    <i className="fas fa-plus mr-1"></i> Agregar
                </button>
                <button
                    onClick={() => exportToExcel(exportData, "iglesias.xlsx")}
                    className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>

                <button
                    onClick={() => exportToPDF(exportData, "iglesias.pdf")}
                    className="btn bg-rose-800 btn-sm text-white">
                    <i className="fa-solid fa-file-pdf mr-1 "></i> PDF
                </button>
                <Link
                    href={"/control/settings/profile"}
                    className="btn btn-primary btn-sm ">
                    <i className="fas fa-user mr-1"></i>
                    Perfil
                </Link>
            </div>

            {/* Buscador y rows */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por NIT, nombre, correo o dirección"
                    className="input input-sm input-bordered w-full md:flex-1"
                />
                <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
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
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}
                {loading ? (
                    <div className="p-6 text-center">Cargando...</div>
                ) : (
                    <table className="table table-zebra w-full text-sm">
                        <thead className="bg-base-300 text-center">
                            <tr>
                                <th>NIT</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Año inicio</th>
                                <th>Dirección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {filteredTenants
                                .slice(0, rowsPerPage)
                                .map((tenant) => (
                                    <tr key={tenant.id_tenant}>
                                        <td>{tenant.dpi}</td>
                                        <td>{tenant.nombre}</td>
                                        <td>{tenant.email}</td>
                                        <td>{tenant.telefono}</td>
                                        <td>{tenant.fecha_inicio}</td>
                                        <td>{tenant.direccion}</td>
                                        <td className="flex gap-2 items-center justify-center">
                                            <button
                                                onClick={() =>
                                                    openModal(tenant)
                                                }
                                                className="btn btn-warning btn-xs">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        tenant.id_tenant,
                                                    )
                                                }
                                                className="btn btn-error btn-xs">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            {filteredTenants.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-6">
                                        No hay resultados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">
                            {form.id_tenant
                                ? "Editar Iglesia"
                                : "Nueva Iglesia"}
                        </h3>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="form-control">
                                    <label className="label">NIT</label>
                                    <input
                                        name="dpi"
                                        value={form.dpi}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Nombre</label>
                                    <input
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Correo</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Teléfono</label>
                                    <input
                                        name="telefono"
                                        value={form.telefono}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        Año de inicio
                                    </label>
                                    <input
                                        type="date"
                                        name="fecha_inicio"
                                        value={form.fecha_inicio}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                    />
                                </div>
                                <div className="form-control ">
                                    <label className="label">Dirección</label>
                                    <textarea
                                        name="direccion"
                                        value={form.direccion}
                                        onChange={handleChange}
                                        className="textarea textarea-bordered"
                                    />
                                </div>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn btn-ghost bg-gray-700">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-accent w-auto">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setModalOpen(false)}>
                            close
                        </button>
                    </form>
                </dialog>
            )}
        </div>
    )
}
