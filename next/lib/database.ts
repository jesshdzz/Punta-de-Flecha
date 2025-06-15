// Simulación de base de datos en memoria - ACTUALIZADA con usuarios de prueba
import type {
  Usuario,
  Estudiante,
  Profesor,
  Administrador,
  PadreFamilia,
  PersonalSecretaria,
  Materia,
  Grupo,
  Calificacion,
  MaterialEducativo,
  Notificacion,
  Reporte,
  SesionUsuario,
  Pago,
  Inscripcion,
  Asistencia,
} from "@/types"

export class BaseDatos {
  private static instance: BaseDatos

  private usuarios: Map<string, Usuario> = new Map()
  private estudiantes: Map<string, Estudiante> = new Map()
  private materias: Map<string, Materia> = new Map()
  private grupos: Map<string, Grupo> = new Map()
  private calificaciones: Map<string, Calificacion> = new Map()
  private materialesEducativos: Map<string, MaterialEducativo> = new Map()
  private notificaciones: Map<string, Notificacion> = new Map()
  private reportes: Map<string, Reporte> = new Map()
  private sesiones: Map<string, SesionUsuario> = new Map()
  private pagos: Map<string, Pago> = new Map()
  private inscripciones: Map<string, Inscripcion> = new Map()
  private asistencias: Map<string, Asistencia> = new Map()

  private constructor() {
    this.inicializarDatos()
  }

  public static getInstance(): BaseDatos {
    if (!BaseDatos.instance) {
      BaseDatos.instance = new BaseDatos()
    }
    return BaseDatos.instance
  }

  private inicializarDatos() {
    // Usuarios de prueba para cada tipo
    const adminUser: Administrador = {
      id: "1",
      nombre: "Administrador Principal",
      email: "admin@escuela.com",
      password: "admin123",
      tipo: "administrador",
      fechaCreacion: new Date(),
      activo: true,
      permisos: ["all"],
    }

    const profesor: Profesor = {
      id: "2",
      nombre: "Juan Pérez",
      email: "juan@escuela.com",
      password: "prof123",
      tipo: "profesor",
      fechaCreacion: new Date(),
      activo: true,
      materias: ["mat1", "mat2"],
      grupos: ["grupo1"],
    }

    const secretaria: PersonalSecretaria = {
      id: "3",
      nombre: "María García",
      email: "secretaria@escuela.com",
      password: "sec123",
      tipo: "secretaria",
      fechaCreacion: new Date(),
      activo: true,
      departamento: "Administración",
    }

    const padre: PadreFamilia = {
      id: "4",
      nombre: "Carlos López",
      email: "padre@escuela.com",
      password: "padre123",
      tipo: "padre",
      fechaCreacion: new Date(),
      activo: true,
      hijos: ["est1"],
      telefono: "555-1234",
      direccion: "Calle Principal 123",
    }

    const estudiante: Usuario = {
      id: "5",
      nombre: "Ana López",
      email: "estudiante@escuela.com",
      password: "est123",
      tipo: "estudiante",
      fechaCreacion: new Date(),
      activo: true,
    }

    this.usuarios.set("1", adminUser)
    this.usuarios.set("2", profesor)
    this.usuarios.set("3", secretaria)
    this.usuarios.set("4", padre)
    this.usuarios.set("5", estudiante)

    // Estudiantes de ejemplo
    const estudiante1: Estudiante = {
      id: "est1",
      nombre: "María",
      apellidos: "González López",
      fechaNacimiento: new Date("2010-05-15"),
      grado: "1°",
      grupo: "A",
      padreId: "4",
      activo: true,
      fechaInscripcion: new Date(),
    }

    this.estudiantes.set("est1", estudiante1)

    // Materias de ejemplo
    const materia1: Materia = {
      id: "mat1",
      nombre: "Matemáticas",
      descripcion: "Matemáticas básicas",
      grado: "1°",
      profesorId: "2",
    }

    const materia2: Materia = {
      id: "mat2",
      nombre: "Álgebra",
      descripcion: "Álgebra básica",
      grado: "2°",
      profesorId: "2",
    }

    this.materias.set("mat1", materia1)
    this.materias.set("mat2", materia2)
  }

  // Métodos CRUD para Usuarios
  public crearUsuario(usuario: Usuario): boolean {
    if (this.usuarios.has(usuario.id)) {
      return false
    }
    this.usuarios.set(usuario.id, usuario)
    return true
  }

  public obtenerUsuario(id: string): Usuario | undefined {
    return this.usuarios.get(id)
  }

  public obtenerTodosUsuarios(): Usuario[] {
    return Array.from(this.usuarios.values())
  }

  public actualizarUsuario(id: string, usuario: Partial<Usuario>): boolean {
    const existente = this.usuarios.get(id)
    if (!existente) return false

    this.usuarios.set(id, { ...existente, ...usuario })
    return true
  }

  public eliminarUsuario(id: string): boolean {
    return this.usuarios.delete(id)
  }

  // Métodos CRUD para Estudiantes
  public crearEstudiante(estudiante: Estudiante): boolean {
    if (this.estudiantes.has(estudiante.id)) {
      return false
    }
    this.estudiantes.set(estudiante.id, estudiante)
    return true
  }

  public obtenerEstudiante(id: string): Estudiante | undefined {
    return this.estudiantes.get(id)
  }

  public obtenerTodosEstudiantes(): Estudiante[] {
    return Array.from(this.estudiantes.values())
  }

  public actualizarEstudiante(id: string, estudiante: Partial<Estudiante>): boolean {
    const existente = this.estudiantes.get(id)
    if (!existente) return false

    this.estudiantes.set(id, { ...existente, ...estudiante })
    return true
  }

  public eliminarEstudiante(id: string): boolean {
    return this.estudiantes.delete(id)
  }

  // Métodos para Materiales Educativos
  public crearMaterialEducativo(material: MaterialEducativo): boolean {
    this.materialesEducativos.set(material.id, material)
    return true
  }

  public obtenerMaterialesEducativos(): MaterialEducativo[] {
    return Array.from(this.materialesEducativos.values())
  }

  // Métodos para Calificaciones
  public crearCalificacion(calificacion: Calificacion): boolean {
    // Verificar si ya existe una calificación para el mismo estudiante, materia y periodo
    const calificacionExistente = Array.from(this.calificaciones.values()).find(
      (cal) =>
        cal.estudianteId === calificacion.estudianteId &&
        cal.materiaId === calificacion.materiaId &&
        cal.periodo === calificacion.periodo,
    )

    if (calificacionExistente) {
      // Si ya existe, actualizamos en lugar de crear una nueva
      calificacionExistente.valor = calificacion.valor
      calificacionExistente.fecha = new Date()
      this.calificaciones.set(calificacionExistente.id, calificacionExistente)
      return true
    }

    // Si no existe, creamos una nueva
    this.calificaciones.set(calificacion.id, calificacion)
    return true
  }

  public obtenerCalificaciones(): Calificacion[] {
    return Array.from(this.calificaciones.values())
  }

  public obtenerCalificacionesPorEstudiante(estudianteId: string): Calificacion[] {
    return Array.from(this.calificaciones.values()).filter((cal) => cal.estudianteId === estudianteId)
  }

  // Métodos para Reportes
  public crearReporte(reporte: Reporte): boolean {
    this.reportes.set(reporte.id, reporte)
    return true
  }

  public obtenerReportes(): Reporte[] {
    return Array.from(this.reportes.values())
  }

  public obtenerMaterias(): Materia[] {
    return Array.from(this.materias.values())
  }

  // Métodos para Asistencias
  public crearAsistencia(asistencia: Asistencia): boolean {
    // Verificar si ya existe una asistencia para el mismo estudiante, materia y fecha
    const asistenciaExistente = Array.from(this.asistencias.values()).find(
      (a) =>
        a.estudianteId === asistencia.estudianteId &&
        a.materiaId === asistencia.materiaId &&
        a.fecha.toDateString() === asistencia.fecha.toDateString(),
    )

    if (asistenciaExistente) {
      // Si ya existe, actualizamos en lugar de crear una nueva
      asistenciaExistente.porcentaje = asistencia.porcentaje
      this.asistencias.set(asistenciaExistente.id, asistenciaExistente)
      return true
    }

    // Si no existe, creamos una nueva
    this.asistencias.set(asistencia.id, asistencia)
    return true
  }

  public obtenerAsistencias(): Asistencia[] {
    return Array.from(this.asistencias.values())
  }

  public obtenerAsistenciasPorEstudiante(estudianteId: string): Asistencia[] {
    return Array.from(this.asistencias.values()).filter((a) => a.estudianteId === estudianteId)
  }
}
