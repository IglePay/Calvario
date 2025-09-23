// components/Pagination.jsx
"use client"
import React from "react"

const Pagination = ({ page, totalPages, total, onPageChange }) => {
    if (totalPages === 0) return null

    return (
        <div className="flex flex-col items-center">
            <div className="join mt-4">
                {/* Botón anterior */}
                <button
                    className="join-item btn btn-xs"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}>
                    «
                </button>

                {/* Números de página */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                        <button
                            key={p}
                            className={`join-item btn btn-xs ${
                                page === p ? "btn-active" : ""
                            }`}
                            onClick={() => onPageChange(p)}>
                            {p}
                        </button>
                    ),
                )}

                {/* Botón siguiente */}
                <button
                    className="join-item btn btn-xs"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}>
                    »
                </button>
            </div>

            {/* Texto informativo */}
            {/* {total !== undefined && ( */}
            {/*     <div className="mt-2 text-sm text-gray-500"> */}
            {/*         Página {page} de {totalPages} — {total} registros */}
            {/*     </div> */}
            {/* )} */}
        </div>
    )
}

export default Pagination
