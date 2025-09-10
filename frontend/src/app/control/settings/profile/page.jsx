"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { exportToExcel, exportToPDF } from "@/utils/exportData"
import { useUsers } from "@/hooks/profile/useUsers"

export default function Profile() {
    const {
        users,
        loading,
        error,
        roles,
        tenants,
        createOrUpdateUser,
        deleteUser,
    } = useUsers()
    const [modalOpen, setModalOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [form, setForm] = useState({
        id_usuario: null,
        usuario: "",
        email: "",
        password: "",
        id_rol: "1",
        iglesia: "",
    })

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const openModal = (user = null) => {
        if (user) {
            setForm({
                id_usuario: user.id,
                usuario: user.name,
                email: user.email,
                password: "",
                id_rol: user.role?.id?.toString() || "",
                iglesia: user.tb_tenants?.id_tenant?.toString() || "",
            })
        } else {
            setForm({
                id_usuario: null,
                usuario: "",
                email: "",
                password: "",
                id_rol: "2",
                iglesia: tenants[0]?.id_tenant?.toString() || "",
            })
        }
        setModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createOrUpdateUser(form)
            setModalOpen(false)
        } catch (err) {
            alert(err.message)
        }
    }

    const handleDelete = (id) => {
        deleteUser(id)
            .then
            // () => console.log("Usuario eliminado")
            ()
    }

    const filteredMembers = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return users
        return users.filter((u) =>
            [u.name, u.email, u.role?.nombre, u.tb_tenants?.nombre]
                .filter(Boolean)
                .some((v) => v.toLowerCase().includes(q)),
        )
    }, [users, search])

    // Genera datos planos para exportar
    const exportData = filteredMembers.map((user) => ({
        ID: user.id, // venía de backend
        Rol: user.role?.nombre || "", // depende si tu backend manda `nombre` o `name`
        Usuario: user.name || "", // nombre del usuario
        Email: user.email || "",
        Contraseña: "••••••",
        Iglesia: user.tb_tenants?.nombre || "", // nombre de la iglesia
    }))

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h1 className="text-2xl font-bold">Editar Usuario</h1>

            <div className="flex gap-2 mt-4">
                <Link href={"/control"} className="btn btn-primary btn-sm ">
                    Regresar
                </Link>
                <button
                    onClick={() => openModal()}
                    className="btn btn-accent btn-sm">
                    <i className="fas fa-plus mr-1"></i> Agregar
                </button>
                <button
                    onClick={() => exportToExcel(exportData, "usuarios.xlsx")}
                    className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button
                    onClick={() => exportToPDF(exportData, "usuarios.pdf")}
                    className="btn btn-warning btn-sm">
                    <i className="fas fa-print mr-1"></i> PDF
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-5xl">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por usuario, email o iglesia"
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
            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-5xl">
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
                                <th>Iglesia</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {filteredMembers
                                .slice(0, rowsPerPage)
                                .map((member) => (
                                    <tr key={member.id}>
                                        <td>{member.id}</td>
                                        <td>{member.role?.nombre}</td>
                                        <td>{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>••••••</td>
                                        <td>{member.tb_tenants?.nombre}</td>
                                        <td className="flex gap-2 items-center justify-center">
                                            <button
                                                onClick={() =>
                                                    openModal(member)
                                                }
                                                className="btn btn-warning btn-xs">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(member.id)
                                                }
                                                className="btn btn-error btn-xs">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            {filteredMembers.length === 0 && (
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

            {/* Modal (opcional). Si usas daisyUI, puedes montar aquí tu formulario usando `modalOpen` */}
            {modalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">
                            {form.id_usuario
                                ? "Editar usuario"
                                : "Nuevo usuario"}
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
                                            form.id_usuario
                                                ? "Dejar en blanco para no cambiar"
                                                : ""
                                        }
                                    />
                                </div>

                                <div className="form-control ">
                                    <label className="label">Iglesia</label>
                                    <select
                                        name="iglesia"
                                        value={form.iglesia}
                                        onChange={handleChange}
                                        className="select select-bordered">
                                        {tenants.map((tenant) => (
                                            <option
                                                key={tenant.id_tenant}
                                                value={tenant.id_tenant}>
                                                {tenant.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="modal-action">
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
