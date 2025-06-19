"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Save, BookOpen, X } from "lucide-react"

interface Grupo {
  id: number
  nombre: string
  grado: number
}

export default function NuevoMaterialPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    grupoId: "",
  })
  const [archivos, setArchivos] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const categorias = ["Matemáticas", "Lenguaje", "Ciencias", "Historia", "Otro"]

  useEffect(() => {
    fetchGrupos()
  }, [])

  const fetchGrupos = async () => {
    try {
      const response = await fetch("/api/grupos")
      const data = await response.json()
      if (data.ok) {
        setGrupos(data.grupos)
      }
    } catch (error) {
      console.error("Error al obtener grupos:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setArchivos((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.titulo.trim()) newErrors.titulo = "El título es requerido"
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es requerida"
    if (!formData.categoria) newErrors.categoria = "Debe seleccionar una categoría"
    if (!formData.grupoId) newErrors.grupoId = "Debe seleccionar un grupo"
    if (archivos.length === 0) newErrors.archivos = "Debe subir al menos un archivo"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // Simular archivos para la API (ya que no podemos subir archivos reales en este entorno)
      const archivosSimulados = archivos.map((archivo) => ({
        nombreArchivo: archivo.name,
        name: archivo.name,
      }))

      const payload = {
        profesorId: 28,// Simular ID de profesor
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        grupoId: Number.parseInt(formData.grupoId),
        archivos: archivosSimulados,
      }

      const response = await fetch("/api/materiales/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/materiales?success=created")
      } else {
        setErrors({ general: data.error || "Error al subir el material" })
      }
    } catch (error) {
      setErrors({ general: "Error de conexión" })
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <Link href="/materiales" className="btn btn-ghost">
            <ArrowLeft className="w-4 h-4" />
            Volver a Materiales
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            Subir Material Educativo
          </h1>
          <p className="text-base-content/70">Comparte recursos educativos con tus estudiantes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Material */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Información del Material</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Título del material *</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    className={`input input-bordered ${errors.titulo ? "input-error" : ""}`}
                    placeholder="Ej: Fundamentos de Álgebra - Unidad 1"
                  />
                  {errors.titulo && <span className="text-error text-sm">{errors.titulo}</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Categoría *</span>
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className={`select select-bordered ${errors.categoria ? "select-error" : ""}`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                  {errors.categoria && <span className="text-error text-sm">{errors.categoria}</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Grupo destinatario *</span>
                  </label>
                  <select
                    name="grupoId"
                    value={formData.grupoId}
                    onChange={handleChange}
                    className={`select select-bordered ${errors.grupoId ? "select-error" : ""}`}
                  >
                    <option value="">Seleccionar grupo</option>
                    {grupos.map((grupo) => (
                      <option key={grupo.id} value={grupo.id}>
                        {grupo.nombre} - Grado {grupo.grado}
                      </option>
                    ))}
                  </select>
                  {errors.grupoId && <span className="text-error text-sm">{errors.grupoId}</span>}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Descripción *</span>
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className={`textarea textarea-bordered h-32 ${errors.descripcion ? "textarea-error" : ""}`}
                    placeholder="Describe el contenido del material, objetivos de aprendizaje, instrucciones de uso, etc."
                  />
                  {errors.descripcion && <span className="text-error text-sm">{errors.descripcion}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Subir Archivos */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Archivos del Material
              </h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Seleccionar archivos *</span>
                  <span className="label-text-alt">PDF, DOCX, PPTX, JPG, PNG, MP4</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                  multiple
                  accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png,.mp4"
                />
                {errors.archivos && <span className="text-error text-sm">{errors.archivos}</span>}
              </div>

              {/* Lista de archivos seleccionados */}
              {archivos.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Archivos seleccionados:</h3>
                  <div className="space-y-2">
                    {archivos.map((archivo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Upload className="w-4 h-4 text-primary" />
                          <div>
                            <p className="font-medium">{archivo.name}</p>
                            <p className="text-sm text-base-content/60">{formatFileSize(archivo.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="btn btn-ghost btn-sm text-error"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="alert alert-error">
              <span>{errors.general}</span>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <Link href="/materiales" className="btn btn-outline">
              Cancelar
            </Link>
            <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? (
                "Subiendo..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Subir Material
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
