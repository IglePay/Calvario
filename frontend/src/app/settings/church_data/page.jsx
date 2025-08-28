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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-md w-full max-w-2xl">
                {/* Header con botón regresar */}
                <div className="flex items-center justify-between bg-blue-600 text-white p-4 rounded-t-xl">
                    <Link
                        href="/"
                        className="btn btn-primary btn-md rounded-xl">
                        Regresar
                    </Link>

                    <h2 className="text-lg font-bold">Datos de la Iglesia</h2>

                    <div className="w-20" />
                </div>

                {/* Formulario */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 p-6">
                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="identificacion"
                            className="w-40 font-medium text-right">
                            Identificación
                        </label>
                        <input
                            id="identificacion"
                            name="identificacion"
                            value={form.identificacion}
                            onChange={handleChange}
                            type="text"
                            className="input input-bordered flex-1"
                            placeholder="NIT o Cédula"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="nombre"
                            className="w-40 font-medium text-right">
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            type="text"
                            className="input input-bordered flex-1"
                            placeholder="Nombre de la iglesia"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="email"
                            className="w-40 font-medium text-right">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            className="input input-bordered flex-1"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="telefono"
                            className="w-40 font-medium text-right">
                            Teléfono
                        </label>
                        <input
                            id="telefono"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            type="tel"
                            className="input input-bordered flex-1"
                            placeholder="000-000-0000"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="anioInicio"
                            className="w-40 font-medium text-right">
                            Año de inicio
                        </label>
                        <select
                            id="anioInicio"
                            name="anioInicio"
                            value={form.anioInicio}
                            onChange={handleChange}
                            className="select select-bordered flex-1">
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

                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="direccion"
                            className="w-40 font-medium text-right">
                            Dirección
                        </label>
                        <input
                            id="direccion"
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            type="text"
                            className="input input-bordered flex-1"
                            placeholder="Dirección completa"
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary rounded-xl px-6">
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
