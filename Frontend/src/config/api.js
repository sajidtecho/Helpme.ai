const API_BASE_URL = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL?.trim() || "")
    : (import.meta.env.VITE_API_URL?.trim() || "http://localhost:3000")

function joinApiUrl(path) {
    const normalizedBase = API_BASE_URL.replace(/\/$/, "")
    const normalizedPath = path.startsWith("/") ? path : `/${path}`

    return normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath
}

export { API_BASE_URL, joinApiUrl }