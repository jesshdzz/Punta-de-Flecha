import { type NextRequest, NextResponse } from "next/server"
import { Profesor } from "@/dominio/entidades/Profesor"
import { Sistema } from "@/dominio/entidades/Sistema"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const grupoId = searchParams.get("grupoId")
        const profesorId = searchParams.get("profesorId")
        
        if (profesorId){
            const profe = new Profesor(Number.parseInt(profesorId), "", "", "", "")
            const materiales = await profe.consultarMaterial()
            return  NextResponse.json({ ok: true, materiales: materiales }, { status: 200 })
        }

        const sistema = Sistema.getInstancia()

        if (grupoId) {
            const materiales = await sistema.consultarMaterialesPorGrupo(Number.parseInt(grupoId))
            return NextResponse.json({ ok: true, materiales }, { status: 200 })
        }

        // Si no se proporciona grupoId, obtenemos todos los materiales
        const materiales = await sistema.consultarMateriales()
        return NextResponse.json({ ok: true, materiales }, { status: 200 })
        
    } catch (error) {
        console.error("Error al obtener materiales:", error)
        return NextResponse.json({ ok: false, mensaje: "Error al obtener los materiales" }, { status: 500 })
    }
}
