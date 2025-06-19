import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const grupos = await prisma.grupo.findMany({
      orderBy: [{ grado: "asc" }, { nombre: "asc" }],
    })

    return NextResponse.json({
      ok: true,
      grupos,
    })
  } catch (error) {
    console.error("Error al obtener grupos:", error)
    return NextResponse.json({ ok: false, mensaje: "Error al obtener los grupos" }, { status: 500 })
  }
}
