"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  BookOpen,
  Bell,
  LogOut,
  Download,
  Eye,
  FileText,
  Video,
  Presentation,
  GraduationCap,
  Calendar,
  ExternalLink,
} from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaAutenticacion } from "@/lib/auth"
import type { Calificacion, MaterialEducativo, Materia } from "@/types"
import { useRouter } from "next/navigation"
import { FileStorage } from "@/lib/file-storage"

function EstudianteDashboardContent() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([])
  const [materiales, setMateriales] = useState<MaterialEducativo[]>([])
  const [materias, setMaterias] = useState<Map<string, Materia>>(new Map())
  const [promedioGeneral, setPromedioGeneral] = useState(0)
  const [notificaciones] = useState([
    { id: 1, mensaje: "Nuevo material disponible: Álgebra Básica - Capítulo 2", fecha: new Date(), leida: false },
    { id: 2, mensaje: "Calificación registrada en Matemáticas", fecha: new Date(), leida: false },
    { id: 3, mensaje: "Video educativo subido: Geometría Plana", fecha: new Date(), leida: false },
  ])
  const router = useRouter()
  const usuario = SistemaAutenticacion.obtenerUsuarioActual()

  useEffect(() => {
    const db = BaseDatos.getInstance()

    // Simular que el usuario actual es un estudiante
    const estudianteId = "est1" // En un sistema real, esto vendría del usuario autenticado

    // Obtener calificaciones del estudiante
    const calificacionesEstudiante = db.obtenerCalificacionesPorEstudiante(estudianteId)
    setCalificaciones(calificacionesEstudiante)

    // Calcular promedio
    if (calificacionesEstudiante.length > 0) {
      const suma = calificacionesEstudiante.reduce((acc, cal) => acc + cal.valor, 0)
      setPromedioGeneral(suma / calificacionesEstudiante.length)
    }

    // Obtener materiales educativos
    setMateriales(db.obtenerMaterialesEducativos())

    // Crear mapa de materias
    const materiasMap = new Map()
    db.obtenerMaterias().forEach((mat) => {
      materiasMap.set(mat.id, mat)
    })
    setMaterias(materiasMap)
  }, [])

  const handleLogout = () => {
    SistemaAutenticacion.cerrarSesion()
    router.push("/login")
  }

  const getColorCalificacion = (valor: number) => {
    if (valor >= 9) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (valor >= 7) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    if (valor >= 6) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "libro":
        return <BookOpen className="h-4 w-4" />
      case "documento":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "presentacion":
        return <Presentation className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case "libro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "documento":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "video":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "presentacion":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatearPeriodo = (periodo: string) => {
    return periodo.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES")
  }

  const handlePrevisualizarMaterial = (materialId: string) => {
    if (FileStorage.previsualizarArchivo(materialId)) {
      console.log("Material previsualizado exitosamente")
    } else {
      alert("Error al previsualizar el material")
    }
  }

  const handleDescargarMaterial = (materialId: string) => {
    if (FileStorage.descargarArchivo(materialId)) {
      console.log("Material descargado exitosamente")
    } else {
      alert("Error al descargar el material")
    }
  }

  const handleVerVideo = (url: string) => {
    window.open(url, "_blank")
  }

  const handleCopiarURL = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL del video copiada al portapapeles")
      })
      .catch(() => {
        alert(`URL del video: ${url}`)
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900/30 p-6">
      <div className="container mx-auto p-6">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Panel del Estudiante</h1>
            <p className="text-gray-600 dark:text-gray-300">Bienvenido, {usuario?.nombre}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Notificaciones */}
        {notificaciones.filter((n) => !n.leida).length > 0 && (
          <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <Bell className="h-4 w-4" />
            <AlertDescription>
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  Tienes {notificaciones.filter((n) => !n.leida).length} notificaciones nuevas
                </span>
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Mi Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">{promedioGeneral.toFixed(1)}</div>
              <Badge variant="secondary" className={getColorCalificacion(promedioGeneral)}>
                {promedioGeneral >= 6 ? "Aprobado" : "Necesita Mejorar"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Material Disponible</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">{materiales.length}</div>
              <p className="text-xs text-muted-foreground">Recursos educativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Calificaciones</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">{calificaciones.length}</div>
              <p className="text-xs text-muted-foreground">Registradas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mis Calificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Mis Calificaciones
              </CardTitle>
              <CardDescription>Historial de calificaciones por materia y periodo</CardDescription>
            </CardHeader>
            <CardContent>
              {calificaciones.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Materia</TableHead>
                        <TableHead>Calificación</TableHead>
                        <TableHead>Periodo</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calificaciones.map((calificacion) => {
                        const materia = materias.get(calificacion.materiaId)
                        return (
                          <TableRow key={calificacion.id}>
                            <TableCell className="font-medium dark:text-white">
                              {materia?.nombre || "Materia no encontrada"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getColorCalificacion(calificacion.valor)}>
                                {calificacion.valor.toFixed(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="dark:text-white">{formatearPeriodo(calificacion.periodo)}</TableCell>
                            <TableCell>
                              <Badge variant={calificacion.valor >= 6 ? "default" : "destructive"}>
                                {calificacion.valor >= 6 ? "Aprobado" : "Reprobado"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay calificaciones</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tus calificaciones aparecerán aquí cuando sean registradas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Material Educativo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Material Educativo
              </CardTitle>
              <CardDescription>Recursos disponibles para estudio</CardDescription>
            </CardHeader>
            <CardContent>
              {materiales.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {materiales.map((material) => {
                      const materia = materias.get(material.materiaId)
                      const tieneArchivo = FileStorage.obtenerArchivo(material.id) !== null

                      return (
                        <Card key={material.id} className="bg-gray-50 dark:bg-gray-700 shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{material.titulo}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{material.descripcion}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Calendar className="h-3 w-3" />
                                  {formatearFecha(material.fechaSubida)}
                                  <Separator orientation="vertical" className="h-3" />
                                  <span>{materia?.nombre}</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className={`${getColorTipo(material.tipo)} ml-2`}>
                                <span className="flex items-center gap-1">
                                  {getIconoTipo(material.tipo)}
                                  {material.tipo}
                                </span>
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              {material.tipo === "video" && material.url ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleVerVideo(material.url!)}
                                    className="flex-1"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Ver Video
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleCopiarURL(material.url!)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : tieneArchivo ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handlePrevisualizarMaterial(material.id)}
                                    className="flex-1"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Previsualizar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDescargarMaterial(material.id)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <div className="flex-1 text-center py-2">
                                  <span className="text-sm text-gray-400">Sin archivo disponible</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No hay material disponible
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Los profesores subirán material educativo aquí</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notificaciones detalladas */}
        {notificaciones.filter((n) => !n.leida).length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Bell className="h-5 w-5 text-orange-600" />
                Notificaciones Recientes
              </CardTitle>
              <CardDescription>Últimas actualizaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificaciones
                  .filter((n) => !n.leida)
                  .map((notif) => (
                    <Alert key={notif.id} className="border-l-4 border-l-blue-500">
                      <Bell className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium dark:text-white">{notif.mensaje}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {formatearFecha(notif.fecha)}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Marcar como leída
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}

export default function EstudianteDashboard() {
  return (
    <AuthGuard requiredRole={["estudiante"]}>
      <EstudianteDashboardContent />
    </AuthGuard>
  )
}