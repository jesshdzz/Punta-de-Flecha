import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
    try {
        const cookieStore = await cookies()
        cookieStore.delete("auth-token")

        return NextResponse.json({ ok: true, mensaje: "Sesión cerrada correctamente" })
    } catch (error) {
        console.error("Error en logout:", error)
        return NextResponse.json({ ok: false, mensaje: "Error al cerrar sesión" }, { status: 500 })
    }
}
