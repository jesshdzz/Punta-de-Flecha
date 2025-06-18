import { Estudiante } from "./Estudiante";
import { Inscripcion } from "./Inscripcion";
import { Pago } from "./Pago";
import { Recibo } from "./Recibo";
import { Tramite } from "./Tramite";
import prisma from "@/lib/prisma"
import { MaterialEducativo } from "./MaterialEducativo";
import { ServicioNube } from "./ServicioNube";
import { PrismaClient } from '@prisma/client';


export class BaseDatos {
    private static instancia: BaseDatos

    constructor() { }
    

    public static getInstancia(): BaseDatos {
        if (!BaseDatos.instancia) {
            BaseDatos.instancia = new BaseDatos();
        }
        return BaseDatos.instancia;
    }

    public async guardarEstudiante(estudiante: Estudiante, grupoId: number): Promise<boolean> {
        try {
            await this.validarCorreo(estudiante.getCorreo());
            await this.validarGrupo(grupoId);

            // Prisma transaction
            await prisma.$transaction(async (tx) => {
                const usuario = await tx.usuario.create({
                    data: {
                        nombre: estudiante.getNombre(),
                        correo: estudiante.getCorreo(),
                        telefono: estudiante.getTelefono(),
                        contrasena: estudiante.getContrasena(),
                        puesto: 'Estudiante'
                    }
                })

                const estu = await tx.estudiante.create({
                    data: {
                        usuarioId: usuario.id,
                        grupoId: grupoId,
                    }
                })

                estudiante.setGrupo(estu.grupoId!);
                estudiante.setId(usuario.id);
            })


            if (!estudiante.getId()) {
                throw new Error("Error al crear el estudiante.");
            }

            return true
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error al guardar el estudiante: " + error.message);
            }
            throw new Error("Error desconocido al guardar el estudiante.");
        }
    }

    public async guardarInscripcion(inscripcion: Inscripcion): Promise<boolean> {
        try {
            await this.validarGrupo(inscripcion.getGrupoId());
            await this.validarUsuario(inscripcion.getEstudianteId());

            await prisma.$transaction(async (tx) => {
                const nuevoTramite = await tx.tramite.create({
                    data: {
                        estudianteId: inscripcion.getEstudianteId(),
                        tipo: inscripcion.getTipo(),
                        estado: inscripcion.getEstado(),
                        fecha: inscripcion.getFecha(),
                    }
                });

                const inscri = await tx.inscripcion.create({
                    data: {
                        tramiteId: nuevoTramite.id,
                        grupoId: inscripcion.getGrupoId(),
                    }
                })

                inscripcion.setId(inscri.tramiteId);
            })

            if (!inscripcion.getId()) {
                throw new Error("Error al crear la inscripción.");
            }

            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error al guardar la inscripción: " + error.message);
            }
            throw new Error("Error desconocido al guardar la inscripción.");
        }
    }

    public async actualizarTramite(tramite: Tramite): Promise<void> {
        try {
            const actualizar = await prisma.tramite.update({
                where: { id: tramite.getId()! },
                data: {
                    estado: tramite.getEstado(),
                    fecha: tramite.getFecha(),
                }
            })

            if (!actualizar) {
                throw new Error("No se pudo actualizar el tramite.");
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error al actualizar el trámite: " + error.message);
            }
            throw new Error("Error desconocido al actualizar el trámite.");

        }
    }

    public async guardarPago(pago: Pago): Promise<boolean> {
        try {
            await this.validarUsuario(pago.getEstudianteId());

            await prisma.$transaction(async (tx) => {
                const tramite = await tx.tramite.create({
                    data: {
                        estudianteId: pago.getEstudianteId(),
                        tipo: pago.getTipo(),
                        estado: pago.getEstado(),
                        fecha: pago.getFecha(),
                    }
                })

                await tx.pago.create({
                    data: {
                        tramiteId: tramite.id,
                        concepto: pago.getConcepto(),
                        monto: pago.getMonto(),
                    }
                })

                pago.setId(tramite.id);
            })
            if (!pago.getId()) {
                throw new Error("Error al crear el pago.");
            }
            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error al guardar el pago: " + error.message);
            }
            throw new Error("Error desconocido al guardar el pago.");
        }
    }

    public async guardarRecibo(recibo: Recibo): Promise<boolean> {
        try {
            await this.validarTramite(recibo.getPagoId());

            const nuevoRecibo = await prisma.recibo.create({
                data: {
                    pagoId: recibo.getPagoId(),
                    monto: recibo.getMonto(),
                    fecha: recibo.getFecha(),
                }
            })

            if (!nuevoRecibo) {
                throw new Error("Error al crear el recibo.");
            }

            recibo.setId(nuevoRecibo.id);
            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error al guardar el recibo: " + error.message);
            }
            throw new Error("Error desconocido al guardar el recibo.");
        }
    }

    public async validarCorreo(correo: string): Promise<boolean> {
        const email = await prisma.usuario.findUnique({ where: { correo } })
        if (email) {
            throw new Error("El correo ya está en uso.");
        }
        return true;
    }

    public async validarGrupo(grupoId: number): Promise<boolean> {
        const grupo = await prisma.grupo.findUnique({ where: { id: grupoId } })
        if (!grupo) {
            throw new Error("El grupo no existe.");
        }
        return true;
    }

    public async validarUsuario(usuarioId: number): Promise<boolean> {
        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } })
        if (!usuario) {
            throw new Error("El usuario no existe.");
        }
        return true;
    } 

    public async validarTramite(tramiteId: number): Promise<boolean> {
        const tramite = await prisma.tramite.findUnique({ where: { id: tramiteId } })
        if (!tramite) {
            throw new Error("El trámite no existe.");
        }
        return true;
    }

    

   
    public async guardarMaterial(datosPrisma: any) { // Puedes usar 'Prisma.MaterialEducativoCreateInput' si lo importas
        try {
            const materialCreado = await prisma.materialEducativo.create({
                data: datosPrisma, // <-- Aquí ya tienes el objeto listo para Prisma
            });
            console.log("Material guardado en la base de datos.");
            return materialCreado;
        } catch (error) {
            console.error("Error al guardar material en la base de datos (Prisma):", error);
            throw error;
        }
    }

    public async guardarArchivo(data: {
    nombreArchivo: string,
    urlNube: string,
    material: {
        connect: {
            id: number
        }
    }
    }): Promise<void> {
        await prisma.archivoSubido.create({
            data
        });
    }
   public async actualizarExistenciaMaterial(materialId: number): Promise<void> {
    await prisma.materialEducativo.update({
        where: { id: materialId },
        data: { existencia: true },
    });
}




}