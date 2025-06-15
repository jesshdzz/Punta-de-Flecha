// Sistema de validación para el sistema escolar
export class SistemaValidacion {
  public static validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  public static validarPassword(password: string): boolean {
    return password.length >= 6
  }

  public static validarNombre(nombre: string): boolean {
    return nombre.trim().length >= 2
  }

  public static validarCalificacion(calificacion: number): boolean {
    return calificacion >= 0 && calificacion <= 10
  }

  public static validarFechaNacimiento(fecha: Date): boolean {
    const hoy = new Date()
    const edad = hoy.getFullYear() - fecha.getFullYear()
    return edad >= 5 && edad <= 18
  }

  public static validarGrado(grado: string): boolean {
    const gradosValidos = ["1°", "2°", "3°"]
    return gradosValidos.includes(grado)
  }
}
