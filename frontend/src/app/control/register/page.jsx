"use client"

import { useState } from "react"
import Link from "next/link"

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Error al registrarse")

            console.log("Registro exitoso:", data)
            window.location.href = "/control/login"
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Registro
                </h2>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nombre completo"
                        className="input input-bordered w-full"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico"
                        className="input input-bordered w-full"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
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

                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmar contraseña"
                            className="input input-bordered w-full pr-10"
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                            onClick={() => setShowConfirm((prev) => !prev)}>
                            {showConfirm ? (
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
                        Registrarse
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                        href="/control/login"
                        className="text-blue-500 font-semibold">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
