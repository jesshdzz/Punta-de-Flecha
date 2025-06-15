import { Usuario, infoUsuario } from "./Usuario";

export class PadreFamilia extends Usuario {
    private hijosId: number[] = [];
    private domicilio: string;

    constructor(
        id: number,
        nombre: string,
        correo: string,
        telefono: string,
        contrasena: string,
        domicilio: string
    ) {
        super(id, nombre, correo, telefono, contrasena, 'Padre_familia');
        this.domicilio = domicilio;
    }

    public consultarCalificaciones(estudianteId: number): void {
        console.log(`Consultando calificaciones para el estudiante con ID: ${estudianteId}`);
        // Implementación pendiente
    }

    public actualizarDatos(nombre: string, telefono: string, correo: string): void {
        super.actualizarDatos(nombre, telefono, correo);
    }

    public asignarHijo(hijoId: number): void {
        this.hijosId.push(hijoId);
        console.log(`Hijo asignado: ${hijoId}`); // Solo para prueba
    }

    public obtenerHijos(): number[] {
        return this.hijosId;
    }

    public obtenerInfo(): infoPadreFamilia {
        const info = super.obtenerInfo();
        return {
            ...info,
            hijosId: this.hijosId,
            domicilio: this.domicilio
        };
    }
}

type infoPadreFamilia = infoUsuario & {
    hijosId: number[];
    domicilio: string;
};