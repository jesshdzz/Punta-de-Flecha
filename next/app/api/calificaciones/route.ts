import { NextRequest, NextResponse } from 'next/server'
import { Profesor } from '@/dominio/entidades/Profesor'
import prisma from '@/lib/prisma'

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

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        const materiaId = searchParams.get('materiaId')
        const usuarioId = Number(id)
        const materiaIdNum = Number(materiaId)

        if (isNaN(usuarioId) || isNaN(materiaIdNum)) {
            return NextResponse.json(
                { ok: false, mensaje: 'ID inválido' },
                { status: 400 }
            )
        }

        const calificaciones = await prisma.calificacion.findFirst({
            where: {
                estudianteId: usuarioId,
                materiaId: materiaIdNum,
            }
        })

        if (!calificaciones) {
            return NextResponse.json(
                { ok: false, mensaje: 'Calificaciones no encontradas' },
                { status: 404 }
            )
        }

        // Devuelvo TODO como strings para que el front use .trim()
        return NextResponse.json({
            ok: true,
            calificaciones: {
                estudianteId: calificaciones.estudianteId.toString(),
                materiaId: calificaciones.materiaId.toString(),
                calif_p1: calificaciones.parcial1.toString(),
                calif_r2: calificaciones.parcial2.toString(),
                ordinario: calificaciones.ordinario.toString(),
                calif_final: calificaciones.final.toString(),
            }
        })

    } catch (error) {
        console.error('Error al obtener calificaciones:', error)
        return NextResponse.json(
            { ok: false, mensaje: 'Error al obtener calificaciones' },
            { status: 500 }
        )

    }
}