interface MaterialProfesor {
  agregarMaterial(datos: {
    titulo: string
    descripcion: string
    categoria: string
    existencia: boolean
    tipoArchivo: string
    fecha: string
    //es necesario tambien poner los archivos
    archivos: File[]
  }): Promise<void>
  modificarMaterial(): boolean
  eliminarMaterial(): boolean
  solicitarReporte(): void
}
