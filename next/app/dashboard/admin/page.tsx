"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, GraduationCap, BookOpen, FileText, Bell, LogOut, UserCog, UserX } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaAutenticacion } from "@/lib/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    totalEstudiantes: 0,
    totalUsuarios: 0,
    materialesEducativos: 0,
    reportesGenerados: 0,
  })
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const db = BaseDatos.getInstance()
    setStats({
      totalEstudiantes: db.obtenerTodosEstudiantes().length,
      totalUsuarios: db.obtenerTodosUsuarios().length,
      materialesEducativos: db.obtenerMaterialesEducativos().length,
      reportesGenerados: db.obtenerReportes().length,
    })

    // Simular solicitudes pendientes
    setSolicitudes([
      { id: 1, tipo: "Alta Usuario", solicitante: "Secretaria", fecha: new Date() },
      { id: 2, tipo: "Baja Estudiante", solicitante: "Secretaria", fecha: new Date() },
    ])
  }, [])

  const handleLogout = () => {
    SistemaAutenticacion.cerrarSesion()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Panel de Administrador</h1>
          <p className="text-gray-600 dark:text-gray-300">Panel de control para la gestión integral de la secundaria</p>
        </div>

        {/* Solicitudes pendientes */}
        {solicitudes.length > 0 && (
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Bell className="h-5 w-5" />
                Solicitudes Pendientes ({solicitudes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {solicitudes.map((solicitud) => (
                  <div
                    key={solicitud.id}
                    className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <span className="font-medium dark:text-white">{solicitud.tipo}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">por {solicitud.solicitante}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Aprobar
                      </Button>
                      <Button size="sm" variant="outline">
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalEstudiantes}</div>
              <p className="text-xs text-muted-foreground">Estudiantes activos</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Usuarios del Sistema</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalUsuarios}</div>
              <p className="text-xs text-muted-foreground">Profesores y administradores</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Material Educativo</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.materialesEducativos}</div>
              <p className="text-xs text-muted-foreground">Recursos disponibles</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Reportes</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.reportesGenerados}</div>
              <p className="text-xs text-muted-foreground">Reportes generados</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Users className="h-5 w-5 text-blue-600" />
                Gestión de Estudiantes
              </CardTitle>
              <CardDescription>Administrar estudiantes del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/estudiantes">
                <Button className="w-full" variant="outline">
                  Ver Estudiantes
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/estudiantes/modificar">
                  <Button className="w-full" variant="outline">
                    <UserCog className="h-4 w-4 mr-2" />
                    Modificar
                  </Button>
                </Link>
                <Link href="/estudiantes/eliminar">
                  <Button className="w-full" variant="outline">
                    <UserX className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <GraduationCap className="h-5 w-5 text-green-600" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>Administrar profesores, secretarias y administradores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/usuarios">
                <Button className="w-full" variant="outline">
                  Ver Usuarios
                </Button>
              </Link>
              <Link href="/usuarios/nuevo">
                <Button className="w-full">Alta Usuario</Button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/usuarios/modificar">
                  <Button className="w-full" variant="outline">
                    <UserCog className="h-4 w-4 mr-2" />
                    Modificar
                  </Button>
                </Link>
                <Link href="/usuarios/eliminar">
                  <Button className="w-full" variant="outline">
                    <UserX className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <FileText className="h-5 w-5 text-orange-600" />
                Reportes del Sistema
              </CardTitle>
              <CardDescription>Generar y consultar reportes del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/reportes">
                <Button className="w-full" variant="outline">
                  Ver Reportes
                </Button>
              </Link>
              <Link href="/reportes/generar">
                <Button className="w-full">Generar Reporte</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Estado del sistema */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="dark:text-white">Estado del Sistema</CardTitle>
            <CardDescription>Información general sobre el funcionamiento del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Sistema Activo
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Base de Datos Conectada
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                Notificaciones Habilitadas
              </Badge>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
              >
                Reportes Disponibles
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard requiredRole={["administrador"]}>
      <AdminDashboardContent />
    </AuthGuard>
  )
}
