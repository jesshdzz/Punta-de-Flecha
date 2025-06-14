import { Estudiante } from '@/dominio/entidades/Estudiante'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

export class RegistrarEstudianteService {
    async ejecutar(datos: {
        nombre: string
        correo: string
        telefono: string
        contrasena: string
        grupoId?: number
    }): Promise<Estudiante> {
        const existente = await prisma.usuario.findUnique({ where: { correo: datos.correo } })
        if (existente) throw new Error('El correo ya está registrado.')

        const usuario = await prisma.usuario.create({
            data: {
                nombre: datos.nombre,
                correo: datos.correo,
                telefono: datos.telefono,
                contrasena: datos.contrasena,
                rol: 'ESTUDIANTE'
            }
        })

        const Estudiante = await prisma.Estudiante.create({
            data: {
                id: usuario.id,
                grupoId: datos.grupoId ?? null
            }
        })

        return new Estudiante(
            usuario.id,
            usuario.nombre,
            usuario.correo,
            usuario.telefono,
            usuario.contrasena,
            datos.grupoId ?? null
        )
    }
}