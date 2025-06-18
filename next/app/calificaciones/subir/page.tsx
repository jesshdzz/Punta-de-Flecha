"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaValidacion } from "@/lib/sistema-validacion"
import type { Calificacion, Estudiante, Materia } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SubirCalificacionPage() {
  const [formData, setFormData] = useState({
    estudianteId: "",
    materiaId: "",
    valor: "",
    periodo: "",
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

    const calificacion = Number.parseFloat(formData.valor)
    if (!formData.valor || isNaN(calificacion)) {
      nuevosErrores.valor = "Ingrese una calificación válida"
    } else if (!SistemaValidacion.validarCalificacion(calificacion)) {
      nuevosErrores.valor = "La calificación debe estar entre 0 y 10"
    }

    if (!formData.periodo) {
      nuevosErrores.periodo = "Seleccione un periodo"
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

      const nuevaCalificacion: Calificacion = {
        id: "cal_" + Date.now().toString(),
        estudianteId: formData.estudianteId,
        materiaId: formData.materiaId,
        valor: Number.parseFloat(formData.valor),
        periodo: formData.periodo,
        fecha: new Date(),
        profesorId: "2", // Por simplicidad, usamos el profesor por defecto
      }

      if (db.crearCalificacion(nuevaCalificacion)) {
        alert("Calificación registrada exitosamente")
        router.push("/calificaciones")
      } else {
        alert("Error al registrar la calificación")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al registrar la calificación")
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
            <Link href="/calificaciones">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Calificaciones
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-base-content mb-2">Subir Calificación</h1>
          <p className="text-base-content/70">Registrar una nueva calificación en el sistema</p>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Información de la Calificación</CardTitle>
            <CardDescription>Complete todos los campos requeridos para registrar la calificación</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="estudianteId">Estudiante *</Label>
                <Select
                  value={formData.estudianteId}
                  onValueChange={(value) => handleInputChange("estudianteId", value)}
                >
                  <SelectTrigger className={errores.estudianteId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccione un estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    {estudiantes.map((estudiante) => (
                      <SelectItem key={estudiante.id} value={estudiante.id}>
                        {estudiante.nombre} {estudiante.apellidos} - {estudiante.grado}
                        {estudiante.grupo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errores.estudianteId && <p className="text-sm text-red-500">{errores.estudianteId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="materiaId">Materia *</Label>
                <Select value={formData.materiaId} onValueChange={(value) => handleInputChange("materiaId", value)}>
                  <SelectTrigger className={errores.materiaId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccione una materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {materias.map((materia) => (
                      <SelectItem key={materia.id} value={materia.id}>
                        {materia.nombre} - {materia.grado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errores.materiaId && <p className="text-sm text-red-500">{errores.materiaId}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Calificación *</Label>
                  <Input
                    id="valor"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.valor}
                    onChange={(e) => handleInputChange("valor", e.target.value)}
                    placeholder="0.0 - 10.0"
                    className={errores.valor ? "border-red-500" : ""}
                  />
                  {errores.valor && <p className="text-sm text-red-500">{errores.valor}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodo">Periodo *</Label>
                  <Select value={formData.periodo} onValueChange={(value) => handleInputChange("periodo", value)}>
                    <SelectTrigger className={errores.periodo ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccione el periodo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1er_bimestre">1er Bimestre</SelectItem>
                      <SelectItem value="2do_bimestre">2do Bimestre</SelectItem>
                      <SelectItem value="3er_bimestre">3er Bimestre</SelectItem>
                      <SelectItem value="4to_bimestre">4to Bimestre</SelectItem>
                      <SelectItem value="5to_bimestre">5to Bimestre</SelectItem>
                    </SelectContent>
                  </Select>
                  {errores.periodo && <p className="text-sm text-red-500">{errores.periodo}</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/calificaciones" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={guardando} className="flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:text-white">
                  {guardando ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Registrar Calificación
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
