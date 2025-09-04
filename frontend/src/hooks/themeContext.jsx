"use client"
import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState()

    useEffect(() => {
        setTheme(localStorage.getItem("theme") || "light")
    }, [])

    useEffect(() => {
        if (!theme) return
        localStorage.setItem("theme", theme)
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
export { ThemeContext, ThemeProvider }
