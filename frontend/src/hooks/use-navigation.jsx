"use client"
import { useState } from "react"

export function useNavigation() {
    const [activeSection, setActiveSection] = useState("escritorio")
    const [searchQuery, setSearchQuery] = useState("")

    const menuItems = [
        { id: "escritorio", icon: "fas fa-desktop", label: "Escritorio" },
        {
            id: "miembros",
            icon: "fas fa-users",
            label: "Miembros",
            children: [
                {
                    id: "miembros-lista",
                    icon: "fas fa-list",
                    label: "Lista",
                },
                {
                    id: "miembros-agregar",
                    icon: "fas fa-user-plus",
                    label: "Agregar",
                },
            ],
        },
        {
            id: "actividades",
            icon: "fas fa-calendar-alt",
            label: "Actividades",
        },
        {
            id: "areas-servicio",
            icon: "fas fa-cogs",
            label: "Áreas de servicio",
        },
        { id: "usuarios", icon: "fas fa-user", label: "Usuarios" },
        { id: "grupos", icon: "fas fa-users-cog", label: "Grupos" },
        { id: "finanzas", icon: "fas fa-dollar-sign", label: "Finanzas" },
        {
            id: "asistencias",
            icon: "fas fa-clipboard-check",
            label: "Asistencias",
        },
    ]

    const handleNavigation = (sectionId) => {
        setActiveSection(sectionId)
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
