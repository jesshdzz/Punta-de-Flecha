import prisma from "@/lib/prisma"
import { Estudiante } from "./Estudiante";
import { Inscripcion } from "./Inscripcion";
import { Reinscripcion } from "./Reinscripcion";
import { BajaEstudiante } from "./BajaEstudiante";
import { Pago } from "./Pago";
import { Recibo } from "./Recibo";
import { Tramite } from "./Tramite";
import { MaterialEducativo } from "./MaterialEducativo";
import { ServicioNube } from "./ServicioNube";
import { Calificacion } from "./Calificacion";


export class BaseDatos {
    private static instancia: BaseDatos

    constructor() { }

    public static getInstancia(): BaseDatos {
        if (!BaseDatos.instancia) {
            BaseDatos.instancia = new BaseDatos();
        }
        return BaseDatos.instancia;
    }

    public async guardarEstudiante(estudiante: Estudiante, correoTutor: string, grupoId: number): Promise<boolean> {
        try {
            await this.validarCorreo(estudiante.getCorreo());
            await this.validarGrupo(grupoId);
            const tutorId = await this.validarTutor(correoTutor);

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
                        padreFamiliaId: tutorId,
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

    public async validarTutor(correo: string): Promise<number> {
        const tutor = await prisma.usuario.findFirst({ where: { correo: correo, puesto: 'Padre_familia' } })
        if (!tutor) {
            throw new Error("El padre de familia no existe.");
        }
        return tutor.id;
    }

    public async validarMateria(materiaId: number): Promise<boolean> {
        const materia = await prisma.materia.findUnique({ where: { id: materiaId } })
        if (!materia) {
            throw new Error("La materia no existe.");
        }
        return true;
    }

    public async validarCalificacion(estudianteId: number, materiaId: number): Promise<number> {
        const calificacion = await prisma.calificacion.findFirst({
            where: {
                estudianteId: estudianteId,
                materiaId: materiaId
            }
        });

        if (!calificacion) {
            return -1;
        }
        return calificacion.id;
    }

    public async actualizarDatosEstudiante(datos: {
        estudianteId: number;
        nombre?: string;
        correo?: string;
        telefono?: string;
        contrasena?: string;
        grupoId?: number;
    }): Promise<void> {
        try {
            const actualizacionesUsuario: any = {};
            const actualizacionesEstudiante: any = {};

            if (datos.nombre) actualizacionesUsuario.nombre = datos.nombre;
            if (datos.correo) actualizacionesUsuario.correo = datos.correo;
            if (datos.telefono) actualizacionesUsuario.telefono = datos.telefono;
            if (datos.contrasena) actualizacionesUsuario.contrasena = datos.contrasena;
            if (datos.grupoId) actualizacionesEstudiante.grupoId = datos.grupoId;


            await prisma.$transaction(async (tx) => {
                if (Object.keys(actualizacionesUsuario).length > 0) {
                    await tx.usuario.update({
                        where: { id: datos.estudianteId },
                        data: actualizacionesUsuario
                    });
                }

                if (Object.keys(actualizacionesEstudiante).length > 0) {
                    await tx.estudiante.update({
                        where: { usuarioId: datos.estudianteId },
                        data: actualizacionesEstudiante
                    });
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error al actualizar el estudiante: " + error.message);
            }
            throw new Error("Error desconocido al actualizar el estudiante.");
        }
    }

    public async guardarReinscripcion(reinscripcion: Reinscripcion): Promise<boolean> {
        try {
            await this.validarGrupo(reinscripcion.getGrupoId());
            await this.validarUsuario(reinscripcion.getEstudianteId());

            await prisma.$transaction(async (tx) => {
                const tramite = await tx.tramite.create({
                    data: {
                        estudianteId: reinscripcion.getEstudianteId(),
                        tipo: reinscripcion.getTipo(),
                        estado: reinscripcion.getEstado(),
                        fecha: reinscripcion.getFecha(),
                    }
                });

                await tx.inscripcion.create({
                    data: {
                        tramiteId: tramite.id,
                        grupoId: reinscripcion.getGrupoId(),
                    }
                });

                reinscripcion.setId(tramite.id);
            });

            if (!reinscripcion.getId()) {
                throw new Error("Error al crear la reinscripción.");
            }

            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error al guardar la reinscripción: " + error.message);
            }
            throw new Error("Error desconocido al guardar la reinscripción.");
        }
    }

    public async guardarBajaEstudiante(baja: BajaEstudiante): Promise<boolean> {
        try {
            // 1) Validar que el estudiante exista
            await this.validarUsuario(baja.getEstudianteId());

            // 2) Ejecutar todo en una transacción
            await prisma.$transaction(async (tx) => {
                // 2.a) Crear el trámite
                const nuevoTramite = await tx.tramite.create({
                    data: {
                        estudianteId: baja.getEstudianteId(),
                        tipo: baja.getTipo(),
                        estado: baja.getEstado(),
                        fecha: baja.getFecha(),
                    },
                });
                baja.setId(nuevoTramite.id);

                // 2.b) Actualizar el estado del estudiante según el tipo de baja
                const nuevoEstado =
                    baja.getTipo() === "BajaTemporal" ? "BajaTemporal" : "BajaDefinitiva";

                await tx.estudiante.update({
                    where: { usuarioId: baja.getEstudianteId() },
                    data: { estado: nuevoEstado },
                });
            });

            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error al guardar la baja: " + error.message);
            }
            throw new Error("Error desconocido al guardar la baja.");
        }
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

    public async guardarCalificacion(calificacion: Calificacion): Promise<boolean> {
        try {
            // Validar que el estudiante y la materia existan
            await this.validarUsuario(calificacion.estudianteId);
            await this.validarMateria(calificacion.materiaId);
            // Validar si ya existe una calificación para el estudiante y la materia
            const calificacionExistente = await this.validarCalificacion(calificacion.estudianteId, calificacion.materiaId);

            if(calificacionExistente !== -1) {
                const calif = await prisma.calificacion.update({
                    where: {
                       id: calificacionExistente
                    },
                    data: {
                        parcial1: calificacion.parcial1,
                        asistencia1: calificacion.asistencia1,
                        parcial2: calificacion.parcial2,
                        asistencia2: calificacion.asistencia2,
                        ordinario: calificacion.ordinario,
                        final: calificacion.final,
                        asistenciaFin: calificacion.asistenciaFin,
                        fecha: new Date() // Actualizar la fecha al momento de la modificación
                    }
                });

                if (!calif) {
                    throw new Error("Error al actualizar la calificación.");
                }
                return true;
            }

            // Guardar la calificación en la base de datos
            const calif = await prisma.calificacion.create({
                data: {
                    estudianteId: calificacion.estudianteId,
                    materiaId: calificacion.materiaId,
                    parcial1: calificacion.parcial1,
                    asistencia1: calificacion.asistencia1,
                    parcial2: calificacion.parcial2,
                    asistencia2: calificacion.asistencia2,
                    ordinario: calificacion.ordinario,
                    final: calificacion.final,
                    asistenciaFin: calificacion.asistenciaFin
                }
            });

            if (!calif) {
                throw new Error("Error al registrar la calificación.");
            }

            return true;

        } catch (error) {
            console.error("Error al registrar calificación:", error);
            throw error;
        }
    }
}