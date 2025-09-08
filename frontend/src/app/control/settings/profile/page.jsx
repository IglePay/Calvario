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
        console.log("Enviar form:", form)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>

            <div className="w-full max-w-3xl bg-base-200 rounded-2xl shadow-lg p-6">
                {/* Botón regresar */}
                <div className="flex justify-start mb-6">
                    <Link
                        href="/control"
                        className="btn btn-primary rounded-2xl">
                        Regresar
                    </Link>
                </div>

                {/* Formulario en grid responsivo */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="label">Rol</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="select select-bordered">
                            <option value="admin">Admin</option>
                            <option value="user">Usuario</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="input input-bordered"
                            placeholder="Nombre de usuario"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="input input-bordered"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="label">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="input input-bordered"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Botón de enviar ocupando todo el ancho */}
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
