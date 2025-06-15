import { Docuemento } from "./Documento";

export class SistemaValidacion {
    private static instance: SistemaValidacion;

    private constructor() {}

    public static getInstancia(): SistemaValidacion {
        if (!SistemaValidacion.instance) {
            SistemaValidacion.instance = new SistemaValidacion();
        }
        return SistemaValidacion.instance;
    }

    public validarDocumento(doc: Docuemento): boolean {
        // Aquí se implementa la lógica de validación del documento
        // Por simplicidad, asumimos que todos los documentos son válidos
        console.log(`Documento ${doc.getNombre()} validado correctamente.`);
        return true;
    }

}