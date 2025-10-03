"use client"
import { useState, useEffect } from "react"
import { useRolPermiso } from "@/hooks/rolepermiso/useRolePermiso"

export default function ModalAsignarPermiso({
    isOpen,
    onClose,
    selectedRoleId,
    setSelectedRoleId,
}) {
    const { assignPermisoToRol, permisosDisponibles, rolesConPermisos } =
        useRolPermiso()

    const [selectedPermisoId, setSelectedPermisoId] = useState("")
    const [error, setError] = useState("") // <-- nuevo estado para errores

    // Limpiar permiso y error al abrir/cerrar modal
    useEffect(() => {
        if (!isOpen) {
            setSelectedPermisoId("")
            setError("")
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleSave = async () => {
        if (!selectedRoleId) return setError("Selecciona un rol")
        if (!selectedPermisoId) return setError("Selecciona un permiso")
        setError("") // limpiar errores previos
        try {
            await assignPermisoToRol(
                Number(selectedRoleId),
                Number(selectedPermisoId),
            )
            setSelectedPermisoId("")
            onClose()
        } catch (err) {
            console.error(err)
            // Aquí podemos leer el mensaje enviado desde el backend
            setError(err?.message || "Ocurrió un error al asignar el permiso")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-bold mb-4">
                    Asignar permiso a un rol
                </h3>

                <select
                    className="select select-bordered w-full mb-3"
                    value={selectedRoleId || ""}
                    onChange={(e) => setSelectedRoleId(e.target.value)}>
                    <option value="">Selecciona un rol</option>
                    {rolesConPermisos.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.nombre}
                        </option>
                    ))}
                </select>

                <select
                    className="select select-bordered w-full mb-3"
                    value={selectedPermisoId || ""}
                    onChange={(e) => setSelectedPermisoId(e.target.value)}>
                    <option value="">Selecciona un permiso</option>
                    {permisosDisponibles.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre}
                        </option>
                    ))}
                </select>

                {/* Mostrar error debajo */}
                {error && (
                    <div className="text-red-500 text-sm mb-2">{error}</div>
                )}

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
