import { Docuemento } from "./Documento";
import { MaterialEducativo } from "./MaterialEducativo";

export class SistemaValidacion {
    private static instance: SistemaValidacion;

    private constructor() { }

    public static getInstancia(): SistemaValidacion {
        if (!SistemaValidacion.instance) {
            SistemaValidacion.instance = new SistemaValidacion();
        }
        return SistemaValidacion.instance;
    }

    public validarDocumento(doc: Docuemento): boolean {
        // Aquí se implementa la lógica de validación del documento
        // Por simplicidad, asumimos que todos los documentos son válidos
        console.log(`Documento ${doc.getNombre()} validado correctamente.`);
        return true;
    }

    public validarCorreo(correo: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(correo)) {
            throw new Error("El correo electrónico no es válido.");
        }
        return true;
    }

    public validarTelefono(telefono: string): boolean {
        const regex = /^\d{10}$/; // Asumiendo un formato de 10 dígitos
        if (!regex.test(telefono)) {
            throw new Error("El número de teléfono no es válido. Debe tener 10 dígitos.");
        }
        return true;
    }

    public validarContrasena(contrasena: string): boolean {
        if (contrasena.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/; // Al menos una minúscula, una mayúscula y un dígito
        if (!regex.test(contrasena)) {
            throw new Error("La contraseña debe contener al menos una letra mayúscula, una minúscula y un dígito.");
        }
        return true;
    }

    public validarGrupo(grupoId: number): boolean {
        if (grupoId <= 0) {
            throw new Error("El ID del grupo debe ser un número positivo.");
        }
        // Aquí se podría agregar lógica adicional para verificar si el grupo existe en la base de datos
        return true;
    }

    public validarCamposRequeridos(datos: Record<string, unknown>): boolean {
        for (const dato in datos) {
            if (!datos[dato]) {
                throw new Error(`El campo ${dato} es obligatorio.`);
            }
        }

        return true;
    }

    public validarDatosUsuario(datos: {
        nombre: string;
        correo: string;
        telefono: string;
        contrasena: string;
        grupoId: number;
    }): boolean {
        try {
            this.validarCamposRequeridos(datos);
            this.validarGrupo(datos.grupoId);
            this.validarCorreo(datos.correo);
            this.validarTelefono(datos.telefono);
            this.validarContrasena(datos.contrasena);

            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error desconocido al validar los datos del usuario.");
        }
    }

    public validarPago(monto: number): boolean {
        if (monto <= 0) {
            throw new Error("El monto del pago debe ser mayor a cero.");
        }
        return true;
    }





    //Validar Material Educativo
    public validarMaterial(material: MaterialEducativo): void {
        if (!material.getTitulo() || material.getTitulo().trim().length < 5){
            throw new Error("El título del material es inválido.");
        }

        if (!material.getDescripcion() || material.getDescripcion().trim().length < 10){
            throw new Error("La descripción debe tener al menos 10 caracteres.");
        }

        if(!material.getCategoria()){
            throw new Error("Debe especificarse una categoría.");
        }

        if (!(material.getFecha() instanceof Date)) {
            throw new Error("La fecha es inválida.");
        }

        if(typeof material.getExistencia() !== 'boolean'){
            throw new Error("El campo 'existencia' debe ser booleano.");
        }
        const tiposPermitidos = ['pdf', 'docx', 'pptx', 'mp4'];

        if (!tiposPermitidos.includes(material.getTipoArchivo().toLowerCase())) {
            throw new Error("Tipo de archivo no permitido.");
        }

        console.log("Material educativo validado correctamente."); // Solo para prueba
    
    }
}