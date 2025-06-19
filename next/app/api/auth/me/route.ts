import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ ok: false, mensaje: "No autenticado" }, { status: 401 })
    }

    // Decodificar token simple
    const decoded = Buffer.from(token, "base64").toString("ascii")
    const [userId] = decoded.split(":")

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number.parseInt(userId) },
      include: {
        Estudiante: true,
        Profesor: true,
      },
    })

    if (!usuario) {
      return NextResponse.json({ ok: false, mensaje: "Usuario no encontrado" }, { status: 404 })
    }

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
    console.error("Error en /me:", error)
    return NextResponse.json({ ok: false, mensaje: "Error interno del servidor" }, { status: 500 })
  }
}
