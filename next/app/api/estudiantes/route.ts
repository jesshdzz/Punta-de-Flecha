import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const estudiantes = await prisma.estudiante.findMany({
      include: {
        usuario: true,
        grupo: true,
        PadreFamilia: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: {
        usuario: {
          nombre: "asc",
        },
      },
    })

    const alumnosFormateados = estudiantes.map((estudiante) => ({
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
      tutor: estudiante.PadreFamilia
        ? {
            nombre: estudiante.PadreFamilia.usuario.nombre,
            correo: estudiante.PadreFamilia.usuario.correo,
            telefono: estudiante.PadreFamilia.usuario.telefono,
          }
        : null,
    }))

    return NextResponse.json({
      ok: true,
      alumnos: alumnosFormateados,
    })
  } catch (error) {
    console.error("Error al obtener alumnos:", error)
    return NextResponse.json({ ok: false, mensaje: "Error al obtener la lista de alumnos" }, { status: 500 })
  }
}
