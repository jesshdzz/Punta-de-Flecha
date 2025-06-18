export class Materia {
    constructor(
        public id: number,
        public nombre: string,
        public profesorId: number,
    ) {}

    public static async registrarMateria(datos: {
        nombre: string
        creditos: number
        profesorId: number
        grupoId: number
    }) {
        try {
            // Aquí se llamaría al método del sistema para registrar la materia
            // await Sistema.getInstancia().registrarMateria(datos);
            console.log('Materia registrada:', datos);
        } catch (error) {
            console.error('Error al registrar materia:', error);
            throw error; // Re-lanzar el error para que pueda ser manejado por el llamador
        }
    }
}