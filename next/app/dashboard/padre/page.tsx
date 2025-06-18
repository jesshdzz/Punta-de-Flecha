"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { TrendingUp, User, Bell, LogOut, BookOpen } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaAutenticacion } from "@/lib/auth"
import type { Calificacion, Estudiante, Materia } from "@/types"
import { useRouter } from "next/navigation"
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableHeader, TableHead, TableBody, TableRow, TableCell
} from "@/components/ui/table"

function PadreDashboardContent() {
  const [hijo, setHijo] = useState<Estudiante | null>(null)
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([])
  const [materias, setMaterias] = useState<Map<string, Materia>>(new Map())
  const [promedioGeneral, setPromedioGeneral] = useState(0)
  const [notificaciones] = useState([
    { id: 1, mensaje: "Nueva calificación en Matemáticas", fecha: new Date(), leida: false },
    { id: 2, mensaje: "Material educativo disponible en Álgebra", fecha: new Date(), leida: false },
  ])
  const router = useRouter()
  const usuario = SistemaAutenticacion.obtenerUsuarioActual()

  useEffect(() => {
    const db = BaseDatos.getInstance()
    const estudiantes = db.obtenerTodosEstudiantes()
    const hijoEncontrado = estudiantes.find((e) => e.padreId === usuario?.id) || estudiantes[0]
    setHijo(hijoEncontrado)

    if (hijoEncontrado) {
      const califs = db.obtenerCalificacionesPorEstudiante(hijoEncontrado.id)
      setCalificaciones(califs)
      if (califs.length > 0) {
        const suma = califs.reduce((acc, c) => acc + c.valor, 0)
        setPromedioGeneral(suma / califs.length)
      }
    }

    const matMap = new Map<string, Materia>()
    db.obtenerMaterias().forEach((mat) => matMap.set(mat.id, mat))
    setMaterias(matMap)
  }, [usuario])

  const handleLogout = () => {
    SistemaAutenticacion.cerrarSesion()
    router.push("/login")
  }

  const getColorBadge = (valor: number) => {
    if (valor >= 9) return "default"
    if (valor >= 7) return "secondary"
    if (valor >= 6) return "destructive"
    return "outline"
  }

  const formatearPeriodo = (periodo: string) =>
    periodo.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const formatearFecha = (fecha: Date) =>
    fecha.toLocaleDateString("es-ES")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900/30 p-6">
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Panel del Padre de Familia</h1>
            <p className="text-gray-600 dark:text-gray-300">Bienvenido, {usuario?.nombre}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      

        {/* Notificaciones */}
        {notificaciones.some(n => !n.leida) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                <Bell size={20} className="inline mr-2" />
                Notificaciones ({notificaciones.filter(n => !n.leida).length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificaciones.filter(n => !n.leida).map(n => (
                <div key={n.id} className="p-4 bg-gray-800 rounded shadow-sm">
                  <p className="font-medium">{n.mensaje}</p>
                  <p className="text-sm text-gray-500">{formatearFecha(n.fecha)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Secciones de información */}
        {hijo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  <User size={20} className="inline mr-2 text-primary" />
                  Información del Estudiante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Nombre:</span>
                  <p>{hijo.nombre} {hijo.apellidos}</p>
                </div>
                <div>
                  <span className="font-medium">Grado:</span>
                  <p>{hijo.grado} - Grupo {hijo.grupo}</p>
                </div>
                <div>
                  <span className="font-medium">Estado:</span>{" "}
                  <Badge variant={hijo.activo ? "default" : "destructive"}>
                    {hijo.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <TrendingUp size={20} className="inline mr-2 text-success" />
                  Rendimiento Académico
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-success mb-2">
                  {promedioGeneral.toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">Promedio General</p>
                <Badge variant={getColorBadge(promedioGeneral)} className="mt-2">
                  {promedioGeneral >= 6 ? "Aprobado" : "Necesita Apoyo"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <BookOpen size={20} className="inline mr-2 text-secondary" />
                  Materias Cursadas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-secondary mb-2">
                  {materias.size}
                </p>
                <p className="text-sm text-gray-500">Materias Activas</p>
                <Badge variant="secondary" className="mt-2">
                  Ciclo Escolar 2024
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabla de calificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Calificaciones de {hijo?.nombre}</CardTitle>
          </CardHeader>
          <CardContent>
            {calificaciones.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Materia</TableHead>
                    <TableHead>Calificación</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calificaciones.map(cal => {
                    const mat = materias.get(cal.materiaId)
                    return (
                      <TableRow key={cal.id}>
                        <TableCell className="font-medium">{mat?.nombre || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={getColorBadge(cal.valor)}>
                            <TrendingUp size={12} className="mr-1 inline" />
                            {cal.valor.toFixed(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatearPeriodo(cal.periodo)}</TableCell>
                        <TableCell>{formatearFecha(cal.fecha)}</TableCell>
                        <TableCell>
                          <Badge variant={cal.valor >= 6 ? "default" : "destructive"}>
                            {cal.valor >= 6 ? "Aprobado" : "Reprobado"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No hay calificaciones registradas
                </h3>
                <p className="text-gray-500">
                  Las calificaciones aparecerán aquí cuando los profesores las registren
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PadreDashboard() {
  return (
    <AuthGuard requiredRole={["padre"]}>
      <PadreDashboardContent />
    </AuthGuard>
  )
}
