"use client"

import { useState } from "react"
import Image from "next/image"
import { useLogin } from "../hooks/login/useLogin"

const Home = () => {
    const [form, setForm] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const { login, loading, error } = useLogin()

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        login(form)
            .then(() => {
                window.location.href = "/control"
            })
            .catch(() => {
                // el error ya se guarda en el hook, no hace falta setError
            })
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
            <div className="flex items-center justify-center w-35 h-35 rounded-full border-4 border-rose-500 shadow-md bg-transparent dark:bg-transparent mb-3">
                <Image
                    src="/images/iglepay.png"
                    alt="Logo Calvario"
                    width={120}
                    height={120}
                    className="object-contain"
                    priority
                />
            </div>

            <div className="bg-neutral dark:bg-neutral rounded-2xl shadow-lg w-auto md:w-full max-w-md p-8 border border-cyan-600">
                <h2 className="text-2xl font-bold mb-6 text-white dark:text-white text-center">
                    Bienvenido
                </h2>

                <form
                    className="flex flex-col gap-2 items-center justify-center"
                    onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        className="input input-bordered w-full md:w-100 rounded-xl bg-transparent text-white border-gray-300 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            className="input input-bordered w-full md:w-100 rounded-xl bg-transparent text-white border-gray-300 pr-10 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
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
                        disabled={loading}
                        className="btn bg-rose-900 hover:bg-rose-700 text-white border-transparent  dark:bg-rose-900 dark:hover:bg-rose-700 dark:text-white font-semibold rounded-full w-full md:w-40">
                        {loading ? "Entrando..." : "Iniciar sesión"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-100 dark:text-gray-100 flex-col flex">
                    ¿No tienes cuenta?{" "}
                    <a
                        href={`https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}&text=${encodeURIComponent(process.env.NEXT_PUBLIC_WHATSAPP_TEXT)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-500 hover:underline dark:text-cyan-500">
                        Solicítala por WhatsApp
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Home
