"use client"
import { useState, useEffect } from "react"

const MembersModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    mode = "create",
    grupos = [],
    generos = [],
    estados = [],
    bautizados = [],
    servidores = [],
}) => {
    const [formData, setFormData] = useState({
        dpi: "",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        fechaNacimiento: "",
        idGenero: "",
        direccion: "",
        estadoCivil: "",
        anioLlegada: "",
        idBautizado: "",
        fechabautizo: "",
        idServidor: "",
        procesosterminado: "",
        grupo: "",
        legusta: "",
    })

    // 🔹 Prellenar formulario al editar
    useEffect(() => {
        if (mode === "create") return

        setFormData({
            dpi: initialData.dpi || "",
            nombre: initialData.nombre || "",
            apellido: initialData.apellido || "",
            email: initialData.email || "",
            telefono: initialData.telefono || "",
            fechaNacimiento: initialData.fechanacimiento
                ? initialData.fechanacimiento.split("T")[0]
                : "",
            idGenero: initialData.idGenero ? String(initialData.idGenero) : "",
            direccion: initialData.direccion || "",
            estadoCivil: initialData.idEstado
                ? String(initialData.idEstado)
                : "",
            anioLlegada: initialData.fechallegada
                ? initialData.fechallegada.split("T")[0]
                : "",
            idBautizado: initialData.idBautizado
                ? String(initialData.idBautizado)
                : "",
            idServidor: initialData.idServidor
                ? String(initialData.idServidor)
                : "",
            fechabautizo: initialData.fechabautismo
                ? initialData.fechabautismo.split("T")[0]
                : "",
            procesosterminado: initialData.procesosterminado || "",
            grupo: initialData.idGrupo ? String(initialData.idGrupo) : "",
            legusta: initialData.legusta || "",
        })
    }, [initialData, mode])

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target
        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                      ? files[0]
                      : value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("formData al enviar:", formData)

        const payload = {
            dpi: formData.dpi || null,
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email || null,
            telefono: formData.telefono || null,
            fechaNacimiento: formData.fechaNacimiento
                ? new Date(formData.fechaNacimiento).toISOString()
                : null,
            idGenero: formData.idGenero ? Number(formData.idGenero) : null,
            direccion: formData.direccion || null,
            idEstado: formData.estadoCivil
                ? Number(formData.estadoCivil)
                : null,
            fechaLlegada: formData.anioLlegada
                ? new Date(formData.anioLlegada).toISOString()
                : null,
            procesosTerminado: formData.procesosterminado || null,
            idGrupo: formData.grupo ? Number(formData.grupo) : null,
            leGusta: formData.legusta || null,
            // fechaBautismo: formData.fechabautizo
            //     ? new Date(formData.fechabautizo).toISOString()
            //     : null,
            idBautizado: formData.idBautizado
                ? Number(formData.idBautizado)
                : null,
            idServidor: formData.idServidor
                ? Number(formData.idServidor)
                : null,
        }

        console.log("payload para el backend:", payload)
        onSubmit(payload)
    }

    if (!isOpen) return null

    // 👇 Aquí mismo, dentro del componente MembersModal
    console.log("👉 Bautizados que llegan al modal:", bautizados)
    console.log("👉 Servidores que llegan al modal:", servidores)

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-200 w-full max-w-5xl p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {mode === "create" ? "Nuevo Miembro" : "Editar Miembro"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Datos básicos */}
                    <div className="flex flex-col">
                        <label className="label">Identificación</label>
                        <input
                            type="text"
                            name="dpi"
                            value={formData.dpi}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Correo</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="label">Dirección actual</label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>
                    {/* Fechas */}
                    <div className="flex flex-col">
                        <label className="label">Fecha de nacimiento</label>
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">
                            Año de inicio en la iglesia
                        </label>
                        <input
                            type="date"
                            name="anioLlegada"
                            value={formData.anioLlegada}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Fecha de Bautismo</label>
                        <input
                            type="date"
                            name="fechabautizo"
                            value={formData.fechabautizo}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    {/* Selects dinámicos */}
                    <div className="flex flex-col">
                        <label className="label">Genero</label>
                        <select
                            name="idGenero"
                            value={String(formData.idGenero)}
                            onChange={handleChange}
                            className="input w-full">
                            <option value="">Seleccione</option>
                            {generos.map((g) => (
                                <option key={g.idGenero} value={g.idGenero}>
                                    {g.nombregenero}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Estado civil</label>
                        <select
                            name="estadoCivil"
                            value={String(formData.estadoCivil)}
                            onChange={handleChange}
                            className="input w-full">
                            <option value="">Seleccione</option>
                            {estados.map((e) => (
                                <option key={e.idEstado} value={e.idEstado}>
                                    {e.nombreEstado}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Grupo</label>
                        <select
                            name="grupo"
                            value={String(formData.grupo)}
                            onChange={handleChange}
                            className="input w-full">
                            <option value="">Seleccione</option>
                            {grupos.map((g) => (
                                <option key={g.idGrupo} value={g.idGrupo}>
                                    {g.nombregrupo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Bautizado</label>
                        <select
                            name="idBautizado"
                            value={formData.idBautizado}
                            onChange={handleChange}
                            className="input w-full">
                            <option value="">Seleccione</option>
                            {bautizados.map((b) => (
                                <option
                                    key={b.idBautizado}
                                    value={b.idBautizado}>
                                    {b.bautizadoEstado}{" "}
                                    {b.fechaBautismo
                                        ? `(${b.fechaBautismo.split("T")[0]})`
                                        : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Servidor */}
                    <div className="flex flex-col">
                        <label className="label">Servidor</label>
                        <select
                            name="idServidor"
                            value={formData.idServidor}
                            onChange={handleChange}
                            className="input w-full">
                            <option value="">Seleccione</option>
                            {servidores.map((s) => (
                                <option key={s.idServidor} value={s.idServidor}>
                                    {s.servidorEstado}{" "}
                                    {s.fechaInicio
                                        ? `(${s.fechaInicio.split("T")[0]})`
                                        : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Otros */}
                    <div className="flex flex-col">
                        <label className="label">Procesos completados</label>
                        <input
                            type="text"
                            name="procesosterminado"
                            value={formData.procesosterminado}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">
                            Lo favorito en la iglesia
                        </label>
                        <input
                            type="text"
                            name="legusta"
                            value={formData.legusta}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 col-span-full items-center justify-center mt-4">
                        <button
                            type="button"
                            className="btn btn-ghost bg-gray-300"
                            onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-accent w-auto">
                            {mode === "create" ? "Guardar" : "Actualizar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MembersModal
