"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { FileStorage } from "@/lib/file-storage"
import type { MaterialEducativo, Materia } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NuevoMaterialPage() {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "" as "libro" | "documento" | "video" | "presentacion" | "",
    materiaId: "",
    url: "",
  })
  const [materias, setMaterias] = useState<Materia[]>([])
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)
  const router = useRouter()
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)

  useEffect(() => {
    const db = BaseDatos.getInstance()
    setMaterias(db.obtenerMaterias())
  }, [])

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = "El título es requerido"
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida"
    }

    if (!formData.tipo) {
      nuevosErrores.tipo = "Seleccione un tipo de material"
    }

    if (!formData.materiaId) {
      nuevosErrores.materiaId = "Seleccione una materia"
    }

    if (formData.tipo === "video" && !formData.url.trim()) {
      nuevosErrores.url = "La URL es requerida para videos"
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
      const materialId = "mat_" + Date.now().toString()

      // Si hay archivo seleccionado, guardarlo en localStorage
      if (archivoSeleccionado) {
        await FileStorage.guardarArchivo(archivoSeleccionado, materialId)
      }

      const nuevoMaterial: MaterialEducativo = {
        id: materialId,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipo: formData.tipo,
        materiaId: formData.materiaId,
        url: formData.url || undefined,
        fechaSubida: new Date(),
      }

      if (db.crearMaterialEducativo(nuevoMaterial)) {
        alert("Material educativo subido exitosamente")
        router.push("/materiales")
      } else {
        alert("Error al subir el material")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al subir el material")
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

  const handleSeleccionarArchivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0]
    if (archivo) {
      // Validar tipo de archivo
      const tiposPermitidos = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ]

      if (!tiposPermitidos.includes(archivo.type)) {
        alert("Tipo de archivo no permitido. Solo se permiten PDF, DOC, DOCX, PPT, PPTX")
        return
      }

      // Validar tamaño (10MB = 10 * 1024 * 1024 bytes)
      if (archivo.size > 10 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 10MB permitido.")
        return
      }

      setArchivoSeleccionado(archivo)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const archivo = event.dataTransfer.files[0]
    if (archivo) {
      // Simular evento de input para reutilizar la validación
      const fakeEvent = {
        target: { files: [archivo] },
      } as React.ChangeEvent<HTMLInputElement>
      handleSeleccionarArchivo(fakeEvent)
    }
  }

  const handleClickSeleccionar = () => {
    document.getElementById("archivo-input")?.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-green-900/30" data-theme="dim">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/materiales">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Materiales
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-base-content mb-2">Subir Material Educativo</h1>
          <p className="text-base-content/70">Agregar un nuevo recurso educativo al sistema</p>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Información del Material</CardTitle>
            <CardDescription>Complete todos los campos requeridos para subir el material educativo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Material *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  placeholder="Ej: Álgebra Básica - Capítulo 1"
                  className={errores.titulo ? "border-red-500" : ""}
                />
                {errores.titulo && <p className="text-sm text-red-500">{errores.titulo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  placeholder="Descripción detallada del contenido del material..."
                  rows={4}
                  className={errores.descripcion ? "border-red-500" : ""}
                />
                {errores.descripcion && <p className="text-sm text-red-500">{errores.descripcion}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Material *</Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                    <SelectTrigger className={errores.tipo ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      <SelectItem value="libro">Libro</SelectItem>
                      <SelectItem value="documento">Documento</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="presentacion">Presentación</SelectItem>
                    </SelectContent>
                  </Select>
                  {errores.tipo && <p className="text-sm text-red-500">{errores.tipo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materiaId">Materia *</Label>
                  <Select value={formData.materiaId} onValueChange={(value) => handleInputChange("materiaId", value)}>
                    <SelectTrigger className={errores.materiaId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccione la materia" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      {materias.map((materia) => (
                        <SelectItem key={materia.id} value={materia.id}>
                          {materia.nombre} - {materia.grado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errores.materiaId && <p className="text-sm text-red-500">{errores.materiaId}</p>}
                </div>
              </div>

              {formData.tipo === "video" && (
                <div className="space-y-2">
                  <Label htmlFor="url">URL del Video *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    placeholder="https://ejemplo.com/video"
                    className={errores.url ? "border-red-500" : ""}
                  />
                  {errores.url && <p className="text-sm text-red-500">{errores.url}</p>}
                </div>
              )}

              {(formData.tipo === "documento" || formData.tipo === "libro" || formData.tipo === "presentacion") && (
                <div className="space-y-2">
                  <Label htmlFor="archivo">Archivo (Opcional)</Label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    {archivoSeleccionado ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-green-600">
                          Archivo seleccionado: {archivoSeleccionado.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Tamaño: {(archivoSeleccionado.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={() => setArchivoSeleccionado(null)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Remover archivo
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">
                          Arrastra y suelta tu archivo aquí, o{" "}
                          <button
                            type="button"
                            onClick={handleClickSeleccionar}
                            className="text-blue-600 hover:underline"
                          >
                            selecciona un archivo
                          </button>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, PPT, PPTX (máx. 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    id="archivo-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleSeleccionarArchivo}
                    className="hidden"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Link href="/materiales" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={guardando} className="bg-blue-600 text-white hover:bg-blue-700 flex-1 text-balck dark:text-white">
                  {guardando ? (
                    "Subiendo..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Subir Material
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
