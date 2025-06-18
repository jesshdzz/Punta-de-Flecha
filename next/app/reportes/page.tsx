"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, ArrowLeft, FileText, Download, Eye } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import type { Reporte } from "@/types"
import Link from "next/link"

export default function ReportesPage() {
  const [reportes, setReportes] = useState<Reporte[]>([])

  useEffect(() => {
    const db = BaseDatos.getInstance()
    setReportes(db.obtenerReportes())
  }, [])

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case "estudiantes":
        return "bg-blue-100 text-blue-800"
      case "calificaciones":
        return "bg-green-100 text-green-800"
      case "asistencia":
        return "bg-yellow-100 text-yellow-800"
      case "general":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDescargarReporte = (reporte: Reporte) => {
    const contenido = JSON.stringify(reporte, null, 2)
    const blob = new Blob([contenido], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reporte.titulo.replace(/\s+/g, "_")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-base-content mb-2">Sistema de Reportes</h1>
          <p className="text-base-content/70">Consultar y generar reportes del sistema escolar</p>
        </div>

        <Card className="bg-white bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-900 dark:text-base-content">Reportes Generados</CardTitle>
                <CardDescription>Total de reportes: {reportes.length}</CardDescription>
              </div>
              <Link href="/reportes/generar">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {reportes.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha Generación</TableHead>
                      <TableHead>Generado Por</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportes.map((reporte) => (
                      <TableRow key={reporte.id}>
                        <TableCell className="font-medium">{reporte.titulo}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getColorTipo(reporte.tipo)}>
                            <FileText className="h-3 w-3 mr-1" />
                            {reporte.tipo.charAt(0).toUpperCase() + reporte.tipo.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatearFecha(reporte.fechaGeneracion)}</TableCell>
                        <TableCell>{reporte.generadoPor}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDescargarReporte(reporte)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">No hay reportes generados</h3>
                <p className="text-gray-600 mb-4">Comienza generando tu primer reporte del sistema</p>
                <Link href="/reportes/generar">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Generar Primer Reporte
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
