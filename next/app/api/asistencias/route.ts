import { NextRequest, NextResponse } from 'next/server'
import { Profesor } from '@/dominio/entidades/Profesor'
import prisma from '@/lib/prisma'

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

        const asistencias = await prisma.asistencia.findFirst({
            where: {
                estudianteId: usuarioId,
                materiaId: materiaIdNum,
            }
        })

        if (!asistencias) {
            return NextResponse.json(
                { ok: false, mensaje: 'asistencias no encontradas' },
                { status: 404 }
            )
        }

        // Devuelvo TODO como strings para que el front use .trim()
        return NextResponse.json({
            ok: true,
            asistencias: {
                estudianteId: asistencias.estudianteId.toString(),
                materiaId: asistencias.materiaId.toString(),
                asis_p1: asistencias.parcial1.toString(),
                asis_p2: asistencias.parcial2.toString(),
                asis_final: asistencias.final.toString(),
            }
        })

    } catch (error) {
        console.error('Error al obtener asistencias:', error)
        return NextResponse.json(
            { ok: false, mensaje: 'Error al obtener asistencias' },
            { status: 500 }
        )

    }
}