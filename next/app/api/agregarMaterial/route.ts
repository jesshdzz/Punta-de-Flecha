// app/api/agregarMaterial/route.ts
import { NextResponse } from "next/server";
import { Profesor } from "@/dominio/entidades/Profesor";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profesorId, archivos, ...materialDatos } = body;

    if (!profesorId) {
      return NextResponse.json(
        { error: "El campo 'profesorId' es requerido." },
        { status: 400 }
      );
    }

    if (!archivos || !Array.isArray(archivos)) {
      return NextResponse.json(
        { error: "El campo 'archivos' debe ser un arreglo de archivos simulados." },
        { status: 400 }
      );
    }

    const existingProfesorData = await prisma.profesor.findUnique({
      where: { usuarioId: profesorId },
      include: { usuario: true },
    });

    if (!existingProfesorData) {
      return NextResponse.json(
        { error: `Profesor con ID ${profesorId} no encontrado.` },
        { status: 404 }
      );
    }

    const profesor = new Profesor(
      existingProfesorData.usuario.id,
      existingProfesorData.usuario.nombre,
      existingProfesorData.usuario.correo,
      existingProfesorData.usuario.telefono,
      existingProfesorData.usuario.contrasena
    );

    
    const archivosSimulados = archivos.map((archivo: any) => {
      return {
        name: archivo.nombreArchivo || archivo.name || "archivo_desconocido",
      } as File; 
    });

    
    await profesor.agregarMaterial({
      ...materialDatos,
      archivos: archivosSimulados,
    });

    return NextResponse.json(
      { mensaje: "Material agregado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en agregarMaterial:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido." },
      { status: 500 }
    );
  }
}
