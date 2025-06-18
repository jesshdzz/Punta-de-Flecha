"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Send, Users, TrendingUp, LogOut, Plus, UserCog, UserX } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaAutenticacion } from "@/lib/auth"
import { SistemaDeReportes } from "@/lib/sistema-reportes"
import Link from "next/link"
import { useRouter } from "next/navigation"

function SecretariaDashboardContent() {
  const [stats, setStats] = useState({
    reportesGenerados: 0,
    solicitudesEnviadas: 3,
    estudiantesActivos: 0,
    promedioGeneral: 8.5,
  })
  const [solicitud, setSolicitud] = useState({
    tipo: "",
    mensaje: "",
  })
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false)
  const router = useRouter()
  const usuario = SistemaAutenticacion.obtenerUsuarioActual()

  useEffect(() => {
    const db = BaseDatos.getInstance()
    setStats({
      reportesGenerados: db.obtenerReportes().length,
      solicitudesEnviadas: 3,
      estudiantesActivos: db.obtenerTodosEstudiantes().filter((e) => e.activo).length,
      promedioGeneral: 8.5,
    })
  }, [])

  const handleLogout = () => {
    SistemaAutenticacion.cerrarSesion()
    router.push("/login")
  }

  const handleEnviarSolicitud = async () => {
    if (!solicitud.tipo || !solicitud.mensaje) {
      alert("Complete todos los campos")
      return
    }

    setEnviandoSolicitud(true)

    // Simular envío de solicitud
    setTimeout(() => {
      alert("Solicitud enviada al administrador exitosamente")
      setSolicitud({ tipo: "", mensaje: "" })
      setStats((prev) => ({ ...prev, solicitudesEnviadas: prev.solicitudesEnviadas + 1 }))
      setEnviandoSolicitud(false)
    }, 1000)
  }

  const handleGenerarReporteRendimiento = () => {
    const sistemaReportes = new SistemaDeReportes()
    const reporte = sistemaReportes.generarReporteCalificaciones()
    alert(`Reporte de rendimiento generado: ${reporte.titulo}`)
    setStats((prev) => ({ ...prev, reportesGenerados: prev.reportesGenerados + 1 }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900/30">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Panel de Secretaría</h1>
            <p className="text-gray-600 dark:text-gray-300">Bienvenida, {usuario?.nombre}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Estadísticas de secretaría */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Reportes Generados</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.reportesGenerados}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Solicitudes Enviadas</CardTitle>
              <Send className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.solicitudesEnviadas}</div>
              <p className="text-xs text-muted-foreground">Pendientes de respuesta</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Estudiantes Activos</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.estudiantesActivos}</div>
              <p className="text-xs text-muted-foreground">En el sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Promedio General</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.promedioGeneral}</div>
              <p className="text-xs text-muted-foreground">Rendimiento académico</p>
            </CardContent>
          </Card>
        </div>
        {/* Gestión de estudiantes */}

        <Card className="bg-white dark:bg-gray-800 shadow-lg mb-8 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Users className="h-5 w-5 text-green-600" />
              Gestión de Estudiantes
            </CardTitle>
            <CardDescription>Administrar altas, bajas y modificaciones de estudiantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <Link href="/estudiantes/nuevo">
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Alta de Estudiante
                </Button>
              </Link>
            </div>
            <Link href="/estudiantes">
              <Button className="w-full" variant="outline">
                Ver Todos los Estudiantes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Generar reportes */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <FileText className="h-5 w-5 text-purple-600" />
                Reportes de Rendimiento
              </CardTitle>
              <CardDescription>Generar reportes basados en calificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button onClick={handleGenerarReporteRendimiento} className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Generar Reporte de Rendimiento
                </Button>
                <Link href="/reportes">
                  <Button variant="outline" className="w-full">
                    Ver Todos los Reportes
                  </Button>
                </Link>
                <Link href="/reportes/generar">
                  <Button variant="outline" className="w-full">
                    Generar Reporte Personalizado
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Enviar solicitudes al administrador */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Send className="h-5 w-5 text-blue-600" />
                Solicitudes al Administrador
              </CardTitle>
              <CardDescription>Enviar solicitudes de alta/baja de usuarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de Solicitud
                  </label>
                  <select
                    value={solicitud.tipo}
                    onChange={(e) => setSolicitud((prev) => ({ ...prev, tipo: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="alta_usuario">Alta de Usuario</option>
                    <option value="baja_usuario">Baja de Usuario</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje</label>
                  <textarea
                    placeholder="Describe los detalles de la solicitud..."
                    value={solicitud.mensaje}
                    onChange={(e) => setSolicitud((prev) => ({ ...prev, mensaje: e.target.value }))}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
                  />
                </div>
                <Button onClick={handleEnviarSolicitud} disabled={enviandoSolicitud} className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:text-white">
                  {enviandoSolicitud ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acceso a información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Calificaciones
              </CardTitle>
              <CardDescription>Consultar calificaciones para reportes</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/calificaciones">
                <Button variant="outline" className="w-full">
                  Ver Calificaciones
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <FileText className="h-5 w-5 text-blue-600" />
                Historial
              </CardTitle>
              <CardDescription>Historial de solicitudes y reportes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Ver Historial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SecretariaDashboard() {
  return (
    <AuthGuard requiredRole={["secretaria"]}>
      <SecretariaDashboardContent />
    </AuthGuard>
  )
}
