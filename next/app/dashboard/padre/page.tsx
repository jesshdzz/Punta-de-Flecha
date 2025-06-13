"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { TrendingUp, User, Bell, LogOut, BookOpen } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaAutenticacion } from "@/lib/auth"
import type { Calificacion, Estudiante, Materia } from "@/types"
import { useRouter } from "next/navigation"

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

    // Obtener información del hijo (simulado)
    const estudiantes = db.obtenerTodosEstudiantes()
    const hijoEncontrado = estudiantes.find((e) => e.padreId === usuario?.id) || estudiantes[0]
    setHijo(hijoEncontrado)

    if (hijoEncontrado) {
      // Obtener calificaciones del hijo
      const calificacionesHijo = db.obtenerCalificacionesPorEstudiante(hijoEncontrado.id)
      setCalificaciones(calificacionesHijo)

      // Calcular promedio
      if (calificacionesHijo.length > 0) {
        const suma = calificacionesHijo.reduce((acc, cal) => acc + cal.valor, 0)
        setPromedioGeneral(suma / calificacionesHijo.length)
      }
    }

    // Crear mapa de materias
    const materiasMap = new Map()
    db.obtenerMaterias().forEach((mat) => {
      materiasMap.set(mat.id, mat)
    })
    setMaterias(materiasMap)
  }, [usuario])

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

  const formatearPeriodo = (periodo: string) => {
    return periodo.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES")
  }

  return (
    <div className="min-h-screen bg-gradient-padre" data-theme="school">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="navbar bg-base-100 rounded-box shadow-lg mb-6">
          <div className="flex-1">
            <div>
              <h1 className="text-3xl font-bold">Panel de Padre de Familia</h1>
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

        {/* Información del hijo */}
        {hijo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <User className="text-primary" size={20} />
                  Información del Estudiante
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Nombre:</span>
                    <p>
                      {hijo.nombre} {hijo.apellidos}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Grado:</span>
                    <p>
                      {hijo.grado} - Grupo {hijo.grupo}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span>
                    <div className={`badge ${hijo.activo ? "badge-success" : "badge-error"}`}>
                      {hijo.activo ? "Activo" : "Inactivo"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <TrendingUp className="text-success" size={20} />
                  Rendimiento Académico
                </h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-success mb-2">{promedioGeneral.toFixed(1)}</div>
                  <p className="text-sm opacity-70">Promedio General</p>
                  <div className={`badge ${getColorCalificacion(promedioGeneral)} mt-2`}>
                    {promedioGeneral >= 6 ? "Aprobado" : "Necesita Apoyo"}
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <BookOpen className="text-secondary" size={20} />
                  Materias Cursadas
                </h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">{materias.size}</div>
                  <p className="text-sm opacity-70">Materias Activas</p>
                  <div className="badge badge-secondary mt-2">Ciclo Escolar 2024</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calificaciones del hijo */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Calificaciones de {hijo?.nombre}</h2>
            <p className="text-base-content/70">Historial de calificaciones por materia y periodo</p>
            {calificaciones.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Materia</th>
                      <th>Calificación</th>
                      <th>Periodo</th>
                      <th>Fecha</th>
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
                              <TrendingUp size={12} className="mr-1" />
                              {calificacion.valor.toFixed(1)}
                            </div>
                          </td>
                          <td>{formatearPeriodo(calificacion.periodo)}</td>
                          <td>{formatearFecha(calificacion.fecha)}</td>
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
              <div className="text-center py-12">
                <TrendingUp size={48} className="mx-auto opacity-30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay calificaciones registradas</h3>
                <p className="opacity-70">Las calificaciones aparecerán aquí cuando los profesores las registren</p>
              </div>
            )}
          </div>
        </div>
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
