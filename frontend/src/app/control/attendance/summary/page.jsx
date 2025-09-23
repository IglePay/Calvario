"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAssistance } from "@/hooks/attendance/useAttendace"

const Summary = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const idservicio = Number(searchParams.get("idservicio"))
    const fechaServicio = searchParams.get("fechaServicio")

    const { getFamiliasPorServicio } = useAssistance()
    const [familias, setFamilias] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!idservicio || !fechaServicio) {
            setError("Parámetros inválidos")
            setLoading(false)
            return
        }

        const fetchFamilias = async () => {
            try {
                setLoading(true)
                setError("")
                const data = await getFamiliasPorServicio(
                    idservicio,
                    fechaServicio,
                )
                setFamilias(data)
            } catch (err) {
                console.error(err)
                setError(err.message || "Error al cargar familias")
            } finally {
                setLoading(false)
            }
        }

        fetchFamilias()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idservicio, fechaServicio]) // no incluir getFamiliasPorServicio

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                {idservicio && fechaServicio
                    ? `Asistentes para servicio ${idservicio} el ${fechaServicio}`
                    : "Resumen de Asistentes"}
            </h2>

            <button
                className="btn btn-primary btn-sm mb-4"
                onClick={() => router.back()}>
                Regresar
            </button>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            {loading ? (
                <p>Cargando...</p>
            ) : familias.length === 0 ? (
                <p>No hay familias registradas para este servicio.</p>
            ) : (
                <table className="table table-zebra w-full text-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Familia</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {familias.map((f, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{f.familia.nombreFamilia}</td>
                                <td>{f.cantidad_asistentes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Summary
