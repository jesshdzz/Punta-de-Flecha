export type RolUsuario = 'ADMINISTRADOR' | 'PROFESOR' | 'ESTUDIANTE' | 'PADRE_FAMILIA' | 'SECRETARIA'

export class Usuario {
    constructor(
        private readonly id: number,
        private nombre: string,
        private correo: string,
        private telefono: string,
        private contrasena: string,
        private puesto: RolUsuario
    ) { }

    public actualizarDatos(nombre: string, telefono: string, correo: string): void {
        this.nombre = nombre
        this.correo = correo
        this.telefono = telefono
        console.log(`Datos actualizados: ${this.nombre}, ${this.correo}, ${this.telefono}`) //nomas de prueba
    }

    public solicitarDatos(): void {

    }

    public guardarUsuario(): void {

    }

    public borrarUsuario(): void {

    }

    public enviarNotificacion(mensaje: string): void {
        console.log(`Notificación enviada a ${this.correo}: ${mensaje}`) //nomas de prueba
    }

    public verificarCredenciales(correo: string, contrasena: string): boolean { // prueba
        return this.correo === correo && this.contrasena === contrasena
    }

    public obtenerRol(): RolUsuario { // prueba
        return this.puesto
    }

    public obtenerInfo(): infoUsuario {  // prueba
        return {
            id: this.id,
            nombre: this.nombre,
            correo: this.correo,
            telefono: this.telefono,
            puesto: this.puesto,
        }
    }
}


export type infoUsuario = {
    id: number;
    nombre: string;
    correo: string;
    telefono: string;
    puesto: RolUsuario;
}