import { BaseDatos } from "./BaseDatos";
import { Documento } from "./Documento";
import { Estudiante } from "./Estudiante";
import { Inscripcion } from "./Inscripcion";
import { Reinscripcion } from "./Reinscripcion";
import { BajaEstudiante } from "./BajaEstudiante";
import { Pago } from "./Pago";
import { Recibo } from "./Recibo";
import { SistemaValidacion } from "./SistemaValidacion";
import { MaterialEducativo } from "./MaterialEducativo";
import { Calificacion } from "./Calificacion";
import { Asistencia } from "./Asistencia";
import { ServicioNube } from "./ServicioNube";

export class Sistema {
    private static instancia: Sistema;
    private bd: BaseDatos;
    private validador: SistemaValidacion

    constructor() {
        this.bd = BaseDatos.getInstancia();
        this.validador = SistemaValidacion.getInstancia();
    }

    public static getInstancia(): Sistema {
        if (!Sistema.instancia) {
            Sistema.instancia = new Sistema();
        }
        return Sistema.instancia;
    }

    public async registrarEstudianteCompleto(datos: {
        nombre: string
        correo: string
        telefono: string
        contrasena: string
        grupoId: number
        montoInscripcion: number
        documentos: Documento[]
        datosTutor: {
            nombre: string
            correo: string
            telefono: string
            domicilio: string
        }
    }) {
        try {
            // 0. Validar datos del tutor
            this.validador.validarDatosUsuario(datos.datosTutor);

            // 0.1 Validar datos del estudiante
            this.validador.validarDatosUsuario(datos);

            // 0.2 Validar documentos
            this.validador.validarDocumentos(datos.documentos);

            // 1. Crear estudiante (sin ID aún)
            const estudiante = new Estudiante(null, datos.nombre, datos.correo, datos.telefono, datos.contrasena)

            // 2. Guardar estudiante en la BD y obtener ID
            await this.bd.guardarEstudiante(estudiante, datos.datosTutor.correo, datos.grupoId);
            const estudianteId = estudiante.getId();

            // 3. Crear inscripción
            const inscripcion = new Inscripcion(null, estudianteId!, datos.grupoId)
            await this.bd.guardarInscripcion(inscripcion)

            // 5. Aprobar inscripción
            // (asumiendo que la validación de documentos fue exitosa)
            inscripcion.aprobar()
            this.bd.actualizarTramite(inscripcion)

            // 5. Crear pago
            const pago = new Pago(null, estudianteId!, "pago por inscripcion", datos.montoInscripcion)
            await this.bd.guardarPago(pago)

            // 5. Crear recibo
            const recibo = new Recibo(null, pago.getId()!, datos.montoInscripcion, pago.getFecha())
            await this.bd.guardarRecibo(recibo)

            pago.completarPago();
            this.bd.actualizarTramite(pago);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            throw new Error("Error desconocido al registrar estudiante.");
        }
    }

    public async agregarMaterial(
        datos: { titulo: string; descripcion: string; categoria: string },
        archivos: File[],
        idProfesor: number,
        grupoId: number

    ): Promise<void> {
        try {
            if (!archivos || archivos.length === 0) throw new Error("Debe subir al menos un archivo.");

            this.validador.validarMaterial(datos);
            this.validador.validarExtensionesArchivos(archivos);
            // const datosGrupo = await this.bd.obtenerDatosGrupoPorId(grupoId);
            // if (!datosGrupo) {
            //     throw new Error("El grupo especificado no existe.");
            // }
            // Tomamos la extensión del primer archivo para el ejemplo
            const nombreArchivo = archivos[0].name;
            const extension = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1).toLowerCase();


            // Crear el material
            const material = new MaterialEducativo(
                null,
                datos.titulo,
                idProfesor,
                new Date(),
                datos.descripcion,
                datos.categoria,
                false,
                extension,
                grupoId
            );

            // Aquí el MaterialEducativo se encarga de guardar todo
            await material.agregarMaterial({
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                categoria: datos.categoria,
                existencia: false,
                tipoArchivo: extension,
                fecha: new Date().toISOString(),
                grupoId,
                archivos
            });
        } catch (error) {
            console.error("Error en agregarMaterial:", error);
            throw error;
        }
    }

    public async registrarCalificacion(calificacion: {
        estudianteId: number,
        materiaId: number,
        parcial1: number,
        parcial2: number,
        ordinario: number,
        final: number,
    }): Promise<void> {
        try {
            // Validar calificación
            this.validador.validarCalificacion(calificacion);

            // Crear la calificación
            const nuevaCalificacion = new Calificacion(
                calificacion.estudianteId,
                calificacion.materiaId,
                calificacion.parcial1,
                calificacion.parcial2,
                calificacion.ordinario,
                calificacion.final,
            );

            // Guardar la calificación en la base de datos
            await this.bd.guardarCalificacion(nuevaCalificacion);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            throw new Error("Error al registrar calificación. Intente mas tarde.");
        }
    }

    public async registrarAsistencia(asistencia: {
        estudianteId: number,
        materiaId: number,
        parcial1: number,
        parcial2: number,
        final: number,
    }): Promise<void> {
        try {
            // Validar asistencia
            this.validador.validarAsistencia(asistencia);

            // Crear la asistencia
            const nuevaAsistencia = new Asistencia(
                asistencia.estudianteId,
                asistencia.materiaId,
                asistencia.parcial1,
                asistencia.parcial2,
                asistencia.final
            );

            // Guardar asistencia en la base de datos
            await this.bd.guardarAsistencia(nuevaAsistencia);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            throw new Error("Error al registrar asistencia. Intente mas tarde.");
        }
    }

    public async actualizarDatosEstudiante(datos: {
        estudianteId: number;
        nombre?: string;
        correo?: string;
        telefono?: string;
        contrasena?: string;
        grupoId?: number;
        montoReinscripcion: number;
        reinscribir?: boolean;
    }): Promise<void> {
        try {
            // 1. Validar campos
            this.validador.validarActualizacionDatos(datos);

            // 2. Actualizar datos en BD
            await this.bd.actualizarDatosEstudiante(datos);

            // 3. Si solicita reinscripción, creamos el flujo completo de reinscripción
            if (datos.reinscribir && datos.grupoId) {
                const reinscripcion = new Reinscripcion(
                    null,
                    datos.estudianteId,
                    datos.grupoId
                );
                await this.bd.guardarReinscripcion(reinscripcion);

                reinscripcion.aprobar();
                await this.bd.actualizarTramite(reinscripcion);

                // Pago por reinscripción
                const pago = new Pago(
                    null,
                    datos.estudianteId,
                    "Pago por reinscripción",
                    datos.montoReinscripcion
                );
                await this.bd.guardarPago(pago);

                // Recibo
                const recibo = new Recibo(
                    null,
                    pago.getId()!,
                    datos.montoReinscripcion,
                    pago.getFecha()
                );
                await this.bd.guardarRecibo(recibo);

                pago.completarPago();
                await this.bd.actualizarTramite(pago);
            }

            console.log(
                `Estudiante ${datos.estudianteId} actualizado/reinscrito correctamente.`
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    "Error al actualizar datos del estudiante: " + error.message
                );
            }
            throw new Error("Error desconocido al actualizar datos del estudiante.");
        }
    }

    public async darBajaEstudiante(datos: {
        estudianteId: number,
        tipo: "BajaTemporal" | "BajaDefinitiva",
        motivo: string
    }): Promise<void> {
        // 0. (opcional) validar el motivo, el tipo, etc.
        this.validador.validarCamposRequeridos({ estudianteId: datos.estudianteId, motivo: datos.motivo });

        // 1. Construir la entidad
        const baja = new BajaEstudiante(
            null,
            datos.estudianteId,
            datos.tipo,
            datos.motivo
        );

        // 2. (opcional) aprobar de inmediato
        baja.aprobar();

        // 3. Persistir trámite y actualizar estado
        await this.bd.guardarBajaEstudiante(baja);
    }

    public async consultarMaterialPorId(profesorId: number): Promise<any> {
        try {
            // Obtener todos los materiales de la base de datos
            const materiales = await this.bd.obtenerMateriales(profesorId, null);
            // simular la obtención de URL de archivos
            const nube = ServicioNube.getInstancia();
            nube.obtenerUrlArchivo(materiales.id, materiales.titulo);

            return materiales;
        } catch (error) {
            console.error("Error al consultar materiales:", error);
            throw new Error("Error al consultar materiales. Intente más tarde.");
        }
    }

    public async consultarMaterialesPorGrupo(grupoId: number): Promise<any> {
        try {
            // Validar grupo
            this.validador.validarGrupo(grupoId);

            // Obtener materiales del grupo
            const materiales = await this.bd.obtenerMateriales(null, grupoId);
            // simular la obtención de URL de archivos
            const nube = ServicioNube.getInstancia();
            nube.obtenerUrlArchivo(materiales.id, materiales.titulo);

            
            return materiales;
        } catch (error) {
            console.error("Error al consultar materiales por grupo:", error);
            throw new Error("Error al consultar materiales por grupo. Intente más tarde.");
        }
    }

    public async consultarMateriales(): Promise<any> {
        try {
            // Obtener todos los materiales de la base de datos
            const materiales = await this.bd.obtenerMateriales(null, null);
            // simular la obtención de URL de archivos
            const nube = ServicioNube.getInstancia();
            nube.obtenerUrlArchivo(materiales.id, materiales.titulo);

            return materiales;
        } catch (error) {
            console.error("Error al consultar todos los materiales:", error);
            throw new Error("Error al consultar materiales. Intente más tarde.");
        }
    }
}