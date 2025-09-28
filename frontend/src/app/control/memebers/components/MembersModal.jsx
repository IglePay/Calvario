"use client"
import { useState, useEffect } from "react"
import * as Yup from "yup"

// Definir el esquema de validación
const memberSchema = Yup.object().shape({
    dpi: Yup.string().nullable(),
    nombre: Yup.string().required("Nombre es obligatorio"),
    apellido: Yup.string().required("Apellido es obligatorio"),
    email: Yup.string().email("Correo no válido").nullable(),
    telefono: Yup.string("Son numeros de 8 digitos").nullable(),
    fechaNacimiento: Yup.date().nullable(),
    idGenero: Yup.number().nullable(),
    direccion: Yup.string().nullable(),
    idEstado: Yup.number().nullable(),
    fechaLlegada: Yup.date().nullable(),
    idBautizado: Yup.number().nullable(),
    fechaBautismo: Yup.date().nullable(),
    idServidor: Yup.number().nullable(),
    procesosterminado: Yup.string().nullable(),
    idGrupo: Yup.number().nullable(),
    legusta: Yup.string().nullable(),
})

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
        idEstado: "",
        fechaLlegada: "",
        idBautizado: "",
        fechaBautismo: "",
        idServidor: "",
        procesosterminado: "",
        idGrupo: "",
        legusta: "",
    })

    const normalizeMemberForForm = (member) => ({
        dpi: member.dpi || "",
        nombre: member.nombre || "",
        apellido: member.apellido || "",
        email: member.email || "",
        telefono: member.telefono || "",
        fechaNacimiento: member.fechanacimiento
            ? member.fechanacimiento.split("T")[0]
            : "",
        idGenero: member.idGenero ? String(member.idGenero) : "",
        direccion: member.direccion || "",
        idEstado: member.idEstado ? String(member.idEstado) : "",
        fechaLlegada: member.fechaLlegada ? member.fechaLlegada : "",
        idBautizado: member.idBautizado ? String(member.idBautizado) : "",
        idServidor: member.idServidor ? String(member.idServidor) : "",
        fechaBautismo: member.fechaBautismo || "",
        procesosterminado: member.procesosterminado || "",
        idGrupo: member.idGrupo ? String(member.idGrupo) : "",
        legusta: member.legusta || "",
    })

    //  Prellenar formulario al editar

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData(normalizeMemberForForm(initialData))
        } else if (mode === "create") {
            setFormData({
                dpi: "",
                nombre: "",
                apellido: "",
                email: "",
                telefono: "",
                fechaNacimiento: "",
                idGenero: "",
                direccion: "",
                idEstado: "",
                fechaLlegada: "",
                idBautizado: "",
                fechaBautismo: "",
                idServidor: "",
                procesosterminado: "",
                idGrupo: "",
                legusta: "",
            })
        }
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

    const toISO = (date) => (date ? new Date(date).toISOString() : null)
    const toNumberOrNull = (value) =>
        value !== "" && value != null ? Number(value) : null

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const validatedData = await memberSchema.validate(formData, {
                abortEarly: false,
                stripUnknown: true,
            })

            const payload = {
                ...validatedData,
                fechaNacimiento: toISO(validatedData.fechaNacimiento),
                fechaLlegada: toISO(validatedData.fechaLlegada),
                fechaBautismo: toISO(validatedData.fechaBautismo),
                idGenero: toNumberOrNull(validatedData.idGenero),
                idEstado: toNumberOrNull(validatedData.idEstado),
                idGrupo: toNumberOrNull(validatedData.idGrupo),
                idBautizado: toNumberOrNull(validatedData.idBautizado),
                idServidor: toNumberOrNull(validatedData.idServidor),
            }

            console.log("payload listo para enviar:", payload)
            onSubmit(payload)
        } catch (err) {
            if (err.inner) {
                console.log("Errores de validación:", err.inner)
            }
        }
    }

    if (!isOpen) return null

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
                            placeholder="Son 13 digitos numerales"
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
                            placeholder="ejem. 12121414"
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
                            name="fechaLlegada"
                            value={formData.fechaLlegada}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Fecha de Bautismo</label>
                        <input
                            type="date"
                            name="fechaBautismo"
                            value={formData.fechaBautismo}
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
                            name="idEstado"
                            value={String(formData.idEstado)}
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
                            name="idGrupo"
                            value={String(formData.idGrupo)}
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
                            className="btn bg-gray-700  text-white"
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
