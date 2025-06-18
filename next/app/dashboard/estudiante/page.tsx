"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { TrendingUp, BookOpen, Bell, LogOut, Download, Eye, FileText, Video, Presentation } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaAutenticacion } from "@/lib/auth"
import type { Calificacion, MaterialEducativo, Materia } from "@/types"
import { useRouter } from "next/navigation"

// Componentes UI importados
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableHeader, TableHead, TableBody, TableRow, TableCell
} from "@/components/ui/table"

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
    const estudianteId = "est1" // simulado
    const califs = db.obtenerCalificacionesPorEstudiante(estudianteId)
    setCalificaciones(califs)
    if (califs.length > 0) {
      const suma = califs.reduce((acc, c) => acc + c.valor, 0)
      setPromedioGeneral(suma / califs.length)
    }
    setMateriales(db.obtenerMaterialesEducativos())
    const mMap = new Map<string, Materia>()
    db.obtenerMaterias().forEach(m => mMap.set(m.id, m))
    setMaterias(mMap)
  }, [])

  const handleLogout = () => {
    SistemaAutenticacion.cerrarSesion()
    router.push("/login")
  }

  const variantCalif = (valor: number) => {
    if (valor >= 9) return "default"
    if (valor >= 7) return "secondary"
    if (valor >= 6) return "destructive"
    return "outline"
  }

  const iconoTipo = (tipo: string) => {
    switch (tipo) {
      case "libro": return <BookOpen size={16} />
      case "documento": return <FileText size={16} />
      case "video": return <Video size={16} />
      case "presentacion": return <Presentation size={16} />
      default: return <FileText size={16} />
    }
  }

  const variantTipo = (tipo: string) => {
    switch (tipo) {
      case "libro": return "primary"
      case "documento": return "success"
      case "video": return "destructive"
      case "presentacion": return "secondary"
      default: return "default"
    }
  }

  const fmtPeriodo = (p: string) =>
    p.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())

  const fmtFecha = (f: Date) =>
    f.toLocaleDateString("es-ES")

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
                <div key={n.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow-sm">
                  <p className="font-medium">{n.mensaje}</p>
                  <p className="text-sm text-gray-500">{fmtFecha(n.fecha)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[{
            title: "Mi Promedio",
            icon: <TrendingUp size={32} className="text-success mx-auto mb-2" />,
            value: promedioGeneral.toFixed(1),
            badge: promedioGeneral >= 6 ? "Aprobado" : "Necesita Mejorar",
            variant: variantCalif(promedioGeneral)
          },{
            title: "Material Disponible",
            icon: <BookOpen size={32} className="text-secondary mx-auto mb-2" />,
            value: materiales.length.toString(),
            badge: "Recursos educativos",
            variant: "secondary"
          },{
            title: "Calificaciones",
            icon: <FileText size={32} className="text-primary mx-auto mb-2" />,
            value: calificaciones.length.toString(),
            badge: "Registradas",
            variant: "primary"
          }].map((s, i) => (
            <Card key={i}>
              <CardHeader><CardTitle>{s.title}</CardTitle></CardHeader>
              <CardContent className="text-center">
                {s.icon}
                <p className="text-4xl font-bold">{s.value}</p>
                <Badge variant={s.variant} className="mt-2">{s.badge}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Calificaciones y Material */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tabla Calificaciones */}
          <Card>
            <CardHeader><CardTitle>Mis Calificaciones</CardTitle></CardHeader>
            <CardContent>
              {calificaciones.length > 0 ? (
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
                    {calificaciones.map(c => {
                      const m = materias.get(c.materiaId)
                      return (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{m?.nombre || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={variantCalif(c.valor)}>
                              {c.valor.toFixed(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{fmtPeriodo(c.periodo)}</TableCell>
                          <TableCell>
                            <Badge variant={c.valor >= 6 ? "default" : "destructive"}>
                              {c.valor >= 6 ? "Aprobado" : "Reprobado"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold">No hay calificaciones</h3>
                  <p className="text-gray-500">Tus calificaciones aparecerán aquí cuando sean registradas</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Material Educativo */}
          <Card>
            <CardHeader><CardTitle>Material Educativo</CardTitle></CardHeader>
            <CardContent>
              {materiales.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {materiales.map(mat => {
                    const m = materias.get(mat.materiaId)
                    return (
                      <Card key={mat.id} className="bg-base-200 shadow-sm">
                        <CardContent>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{mat.titulo}</h4>
                            <Badge variant={variantTipo(mat.tipo)} className="flex items-center gap-1">
                              {iconoTipo(mat.tipo)}
                              {mat.tipo}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{mat.descripcion}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{m?.nombre} – {fmtFecha(mat.fechaSubida)}</span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon"><Eye size={12} /></Button>
                              <Button variant="ghost" size="icon"><Download size={12} /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold">No hay material disponible</h3>
                  <p className="text-gray-500">Los profesores subirán material educativo aquí</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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