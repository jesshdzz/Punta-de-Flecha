"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, ArrowLeft, TrendingUp } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import type { Calificacion, Estudiante, Materia } from "@/types"
import Link from "next/link"

export default function CalificacionesPage() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([])
  const [estudiantes, setEstudiantes] = useState<Map<string, Estudiante>>(new Map())
  const [materias, setMaterias] = useState<Map<string, Materia>>(new Map())
  const [filtro, setFiltro] = useState("")

  useEffect(() => {
    const db = BaseDatos.getInstance()

    // Agregar algunas calificaciones de ejemplo
    const calificacionesEjemplo: Calificacion[] = [
      {
        id: "cal_1",
        estudianteId: "est1",
        materiaId: "mat1",
        valor: 8.5,
        periodo: "1er_bimestre",
        fecha: new Date("2024-01-15"),
        profesorId: "2",
      },
      {
        id: "cal_2",
        estudianteId: "est1",
        materiaId: "mat1",
        valor: 9.0,
        periodo: "2do_bimestre",
        fecha: new Date("2024-03-15"),
        profesorId: "2",
      },
    ]

    calificacionesEjemplo.forEach((cal) => {
      db.crearCalificacion(cal)
    })

    setCalificaciones(db.obtenerCalificaciones())

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

  const calificacionesFiltradas = calificaciones.filter((calificacion) => {
    const estudiante = estudiantes.get(calificacion.estudianteId)
    const materia = materias.get(calificacion.materiaId)

    if (!estudiante || !materia) return false

    const nombreCompleto = `${estudiante.nombre} ${estudiante.apellidos}`.toLowerCase()
    const nombreMateria = materia.nombre.toLowerCase()
    const filtroLower = filtro.toLowerCase()

    return (
      nombreCompleto.includes(filtroLower) ||
      nombreMateria.includes(filtroLower) ||
      calificacion.periodo.toLowerCase().includes(filtroLower)
    )
  })

  const getColorCalificacion = (valor: number) => {
    if (valor >= 9) return "bg-green-100 text-green-800"
    if (valor >= 7) return "bg-yellow-100 text-yellow-800"
    if (valor >= 6) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const formatearPeriodo = (periodo: string) => {
    return periodo.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Calificaciones</h1>
          <p className="text-gray-600">Consultar y administrar calificaciones de estudiantes</p>
        </div>

        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Registro de Calificaciones</CardTitle>
                <CardDescription>Total de calificaciones: {calificacionesFiltradas.length}</CardDescription>
              </div>
              <Link href="/calificaciones/subir">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Calificación
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por estudiante, materia o periodo..."
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
                    <TableHead>Calificación</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calificacionesFiltradas.map((calificacion) => {
                    const estudiante = estudiantes.get(calificacion.estudianteId)
                    const materia = materias.get(calificacion.materiaId)

                    if (!estudiante || !materia) return null

                    return (
                      <TableRow key={calificacion.id}>
                        <TableCell className="font-medium">
                          {estudiante.nombre} {estudiante.apellidos}
                          <div className="text-sm text-gray-500">
                            {estudiante.grado}
                            {estudiante.grupo}
                          </div>
                        </TableCell>
                        <TableCell>{materia.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getColorCalificacion(calificacion.valor)}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {calificacion.valor.toFixed(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatearPeriodo(calificacion.periodo)}</TableCell>
                        <TableCell>{formatearFecha(calificacion.fecha)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              calificacion.valor >= 6 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {calificacion.valor >= 6 ? "Aprobado" : "Reprobado"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {calificacionesFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron calificaciones que coincidan con la búsqueda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
