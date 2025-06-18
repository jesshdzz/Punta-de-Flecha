"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaValidacion } from "@/lib/sistema-validacion"
import type { Estudiante } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NuevoEstudiantePage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    grado: "",
    grupo: "",
    padreId: "padre1", // Por simplicidad, usamos un padre por defecto
  })
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)
  const router = useRouter()

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (!SistemaValidacion.validarNombre(formData.nombre)) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres"
    }

    if (!SistemaValidacion.validarNombre(formData.apellidos)) {
      nuevosErrores.apellidos = "Los apellidos deben tener al menos 2 caracteres"
    }

    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha de nacimiento es requerida"
    } else {
      const fecha = new Date(formData.fechaNacimiento)
      if (!SistemaValidacion.validarFechaNacimiento(fecha)) {
        nuevosErrores.fechaNacimiento = "La edad debe estar entre 5 y 18 años"
      }
    }

    if (!SistemaValidacion.validarGrado(formData.grado)) {
      nuevosErrores.grado = "Seleccione un grado válido"
    }

    if (!formData.grupo) {
      nuevosErrores.grupo = "Seleccione un grupo"
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

      const nuevoEstudiante: Estudiante = {
        id: "est_" + Date.now().toString(),
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        fechaNacimiento: new Date(formData.fechaNacimiento),
        grado: formData.grado,
        grupo: formData.grupo,
        padreId: formData.padreId,
        activo: true,
        fechaInscripcion: new Date(),
      }

      if (db.crearEstudiante(nuevoEstudiante)) {
        alert("Estudiante registrado exitosamente")
        router.push("/estudiantes")
      } else {
        alert("Error al registrar el estudiante")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al registrar el estudiante")
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900/30">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/estudiantes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Estudiantes
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-base-content mb-2">Alta de Estudiante</h1>
          <p className="text-gray-600 dark:text-base-content/70">Registrar un nuevo estudiante en el sistema</p>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Información del Estudiante</CardTitle>
            <CardDescription>Complete todos los campos requeridos para registrar al estudiante</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ingrese el nombre"
                    className={errores.nombre ? "border-red-500" : ""}
                  />
                  {errores.nombre && <p className="text-sm text-red-500">{errores.nombre}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos}
                    onChange={(e) => handleInputChange("apellidos", e.target.value)}
                    placeholder="Ingrese los apellidos"
                    className={errores.apellidos ? "border-red-500" : ""}
                  />
                  {errores.apellidos && <p className="text-sm text-red-500">{errores.apellidos}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                  className={errores.fechaNacimiento ? "border-red-500" : ""}
                />
                {errores.fechaNacimiento && <p className="text-sm text-red-500">{errores.fechaNacimiento}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grado">Grado *</Label>
                  <Select value={formData.grado} onValueChange={(value) => handleInputChange("grado", value)}>
                    <SelectTrigger className={errores.grado ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccione el grado" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 bg-white">
                      <SelectItem value="1°">1° Grado</SelectItem>
                      <SelectItem value="2°">2° Grado</SelectItem>
                      <SelectItem value="3°">3° Grado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errores.grado && <p className="text-sm text-red-500">{errores.grado}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grupo">Grupo *</Label>
                  <Select value={formData.grupo} onValueChange={(value) => handleInputChange("grupo", value)}>
                    <SelectTrigger className={errores.grupo ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccione el grupo" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 bg-white">
                      <SelectItem value="A">Grupo A</SelectItem>
                      <SelectItem value="B">Grupo B</SelectItem>
                      <SelectItem value="C">Grupo C</SelectItem>
                    </SelectContent>
                  </Select>
                  {errores.grupo && <p className="text-sm text-red-500">{errores.grupo}</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/estudiantes" className="flex-1">
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
                      Registrar Estudiante
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
