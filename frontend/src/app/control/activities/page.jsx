"use client"
import { useState } from "react"
import ActivityModal from "./components/ActivityModal"
import Link from "next/link"
import useActivities from "@/hooks/activities/useActivities"

function prettyDate(iso) {
    if (!iso) return "_"
    return new Date(iso).toLocaleDateString("es-GT", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

const ActivitiesPage = () => {
    //se importa el hook useActivities para obtener las actividades
    const {
        activities,
        miembros,
        grupos,
        loading,
        error,
        createActivity,
        updateActivity,
        deleteActivity,
    } = useActivities()

    const [modalOpen, setModalOpen] = useState(false)
    const [editingActivity, setEditingActivity] = useState(null)

    const [search, setSearch] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleSave = (data) => {
        if (editingActivity) {
            updateActivity(editingActivity.idActividad, data).then(() => {
                setEditingActivity(null)
                setModalOpen(false)
            })
        } else {
            createActivity(data).then(() => setModalOpen(false))
        }
    }

    const handleEdit = (activity) => {
        setEditingActivity(activity)
        setModalOpen(true)
    }

    const handleDelete = (id) => {
        deleteActivity(id)
    }

    return (
        <div className=" flex flex-col items-center justify-start min-h-screen bg-base-100 p-6">
            <h1 className="text-2xl font-bold">Listado de Actividades</h1>

            <div className="flex gap-2 mt-4">
                <Link href={"/control"} className="btn btn-primary btn-sm ">
                    {" "}
                    Regresar
                </Link>

                <button
                    className="btn btn-accent btn-sm "
                    onClick={() => setModalOpen(true)}>
                    <i className="fas fa-plus mr-1"></i> Agregar
                </button>
            </div>

            {/* Buscador y rows */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 w-full max-w-6xl">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por título, descripción, grupo, miembro"
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

            <div className=" overflow-x-auto rounded-box border border-base-content/5 mt-5 w-full max-w-6xl">
                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}
                {loading ? (
                    <div className="p-6 text-center">Cargando...</div>
                ) : (
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-300 text-center">
                            <tr>
                                <th>N.</th>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th>Grupo</th>
                                <th>Miembro</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {activities.length === 0 && !loading ? (
                                <tr key="no-activities">
                                    <td colSpan={5} className="text-center">
                                        No hay actividades registradas
                                    </td>
                                </tr>
                            ) : (
                                activities.map((act) => (
                                    <tr key={act.idActividad}>
                                        <td>{act.idActividad}</td>
                                        <td>{act.titulo}</td>
                                        <td>{act.descripcion ?? "-"}</td>
                                        <td>{act.grupo ?? "-"}</td>
                                        <td>{act.miembro ?? "-"}</td>
                                        <td>
                                            {prettyDate(act.fechaActividad)}
                                        </td>

                                        <td className="flex gap-2 items-center justify-center">
                                            <button
                                                onClick={() => handleEdit(act)}
                                                className="btn btn-warning btn-xs">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        act.idActividad,
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

            <ActivityModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setEditingActivity(null)
                }}
                onSave={handleSave}
                initialData={editingActivity}
                miembros={miembros}
                grupos={grupos}
            />
        </div>
    )
}

export default ActivitiesPage
