// app/api/actualizar/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PersonalSecretaria } from '@/dominio/entidades/PersonalSecretaria'

export async function POST(req: NextRequest) {
  const datos = await req.json()
  const {
    estudianteId,
    nombre,
    correo,
    telefono,
    contrasena,
    reinscribir,
    grupoId,
    montoReinscripcion
  } = datos

  // Preparamos solo los campos que lleguen
  const payload: any = {
    estudianteId: Number(estudianteId)
  }
  if (nombre)    payload.nombre    = nombre
  if (correo)    payload.correo    = correo
  if (telefono)  payload.telefono  = telefono
  if (contrasena && contrasena.trim() !== '') payload.contrasena = contrasena

  if (reinscribir) {
    // Validación mínima
    if (!grupoId || !montoReinscripcion) {
      return NextResponse.json(
        { ok: false, mensaje: 'Al reinscribir debes indicar grupo y monto' },
        { status: 400 }
      )
    }
    payload.reinscribir        = true
    payload.grupoId            = Number(grupoId)
    payload.montoReinscripcion = Number(montoReinscripcion)
  }

  try {
    await PersonalSecretaria.actualizarAlumno(payload)
    return NextResponse.json({ ok: true, mensaje: 'Datos actualizados correctamente' })
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ ok: false, mensaje }, { status: 400 })
  }
}
