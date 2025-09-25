"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"

export default function ControlLayout({ children }) {
    const { user, loading } = useAuthContext()
    const router = useRouter()

    // Si no hay usuario, redirige al login
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login")
        }
    }, [loading, user, router])

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                Cargando...
            </div>
        )
    }

    return children
}
