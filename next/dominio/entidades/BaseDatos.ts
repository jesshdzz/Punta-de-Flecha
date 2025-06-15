import { Estudiante } from "./Estudiante";
import { Inscripcion } from "./Inscripcion";
import { Pago } from "./Pago";
import { Recibo } from "./Recibo";
import { Tramite } from "./Tramite";
import prisma from "@/lib/prisma"

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

        const usuario = await prisma.usuario.create({
            data: {
                nombre: estudiante.getNombre(),
                correo: estudiante.getCorreo(),
                telefono: estudiante.getTelefono(),
                contrasena: estudiante.getContrasena(),
                puesto: 'Estudiante'
            }
        })

        const Estudiante = await prisma.estudiante.create({
            data: {
                usuarioId: usuario.id,
                grupoId: estudiante.getGrupoId() ?? null
            }
        })

        estudiante.setId(Estudiante.id);
        return true;
    }

    public async guardarInscripcion(inscripcion: Inscripcion): Promise<boolean> {
        const tramite = await prisma.tramite.create({
            data: {
                estudianteId: inscripcion.getEstudianteId(),
                tipo: inscripcion.getTipo(),
                estado: inscripcion.getEstado(),
            }
        })

        await prisma.inscripcion.create({
            data: {
                tramiteId: tramite.id,
                grupoId: inscripcion.getGrupoId(),
            }
        })

        inscripcion.setId(tramite.id);
        return true;
    }

    public async actualizarTramite(tramite: Tramite): Promise<void> {
        await prisma.tramite.update({
            where: { id: tramite.getId()! },
            data: {
                estado: tramite.getEstado(),
                fecha: tramite.getFecha(),
            }
        })
    }

    public async guardarPago(pago: Pago): Promise<boolean> {
        const tramite = await prisma.tramite.create({
            data: {
                estudianteId: pago.getEstudianteId(),
                tipo: pago.getTipo(),
                estado: pago.getEstado(),
                fecha: pago.getFecha(),
            }
        })

        await prisma.pago.create({
            data: {
                tramiteId: tramite.id,
                concepto: pago.getConcepto(),
                monto: pago.getMonto(),
            }
        })

        pago.setId(tramite.id);
        return true;
    }

    public async guardarRecibo(recibo: Recibo): Promise<boolean> {
        await prisma.recibo.create({
            data: {
                pagoId: recibo.getPagoId(),
                monto: recibo.getMonto(),
                fecha: recibo.getFecha(),
            }
        })

        return true;
    }
}