"use client"

import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export default function ReportesMaterialesPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="shadow-lg navbar bg-base-100">
        <div className="flex-1">
          <Link href="/reportes" className="btn btn-ghost">
            <ArrowLeft className="w-4 h-4" />
            Volver a Reportes
          </Link>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 mb-2 text-3xl font-bold text-base-content">
            <FileText className="w-8 h-8" />
            Reportes de Materiales
          </h1>
          <p className="text-base-content/70">Estadísticas de uso y distribución de materiales educativos</p>
        </div>

        <div className="text-center">
          <p className="text-lg text-base-content/70">Esta sección estará disponible próximamente</p>
        </div>
      </div>
    </div>
  )
}
