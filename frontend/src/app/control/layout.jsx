"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ControlLayout({ children }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkUser() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
                    {
                        credentials: "include",
                    },
                )
                if (!res.ok) throw new Error("No autorizado")
                setLoading(false)
            } catch (err) {
                router.replace("/login")
            }
        }
        checkUser()
    }, [router])

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                Cargando...
            </div>
        )

    return children
}
