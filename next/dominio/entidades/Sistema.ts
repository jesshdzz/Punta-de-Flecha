import { BaseDatos } from "./BaseDatos";
import { Docuemento } from "./Documento";
import { Estudiante } from "./Estudiante";
import { SistemaValidacion } from "./SistemaValidacion";

export class Sistema {
    constructor(
        private bd: BaseDatos,
        private validador: SistemaValidacion
    ){
        this.bd = new BaseDatos();
        this.validador = SistemaValidacion.getInstancia();
    }

    public registrarEstudiante(estudiante: Estudiante): boolean {
        // Aquí se hace el guardado del estudiante en la base de datos
        return this.bd.guardarEstudiante(estudiante);
    }

    public validarDocumentos(documentos: Docuemento[]): boolean {
        for (const doc of documentos) {
            if (!this.validarDocumento(doc)) {
                console.error(`Documento inválido: ${doc.getNombre()}`);
                return false;
            }
        }
        return true;
    }
}