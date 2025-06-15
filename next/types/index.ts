// Definición de interfaces y tipos para el sistema de administración escolar

export interface Usuario {
  id: string
  nombre: string
  email: string
  password: string
  tipo: "administrador" | "profesor" | "secretaria" | "padre"
  fechaCreacion: Date
  activo: boolean
}

export interface Estudiante {
  id: string
  nombre: string
  apellidos: string
  fechaNacimiento: Date
  grado: string
  grupo: string
  padreId: string
  activo: boolean
  fechaInscripcion: Date
}

export interface Profesor extends Usuario {
  materias: string[]
  grupos: string[]
}

export interface Administrador extends Usuario {
  permisos: string[]
}

export interface PadreFamilia extends Usuario {
  hijos: string[]
  telefono: string
  direccion: string
}

export interface PersonalSecretaria extends Usuario {
  departamento: string
}

export interface Materia {
  id: string
  nombre: string
  descripcion: string
  grado: string
  profesorId: string
}

export interface Grupo {
  id: string
  nombre: string
  grado: string
  estudiantes: string[]
  profesorTitular: string
}

export interface Calificacion {
  id: string
  estudianteId: string
  materiaId: string
  valor: number
  periodo: string
  fecha: Date
  profesorId: string
}

export interface MaterialEducativo {
  id: string
  titulo: string
  descripcion: string
  tipo: "libro" | "documento" | "video" | "presentacion"
  materiaId: string
  url?: string
  fechaSubida: Date
}

export interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  tipo: "info" | "warning" | "error" | "success"
  destinatarios: string[]
  fecha: Date
  leida: boolean
}

export interface Reporte {
  id: string
  tipo: "calificaciones" | "asistencia" | "estudiantes" | "general"
  titulo: string
  datos: any
  fechaGeneracion: Date
  generadoPor: string
}

export interface SesionUsuario {
  usuarioId: string
  token: string
  fechaInicio: Date
  activa: boolean
}

export interface Pago {
  id: string
  estudianteId: string
  concepto: string
  monto: number
  fecha: Date
  estado: "pendiente" | "pagado" | "vencido"
}

export interface Inscripcion {
  id: string
  estudianteId: string
  cicloEscolar: string
  fecha: Date
  estado: "activa" | "cancelada"
  pagos: string[]
}

// Añadir el tipo Asistencia
export interface Asistencia {
  id: string
  estudianteId: string
  materiaId: string
  porcentaje: number
  fecha: Date
  profesorId: string
  observaciones?: string
}
