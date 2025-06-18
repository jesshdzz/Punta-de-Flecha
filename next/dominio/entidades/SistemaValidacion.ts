import { Documento } from "./Documento";
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

    public validarDocumentos(docs: Documento[]): boolean {
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
        return true;
    }

    public validarDomicilio(domicilio: string): boolean {
        if (domicilio.length < 10) {
            throw new Error("El domicilio debe tener al menos 10 caracteres.");
        }
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
        contrasena?: string;
        domicilio?: string;
        grupoId?: number;
    }): boolean {
        try {
            this.validarCamposRequeridos(datos); // validar los campos obligatorios del formulario

            this.validarCorreo(datos.correo);
            this.validarTelefono(datos.telefono);
            
            if (datos.grupoId) this.validarGrupo(datos.grupoId);
            if (datos.contrasena) this.validarContrasena(datos.contrasena);
            if (datos.domicilio) this.validarDomicilio(datos.domicilio);

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
  
    public validarActualizacionDatos(datos: {
        estudianteId: number;
        nombre?: string;
        correo?: string;
        telefono?: string;
        contrasena?: string;
        grupoId?: number;
       // gradoId?: string;
        reinscribir?: boolean;
        montoReinscripcion?: number;
      }): boolean {
        // 1. El ID siempre obligatorio
        if (!datos.estudianteId || datos.estudianteId <= 0) {
          throw new Error("El ID del estudiante es obligatorio y debe ser válido.");
        }
      
        // 2. Validaciones puntuales de opcionales
        if (datos.correo)        this.validarCorreo(datos.correo);
        if (datos.telefono)      this.validarTelefono(datos.telefono);
        if (datos.contrasena)    this.validarContrasena(datos.contrasena);
        if (datos.grupoId)       this.validarGrupo(datos.grupoId);
        //if (datos.gradoId)       this.validarGrado(datos.gradoId);
      
        // 3. Si se está reinscribiendo, monto obligatorio y válido
        if (datos.reinscribir) {
          if (datos.montoReinscripcion == null) {
            throw new Error("El monto de reinscripción es obligatorio al reinscribir.");
          }
          this.validarPago(datos.montoReinscripcion);
        }
      
        return true;
      }

    //Validar Material Educativo
    public validarMaterial(datos: {
        titulo: string;
        descripcion: string;
        categoria: string;
        }): void {
        const { titulo, descripcion, categoria } = datos;

        // Validar que existan
        if (!titulo || titulo.trim() === '') {
            throw new Error("El título del material es obligatorio.");
        }

        if (!descripcion || descripcion.trim() === '') {
            throw new Error("La descripción del material es obligatoria.");
        }

        if (!categoria || categoria.trim() === '') {
            throw new Error("La categoría del material es obligatoria.");
        }

        if (titulo.length < 5) {
            throw new Error("El título debe tener al menos 5 caracteres.");
        }

        if (descripcion.length < 10) {
            throw new Error("La descripción debe tener al menos 10 caracteres.");
        }

        const categoriasPermitidas = ['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Otro'];
        if (!categoriasPermitidas.includes(categoria)) {
            throw new Error(`Categoría no válida. Las opciones válidas son: ${categoriasPermitidas.join(', ')}`);
        }

        console.log("Validación de material educativa exitosa.");
        }

    public validarExtensionesArchivos(archivos: File[]) {
        const extensionesPermitidas = ['pdf', 'docx', 'pptx', 'jpg', 'png', 'mp4']; // ejemplo
        for (const archivo of archivos) {
        const extension = archivo.name.substring(archivo.name.lastIndexOf('.') + 1).toLowerCase();
        if (!extensionesPermitidas.includes(extension)) {
            throw new Error(`Archivo no permitido: ${archivo.name} (extensión .${extension})`);
      }
    }
  }
}