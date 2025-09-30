"use client"
import { useState, useEffect } from "react"

const ActivityModal = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    miembros,
    grupos,
}) => {
    const [formData, setFormData] = useState({
        titulo: "",
        fecha: "",
        idMiembro: "",
        idGrupo: "",
        descripcion: "",
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                titulo: initialData.titulo || "",
                fecha: initialData.fechaActividad || "",
                idMiembro: initialData.idMiembro || "",
                idGrupo: initialData.idGrupo || "",
                descripcion: initialData.descripcion || "",
            })
        } else {
            setFormData({
                titulo: "",
                fecha: "",
                idMiembro: "",
                idGrupo: "",
                descripcion: "",
            })
        }
    }, [initialData])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    if (!isOpen) return null

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="text-lg font-bold mb-4">
                    {initialData ? "Editar Actividad" : "Nueva Actividad"}
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
                    <div className="form-control">
                        <label className="label">Título</label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Actividad"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">Miembro</label>
                        <select
                            name="idMiembro"
                            value={formData.idMiembro}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                            required>
                            <option value="">Selecciona un miembro</option>
                            {miembros.map((m) => (
                                <option key={m.idMiembro} value={m.idMiembro}>
                                    {m.nombre} {m.apellido}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">Grupo</label>
                        <select
                            name="idGrupo"
                            value={formData.idGrupo}
                            onChange={handleChange}
                            className="select select-bordered w-full">
                            <option value="">Selecciona un grupo</option>
                            {grupos.map((g) => (
                                <option key={g.idGrupo} value={g.idGrupo}>
                                    {g.nombregrupo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="form-control col-span-2">
                        <label className="label">Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="flex gap-2 modal-action col-span-2 justify-center mt-3">
                        <button
                            type="button"
                            className="btn text-white bg-gray-700"
                            onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-accent w-auto">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ActivityModal
