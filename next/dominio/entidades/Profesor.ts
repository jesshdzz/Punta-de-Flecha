import { Usuario } from './Usuario'
import { Sistema } from './Sistema'
import { MaterialEducativo } from './MaterialEducativo'
import { Numerals } from 'react-day-picker'
import { ServicioNube } from './ServicioNube'

export class Profesor extends Usuario implements MaterialProfesor {
  constructor(
    id: number,
    nombre: string,
    correo: string,
    telefono: string,
    contrasena: string
  ) {
    super(id, nombre, correo, telefono, contrasena, 'Profesor')
  }

  public asignarCalificacion(estudianteID: number, valor: number): boolean {
    if (valor >= 0 && valor <= 10) {
      console.log(`Calificación de ${valor} al estudiante con ID ${estudianteID}`)
      return true
    }
    return false
  }

  public async agregarMaterial(datos: {
    titulo: string
    descripcion: string
    categoria: string
    //existencia: boolean
    tipoArchivo: string
    fecha: string
   // profesorId: number
    archivos: File[]
  }): Promise<void> {
    try {

      const idProfesor = this.getId(); //lo obtenemos de usuario

      console.log("El Id del profesor es: ", idProfesor); 
      //validar para no tener errores
      if (!idProfesor) throw new Error("ID del profesor no definido");

      //Cramos primero el material con existencia en false
      const material = new MaterialEducativo(
        null,
        datos.titulo,
        idProfesor, 
        new Date(datos.fecha),
        datos.descripcion,
        datos.categoria,
        false,
        datos.tipoArchivo
      );
      

      const idMaterialCreado = await Sistema.getInstancia().agregarMaterial(material);

      console.log("Material creado con ID: ",idMaterialCreado);

      //ahora la nube
      const servicioNube = ServicioNube.getInstancia();

      const archivoSubido = datos.archivos.map((archivo, index) => ({
        //que datos necesitamos?
        
        nombreArchivo: archivo.name,
        urlNube: servicioNube.generarUrlSimulada(
          idMaterialCreado,
          datos.titulo,
          datos.tipoArchivo
        ),
      }));

      //Guardamos las urls de los archivos
      await Sistema.getInstancia().agregarArchivosMaterial(idMaterialCreado, archivoSubido)

      await Sistema.getInstancia().actualizarExistenciaMaterial(idMaterialCreado)

      console.log('Material educativo agregado correctamente.')
    } catch (error) {
      console.error('Error al subir Material Educativo:', error)
      throw error
    }
  }

  modificarMaterial(): boolean {
    console.log("Profesor modificó material.");
    return true
  }

  eliminarMaterial(): boolean {
    console.log("Profesor eliminó material.");
    return true
  }

  solicitarReporte(): void {
    console.log("Profesor solicitó un reporte.");
  }
}
