import { NextRequest, NextResponse } from 'next/server'
import { PersonalSecretaria } from '@/dominio/entidades/PersonalSecretaria'

export async function POST(req: NextRequest) {
  try {
    const { estudianteId, tipo, motivo } = await req.json()

    // Validación básica de payload
    if (!estudianteId || !['BajaTemporal','BajaDefinitiva'].includes(tipo)) {
      return NextResponse.json(
        { ok: false, mensaje: 'Payload inválido' },
        { status: 400 }
      )
    }
    if (typeof motivo !== 'string' || motivo.trim().length < 5) {
      return NextResponse.json(
        { ok: false, mensaje: 'Motivo obligatorio (mín. 5 caracteres).' },
        { status: 400 }
      )
    }

    console.log('⚡ [API baja] payload recibido:', { estudianteId, tipo, motivo })

    // Llama al caso de uso
    await PersonalSecretaria.darBajaEstudiante({ estudianteId, tipo, motivo })

    return NextResponse.json({ ok: true, mensaje: 'Baja registrada correctamente.' })
  } catch (err) {
    console.error(err)
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ ok: false, mensaje: msg }, { status: 500 })
  }
}
