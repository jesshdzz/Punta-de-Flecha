// app/api/baja/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id?: string } }
) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ ok: false, mensaje: 'ID inválido' }, { status: 400 })
  }

  // Busca el estudiante junto con sus datos de usuario
  const estudiante = await prisma.estudiante.findUnique({
    where: { usuarioId: id },
    include: { usuario: true }
  })

  if (!estudiante) {
    return NextResponse.json({ ok: false, mensaje: 'Estudiante no encontrado' }, { status: 404 })
  }

  return NextResponse.json({
    ok: true,
    alumno: {
      estudianteId:   estudiante.usuarioId,
      nombre:         estudiante.usuario.nombre,
      correo:         estudiante.usuario.correo,
      telefono:       estudiante.usuario.telefono,
      grupoId:        estudiante.grupoId,
      estado:         estudiante.estado
    }
  })
}