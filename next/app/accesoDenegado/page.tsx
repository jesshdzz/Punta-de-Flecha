import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"

export default function AccesoDenegadoPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="text-center">
                <div className="mb-8">
                    <Shield className="w-24 h-24 mx-auto text-error" />
                </div>

                <h1 className="mb-4 text-4xl font-bold text-base-content">Acceso Denegado</h1>

                <p className="mb-8 text-lg text-base-content/70">No tienes permisos para acceder a esta página.</p>

                <div className="space-y-4">
                    <Link href="/dashboard" className="btn btn-primary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Dashboard
                    </Link>

                    <div className="divider">O</div>

                    <Link href="/login" className="btn btn-outline">
                        Iniciar Sesión con Otra Cuenta
                    </Link>
                </div>
            </div>
        </div>
    )
}
