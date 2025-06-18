"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import type { Asistencia, Estudiante, Materia } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegistrarAsistenciaPage() {
  const [formData, setFormData] = useState({
    estudianteId: "",
    materiaId: "",
    porcentaje: "",
    fecha: new Date().toISOString().split("T")[0],
    observaciones: "",
  })
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [materias, setMaterias] = useState<Materia[]>([])
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const db = BaseDatos.getInstance()
    setEstudiantes(db.obtenerTodosEstudiantes().filter((e) => e.activo))
    setMaterias(db.obtenerMaterias())
  }, [])

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.estudianteId) {
      nuevosErrores.estudianteId = "Seleccione un estudiante"
    }

    if (!formData.materiaId) {
      nuevosErrores.materiaId = "Seleccione una materia"
    }

    const porcentaje = Number.parseFloat(formData.porcentaje)
    if (!formData.porcentaje || isNaN(porcentaje)) {
      nuevosErrores.porcentaje = "Ingrese un porcentaje válido"
    } else if (porcentaje < 0 || porcentaje > 100) {
      nuevosErrores.porcentaje = "El porcentaje debe estar entre 0 y 100"
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = "Seleccione una fecha"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setGuardando(true)

    try {
      const db = BaseDatos.getInstance()

      const nuevaAsistencia: Asistencia = {
        id: "ast_" + Date.now().toString(),
        estudianteId: formData.estudianteId,
        materiaId: formData.materiaId,
        porcentaje: Number.parseFloat(formData.porcentaje),
        fecha: new Date(formData.fecha),
        profesorId: "2", // Por simplicidad, usamos el profesor por defecto
        observaciones: formData.observaciones || undefined,
      }

      if (db.crearAsistencia && db.crearAsistencia(nuevaAsistencia)) {
        alert("Asistencia registrada exitosamente")
        router.push("/asistencias")
      } else {
        alert("Error al registrar la asistencia")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al registrar la asistencia")
    } finally {
      setGuardando(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errores[field]) {
      setErrores((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-green-900/30">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/asistencias">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Asistencias
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-base-content mb-2">Registrar Asistencia</h1>
          <p className="text-gray-600 dark:text-base-content/70">Registrar porcentaje de asistencia de un estudiante</p>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="dark:text-base-content">Información de Asistencia</CardTitle>
            <CardDescription>Complete todos los campos requeridos para registrar la asistencia</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="estudianteId">Estudiante *</Label>
                <select
                  id="estudianteId"
                  value={formData.estudianteId}
                  onChange={(e) => handleInputChange("estudianteId", e.target.value)}
                  className={`w-full rounded-md border ${
                    errores.estudianteId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white`}
                >
                  <option value="">Seleccione un estudiante</option>
                  {estudiantes.map((estudiante) => (
                    <option key={estudiante.id} value={estudiante.id}>
                      {estudiante.nombre} {estudiante.apellidos} - {estudiante.grado}
                      {estudiante.grupo}
                    </option>
                  ))}
                </select>
                {errores.estudianteId && <p className="text-sm text-red-500">{errores.estudianteId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="materiaId">Materia *</Label>
                <select
                  id="materiaId"
                  value={formData.materiaId}
                  onChange={(e) => handleInputChange("materiaId", e.target.value)}
                  className={`w-full rounded-md border ${
                    errores.materiaId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white`}
                >
                  <option value="">Seleccione una materia</option>
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nombre} - {materia.grado}
                    </option>
                  ))}
                </select>
                {errores.materiaId && <p className="text-sm text-red-500">{errores.materiaId}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="porcentaje">Porcentaje de Asistencia *</Label>
                  <Input
                    id="porcentaje"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.porcentaje}
                    onChange={(e) => handleInputChange("porcentaje", e.target.value)}
                    placeholder="0 - 100"
                    className={errores.porcentaje ? "border-red-500" : ""}
                  />
                  {errores.porcentaje && <p className="text-sm text-red-500">{errores.porcentaje}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => handleInputChange("fecha", e.target.value)}
                    className={errores.fecha ? "border-red-500" : ""}
                  />
                  {errores.fecha && <p className="text-sm text-red-500">{errores.fecha}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                <textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Observaciones adicionales sobre la asistencia..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/asistencias" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={guardando} className="bg-blue-600 text-white hover:bg-blue-700 dark:text-white flex-1">
                  {guardando ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Registrar Asistencia
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
