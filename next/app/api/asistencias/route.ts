import { NextRequest, NextResponse } from 'next/server'
import { Profesor } from '@/dominio/entidades/Profesor'
import { Sistema } from '@/dominio/entidades/Sistema'


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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const estudianteId = searchParams.get("estudianteId")

        if (!estudianteId) {
            return NextResponse.json({ error: "ID de estudiante es requerido" }, { status: 400 })
        }

        const sistema = Sistema.getInstancia()
        const asistencias = await sistema.obtenerAsistenciasPorEstudiante(Number.parseInt(estudianteId))
        return NextResponse.json({
            success: true,
            data: asistencias,
        })
    } catch (error) {
        console.error("Error al obtener asistencias:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
