"use client"
import Link from "next/link"
import { useState } from "react"
import { useRolPermiso } from "@/hooks/rolepermiso/useRolePermiso"
import Pagination from "@/components/Paginacion"
import ModalAsignarPermiso from "./ModalAsignarPermiso/page"
import ModalCrearPermiso from "./ModalCrearPermiso/page"
import ModalEditarPermiso from "./ModalEditar/page"
export default function RolPermiso() {
    const {
        rolesConPermisos,
        loading,
        error,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        totalPages,
        removePermisoFromRol,
        updatePermisosRol,
    } = useRolPermiso()

    const [modalOpenCrear, setModalOpenCrear] = useState(false)
    const [modalOpenAsignar, setModalOpenAsignar] = useState(false)
    const [selectedRoleId, setSelectedRoleId] = useState("")

    //estados para el boton editar tabla
    const [editPermisoId, setEditPermisoId] = useState("")
    const [modalOpenEditar, setModalOpenEditar] = useState(false)
    const [editRoleId, setEditRoleId] = useState(null)

    const handleDelete = (roleId, permisoId) => {
        removePermisoFromRol(roleId, permisoId)
            .then(() => {
                // Aquí ya se eliminó, no hacemos nada más
            })
            .catch((err) => {
                console.error(err)
                // Solo logueamos el error, no alertamos
            })
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h2 className="text-2xl font-bold">Administración</h2>
            <h2 className="text-xl font-bold">Roles y Permisos</h2>

            {/* botones superiores */}
            <div className="flex flex-wrap gap-4 md:gap-2 mt-4">
                <Link href={"/control"} className="btn btn-primary btn-sm">
                    Regresar
                </Link>
                {/* Crear permiso global */}
                <button
                    className="btn btn-accent btn-sm"
                    onClick={() => setModalOpenCrear(true)}>
                    <i className="fas fa-plus mr-1"></i> Crear Permiso
                </button>
                {/* Asignar permiso a un rol */}
                <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                        setSelectedRoleId(null) // o pasar un role.id si vienes de la tabla
                        setModalOpenAsignar(true)
                    }}>
                    <i className="fas fa-edit mr-1"></i> Asignar Permiso
                </button>
            </div>

            {/* buscador y selector */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-5xl">
                <input
                    type="text"
                    placeholder="Buscar por nombre de rol"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-sm input-bordered w-full md:flex-1"
                />
                <select
                    className="select select-sm w-36"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                </select>
            </div>

            {/* tabla */}
            <div className="overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                {error && (
                    <div className="alert alert-error bg-red-500 text-white">
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="p-6 text-center">Cargando...</div>
                ) : (
                    <table className="table w-full table-zebra text-sm">
                        <thead className="bg-base-300 text-center">
                            <tr>
                                <th>ID Rol</th>
                                <th>Nombre Rol</th>
                                <th>Permiso</th>
                                <th>Descripción Permiso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {rolesConPermisos.map((role) =>
                                role.permisos.length > 0 ? (
                                    role.permisos.map((permiso) => (
                                        <tr
                                            key={`role-${role.id}-perm-${permiso.id}`}>
                                            <td>{role.id}</td>
                                            <td>{role.nombre}</td>
                                            <td>{permiso.nombre}</td>
                                            <td>
                                                {permiso.descripcion || "-"}
                                            </td>
                                            <td className="flex gap-2 justify-center">
                                                <button
                                                    className="btn btn-info btn-xs"
                                                    onClick={() => {
                                                        setEditRoleId(role.id)
                                                        setModalOpenEditar(true)
                                                    }}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>

                                                <button
                                                    className="btn btn-error btn-xs"
                                                    onClick={() =>
                                                        handleDelete(
                                                            role.id,
                                                            permiso.id,
                                                        )
                                                    }>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={`role-${role.id}-noperm`}>
                                        <td>{role.id}</td>
                                        <td>{role.nombre}</td>
                                        <td
                                            colSpan={2}
                                            className="text-gray-400">
                                            Sin permisos asignados
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* paginado */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {/* modal */}
            <ModalCrearPermiso
                isOpen={modalOpenCrear}
                onClose={() => setModalOpenCrear(false)}
            />

            <ModalAsignarPermiso
                isOpen={modalOpenAsignar}
                onClose={() => setModalOpenAsignar(false)}
                selectedRoleId={selectedRoleId}
                setSelectedRoleId={setSelectedRoleId}
            />
            <ModalEditarPermiso
                isOpen={modalOpenEditar}
                onClose={() => setModalOpenEditar(false)}
                roleId={editRoleId}
            />
        </div>
    )
}
