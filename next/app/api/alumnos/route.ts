import { NextRequest, NextResponse } from 'next/server'
import { PersonalSecretaria } from '@/dominio/entidades/PersonalSecretaria'

export async function POST(req: NextRequest) {
    try {
        const datos = await req.json()

        const {
            nombre,
            correo,
            telefono,
            contrasena,
            grupoId,
            montoInscripcion
            // doumentos[]
            // datos del tutor
        } = datos

        // Ejecutar flujo completo
        PersonalSecretaria.registrarAlumno({
            nombre,
            correo,
            telefono,
            contrasena,
            grupoId,
            montoInscripcion
            // documentos, 
            // datos del tutor
        })

        return NextResponse.json({ ok: true, mensaje: 'Alumno registrado correctamente' })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { ok: false, mensaje: error.message || 'Error al registrar alumno' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { ok: false, mensaje: 'Error desconocido al registrar alumno' },
            { status: 500 }
        )
    }
}
