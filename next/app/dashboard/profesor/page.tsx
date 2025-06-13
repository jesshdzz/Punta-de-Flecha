"use client"

import { Badge } from "@/components/ui/badge"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, Users, Upload, LogOut, Plus, Clock } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaAutenticacion } from "@/lib/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

function ProfesorDashboardContent() {
  const [stats, setStats] = useState({
    materialesSubidos: 0,
    calificacionesRegistradas: 0,
    asistenciasRegistradas: 0,
    estudiantesAsignados: 0,
    materiasImpartidas: 2,
  })
  const router = useRouter()
  const usuario = SistemaAutenticacion.obtenerUsuarioActual()

  useEffect(() => {
    const db = BaseDatos.getInstance()
    setStats({
      materialesSubidos: db.obtenerMaterialesEducativos().length,
      calificacionesRegistradas: db.obtenerCalificaciones().length,
      asistenciasRegistradas: db.obtenerAsistencias ? db.obtenerAsistencias().length : 0,
      estudiantesAsignados: db.obtenerTodosEstudiantes().filter((e) => e.activo).length,
      materiasImpartidas: 2,
    })
  }, [])

  const handleLogout = () => {
    SistemaAutenticacion.cerrarSesion()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-green-900/30">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Panel del Profesor</h1>
            <p className="text-gray-600 dark:text-gray-300">Bienvenido, {usuario?.nombre}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Estadísticas del profesor */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Materias</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.materiasImpartidas}</div>
              <p className="text-xs text-muted-foreground">Materias asignadas</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.estudiantesAsignados}</div>
              <p className="text-xs text-muted-foreground">Estudiantes asignados</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Material</CardTitle>
              <Upload className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.materialesSubidos}</div>
              <p className="text-xs text-muted-foreground">Recursos educativos</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Calificaciones</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.calificacionesRegistradas}</div>
              <p className="text-xs text-muted-foreground">Calificaciones registradas</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Asistencias</CardTitle>
              <Clock className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.asistenciasRegistradas}</div>
              <p className="text-xs text-muted-foreground">Registros de asistencia</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones principales del profesor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Gestión de Calificaciones
              </CardTitle>
              <CardDescription>Registrar y consultar calificaciones de estudiantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/calificaciones">
                <Button variant="outline" className="w-full">
                  Ver Calificaciones
                </Button>
              </Link>
              <Link href="/calificaciones/subir">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Calificación
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Clock className="h-5 w-5 text-indigo-600" />
                Control de Asistencia
              </CardTitle>
              <CardDescription>Registrar y consultar asistencia de estudiantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/asistencias">
                <Button variant="outline" className="w-full">
                  Ver Asistencias
                </Button>
              </Link>
              <Link href="/asistencias/registrar">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Asistencia
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <BookOpen className="h-5 w-5 text-green-600" />
                Material Educativo
              </CardTitle>
              <CardDescription>Subir y gestionar recursos educativos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/materiales">
                <Button variant="outline" className="w-full">
                  Ver Materiales
                </Button>
              </Link>
              <Link href="/materiales/nuevo">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Material
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Materias asignadas */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="dark:text-white">Mis Materias</CardTitle>
            <CardDescription>Materias que tienes asignadas este ciclo escolar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-50 dark:bg-gray-700 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold dark:text-white">Matemáticas</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">1° Grado - Grupos A, B, C</p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      45 estudiantes
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Activa
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-700 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold dark:text-white">Álgebra</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">2° Grado - Grupos A, B</p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      30 estudiantes
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Activa
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProfesorDashboard() {
  return (
    <AuthGuard requiredRole={["profesor"]}>
      <ProfesorDashboardContent />
    </AuthGuard>
  )
}
