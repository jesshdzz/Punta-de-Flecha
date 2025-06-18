import { BaseDatos } from "./BaseDatos";
// import { Docuemento } from "./Documento";
import { Estudiante } from "./Estudiante";
import { Inscripcion } from "./Inscripcion";
import { Pago } from "./Pago";
import { Recibo } from "./Recibo";
import { SistemaValidacion } from "./SistemaValidacion";
import { Profesor } from "./Profesor";
import { MaterialEducativo } from "./MaterialEducativo";
import { Usuario } from "./Usuario";
import { Numerals } from "react-day-picker";
import { Grupo } from "./Grupo";

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
        // documentos?: Docuemento[]
        // datosTutor?: {
        //     nombre: string
        //     correo: string
        //     telefono: string
        //     domicilio: string
    }) {
        try {
            // 0. Validar datos del estudiante
            this.validador.validarDatosUsuario(datos);

            // 1. Crear estudiante (sin ID aún)
            const estudiante = new Estudiante(null, datos.nombre, datos.correo, datos.telefono, datos.contrasena)

            // 2. Guardar estudiante en la BD y obtener ID
            await this.bd.guardarEstudiante(estudiante, datos.grupoId);
            const estudianteId = estudiante.getId();

            // 3. Crear inscripción
            const inscripcion = new Inscripcion(null, estudianteId!, datos.grupoId)
            await this.bd.guardarInscripcion(inscripcion)

            // 4. validar documentos
            // validacion de documentos pendiente

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
            const datosGrupo = await this.bd.obtenerDatosGrupoPorId(grupoId);
            if (!datosGrupo) {
            throw new Error("El grupo especificado no existe.");
            }

            const grupo = new Grupo(datosGrupo.id, datosGrupo.nombre, datosGrupo.grado);

           if (!archivos || archivos.length === 0) throw new Error("Debe subir al menos un archivo.");

            this.validador.validarMaterial(datos);
            this.validador.validarExtensionesArchivos(archivos);

            // Tomamos la extensión del primer archivo para el ejemplo
            const nombreArchivo = archivos[0].name;
            const extension = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1).toLowerCase();


            await grupo.agregarMaterial(
                {
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                categoria: datos.categoria,
                existencia: false,
                tipoArchivo: extension,
                profesorId: idProfesor,
                },
                archivos
            );
        } catch (error) {
            console.error("Error en agregarMaterial:", error);
            throw error;
        }
    }


}