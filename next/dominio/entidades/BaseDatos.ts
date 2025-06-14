import { Estudiante } from "./Estudiante";

export class BaseDatos {
    private static instancia: BaseDatos

    private constructor() {}

    public static getInstancia(): BaseDatos {
        if (!BaseDatos.instancia) {
            BaseDatos.instancia = new BaseDatos();
        }
        return BaseDatos.instancia;
    }
    public guardarEstudiante(estudiante: Estudiante): boolean {
        // Aquí se hace el guardado del estudiante en la base de datos
        console.log(`Estudiante ${estudiante.obtenerInfo().nombre} guardado exitosamente.`);
        return true; // Simula que el guardado fue exitoso
    }
}