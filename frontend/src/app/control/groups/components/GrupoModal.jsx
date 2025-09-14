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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">
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

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline btn-sm">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
