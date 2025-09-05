"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

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

        // Validación de contraseñas
        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,

                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        password: form.password,
                    }),
                },
            )

            const data = await res.json()
            console.log("Respuesta backend:", res.status, data) // Para depuración

            if (!res.ok) {
                throw new Error(data.message || "Error al registrarse")
            }

            // Redirige al login solo si todo está OK
            window.location.href = "/"
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-100 via-white to-cyan-100 p-4">
            {/* Círculo con logo */}
            <div className="flex items-center justify-center w-35 h-35 rounded-full border-4 border-rose-500 shadow-md bg-white mb-6">
                <Image
                    src="/images/iglepay.png"
                    alt="Logo Calvario"
                    width={120}
                    height={120}
                    className="object-contain"
                    priority
                />
            </div>

            {/* Card de registro */}
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-5 border border-cyan-600">
                <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">
                    Registro
                </h2>

                <form
                    className="flex flex-col items-center justify-center gap-4"
                    onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nombre completo"
                        className="input input-bordered w-full rounded-lg border-gray-300 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico"
                        className="input input-bordered w-full rounded-lg border-gray-300 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            className="input input-bordered w-80 sm:w-100 pr-10 rounded-lg border-gray-300 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-cyan-600"
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
                            className="input input-bordered w-80 sm:w-100 pr-10 rounded-lg border-gray-300 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-cyan-600"
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
                        className="btn bg-rose-900 hover:bg-rose-700 text-white font-semibold rounded-full">
                        Registrarse
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                        href="/"
                        className="text-cyan-600 font-semibold hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
