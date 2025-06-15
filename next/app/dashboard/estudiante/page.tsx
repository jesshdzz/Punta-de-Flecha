"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { TrendingUp, BookOpen, Bell, LogOut, Download, Eye, FileText, Video, Presentation } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaAutenticacion } from "@/lib/auth"
import type { Calificacion, MaterialEducativo, Materia } from "@/types"
import { useRouter } from "next/navigation"

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
    if (valor >= 9) return "badge-success"
    if (valor >= 7) return "badge-warning"
    if (valor >= 6) return "badge-info"
    return "badge-error"
  }

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "libro":
        return <BookOpen size={16} />
      case "documento":
        return <FileText size={16} />
      case "video":
        return <Video size={16} />
      case "presentacion":
        return <Presentation size={16} />
      default:
        return <FileText size={16} />
    }
  }

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case "libro":
        return "badge-primary"
      case "documento":
        return "badge-success"
      case "video":
        return "badge-error"
      case "presentacion":
        return "badge-secondary"
      default:
        return "badge-neutral"
    }
  }

  const formatearPeriodo = (periodo: string) => {
    return periodo.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES")
  }

  return (
    <div className="min-h-screen bg-gradient-estudiante" data-theme="school">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="navbar bg-base-100 rounded-box shadow-lg mb-6">
          <div className="flex-1">
            <div>
              <h1 className="text-3xl font-bold">Panel del Estudiante</h1>
              <p className="text-base-content/70">Bienvenido, {usuario?.nombre}</p>
            </div>
          </div>
          <div className="flex-none">
            <button className="btn btn-outline btn-error" onClick={handleLogout}>
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Notificaciones */}
        {notificaciones.filter((n) => !n.leida).length > 0 && (
          <div className="alert alert-info mb-6 animate-fade-in">
            <Bell size={20} />
            <div>
              <h3 className="font-bold">Notificaciones ({notificaciones.filter((n) => !n.leida).length})</h3>
              <div className="space-y-2 mt-2">
                {notificaciones
                  .filter((n) => !n.leida)
                  .map((notif) => (
                    <div key={notif.id} className="card bg-base-100 shadow-sm">
                      <div className="card-body p-3">
                        <p className="font-medium">{notif.mensaje}</p>
                        <p className="text-sm opacity-70">{formatearFecha(notif.fecha)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas del estudiante */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-success">
              <TrendingUp size={32} />
            </div>
            <div className="stat-title">Mi Promedio</div>
            <div className="stat-value text-success">{promedioGeneral.toFixed(1)}</div>
            <div className="stat-desc">
              <div className={`badge ${getColorCalificacion(promedioGeneral)}`}>
                {promedioGeneral >= 6 ? "Aprobado" : "Necesita Mejorar"}
              </div>
            </div>
          </div>

          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-secondary">
              <BookOpen size={32} />
            </div>
            <div className="stat-title">Material Disponible</div>
            <div className="stat-value text-secondary">{materiales.length}</div>
            <div className="stat-desc">Recursos educativos</div>
          </div>

          <div className="stat bg-base-100 rounded-box shadow-lg">
            <div className="stat-figure text-primary">
              <FileText size={32} />
            </div>
            <div className="stat-title">Calificaciones</div>
            <div className="stat-value text-primary">{calificaciones.length}</div>
            <div className="stat-desc">Registradas</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mis Calificaciones */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Mis Calificaciones</h2>
              <p className="text-base-content/70">Historial de calificaciones por materia</p>
              {calificaciones.length > 0 ? (
                <div className="overflow-x-auto mt-4">
                  <table className="table table-zebra table-compact w-full">
                    <thead>
                      <tr>
                        <th>Materia</th>
                        <th>Calificación</th>
                        <th>Periodo</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calificaciones.map((calificacion) => {
                        const materia = materias.get(calificacion.materiaId)
                        return (
                          <tr key={calificacion.id}>
                            <td className="font-medium">{materia?.nombre || "Materia no encontrada"}</td>
                            <td>
                              <div className={`badge ${getColorCalificacion(calificacion.valor)}`}>
                                {calificacion.valor.toFixed(1)}
                              </div>
                            </td>
                            <td>{formatearPeriodo(calificacion.periodo)}</td>
                            <td>
                              <div className={`badge ${calificacion.valor >= 6 ? "badge-success" : "badge-error"}`}>
                                {calificacion.valor >= 6 ? "Aprobado" : "Reprobado"}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp size={48} className="mx-auto opacity-30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay calificaciones</h3>
                  <p className="opacity-70">Tus calificaciones aparecerán aquí cuando sean registradas</p>
                </div>
              )}
            </div>
          </div>

          {/* Material Educativo */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Material Educativo</h2>
              <p className="text-base-content/70">Recursos disponibles para estudio</p>
              {materiales.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto mt-4">
                  {materiales.map((material) => {
                    const materia = materias.get(material.materiaId)
                    return (
                      <div key={material.id} className="card bg-base-200 shadow-sm">
                        <div className="card-body p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{material.titulo}</h4>
                            <div className={`badge ${getColorTipo(material.tipo)} gap-1`}>
                              {getIconoTipo(material.tipo)}
                              {material.tipo}
                            </div>
                          </div>
                          <p className="text-xs opacity-70 mb-2">{material.descripcion}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs opacity-60">
                              {materia?.nombre} - {formatearFecha(material.fechaSubida)}
                            </span>
                            <div className="flex gap-1">
                              <button className="btn btn-ghost btn-xs">
                                <Eye size={12} />
                              </button>
                              <button className="btn btn-ghost btn-xs">
                                <Download size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen size={48} className="mx-auto opacity-30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay material disponible</h3>
                  <p className="opacity-70">Los profesores subirán material educativo aquí</p>
                </div>
              )}
            </div>
          </div>
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
