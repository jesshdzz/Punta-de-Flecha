import { Estudiante } from "./Estudiante";
import { Inscripcion } from "./Inscripcion";
import { Pago } from "./Pago";
import { Recibo } from "./Recibo";
import { Tramite } from "./Tramite";
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export class BaseDatos {
    private static instancia: BaseDatos

    constructor() { }

    public static getInstancia(): BaseDatos {
        if (!BaseDatos.instancia) {
            BaseDatos.instancia = new BaseDatos();
        }
        return BaseDatos.instancia;
    }

    public async guardarEstudiante(estudiante: Estudiante): Promise<boolean> {
        const existente = await prisma.usuario.findUnique({ where: { correo: estudiante.getCorreo() } })
        if (existente) throw new Error('El correo ya está registrado.')

        const usuario = await prisma.Usuario.create({
            data: {
                nombre: estudiante.getNombre(),
                correo: estudiante.getCorreo(),
                telefono: estudiante.getTelefono(),
                contrasena: estudiante.getContrasena(),
                rol: 'ESTUDIANTE'
            }
        })

        const Estudiante = await prisma.Estudiante.create({
            data: {
                id: usuario.id,
                grupoId: estudiante.getGrupoId() ?? null
            }
        })

        estudiante.setId(Estudiante.id);
        return true;
    }

    public async guardarInscripcion(inscripcion: Inscripcion): Promise<boolean> {
        const tramite = await prisma.Tramite.create({
            data: {
                tipo: 'inscripción',
                estado: 'pendiente',
            }
        })

        await prisma.Inscripcion.create({
            data: {
                id: tramite.id,
                estudianteId: inscripcion.getEstudianteId(),
                grupoId: inscripcion.getGrupoId(),
            }
        })

        inscripcion.setId(tramite.id);
        return true;
    }

    public async actualizarTramite(tramite: Tramite): Promise<void> {
        await prisma.Tramite.update({
            where: { id: tramite.getId()! },
            data: {
                estado: tramite.getEstado(),
                fecha: tramite.getFecha(),
            }
        })
    }

    public async guardarPago(pago: Pago): Promise<boolean> {
        const tramite = await prisma.Tramite.create({
            data: {
                estudianteId: pago.getEstudianteId(),
                tipo: 'pago',
                estado: pago.getEstado(),
                fecha: pago.getFecha(),
            }
        })

        await prisma.Pago.create({
            data: {
                id: tramite.id,
                estudianteId: pago.getEstudianteId(),
                monto: pago.getMonto(),
                fecha: pago.getFecha(),
                estado: pago.getEstado(),
            }
        })

        pago.setId(tramite.id);
        return true;
    }

    public async guardarRecibo(recibo: Recibo): Promise<boolean> {
        await prisma.Recibo.create({
            data: {
                id: recibo.getId()!,
                pagoId: recibo.getPagoId(),
                fecha: recibo.getFecha(),
            }
        })

        return true;
    }
}