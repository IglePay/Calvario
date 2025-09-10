import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

/**
 * Exporta datos a Excel
 * @param {Array} data - Arreglo de objetos (ej: [{id:1, nombre:"Iglesia"}])
 * @param {string} filename - Nombre del archivo a descargar
 */
export function exportToExcel(data, filename = "reporte.xlsx") {
    if (!data || data.length === 0) return

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos")
    XLSX.writeFile(workbook, filename)
}

/**
 * Exporta datos a PDF y lo abre en otra ventana
 * @param {Array} data - Arreglo de objetos
 * @param {string} filename - Nombre del archivo PDF
 * @param {boolean} landscape - Si true, PDF horizontal
 */
export function exportToPDF(data, filename = "reporte.pdf", landscape = true) {
    if (!data || data.length === 0) return

    // Crear PDF en horizontal si landscape=true
    const doc = new jsPDF({ orientation: landscape ? "landscape" : "portrait" })

    // Columnas dinámicas
    const columns = Object.keys(data[0])
    const rows = data.map((item) => columns.map((col) => item[col] ?? ""))

    // Título
    doc.text("Reporte", 14, 15)

    // Calcular startY dinámico si hay tablas previas
    const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 20

    // Generar tabla
    autoTable(doc, {
        head: [columns],
        body: rows,
        startY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] }, // color encabezado
    })

    // Generar blob y abrir en otra ventana
    const blob = doc.output("blob")
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
}
