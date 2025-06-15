import  { Usuario} from './Usuario'

export class Profesor extends Usuario{

    constructor(
        id: number,
        nombre: string,
        correo: string,
        telefono: string,
        contrasena:string,
    ){
        super(id, nombre, correo, telefono, contrasena, 'PROFESOR')
    }
    public asignarCalificacion(estudianteID:  number, valor: number): boolean {
        if(valor >= 0 && valor <= 10){
            //ejemplito
            console.log(`Calificacion de ${valor} al estudiante con ID ${estudianteID}`)
            return true
        }
        return false
    }

    //podemos hacer una lista de estudiantes 

}