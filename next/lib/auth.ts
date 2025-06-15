// Sistema de autenticación y gestión de sesiones
import type { Usuario, SesionUsuario } from "@/types"
import { BaseDatos } from "./database"

export class SistemaAutenticacion {
  private static readonly SESION_KEY = "school_session"

  public static async iniciarSesion(
    email: string,
    password: string,
  ): Promise<{ success: boolean; usuario?: Usuario; error?: string }> {
    const db = BaseDatos.getInstance()
    const usuarios = db.obtenerTodosUsuarios()

    const usuario = usuarios.find((u) => u.email === email && u.password === password && u.activo)

    if (!usuario) {
      return { success: false, error: "Credenciales inválidas" }
    }

    const sesion: SesionUsuario = {
      usuarioId: usuario.id,
      token: this.generarToken(),
      fechaInicio: new Date(),
      activa: true,
    }

    // Guardar sesión en localStorage
    localStorage.setItem(this.SESION_KEY, JSON.stringify(sesion))

    return { success: true, usuario }
  }

  public static cerrarSesion(): void {
    localStorage.removeItem(this.SESION_KEY)
  }

  public static obtenerSesionActual(): SesionUsuario | null {
    try {
      const sesionData = localStorage.getItem(this.SESION_KEY)
      if (!sesionData) return null

      const sesion: SesionUsuario = JSON.parse(sesionData)
      return sesion.activa ? sesion : null
    } catch {
      return null
    }
  }

  public static obtenerUsuarioActual(): Usuario | null {
    const sesion = this.obtenerSesionActual()
    if (!sesion) return null

    const db = BaseDatos.getInstance()
    return db.obtenerUsuario(sesion.usuarioId) || null
  }

  public static estaAutenticado(): boolean {
    return this.obtenerSesionActual() !== null
  }

  public static tienePermiso(tipoUsuario: string, accion: string): boolean {
    // Actualización de permisos según los nuevos requerimientos
    const permisos = {
      administrador: ["all", "modificar_usuario", "eliminar_usuario", "modificar_alumno", "eliminar_alumno"],
      profesor: ["subir_calificaciones", "subir_asistencia", "subir_material", "ver_estudiantes"],
      secretaria: [
        "alta_estudiante",
        "modificar_estudiante",
        "eliminar_estudiante",
        "generar_reportes",
        "enviar_solicitudes",
        "ver_estudiantes",
      ],
      padre: ["ver_calificaciones_hijo", "ver_notificaciones"],
      estudiante: ["ver_material", "ver_calificaciones_propias", "ver_notificaciones"],
    }

    const permisosUsuario = permisos[tipoUsuario as keyof typeof permisos] || []
    return permisosUsuario.includes("all") || permisosUsuario.includes(accion)
  }

  private static generarToken(): string {
    return "token_" + Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9)
  }
}
