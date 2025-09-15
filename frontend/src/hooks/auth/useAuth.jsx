"use client"
import { useEffect, useState } from "react"
import { apiFetch } from "@/utils/apiFetch"

export function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchUser = () => {
        setLoading(true)
        setError(null)

        console.log("🔹 Llamando a /auth/me...") //  Debug

        return apiFetch("/auth/me", { method: "GET" })
            .then(async (res) => {
                console.log("🔹 Respuesta raw:", res) // mostrar el Response completo
                const data = await res.json()
                console.log("🔹 Datos recibidos:", data) // mostrar el body
                if (!res.ok) throw new Error("No autenticado")
                return data
            })
            .then((data) => {
                setUser(data)
                return data
            })
            .catch((err) => {
                console.error("❌ Error fetchUser:", err)
                setUser(null)
                setError(err.message)
                return null
            })
            .finally(() => {
                console.log("🔹 fetchUser finalizado")
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return { user, loading, error, fetchUser }
}
