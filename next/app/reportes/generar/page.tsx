"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, Download } from "lucide-react"
import { SistemaDeReportes } from "@/lib/sistema-reportes"
import type { Reporte } from "@/types"
import Link from "next/link"

export default function GenerarReportePage() {
  const [tipoReporte, setTipoReporte] = useState("")
  const [reporteGenerado, setReporteGenerado] = useState<Reporte | null>(null)
  const [generando, setGenerando] = useState(false)

  const handleGenerarReporte = async () => {
    if (!tipoReporte) {
      alert("Seleccione un tipo de reporte")
      return
    }

    setGenerando(true)

    try {
      const sistemaReportes = new SistemaDeReportes()
      let reporte: Reporte

      switch (tipoReporte) {
        case "estudiantes":
          reporte = sistemaReportes.generarReporteEstudiantes()
          break
        case "calificaciones":
          reporte = sistemaReportes.generarReporteCalificaciones()
          break
        default:
          throw new Error("Tipo de reporte no válido")
      }

      setReporteGenerado(reporte)
    } catch (error) {
      console.error("Error:", error)
      alert("Error al generar el reporte")
    } finally {
      setGenerando(false)
    }
  }

  const handleDescargarReporte = () => {
    if (!reporteGenerado) return

    const contenido = JSON.stringify(reporteGenerado, null, 2)
    const blob = new Blob([contenido], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reporteGenerado.titulo.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/reportes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Reportes
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generar Reporte</h1>
          <p className="text-gray-600">Crear reportes personalizados del sistema escolar</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Configuración del Reporte</CardTitle>
              <CardDescription>Seleccione el tipo de reporte que desea generar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tipoReporte">Tipo de Reporte</Label>
                <Select value={tipoReporte} onValueChange={setTipoReporte}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estudiantes">Reporte de Estudiantes</SelectItem>
                    <SelectItem value="calificaciones">Reporte de Calificaciones</SelectItem>
                    <SelectItem value="asistencia">Reporte de Asistencia</SelectItem>
                    <SelectItem value="general">Reporte General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerarReporte} disabled={!tipoReporte || generando} className="w-full">
                {generando ? (
                  "Generando..."
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {reporteGenerado && (
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{reporteGenerado.titulo}</CardTitle>
                    <CardDescription>
                      Generado el {reporteGenerado.fechaGeneracion.toLocaleDateString("es-ES")}
                    </CardDescription>
                  </div>
                  <Button onClick={handleDescargarReporte} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reporteGenerado.tipo === "estudiantes" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reporteGenerado.datos.total}</div>
                        <div className="text-sm text-blue-800">Total Estudiantes</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{reporteGenerado.datos.activos}</div>
                        <div className="text-sm text-green-800">Estudiantes Activos</div>
                      </div>
                    </div>
                  )}

                  {reporteGenerado.tipo === "calificaciones" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{reporteGenerado.datos.total}</div>
                        <div className="text-sm text-purple-800">Total Calificaciones</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {reporteGenerado.datos.promedio.toFixed(2)}
                        </div>
                        <div className="text-sm text-orange-800">Promedio General</div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Resumen de Datos</h4>
                    <pre className="text-xs overflow-auto max-h-40">
                      {JSON.stringify(reporteGenerado.datos, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
