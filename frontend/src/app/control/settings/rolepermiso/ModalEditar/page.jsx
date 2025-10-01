"use client"
import { useState, useEffect } from "react"
import { useRolPermiso } from "@/hooks/rolepermiso/useRolePermiso"

export default function ModalEditarPermiso({ isOpen, onClose, roleId }) {
    const { permisosDisponibles, updatePermisosRol } = useRolPermiso()
    const [selectedPermisoId, setSelectedPermisoId] = useState("")

    // limpiar selección al abrir el modal
    useEffect(() => {
        if (isOpen) {
            setSelectedPermisoId("") // opcional: puedes precargar el permiso actual
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleSave = async () => {
        if (!roleId) return alert("Rol no seleccionado")
        if (!selectedPermisoId) return alert("Selecciona un permiso")

        try {
            // enviar un array con el nombre del permiso seleccionado
            const permiso = permisosDisponibles.find(
                (p) => p.id.toString() === selectedPermisoId,
            )
            if (!permiso) return alert("Permiso no válido")

            await updatePermisosRol(roleId, [permiso.nombre])
            onClose()
        } catch (error) {
            console.error(error)
            alert("Error al actualizar permisos")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-bold mb-4">
                    Editar permiso del rol
                </h3>

                <select
                    className="select select-bordered w-full mb-3"
                    value={selectedPermisoId}
                    onChange={(e) => setSelectedPermisoId(e.target.value)}>
                    <option value="">Selecciona un permiso</option>
                    {permisosDisponibles.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre}
                        </option>
                    ))}
                </select>

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
