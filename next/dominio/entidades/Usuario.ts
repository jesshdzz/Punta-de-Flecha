export type RolUsuario = 'ADMINISTRADOR' | 'PROFESOR' | 'ESTUDIANTE' | 'PADRE_FAMILIA' | 'SECRETARIA'

export class Usuario {
  constructor(
    private readonly id: number,
    private nombre: string,
    private correo: string,
    private telefono: string,
    private contrasena: string,
    private puesto: RolUsuario
  ) {}

  public actualizarDatos(nombre: string, telefono: string): void {
    this.nombre = nombre
    this.telefono = telefono
  }

  public verificarCredenciales(correo: string, contrasena: string): boolean {
    return this.correo === correo && this.contrasena === contrasena
  }

  public obtenerRol(): RolUsuario {
    return this.puesto
  }

  public obtenerInfo(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      correo: this.correo,
      telefono: this.telefono,
      puesto: this.puesto,
    }
  }
}
