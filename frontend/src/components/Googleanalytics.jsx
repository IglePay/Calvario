"use client"
import { useEffect } from "react"

export default function GoogleAnalytics() {
    useEffect(() => {
        const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID

        if (typeof window !== "undefined" && gaTrackingId) {
            const script = document.createElement("script")
            script.src = `https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`
            script.async = true
            document.head.appendChild(script)

            script.onload = () => {
                window.dataLayer = window.dataLayer || []
                function gtag() {
                    window.dataLayer.push(arguments)
                }
                gtag("js", new Date())
                gtag("config", gaTrackingId, {
                    page_path: window.location.pathname,
                })
            }
        }
    }, [])

    //No renderiza nada, solo ejecuta el efecto
    return null
}
