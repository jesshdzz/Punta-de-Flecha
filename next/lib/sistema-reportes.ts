// Sistema de generación de reportes
import type { Reporte, Estudiante, Calificacion } from "@/types"
import { BaseDatos } from "./database"

export class SistemaDeReportes {
  private baseDatos: BaseDatos

  constructor() {
    this.baseDatos = BaseDatos.getInstance()
  }

  public generarReporteEstudiantes(): Reporte {
    const estudiantes = this.baseDatos.obtenerTodosEstudiantes()

    const reporte: Reporte = {
      id: this.generarId(),
      tipo: "estudiantes",
      titulo: "Reporte de Estudiantes",
      datos: {
        total: estudiantes.length,
        activos: estudiantes.filter((e) => e.activo).length,
        porGrado: this.agruparPorGrado(estudiantes),
        estudiantes: estudiantes,
      },
      fechaGeneracion: new Date(),
      generadoPor: "sistema",
    }

    this.baseDatos.crearReporte(reporte)
    return reporte
  }

  public generarReporteCalificaciones(estudianteId?: string): Reporte {
    let calificaciones = this.baseDatos.obtenerCalificaciones()

    if (estudianteId) {
      calificaciones = calificaciones.filter((c) => c.estudianteId === estudianteId)
    }

    const reporte: Reporte = {
      id: this.generarId(),
      tipo: "calificaciones",
      titulo: estudianteId ? "Reporte de Calificaciones - Estudiante" : "Reporte General de Calificaciones",
      datos: {
        total: calificaciones.length,
        promedio: this.calcularPromedio(calificaciones),
        calificaciones: calificaciones,
      },
      fechaGeneracion: new Date(),
      generadoPor: "sistema",
    }

    this.baseDatos.crearReporte(reporte)
    return reporte
  }

  private agruparPorGrado(estudiantes: Estudiante[]): Record<string, number> {
    return estudiantes.reduce(
      (acc, estudiante) => {
        acc[estudiante.grado] = (acc[estudiante.grado] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  private calcularPromedio(calificaciones: Calificacion[]): number {
    if (calificaciones.length === 0) return 0
    const suma = calificaciones.reduce((acc, cal) => acc + cal.valor, 0)
    return suma / calificaciones.length
  }

  private generarId(): string {
    return "rep_" + Date.now().toString()
  }
}
