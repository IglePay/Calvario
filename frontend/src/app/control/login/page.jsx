"use client"

import { useState } from "react"
import Link from "next/link"

const Login = ({ role }) => {
    const [form, setForm] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, role }),
            })

            const data = await res.json()
            if (!res.ok)
                throw new Error(data.message || "Error al iniciar sesión")

            console.log("Login exitoso:", data)
            window.location.href = "/dashboard"
        } catch (err) {
            setError(err.message)
        }
    }

    const getRoleIcon = () => {
        switch (role) {
            case "miembro":
                return (
                    <i className="fa-solid fa-users text-3xl text-blue-500"></i>
                )
            case "pastor":
                return (
                    <i className="fa-solid fa-user-tie text-3xl text-rose-500"></i>
                )
            case "admin":
                return (
                    <i className="fa-solid fa-user-secret text-3xl text-gray-700"></i>
                )
            default:
                return null
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
                <div className="flex flex-col items-center mb-6">
                    {getRoleIcon()}
                    <h2 className="text-2xl font-bold mt-2 capitalize">
                        {role} Bienvenido
                    </h2>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            className="input input-bordered w-full pr-10"
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                            onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? (
                                <i className="fa-solid fa-eye-slash"></i>
                            ) : (
                                <i className="fa-solid fa-eye"></i>
                            )}
                        </span>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary rounded-xl mt-2">
                        Iniciar sesión
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    ¿No tienes cuenta?{" "}
                    <Link
                        href="/control/register"
                        className="text-blue-500 font-semibold">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
