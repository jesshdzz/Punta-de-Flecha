export type RolUsuario = 'Administrador' | 'Profesor' | 'Estudiante' | 'Padre_familia' | 'Secretaria'

export abstract class Usuario {
    constructor(
        private id: number | null, // El ID puede ser null si es un nuevo usuario
        private nombre: string,
        private correo: string,
        private telefono: string,
        private contrasena: string,
        private puesto: RolUsuario,
        private readonly fechaCreacion: Date = new Date() // Fecha de creación del usuario
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

    public getRol(): RolUsuario { // prueba
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
    public getPuesto(): RolUsuario {
        return this.puesto
    }
    public getFechaCreacion(): Date {
        return this.fechaCreacion;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public obtenerInfo(): infoUsuario {
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