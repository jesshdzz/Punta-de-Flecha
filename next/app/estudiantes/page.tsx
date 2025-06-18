"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import type { Estudiante } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [filtro, setFiltro] = useState("")
  const router = useRouter()

  useEffect(() => {
    const db = BaseDatos.getInstance()
    setEstudiantes(db.obtenerTodosEstudiantes())
  }, [])

  const estudiantesFiltrados = estudiantes.filter(
    (estudiante) =>
      estudiante.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(filtro.toLowerCase()) ||
      estudiante.grado.toLowerCase().includes(filtro.toLowerCase()),
  )

  const handleBajaEstudiante = (id: string) => {
    const db = BaseDatos.getInstance()
    if (db.actualizarEstudiante(id, { activo: false })) {
      setEstudiantes(db.obtenerTodosEstudiantes())
      alert("Estudiante dado de baja exitosamente")
    }
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Estudiantes</h1>
          <p className="text-gray-600">Administrar altas, bajas y consultas de estudiantes</p>
        </div>

        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Lista de Estudiantes</CardTitle>
                <CardDescription>Total de estudiantes: {estudiantesFiltrados.length}</CardDescription>
              </div>
              <Link href="/estudiantes/nuevo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Alta Estudiante
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, apellidos o grado..."
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
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Grado</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Fecha Nacimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Inscripción</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudiantesFiltrados.map((estudiante) => (
                    <TableRow key={estudiante.id}>
                      <TableCell className="font-medium">
                        {estudiante.nombre} {estudiante.apellidos}
                      </TableCell>
                      <TableCell>{estudiante.grado}</TableCell>
                      <TableCell>{estudiante.grupo}</TableCell>
                      <TableCell>{formatearFecha(estudiante.fechaNacimiento)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={estudiante.activo ? "default" : "secondary"}
                          className={estudiante.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {estudiante.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatearFecha(estudiante.fechaInscripcion)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/estudiantes/modificar/${estudiante.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          </Link>
                          
                          {estudiante.activo && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBajaEstudiante(estudiante.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {estudiantesFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron estudiantes que coincidan con la búsqueda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
