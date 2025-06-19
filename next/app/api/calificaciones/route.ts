import { NextRequest, NextResponse } from 'next/server'
import { Profesor } from '@/dominio/entidades/Profesor'
import { Sistema } from '@/dominio/entidades/Sistema'


export async function POST(req: NextRequest) {
    try {
        const datos = await req.json()

        const {
            estudianteId,
            materiaId,
            calif_p1,
            calif_r2,
            ordinario,
            calif_final,
        } = datos

        await Profesor.asignarCalificacion(estudianteId, materiaId, calif_p1, calif_r2, ordinario, calif_final)

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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const estudianteId = searchParams.get("estudianteId")

        if (!estudianteId) {
            return NextResponse.json({ error: "ID de estudiante es requerido" }, { status: 400 })
        }

        const sistema = Sistema.getInstancia()
        const calificaciones = await sistema.obtenerCalificacionesPorEstudiante(Number.parseInt(estudianteId))
        return NextResponse.json({
            success: true,
            data: calificaciones,
        })
    } catch (error) {
        console.error("Error al obtener calificaciones:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}