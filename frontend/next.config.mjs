import path from "path"
import { fileURLToPath } from "url"
import withPWA from "next-pwa"

// Convierte import.meta.url en ruta absoluta
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    reactStrictMode: true,
    turbopack: {
        root: path.resolve(__dirname),
    },
}

// Configuración válida de PWA
const pwaConfig = {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
}

export default withPWA(pwaConfig)(nextConfig)
