"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, User, Users, FileText } from "lucide-react"

interface Grupo {
    id: number
    nombre: string
    grado: number
}

export default function NuevoEstudiantePage() {
    const [grupos, setGrupos] = useState<Grupo[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        // Datos del estudiante
        nombre: "",
        correo: "",
        telefono: "",
        contrasena: "",
        grupoId: "",
        montoInscripcion: "",
        // Datos del tutor
        tutor: {
            nombre: "",
            correo: "",
            telefono: "",
            domicilio: "",
        },
        // Documentos (simulados)
        documentos: [
            { tipo: "Acta de nacimiento", entregado: false },
            { tipo: "CURP", entregado: false },
            { tipo: "Comprobante de domicilio", entregado: false },
            { tipo: "Certificado de estudios", entregado: false },
        ],
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const router = useRouter()

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

        if (name.startsWith("tutor.")) {
            const tutorField = name.split(".")[1]
            setFormData((prev) => ({
                ...prev,
                tutor: {
                    ...prev.tutor,
                    [tutorField]: value,
                },
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

    const handleDocumentoChange = (index: number, entregado: boolean) => {
        setFormData((prev) => ({
            ...prev,
            documentos: prev.documentos.map((doc, i) => (i === index ? { ...doc, entregado } : doc)),
        }))
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        // Validaciones del estudiante
        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!formData.correo.trim()) newErrors.correo = "El correo es requerido"
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido"
        if (!formData.contrasena.trim()) newErrors.contrasena = "La contraseña es requerida"
        if (!formData.grupoId) newErrors.grupoId = "Debe seleccionar un grupo"
        if (!formData.montoInscripcion || Number.parseFloat(formData.montoInscripcion) <= 0) {
            newErrors.montoInscripcion = "El monto de inscripción debe ser mayor a 0"
        }

        // Validaciones del tutor
        if (!formData.tutor.nombre.trim()) newErrors["tutor.nombre"] = "El nombre del tutor es requerido"
        if (!formData.tutor.correo.trim()) newErrors["tutor.correo"] = "El correo del tutor es requerido"
        if (!formData.tutor.telefono.trim()) newErrors["tutor.telefono"] = "El teléfono del tutor es requerido"
        if (!formData.tutor.domicilio.trim()) newErrors["tutor.domicilio"] = "El domicilio del tutor es requerido"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            // Simular documentos para la API
            const documentosSimulados = formData.documentos
                .filter((doc) => doc.entregado)
                .map((doc) => ({
                    id: Math.random(),
                    nombre: doc.tipo,
                    tipo: doc.tipo,
                    fechaCreacion: new Date(),
                    contenido: `Documento ${doc.tipo} simulado`,
                }))

            const payload = {
                nombre: formData.nombre,
                correo: formData.correo,
                telefono: formData.telefono,
                contrasena: formData.contrasena,
                grupoId: Number.parseInt(formData.grupoId),
                montoInscripcion: Number.parseFloat(formData.montoInscripcion),
                documentos: documentosSimulados,
                tutor: formData.tutor,
            }

            const response = await fetch("/api/estudiantes/alta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (data.ok) {
                router.push("/estudiantes?success=created")
            } else {
                setErrors({ general: data.mensaje || "Error al registrar el estudiante" })
            }
        } catch (error) {
            setErrors({ general: "Error de conexión" })
        } finally {
            setLoading(false)
        }
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
                        Registrar Nuevo Estudiante
                    </h1>
                    <p className="text-base-content/70">Complete todos los campos para registrar un nuevo estudiante</p>
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
                                        <span className="label-text">Contraseña *</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="contrasena"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        className={`input input-bordered ${errors.contrasena ? "input-error" : ""}`}
                                        placeholder="••••••••"
                                    />
                                    {errors.contrasena && <span className="text-sm text-error">{errors.contrasena}</span>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Grupo *</span>
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
                                        <span className="label-text">Monto de inscripción *</span>
                                    </label>
                                    <select
                                        name="montoInscripcion"
                                        value={formData.montoInscripcion}
                                        onChange={handleChange}
                                        className={`select select-bordered ${errors.montoInscripcion ? "select-error" : ""}`}
                                    >
                                        <option value="">Seleccionar monto de pago *</option>
                                        <option value="1000">Inscripción Completa - $1,000</option>
                                        <option value="1500">Inscripción parcial - $700</option>
                                    </select>
                                    {errors.montoInscripcion && <span className="text-sm text-error">{errors.montoInscripcion}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Datos del Tutor */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 mb-4 text-xl card-title">
                                <Users className="w-5 h-5" />
                                Datos del Tutor/Padre de Familia
                            </h2>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Nombre completo *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="tutor.nombre"
                                        value={formData.tutor.nombre}
                                        onChange={handleChange}
                                        className={`input input-bordered ${errors["tutor.nombre"] ? "input-error" : ""}`}
                                        placeholder="María García López"
                                    />
                                    {errors["tutor.nombre"] && <span className="text-sm text-error">{errors["tutor.nombre"]}</span>}
                                </div>

                                <div className="form-control">
                                    <p className="text-gray-500">ana.lopez@email.com</p>
                                    <label className="label">
                                        <span className="label-text">Correo electrónico *</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="tutor.correo"
                                        value={formData.tutor.correo}
                                        onChange={handleChange}
                                        className={`input input-bordered ${errors["tutor.correo"] ? "input-error" : ""}`}
                                        placeholder="maria@ejemplo.com"
                                    />

                                    {errors["tutor.correo"] && <span className="text-sm text-error">{errors["tutor.correo"]}</span>}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Teléfono *</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="tutor.telefono"
                                        value={formData.tutor.telefono}
                                        onChange={handleChange}
                                        className={`input input-bordered ${errors["tutor.telefono"] ? "input-error" : ""}`}
                                        placeholder="0987654321"
                                    />
                                    {errors["tutor.telefono"] && <span className="text-sm text-error">{errors["tutor.telefono"]}</span>}
                                </div>

                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Domicilio *</span>
                                    </label>
                                    <textarea
                                        name="tutor.domicilio"
                                        value={formData.tutor.domicilio}
                                        onChange={handleChange}
                                        className={`textarea textarea-bordered ${errors["tutor.domicilio"] ? "textarea-error" : ""}`}
                                        placeholder="Calle, número, colonia, ciudad, código postal"
                                        rows={3}
                                    />
                                    {errors["tutor.domicilio"] && <span className="text-sm text-error">{errors["tutor.domicilio"]}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documentos */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 mb-4 text-xl card-title">
                                <FileText className="w-5 h-5" />
                                Documentos Requeridos
                            </h2>

                            <div className="space-y-3">
                                {formData.documentos.map((documento, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-base-200">
                                        <span className="font-medium">{documento.tipo}</span>
                                        <div className="form-control">
                                            <label className="cursor-pointer label">
                                                <span className="mr-2 label-text">Entregado</span>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-primary"
                                                    checked={documento.entregado}
                                                    onChange={(e) => handleDocumentoChange(index, e.target.checked)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ))}
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
                        <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                            {loading ? (
                                "Registrando..."
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Registrar Estudiante
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
