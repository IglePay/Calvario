"use client"
import { useState } from "react"

const Modal = ({
    title = "Modal",
    isOpen,
    onClose,
    onSave,
    children,
    saveLabel = "Guardar",
}) => {
    if (!isOpen) return null

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <div className="mt-4 flex flex-col gap-3">
                    {children} {/* Aquí van los inputs que pase cada módulo */}
                </div>
                <div className="modal-action  justify-center">
                    <button
                        onClick={onClose}
                        className="btn text-white bg-gray-700">
                        Cancelar
                    </button>
                    <button onClick={onSave} className="btn btn-accent w-auto">
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Modal
