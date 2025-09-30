"use client"
import { useState, useEffect } from "react"

export default function GrupoModal({ isOpen, onClose, onSave, initialData }) {
    const [nombregrupo, setNombregrupo] = useState("")

    useEffect(() => {
        setNombregrupo(initialData?.nombregrupo || "")
    }, [initialData])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!nombregrupo.trim()) return
        onSave({ nombregrupo: nombregrupo.trim() })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h2 className="text-xl font-bold mb-3">
                    {initialData ? "Editar Grupo" : "Agregar Grupo"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={nombregrupo}
                        onChange={(e) => setNombregrupo(e.target.value)}
                        placeholder="Nombre del grupo"
                        className="input input-bordered w-full"
                        required
                    />

                    <div className="modal-action justify-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn text-white bg-gray-700">
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
