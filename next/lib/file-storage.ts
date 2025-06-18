// Sistema de almacenamiento de archivos en localStorage
export class FileStorage {
  private static readonly STORAGE_KEY = "school_files"

  public static guardarArchivo(archivo: File, materialId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        try {
          const archivoData = {
            id: materialId,
            nombre: archivo.name,
            tipo: archivo.type,
            tamaño: archivo.size,
            contenido: reader.result as string,
            fechaSubida: new Date().toISOString(),
          }

          const archivosExistentes = this.obtenerTodosArchivos()
          archivosExistentes[materialId] = archivoData

          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(archivosExistentes))
          resolve(materialId)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(archivo)
    })
  }

  public static obtenerArchivo(materialId: string) {
    const archivos = this.obtenerTodosArchivos()
    return archivos[materialId] || null
  }

  public static obtenerTodosArchivos(): Record<string, any> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  }

  public static eliminarArchivo(materialId: string): boolean {
    try {
      const archivos = this.obtenerTodosArchivos()
      delete archivos[materialId]
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(archivos))
      return true
    } catch {
      return false
    }
  }

  public static descargarArchivo(materialId: string): boolean {
    try {
      const archivo = this.obtenerArchivo(materialId)
      if (!archivo) return false

      const link = document.createElement("a")
      link.href = archivo.contenido
      link.download = archivo.nombre
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return true
    } catch {
      return false
    }
  }

  public static previsualizarArchivo(materialId: string): boolean {
    try {
      const archivo = this.obtenerArchivo(materialId)
      if (!archivo) return false

      // Para PDFs y algunos documentos, abrir en nueva ventana
      if (archivo.tipo === "application/pdf") {
        const newWindow = window.open()
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>${archivo.nombre}</title></head>
              <body style="margin:0;">
                <embed src="${archivo.contenido}" width="100%" height="100%" type="application/pdf">
              </body>
            </html>
          `)
        }
        return true
      }

      // Para otros tipos, descargar directamente
      return this.descargarArchivo(materialId)
    } catch {
      return false
    }
  }
}
