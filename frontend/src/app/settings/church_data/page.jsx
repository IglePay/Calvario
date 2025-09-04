"use client"

import Link from "next/link"
import { useState } from "react"

export default function ChurchData() {
    const [form, setForm] = useState({
        identificacion: "",
        nombre: "",
        email: "",
        telefono: "",
        anioInicio: "",
        direccion: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Datos Iglesia:", form)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Datos de la Iglesia</h1>

            <div className="w-full max-w-3xl bg-base-200 rounded-2xl shadow-lg p-6">
                {/* Botón regresar */}
                <div className="flex justify-start mb-6">
                    <Link
                        href="/control/panel"
                        className="btn btn-primary rounded-2xl">
                        Regresar
                    </Link>
                </div>

                {/* Formulario en grid responsivo */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="label">Identificación</label>
                        <input
                            type="text"
                            name="identificacion"
                            value={form.identificacion}
                            onChange={handleChange}
                            placeholder="NIT o Cédula"
                            className="input input-bordered"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Nombre de la iglesia"
                            className="input input-bordered"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            className="input input-bordered"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            placeholder="000-000-0000"
                            className="input input-bordered"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Año de inicio</label>
                        <select
                            name="anioInicio"
                            value={form.anioInicio}
                            onChange={handleChange}
                            className="select select-bordered">
                            <option value="">Seleccione un año</option>
                            {Array.from({ length: 50 }, (_, i) => {
                                const year = new Date().getFullYear() - i
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            placeholder="Dirección completa"
                            className="input input-bordered"
                        />
                    </div>

                    {/* Botón de enviar */}
                    <div className="col-span-full flex justify-end mt-4">
                        <button
                            type="submit"
                            className="btn btn-accent rounded-2xl px-6">
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
