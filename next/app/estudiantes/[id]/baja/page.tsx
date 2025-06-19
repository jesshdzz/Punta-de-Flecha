"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, User } from "lucide-react"

interface Estudiante {
    estudianteId: string
    nombre: string
    correo: string
    telefono: string
    grupoId: string
}

export default function BajaEstudiantePage() {
    const params = useParams()
    const router = useRouter()
    const [estudiante, setEstudiante] = useState<Estudiante | null>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [formData, setFormData] = useState({
        tipo: "BajaTemporal" as "BajaTemporal" | "BajaDefinitiva",
        motivo: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (params.id) {
            fetchEstudiante()
        }
    }, [params.id])

    const fetchEstudiante = async () => {
        try {
            const response = await fetch(`/api/estudiantes/${params.id}`)
            const data = await response.json()

            if (data.ok) {
                setEstudiante(data.estudiante)
            } else {
                console.error("Error al obtener estudiante:", data.mensaje)
            }
        } catch (error) {
            console.error("Error al obtener estudiante:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.motivo.trim()) {
            newErrors.motivo = "El motivo es requerido"
        } else if (formData.motivo.trim().length < 5) {
            newErrors.motivo = "El motivo debe tener al menos 5 caracteres"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm() || !estudiante) return

        setProcessing(true)

        try {
            const payload = {
                estudianteId: Number.parseInt(estudiante.estudianteId),
                tipo: formData.tipo,
                motivo: formData.motivo,
            }

            const response = await fetch("/api/estudiantes/baja", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (data.ok) {
                router.push("/estudiantes?success=baja")
            } else {
                setErrors({ general: data.mensaje || "Error al procesar la baja" })
            }
        } catch (error) {
            setErrors({ general: "Error de conexión" })
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (!estudiante) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <div className="text-center">
                    <h2 className="mb-4 text-2xl font-bold">Estudiante no encontrado</h2>
                    <Link href="/estudiantes" className="btn btn-primary">
                        Volver a Estudiantes
                    </Link>
                </div>
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
                        Volver a estudiantes
                    </Link>
                </div>
            </div>

            <div className="container px-4 py-8 mx-auto">
                <div className="mb-8">
                    <h1 className="flex items-center gap-2 mb-2 text-3xl font-bold text-base-content">
                        <AlertTriangle className="w-8 h-8 text-warning" />
                        Dar de Baja Estudiante
                    </h1>
                    <p className="text-base-content/70">Procese la baja temporal o definitiva del estudiante</p>
                </div>

                {/* Información del Estudiante */}
                <div className="mb-6 shadow-lg card bg-base-100">
                    <div className="card-body">
                        <h2 className="flex items-center gap-2 mb-4 text-xl card-title">
                            <User className="w-5 h-5" />
                            Información del Estudiante
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <span className="font-semibold">Nombre:</span>
                                <p className="text-lg">{estudiante.nombre}</p>
                            </div>
                            <div>
                                <span className="font-semibold">ID:</span>
                                <p className="text-lg">{estudiante.estudianteId}</p>
                            </div>
                            <div>
                                <span className="font-semibold">Correo:</span>
                                <p className="text-lg">{estudiante.correo}</p>
                            </div>
                            <div>
                                <span className="font-semibold">Teléfono:</span>
                                <p className="text-lg">{estudiante.telefono}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulario de Baja */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 mb-4 text-xl card-title">
                                <AlertTriangle className="w-5 h-5 text-warning" />
                                Detalles de la Baja
                            </h2>

                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="font-semibold label-text">Tipo de baja *</span>
                                    </label>
                                    <select name="tipo" value={formData.tipo} onChange={handleChange} className="select select-bordered">
                                        <option value="BajaTemporal">Baja Temporal</option>
                                        <option value="BajaDefinitiva">Baja Definitiva</option>
                                    </select>

                                    <div className="p-3 mt-2 rounded-lg bg-base-200">
                                        {formData.tipo === "BajaTemporal" ? (
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-warning">Baja Temporal</p>
                                                    <p className="text-sm text-base-content/70">
                                                        El estudiante podrá reincorporarse en el futuro. Su expediente se mantiene activo pero
                                                        suspendido.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-error">Baja Definitiva</p>
                                                    <p className="text-sm text-base-content/70">
                                                        El estudiante es dado de baja permanentemente. Esta acción no se puede deshacer fácilmente.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="font-semibold label-text">Motivo de la baja *</span>
                                    </label>
                                    <textarea
                                        name="motivo"
                                        value={formData.motivo}
                                        onChange={handleChange}
                                        className={`textarea textarea-bordered h-32 ${errors.motivo ? "textarea-error" : ""}`}
                                        placeholder="Describa detalladamente el motivo de la baja (mínimo 5 caracteres)..."
                                    />
                                    {errors.motivo && <span className="text-sm text-error">{errors.motivo}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Advertencia */}
                    <div className="alert alert-warning">
                        <AlertTriangle className="w-6 h-6" />
                        <div>
                            <h3 className="font-bold">¡Atención!</h3>
                            <div className="text-sm">
                                Esta acción cambiará el estado del estudiante en el sistema. Asegúrese de que toda la información sea
                                correcta antes de proceder.
                            </div>
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
                        <button type="submit" className={`btn btn-error ${processing ? "loading" : ""}`} disabled={processing}>
                            {processing ? (
                                "Procesando..."
                            ) : (
                                <>
                                    <AlertTriangle className="w-4 h-4" />
                                    Confirmar Baja
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
