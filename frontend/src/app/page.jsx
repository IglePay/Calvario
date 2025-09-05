"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

const Home = ({ role }) => {
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
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password,
                    }),
                },
            )

            const data = await res.json()
            if (!res.ok)
                throw new Error(data.message || "Error al iniciar sesión")

            // ✅ Guardar token
            localStorage.setItem("token", data.access_token)

            // ✅ Redirigir
            window.location.href = "/control/panel"
        } catch (err) {
            setError(err.message)
        }
    }

    const getRoleIcon = () => {
        switch (role) {
            case "miembro":
                return (
                    <i className="fa-solid fa-users text-3xl text-cyan-600"></i>
                )
            case "pastor":
                return (
                    <i className="fa-solid fa-user-tie text-3xl text-rose-600"></i>
                )
            case "admin":
                return (
                    <i className="fa-solid fa-user-shield text-3xl text-gray-700"></i>
                )
            default:
                return null
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-100 via-white to-cyan-100 ">
            {/* Círculo con logo */}
            <div className="flex items-center justify-center w-35 h-35 rounded-full border-4 border-rose-500 shadow-md bg-white mb-3">
                <Image
                    src="/images/iglepay.png"
                    alt="Logo Calvario"
                    width={120}
                    height={120}
                    className="object-contain"
                    priority
                />
            </div>

            {/* Card del login */}
            <div className="bg-white rounded-2xl shadow-lg w-auto md:w-full max-w-md p-8 border border-cyan-600">
                <div className="flex flex-col items-center mb-6">
                    {getRoleIcon()}
                    <h2 className="text-2xl font-bold mt-2 text-gray-800 capitalize">
                        {role} Bienvenido
                    </h2>
                </div>

                <form
                    className="flex flex-col items-center justify-center gap-2"
                    onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        className="input input-bordered w-full sm:w-100 rounded-lg border-gray-300 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            className="input input-bordered w-full sm:w-100 rounded-lg border-gray-300 pr-10 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
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

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="btn bg-rose-900 hover:bg-rose-700 text-white font-semibold rounded-full w-full md:w-40">
                        Iniciar sesión
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    ¿No tienes cuenta?{" "}
                    <Link
                        href="/register"
                        className="text-cyan-600 font-semibold hover:underline">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Home
