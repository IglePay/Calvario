"use client"
import { useState } from "react"
import { useRolPermiso } from "@/hooks/rolepermiso/useRolePermiso"

export default function ModalCrearPermiso({ isOpen, onClose }) {
    const { createPermiso } = useRolPermiso()
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")

    if (!isOpen) return null

    const handleSave = async () => {
        if (!nombre) return alert("Ingresa el nombre del permiso")
        try {
            await createPermiso(nombre, descripcion)
            setNombre("")
            setDescripcion("")
            onClose()
        } catch (error) {
            console.error(error)
            alert("Ocurrió un error al crear el permiso")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-bold mb-4">Crear nuevo permiso</h3>
                <input
                    type="text"
                    placeholder="Nombre del permiso"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="input input-bordered w-full mb-3"
                />
                <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="textarea textarea-bordered w-full mb-3"
                />
                <div className="flex justify-end gap-2">
                    <button className="btn btn-ghost" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}
