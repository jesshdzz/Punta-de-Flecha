import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
    try {
        const { correo, contrasena } = await req.json()

        if (!correo || !contrasena) {
            return NextResponse.json({ ok: false, mensaje: "Correo y contraseña son requeridos" }, { status: 400 })
        }

        // Buscar usuario en la base de datos
        const usuario = await prisma.usuario.findUnique({
            where: { correo },
            include: {
                Estudiante: true,
                Profesor: true,
            },
        })

        if (!usuario || usuario.contrasena !== contrasena) {
            return NextResponse.json({ ok: false, mensaje: "Credenciales inválidas" }, { status: 401 })
        }

        // Crear token simple (en producción usar JWT)
        const token = Buffer.from(`${usuario.id}:${usuario.puesto}`).toString("base64")

        // Establecer cookie
        const cookieStore = await cookies()
        cookieStore.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 días
        })

        return NextResponse.json({
            ok: true,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                puesto: usuario.puesto,
            },
        })
    } catch (error) {
        console.error("Error en login:", error)
        return NextResponse.json({ ok: false, mensaje: "Error interno del servidor" }, { status: 500 })
    }
}
