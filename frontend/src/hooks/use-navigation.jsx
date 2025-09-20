"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function useNavigation() {
    const router = useRouter()
    const [activeSection, setActiveSection] = useState("escritorio")
    const [searchQuery, setSearchQuery] = useState("")
    const [openModal, setOpenModal] = useState(null)
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
                    route: "/control/memebers/persons",
                },
                {
                    id: "miembros-agregar",
                    icon: "fas fa-user-plus",
                    label: "Agregar",
                    action: "openMemberModal",
                },
            ],
        },
        {
            id: "actividades",
            icon: "fas fa-calendar-alt",
            label: "Actividades",
            route: "/control/activities",
        },
        // {
        //     id: "areas-servicio",
        //     icon: "fas fa-cogs",
        //     label: "Áreas de servicio",
        // },
        {
            id: "limpieza",
            icon: "fa fa-solid fa-broom",
            label: "Áreas de limpieza",
            route: "/control/cleaning",
        },
        {
            id: "usuarios",
            icon: "fas fa-user",
            label: "Colaborador",
            route: "/control/collaborator",
        },
        {
            id: "grupos",
            icon: "fas fa-users-cog",
            label: "Grupos",
            route: "/control/groups",
        },
        {
            id: "finanzas",
            icon: "fas fa-dollar-sign",
            label: "Finanzas",
            children: [
                {
                    id: "cuentas",
                    icon: "fa-solid fa-wallet",
                    label: "Cuentas",
                    route: "/control/finance/accounts",
                },
                {
                    id: "fondos",
                    icon: "fa-solid fa-piggy-bank",
                    label: "Fondos",
                    route: "/control/finance/funds",
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
                    route: "/contro/assists/general_assists",
                },
                {
                    id: "Assitencia_Individual",
                    icon: "fas fa-user-plus",
                    label: "Asistencia Individual",
                    route: "/control/assists/individual_assists",
                },
                {
                    id: "Eventos",
                    icon: "fas fa-file-alt",
                    label: "Eventos",
                    route: "/control/assists/events",
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
                    route: "/control/settings/profile",
                },
                {
                    id: "Preferencias",
                    icon: "fas fa-sliders-h",
                    label: "Datos de la Iglesia",
                    route: "/control/settings/church_data",
                },
            ],
        },
    ]

    const handleNavigation = (section) => {
        setActiveSection(section.id)
        if (section.route) {
            router.push(section.route)
        } else if (section.action === "openMemberModal") {
            setOpenModal("member")
        }
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
    }

    return {
        activeSection,
        searchQuery,
        menuItems,
        handleNavigation,
        handleSearch,
        setSearchQuery,
        openModal,
        setOpenModal,
    }
}
