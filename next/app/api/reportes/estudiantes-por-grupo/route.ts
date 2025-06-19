import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grupoId = searchParams.get("grupoId")

    const whereClause = grupoId ? { grupoId: Number.parseInt(grupoId) } : {}

    const estudiantes = await prisma.estudiante.findMany({
      where: whereClause,
      include: {
        usuario: true,
        grupo: true,
        Calificacion: {
          include: {
            materia: true,
          },
        },
        Asistencia: {
          include: {
            materia: true,
          },
        },
      },
      orderBy: [{ grupo: { grado: "asc" } }, { grupo: { nombre: "asc" } }, { usuario: { nombre: "asc" } }],
    })

    const estudiantesFormateados = estudiantes.map((estudiante) => ({
      id: estudiante.usuarioId,
      nombre: estudiante.usuario.nombre,
      correo: estudiante.usuario.correo,
      telefono: estudiante.usuario.telefono,
      estado: estudiante.estado,
      grupo: estudiante.grupo
        ? {
            id: estudiante.grupo.id,
            nombre: estudiante.grupo.nombre,
            grado: estudiante.grupo.grado,
          }
        : null,
      calificaciones: estudiante.Calificacion.map((cal) => ({
        materia: cal.materia.nombre,
        parcial1: cal.parcial1,
        parcial2: cal.parcial2,
        ordinario: cal.ordinario,
        final: cal.final,
      })),
      asistencias: estudiante.Asistencia.map((asis) => ({
        materia: asis.materia.nombre,
        parcial1: asis.parcial1,
        parcial2: asis.parcial2,
        final: asis.final,
      })),
    }))

    return NextResponse.json({
      ok: true,
      estudiantes: estudiantesFormateados,
    })
  } catch (error) {
    console.error("Error al obtener reporte de estudiantes:", error)
    return NextResponse.json({ ok: false, mensaje: "Error al generar el reporte" }, { status: 500 })
  }
}
