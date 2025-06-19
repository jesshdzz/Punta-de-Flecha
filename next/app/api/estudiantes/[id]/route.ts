import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← params es promesa
) {
  const { id } = await params
  const usuarioId = Number(id)
  if (isNaN(usuarioId)) {
    return NextResponse.json(
      { ok: false, mensaje: 'ID inválido' },
      { status: 400 }
    )
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: { usuarioId },
    include: { usuario: true }
  })
  if (!estudiante) {
    return NextResponse.json(
      { ok: false, mensaje: 'Estudiante no encontrado' },
      { status: 404 }
    )
  }

  // Devuelvo TODO como strings para que el front use .trim()
  return NextResponse.json({
    ok: true,
    estudiante: {
      estudianteId:   estudiante.usuarioId.toString(),
      nombre:         estudiante.usuario.nombre,
      correo:         estudiante.usuario.correo,
      telefono:       estudiante.usuario.telefono,
      grupoId:        (estudiante.grupoId ?? '').toString(),
      contrasena:     estudiante.usuario.contrasena,     
      reinscribir:    false,
      montoReinscripcion: ''
    }
  })
}
