"use client"

import Link from "next/link"
import { useState } from "react"

export default function Profile() {
    const [form, setForm] = useState({
        role: "admin",
        username: "",
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // aquí iría la lógica para enviar el formulario
        console.log("Enviar form:", form)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-md w-full max-w-2xl">
                {/* Header con botón regresar */}
                <div className="flex items-center justify-between bg-blue-500 text-white p-4 rounded-t-xl">
                    <Link
                        href="/"
                        className="btn btn-primary btn-md rounded-xl">
                        Regresar
                    </Link>

                    <h2 className="text-lg font-bold">Editar Usuario</h2>

                    {/* Placeholder para balancear el header */}
                    <div className="w-20" />
                </div>

                {/* Formulario (labels e inputs en línea horizontal) */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 p-6">
                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="role"
                            className="w-32 font-medium text-right">
                            Rol
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="select select-bordered flex-1">
                            <option value="admin">Admin</option>
                            <option value="user">Usuario</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="username"
                            className="w-32 font-medium text-right">
                            Usuario
                        </label>
                        <input
                            id="username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            type="text"
                            className="input input-bordered flex-1"
                            placeholder="Nombre de usuario"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="email"
                            className="w-32 font-medium text-right">
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
                            htmlFor="password"
                            className="w-32 font-medium text-right">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            type="password"
                            className="input input-bordered flex-1"
                            placeholder="••••••••"
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
