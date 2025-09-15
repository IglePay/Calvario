"use client"

import { useState } from "react"
import { apiFetch } from "@/utils/apiFetch" // donde tienes tu wrapper

export const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    /**
     * Intenta iniciar sesión con email y password
     * @param {{ email: string, password: string }} credentials
     * @returns {Promise<object>} respuesta del backend
     */
    const login = (credentials) => {
        setLoading(true)
        setError(null)

        return apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        })
            .then(async (res) => {
                const data = await res.json()
                if (!res.ok)
                    throw new Error(data.message || "Error al iniciar sesión")
                return data
            })
            .catch((err) => {
                setError(err.message)
                throw err
            })
            .finally(() => setLoading(false))
    }

    return { login, loading, error }
}
