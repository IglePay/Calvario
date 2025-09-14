const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Wrapper de fetch que incluye cookies automáticamente.
 * @param {string} path - Ruta del endpoint relativa a API_URL
 * @param {object} options - Opciones de fetch (method, headers, body, etc.)
 * @returns {Promise<Response>}
 */
export const apiFetch = (path, options = {}) => {
    return fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include", //  envía cookies automáticamente
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    })
}
