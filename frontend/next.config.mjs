import withPWA from "next-pwa"

/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    reactStrictMode: true,
    turbopack: {
        root: ".",
    },
}

// Configuración válida de PWA
const pwaConfig = {
    dest: "public",
    register: true,
    skipWaiting: true,
}

export default withPWA(pwaConfig)(nextConfig)
