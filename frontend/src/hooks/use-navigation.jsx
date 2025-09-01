"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function useNavigation() {
    const router = useRouter()
    const [activeSection, setActiveSection] = useState("escritorio")
    const [searchQuery, setSearchQuery] = useState("")

    const menuItems = [
        {
            id: "escritorio",
            icon: "fas fa-desktop",
            label: "Escritorio",
        },
        {
            id: "miembros",
            icon: "fas fa-users",
            label: "Miembros",
            children: [
                {
                    id: "miembros-lista",
                    icon: "fas fa-list",
                    label: "Listado Miembros",
                    route: "memebers/persons",
                },
                {
                    id: "miembros-agregar",
                    icon: "fas fa-user-plus",
                    label: "Agregar",
                    route: "memebers/createP",
                },
            ],
        },
        {
            id: "actividades",
            icon: "fas fa-calendar-alt",
            label: "Actividades",
            route: "/activities",
        },
        {
            id: "areas-servicio",
            icon: "fas fa-cogs",
            label: "Áreas de servicio",
        },
        {
            id: "limpieza",
            icon: "fa fa-solid fa-broom",
            label: "Áreas de limpieza",
            route: "/cleaning",
        },
        {
            id: "usuarios",
            icon: "fas fa-user",
            label: "Usuarios",
            route: "/users",
        },
        {
            id: "grupos",
            icon: "fas fa-users-cog",
            label: "Grupos",
            route: "/groups",
        },
        {
            id: "finanzas",
            icon: "fas fa-dollar-sign",
            label: "Finanzas",
            children: [
                {
                    id: "cuentas",
                    icon: "fas fa-arrow-down",
                    label: "Cuentas",
                    route: "/finance/accounts",
                },
                {
                    id: "fondos",
                    icon: "fas fa-arrow-up",
                    label: "Fondos",
                    route: "/finance/funds",
                },
            ],
        },
        {
            id: "asistencias",
            icon: "fas fa-clipboard-check",
            label: "Asistencias",
            children: [
                {
                    id: "Asistencia_General",
                    icon: "fas fa-list",
                    label: "Asistencia General",
                    route: "/assists/general_assists",
                },
                {
                    id: "Assitencia_Individual",
                    icon: "fas fa-user-plus",
                    label: "Asistencia Individual",
                    route: "/assists/individual_assists",
                },
                {
                    id: "Eventos",
                    icon: "fas fa-file-alt",
                    label: "Eventos",
                    route: "/assists/events",
                },
            ],
        },
        {
            id: "Ajustes",
            icon: "fas fa-cog",
            label: "Ajustes",
            children: [
                {
                    id: "Perfil",
                    icon: "fas fa-user-cog",
                    label: "Perfil",
                    route: "/settings/profile",
                },
                {
                    id: "Preferencias",
                    icon: "fas fa-sliders-h",
                    label: "Datos de la Iglesia",
                    route: "/settings/church_data",
                },
            ],
        },
    ]

    const handleNavigation = (section) => {
        setActiveSection(section.id)
        if (section.route) {
            router.push(section.route)
        }
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
        console.log("Searching for:", query)
    }

    return {
        activeSection,
        searchQuery,
        menuItems,
        handleNavigation,
        handleSearch,
        setSearchQuery,
    }
}
