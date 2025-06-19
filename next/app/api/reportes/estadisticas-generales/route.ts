import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get general statistics
    const totalEstudiantes = await prisma.estudiante.count()
    const estudiantesActivos = await prisma.estudiante.count({
      where: { estado: "Activo" },
    })
    const totalProfesores = await prisma.profesor.count()
    const totalMaterias = await prisma.materia.count()
    const totalMateriales = await prisma.materialEducativo.count()

    // Get students by grade
    const estudiantesPorGrado = await prisma.estudiante.groupBy({
      by: ["grupoId"],
      _count: {
        usuarioId: true,
      },
      where: {
        grupoId: {
          not: null,
        },
      },
    })

    // Get grade distribution
    const promedioCalificaciones = await prisma.calificacion.aggregate({
      _avg: {
        final: true,
      },
    })

    // Get attendance statistics
    const promedioAsistencias = await prisma.asistencia.aggregate({
      _avg: {
        final: true,
      },
    })

    // Get recent activities
    const tramitesRecientes = await prisma.tramite.count({
      where: {
        fecha: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    })

    return NextResponse.json({
      ok: true,
      estadisticas: {
        totalEstudiantes,
        estudiantesActivos,
        totalProfesores,
        totalMaterias,
        totalMateriales,
        promedioCalificaciones: promedioCalificaciones._avg.final || 0,
        promedioAsistencias: promedioAsistencias._avg.final || 0,
        tramitesRecientes,
        estudiantesPorGrado: estudiantesPorGrado.length,
      },
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ ok: false, mensaje: "Error al obtener estadísticas" }, { status: 500 })
  }
}
