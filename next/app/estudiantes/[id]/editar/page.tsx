"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, User, Users } from "lucide-react"

interface Grupo {
    id: number
    nombre: string
    grado: number
}

export default function EditarEstudiantePage() {
    const params = useParams()
    const router = useRouter()
    const [grupos, setGrupos] = useState<Grupo[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        estudianteId: "",
        nombre: "",
        correo: "",
        telefono: "",
        contrasena: "",
        grupoId: "",
        reinscribir: false,
        montoReinscripcion: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (params.id) {
            fetchEstudiante()
            fetchGrupos()
        }
    }, [params.id])

    const fetchEstudiante = async () => {
        try {
            const response = await fetch(`/api/estudiantes/${params.id}`)
            const data = await response.json()

            if (data.ok) {
                setFormData({
                    estudianteId: data.estudiante.estudianteId,
                    nombre: data.estudiante.nombre,
                    correo: data.estudiante.correo,
                    telefono: data.estudiante.telefono,
                    contrasena: "", // No mostrar contraseña actual
                    grupoId: data.estudiante.grupoId,
                    reinscribir: false,
                    montoReinscripcion: "",
                })
            } else {
                console.error("Error al obtener estudiante:", data.mensaje)
            }
        } catch (error) {
            console.error("Error al obtener estudiante:", error)
        } finally {
            setLoading(false)
        }
    }

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }

        // Limpiar error del campo
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!formData.correo.trim()) newErrors.correo = "El correo es requerido"
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido"

        if (formData.reinscribir) {
            if (!formData.grupoId) newErrors.grupoId = "Debe seleccionar un grupo para reinscribir"
            if (!formData.montoReinscripcion || Number.parseFloat(formData.montoReinscripcion) <= 0) {
                newErrors.montoReinscripcion = "El monto de reinscripción debe ser mayor a 0"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setSaving(true)

        try {
            const payload = {
                estudianteId: Number.parseInt(formData.estudianteId),
                nombre: formData.nombre,
                correo: formData.correo,
                telefono: formData.telefono,
                ...(formData.contrasena && { contrasena: formData.contrasena }),
                reinscribir: formData.reinscribir,
                ...(formData.reinscribir && {
                    grupoId: Number.parseInt(formData.grupoId),
                    montoReinscripcion: Number.parseFloat(formData.montoReinscripcion),
                }),
            }

            const response = await fetch("/api/estudiantes/actualiza", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (data.ok) {
                router.push("/estudiantes?success=updated")
            } else {
                setErrors({ general: data.mensaje || "Error al actualizar el estudiante" })
            }
        } catch (error) {
            setErrors({ general: "Error de conexión" })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-base-200">
            {/* Navbar */}
            <div className="shadow-lg navbar bg-base-100">
                <div className="flex-1">
                    <Link href="/estudiantes" className="btn btn-ghost">
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Estudiantes
                    </Link>
                </div>
            </div>

            <div className="container px-4 py-8 mx-auto">
                <div className="mb-8">
                    <h1 className="flex items-center gap-2 mb-2 text-3xl font-bold text-base-content">
                        <User className="w-8 h-8" />
                        Editar Estudiante
                    </h1>
                    <p className="text-base-content/70">Actualice los datos del estudiante o procese una reinscripción</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Datos del Estudiante */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 mb-4 text-xl card-title">
                                <User className="w-5 h-5" />
                                Datos del Estudiante
                            </h2>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Nombre completo *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className={`input input-bordered ${errors.nombre ? "input-error" : ""}`}
                                        placeholder="Juan Pérez García"
                                    />
                                    {errors.nombre && <span className="text-sm text-error">{errors.nombre}</span>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Correo electrónico *</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        className={`input input-bordered ${errors.correo ? "input-error" : ""}`}
                                        placeholder="juan@ejemplo.com"
                                    />
                                    {errors.correo && <span className="text-sm text-error">{errors.correo}</span>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Teléfono *</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className={`input input-bordered ${errors.telefono ? "input-error" : ""}`}
                                        placeholder="1234567890"
                                    />
                                    {errors.telefono && <span className="text-sm text-error">{errors.telefono}</span>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Nueva contraseña</span>
                                        <span className="label-text-alt">Dejar vacío para mantener actual</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="contrasena"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reinscripción */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 mb-4 text-xl card-title">
                                <Users className="w-5 h-5" />
                                Reinscripción
                            </h2>

                            <div className="mb-4 form-control">
                                <label className="justify-start gap-4 cursor-pointer label">
                                    <input
                                        type="checkbox"
                                        name="reinscribir"
                                        checked={formData.reinscribir}
                                        onChange={handleChange}
                                        className="checkbox checkbox-primary"
                                    />
                                    <div>
                                        <span className="font-semibold label-text">Procesar reinscripción</span>
                                        <div className="text-sm text-base-content/70">
                                            Marque esta opción si el estudiante se reinscribe a un nuevo grupo
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {formData.reinscribir && (
                                <div className="grid grid-cols-1 gap-4 p-4 mt-4 rounded-lg md:grid-cols-2 bg-base-200">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Nuevo grupo *</span>
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
                                        {errors.grupoId && <span className="text-sm text-error">{errors.grupoId}</span>}
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Monto de reinscripción *</span>
                                        </label>
                                        <select
                                            name="montoReinscripcion"
                                            value={formData.montoReinscripcion}
                                            onChange={handleChange}
                                            className={`select select-bordered ${errors.montoReinscripcion ? "select-error" : ""}`}
                                        >
                                            <option value="">Seleccionar monto</option>
                                            <option value="1000">$300</option>
                                            <option value="2000">$500</option>
                                            <option value="3000">$800</option>
                                        </select>
                                        {errors.montoReinscripcion && (
                                            <span className="text-sm text-error">{errors.montoReinscripcion}</span>
                                        )}
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
                        <Link href="/estudiantes" className="btn btn-outline">
                            Cancelar
                        </Link>
                        <button type="submit" className={`btn btn-primary ${saving ? "loading" : ""}`} disabled={saving}>
                            {saving ? (
                                "Guardando..."
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
