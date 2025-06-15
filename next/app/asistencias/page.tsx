"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, ArrowLeft, Clock } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import type { Asistencia, Estudiante, Materia } from "@/types"
import Link from "next/link"

export default function AsistenciasPage() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [estudiantes, setEstudiantes] = useState<Map<string, Estudiante>>(new Map())
  const [materias, setMaterias] = useState<Map<string, Materia>>(new Map())
  const [filtro, setFiltro] = useState("")

  useEffect(() => {
    const db = BaseDatos.getInstance()

    // Agregar algunas asistencias de ejemplo si no existen
    if (!db.obtenerAsistencias || db.obtenerAsistencias().length === 0) {
      const asistenciasEjemplo: Asistencia[] = [
        {
          id: "ast_1",
          estudianteId: "est1",
          materiaId: "mat1",
          porcentaje: 90,
          fecha: new Date("2024-01-15"),
          profesorId: "2",
        },
        {
          id: "ast_2",
          estudianteId: "est1",
          materiaId: "mat1",
          porcentaje: 85,
          fecha: new Date("2024-02-15"),
          profesorId: "2",
          observaciones: "Llegó tarde a clase",
        },
      ]

      asistenciasEjemplo.forEach((ast) => {
        if (db.crearAsistencia) {
          db.crearAsistencia(ast)
        }
      })
    }

    setAsistencias(db.obtenerAsistencias ? db.obtenerAsistencias() : [])

    // Crear mapas para búsqueda rápida
    const estudiantesMap = new Map()
    db.obtenerTodosEstudiantes().forEach((est) => {
      estudiantesMap.set(est.id, est)
    })
    setEstudiantes(estudiantesMap)

    const materiasMap = new Map()
    db.obtenerMaterias().forEach((mat) => {
      materiasMap.set(mat.id, mat)
    })
    setMaterias(materiasMap)
  }, [])

  const asistenciasFiltradas = asistencias.filter((asistencia) => {
    const estudiante = estudiantes.get(asistencia.estudianteId)
    const materia = materias.get(asistencia.materiaId)

    if (!estudiante || !materia) return false

    const nombreCompleto = `${estudiante.nombre} ${estudiante.apellidos}`.toLowerCase()
    const nombreMateria = materia.nombre.toLowerCase()
    const filtroLower = filtro.toLowerCase()

    return (
      nombreCompleto.includes(filtroLower) ||
      nombreMateria.includes(filtroLower) ||
      asistencia.fecha.toLocaleDateString().includes(filtroLower)
    )
  })

  const getColorPorcentaje = (porcentaje: number) => {
    if (porcentaje >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (porcentaje >= 80) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (porcentaje >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-green-900/30">
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

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Control de Asistencias</h1>
          <p className="text-gray-600 dark:text-gray-300">Consultar y registrar asistencias de estudiantes</p>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-lg mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="dark:text-white">Registro de Asistencias</CardTitle>
                <CardDescription>Total de registros: {asistenciasFiltradas.length}</CardDescription>
              </div>
              <Link href="/asistencias/registrar">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Asistencia
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por estudiante, materia o fecha..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Materia</TableHead>
                    <TableHead>Porcentaje</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Observaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asistenciasFiltradas.map((asistencia) => {
                    const estudiante = estudiantes.get(asistencia.estudianteId)
                    const materia = materias.get(asistencia.materiaId)

                    if (!estudiante || !materia) return null

                    return (
                      <TableRow key={asistencia.id}>
                        <TableCell className="font-medium dark:text-white">
                          {estudiante.nombre} {estudiante.apellidos}
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {estudiante.grado}
                            {estudiante.grupo}
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-white">{materia.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getColorPorcentaje(asistencia.porcentaje)}>
                            <Clock className="h-3 w-3 mr-1" />
                            {asistencia.porcentaje}%
                          </Badge>
                        </TableCell>
                        <TableCell className="dark:text-white">{formatearFecha(asistencia.fecha)}</TableCell>
                        <TableCell className="dark:text-white">
                          {asistencia.observaciones || <span className="text-gray-400">-</span>}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {asistenciasFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No se encontraron registros de asistencia que coincidan con la búsqueda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
