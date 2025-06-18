interface MaterialProfesor {
  agregarMaterial(datos: {
    titulo: string
    descripcion: string
    categoria: string
    existencia: boolean
    tipoArchivo: string
    fecha: string
    archivos: File[]
    grupoId: number
  }): Promise<void>
  modificarMaterial(): boolean
  eliminarMaterial(): boolean
  solicitarReporte(): void
}
