"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { useCollaborator } from "@/hooks/Collaborator/useCollaborator"
import { exportToExcel, exportToPDF } from "@/utils/exportData"

export default function Collaborator() {
    const {
        collaborators,
        loading,
        roles,
        error,
        createOrUpdateCollaborator,
        deleteCollaborator,
    } = useCollaborator()

    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState("")

    const [modalOpen, setModalOpen] = useState(false)
    const [form, setForm] = useState({
        id: null,
        usuario: "",
        email: "",
        password: "",
        id_rol: "4",
    })

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const openModal = (collaborator = null) => {
        if (collaborator) {
            setForm({
                id: collaborator.id,
                usuario: collaborator.name,
                email: collaborator.email,
                password: "",
                id_rol: collaborator.role?.id?.toString() || "",
            })
        } else {
            setForm({
                id: null,
                usuario: "",
                email: "",
                password: "",
                id_rol: "",
            })
        }
        setModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createOrUpdateCollaborator(form)
            setModalOpen(false)
        } catch (err) {
            alert(err.message)
        }
    }

    const filteredMembers = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return collaborators
        return collaborators.filter((c) =>
            [c.name, c.email, c.role?.nombre]
                .filter(Boolean)
                .some((v) => v.toLowerCase().includes(q)),
        )
    }, [collaborators, search])

    const exportData = filteredMembers.map((user) => ({
        ID: user.id, // venía de backend
        Rol: user.role?.nombre || "", // depende si tu backend manda `nombre` o `name`
        Usuario: user.name || "", // nombre del usuario
        Email: user.email || "",
        Contraseña: "••••••",
    }))

    return (
        <div className="  flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-xl font-bold">Listado de Colaboradores</h2>

            <div className="flex gap-2 mt-4">
                <Link href="/control" className="btn btn-primary btn-sm w-24 ">
                    Regresar
                </Link>
                <button
                    onClick={() => openModal()}
                    className="btn btn-accent btn-sm">
                    <i className="fas fa-plus mr-1"></i> Agregar
                </button>
                <button
                    onClick={() =>
                        exportToExcel(exportData, "Colaboradores.xlsx")
                    }
                    className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button
                    onClick={() => exportToPDF(exportData, "Colaboradores.pdf")}
                    className="btn bg-rose-800 text-white btn-sm">
                    <i className="fas fa-print mr-1"></i> PDF
                </button>
            </div>

            {/* Buscador y rows */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por usuario,email"
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

            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-4">
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
                                <th>ID</th>
                                <th>Rol</th>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Contraseña</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-6">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-red-500 py-6">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-6">
                                        No hay resultados
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers
                                    .slice(0, rowsPerPage)
                                    .map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.id}</td>
                                            <td>{member.role?.nombre}</td>
                                            <td>{member.name}</td>
                                            <td>{member.email}</td>
                                            <td>••••••</td>
                                            <td className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() =>
                                                        openModal(member)
                                                    }
                                                    className="btn btn-warning btn-xs">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteCollaborator(
                                                            member.id,
                                                        )
                                                    }
                                                    className="btn btn-error btn-xs">
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

            {/* Modal */}
            {modalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">
                            {form.id
                                ? "Editar colaborador"
                                : "Nuevo colaborador"}
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="form-control">
                                    <label className="label">Rol</label>
                                    <select
                                        name="id_rol"
                                        value={form.id_rol}
                                        onChange={handleChange}
                                        className="select select-bordered">
                                        <option value="" disabled>
                                            - Selecciona un rol -
                                        </option>
                                        {roles.map((role) => (
                                            <option
                                                key={role.id}
                                                value={role.id}>
                                                {role.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">Usuario</label>
                                    <input
                                        name="usuario"
                                        value={form.usuario}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Contraseña</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                        placeholder={
                                            form.id
                                                ? "Dejar en blanco para no cambiar"
                                                : ""
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center modal-action mt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary">
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
