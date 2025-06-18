import { NextRequest, NextResponse } from 'next/server'
import { Profesor } from '@/dominio/entidades/Profesor'


export async function POST(req: NextRequest) {
    try {
        const datos = await req.json()

        const {
            estudianteId,
            materiaId,
            asis_p1,
            asis_p2,
            asis_final
        } = datos

        await Profesor.asignarAsistencia(estudianteId, materiaId, asis_p1, asis_p2, asis_final)
        
        return NextResponse.json({ ok: true, mensaje: 'Asistencias registradas correctamente' })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { ok: false, mensaje: error.message || 'Error al subir las Asistencias' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { ok: false, mensaje: 'Error desconocido al subir las Asistencias' },
            { status: 500 }
        )
    }
}
