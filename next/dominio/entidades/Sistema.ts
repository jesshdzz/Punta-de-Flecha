import { BaseDatos } from "./BaseDatos";
// import { Docuemento } from "./Documento";
import { Estudiante } from "./Estudiante";
import { Inscripcion } from "./Inscripcion";
import { Pago } from "./Pago";
import { Recibo } from "./Recibo";
import { SistemaValidacion } from "./SistemaValidacion";

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
}