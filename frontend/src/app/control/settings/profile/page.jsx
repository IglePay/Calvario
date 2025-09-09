"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
const API_URL = process.env.NEXT_PUBLIC_API_URL
console.log("API_URL", API_URL)
export default function Profile() {
    const [modalOpen, setModalOpen] = useState(false)

    // Tabla / listado
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [roles, setRoles] = useState([])
    const [tenants, setTenants] = useState([])

    // Formulario
    const [form, setForm] = useState({
        id_usuario: null,
        usuario: "",
        email: "",
        password: "",
        id_rol: "1",
        iglesia: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const openModal = (user = null) => {
        if (user) {
            // Editar usuario existente
            setForm({
                id_usuario: user.id,
                usuario: user.name,
                email: user.email,
                password: "",
                id_rol: user.role?.id?.toString() || "",
                iglesia: user.tb_tenants?.id_tenant?.toString() || "",
            })
        } else {
            // Crear nuevo usuario
            setForm({
                id_usuario: null,
                usuario: "",
                email: "",
                password: "",
                id_rol: "2", // miembro por defecto
                iglesia: tenants[0]?.id_tenant?.toString() || "",
            })
        }
        setModalOpen(true)
    }

    const fetchRolesAndTenants = async () => {
        try {
            const [rolesRes, tenantsRes] = await Promise.all([
                fetch(`${API_URL}/roles`, { credentials: "include" }),
                fetch(`${API_URL}/tenants`, { credentials: "include" }),
            ])

            if (!rolesRes.ok || !tenantsRes.ok)
                throw new Error("No se pudo cargar roles o iglesias")

            setRoles(await rolesRes.json())
            setTenants(await tenantsRes.json())
        } catch (err) {
            console.error(err)
        }
    }

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch(`${API_URL}/users/full`, {
                cache: "no-store",
                credentials: "include",
            })
            if (!res.ok)
                throw new Error("No se pudo cargar la lista de usuarios")
            const data = await res.json()
            // Ajusta según responda tu API: data o data.data
            setUsers(Array.isArray(data) ? data : (data.data ?? []))
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
        fetchRolesAndTenants()
    }, [])

    const filteredMembers = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return users
        return users.filter((u) =>
            [u.name, u.email, u.role?.nombre, u.tb_tenants?.nombre]
                .filter(Boolean)
                .some((v) => v.toString().toLowerCase().includes(q)),
        )
    }, [users, search])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const method = form.id_usuario ? "PUT" : "POST"
        const url = form.id_usuario
            ? `${API_URL}/users/${form.id_usuario}`
            : `${API_URL}/users`

        const body = {
            name: form.usuario, // 👈 Prisma usa `name` (mapeado a `nombre`)
            email: form.email,
            password: form.password || undefined,
            roleId: parseInt(form.id_rol),
            tenantId: parseInt(form.iglesia), // por ahora fijo, luego lo puedes cambiar dinámico
        }

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include",
        })

        if (!res.ok) return alert("Error al guardar")
        setModalOpen(false)
        fetchUsers()
    }

    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este usuario?")) return
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
        if (!res.ok) return alert("Error al eliminar")
        fetchUsers()
    }

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
                <button className="btn btn-secondary btn-sm">
                    <i className="fas fa-file-excel mr-1"></i> Excel
                </button>
                <button className="btn btn-warning btn-sm">
                    <i className="fas fa-print mr-1"></i> Imprimir
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
