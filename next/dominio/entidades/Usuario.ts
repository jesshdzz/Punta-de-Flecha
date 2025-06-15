export type RolUsuario = 'ADMINISTRADOR' | 'PROFESOR' | 'ESTUDIANTE' | 'PADRE_FAMILIA' | 'SECRETARIA'

export class Usuario {
    constructor(
        protected id: number | null, // El ID puede ser null si es un nuevo usuario
        protected nombre: string,
        protected correo: string,
        protected telefono: string,
        protected contrasena: string,
        protected puesto: RolUsuario
    ) {
        console.log(`Usuario creado: ${this.nombre}, ID: ${this.id}`) // Solo para prueba
    }

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

    public getId(): number | null {
        return this.id;
    }

    public getCorreo(): string {
        return this.correo
    }
    public getNombre(): string {
        return this.nombre
    }
    public getTelefono(): string {
        return this.telefono
    }
    public getContrasena(): string {
        return this.contrasena
    }

    public setId(id: number): void {
        this.id = id;
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
    id: number | null; // El ID puede ser null si es un nuevo usuario
    nombre: string;
    correo: string;
    telefono: string;
    puesto: RolUsuario;
}