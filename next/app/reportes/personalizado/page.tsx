"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Download } from "lucide-react"

export default function ReportePersonalizadoPage() {
  const [reportConfig, setReportConfig] = useState({
    tipo: "",
    fechaInicio: "",
    fechaFin: "",
    grupo: "",
    materia: "",
    incluirCalificaciones: false,
    incluirAsistencias: false,
    incluirMateriales: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate custom report logic here
    console.log("Generating custom report with config:", reportConfig)
  }

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
            Reporte Personalizado
          </h1>
          <p className="text-base-content/70">Configura y genera reportes según tus necesidades específicas</p>
        </div>

        <div className="max-w-2xl mx-auto shadow-lg card bg-base-100">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tipo de Reporte</span>
                </label>
                <select
                  className="select select-bordered"
                  value={reportConfig.tipo}
                  onChange={(e) => setReportConfig({ ...reportConfig, tipo: e.target.value })}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="estudiantes">Estudiantes</option>
                  <option value="calificaciones">Calificaciones</option>
                  <option value="asistencias">Asistencias</option>
                  <option value="materiales">Materiales</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fecha Inicio</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={reportConfig.fechaInicio}
                    onChange={(e) => setReportConfig({ ...reportConfig, fechaInicio: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fecha Fin</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={reportConfig.fechaFin}
                    onChange={(e) => setReportConfig({ ...reportConfig, fechaFin: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Incluir en el reporte:</h3>
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text">Calificaciones</span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={reportConfig.incluirCalificaciones}
                      onChange={(e) => setReportConfig({ ...reportConfig, incluirCalificaciones: e.target.checked })}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text">Asistencias</span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={reportConfig.incluirAsistencias}
                      onChange={(e) => setReportConfig({ ...reportConfig, incluirAsistencias: e.target.checked })}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text">Materiales Educativos</span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={reportConfig.incluirMateriales}
                      onChange={(e) => setReportConfig({ ...reportConfig, incluirMateriales: e.target.checked })}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Link href="/reportes" className="btn btn-outline">
                  Cancelar
                </Link>
                <button type="submit" className="btn btn-primary">
                  <Download className="w-4 h-4" />
                  Generar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
