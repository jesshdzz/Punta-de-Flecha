import { NextRequest, NextResponse } from 'next/server'
import { Profesor } from '@/dominio/entidades/Profesor'


export async function POST(req: NextRequest) {
    try {
        const datos = await req.json()

        const {
            estudianteId,
            materiaId,
            parcial1,
            asistencia1,
            parcial2,
            asistencia2,
            ordinario,
            final,
            asistenciaFin
        } = datos

        await Profesor.asignarCalificacion(estudianteId, materiaId, parcial1, asistencia1, parcial2, asistencia2, ordinario, final, asistenciaFin)
        
        return NextResponse.json({ ok: true, mensaje: 'Calificaciones registradas correctamente' })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { ok: false, mensaje: error.message || 'Error al subir las calificaciones' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { ok: false, mensaje: 'Error desconocido al subir las calificaciones' },
            { status: 500 }
        )
    }
}
