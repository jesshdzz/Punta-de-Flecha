import { BaseDatos } from "./BaseDatos";
import { Docuemento } from "./Documento";
import { Estudiante } from "./Estudiante";
import { Inscripcion } from "./Inscripcion";
import { Pago } from "./Pago";
import { Recibo } from "./Recibo";
import { SistemaValidacion } from "./SistemaValidacion";

export class Sistema {
    private static instancia: Sistema;
    private bd: BaseDatos;
    private validador: SistemaValidacion

    constructor( ) {
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
        // 1. Crear estudiante (sin ID aún)
        const estudiante = new Estudiante(null, datos.nombre, datos.correo, datos.telefono, datos.contrasena)
        estudiante.asignarGrupo(datos.grupoId)

        // 2. Guardar estudiante en la BD y obtener ID
        await this.bd.guardarEstudiante(estudiante)
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
        const pago = new Pago(null, estudianteId!, datos.montoInscripcion)
        await this.bd.guardarPago(pago)

        // 5. Crear recibo
        const recibo = new Recibo(null, pago.getId()!, pago.getFecha())
        await this.bd.guardarRecibo(recibo)

        pago.aprobar();
        this.bd.actualizarTramite(pago);
    }

    public validarDocumentos(documentos: Docuemento[]): boolean {
        for (const doc of documentos) {
            if (!this.validador.validarDocumento(doc)) {
                console.error(`Documento inválido: ${doc.getNombre()}`);
                return false;
            }
        }
        return true;
    }
}