import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const materias = await prisma.materia.findMany({
      include: {
        profesor: {
          include: {
            usuario: true,
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    })

    const materiasFormateadas = materias.map((materia) => ({
      id: materia.id,
      nombre: materia.nombre,
      profesor: {
        id: materia.profesor.usuarioId,
        nombre: materia.profesor.usuario.nombre,
      },
    }))

    return NextResponse.json({
      ok: true,
      materias: materiasFormateadas,
    })
  } catch (error) {
    console.error("Error al obtener materias:", error)
    return NextResponse.json({ ok: false, mensaje: "Error al obtener las materias" }, { status: 500 })
  }
}
