"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, GraduationCap, Save, Search } from "lucide-react"

interface Materia {
    id: number
    nombre: string
    profesor: {
        id: number
        nombre: string
    }
}

interface Estudiante {
    id: number
    nombre: string
    correo: string
}

export default function CalificacionesPage() {
    const [materias, setMaterias] = useState<Materia[]>([])
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
    const [selectedMateria, setSelectedMateria] = useState("")
    const [selectedEstudiante, setSelectedEstudiante] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [calificaciones, setCalificaciones] = useState({
        parcial1: "",
        parcial2: "",
        ordinario: "",
        final: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchMaterias()
        fetchEstudiantes()
    }, [])

    const fetchMaterias = async () => {
        try {
            const response = await fetch("/api/materias")
            const data = await response.json()
            if (data.ok) {
                setMaterias(data.materias)
            }
        } catch (error) {
            console.error("Error al obtener materias:", error)
        }
    }

    const fetchEstudiantes = async () => {
        try {
            const response = await fetch("/api/estudiantes")
            const data = await response.json()
            if (data.ok) {
                setEstudiantes(data.estudiantes.filter((estudiante: any) => estudiante.estado === "Activo"))
            }
        } catch (error) {
            console.error("Error al obtener estudiantes:", error)
        }
    }

    const fetchCalificaciones = async (estudianteId: string, materiaId: string) => {
        try {
            const response = await fetch(`/api/calificaciones?id=${estudianteId}&materiaId=${materiaId}`)
            const data = await response.json()
            if (data.ok) {
                setCalificaciones({
                    parcial1: data.calificaciones.calif_p1,
                    parcial2: data.calificaciones.calif_r2,
                    ordinario: data.calificaciones.ordinario,
                    final: data.calificaciones.calif_final,
                })
                setSelectedEstudiante(data.calificaciones.estudianteId.toString())
                setSelectedMateria(data.calificaciones.materiaId.toString())
            } else {
                setCalificaciones({
                    parcial1: "",
                    parcial2: "",
                    ordinario: "",
                    final: "",
                })
                setSelectedEstudiante("")
                setSelectedMateria("")
                setErrors({ general: data.mensaje || "Error al obtener calificaciones" })
            }
        } catch (error) {
            console.error("Error al obtener calificaciones:", error)
            setErrors({ general: "Error de conexión" })
        }
    }
    
    useEffect(() => {
        if (selectedEstudiante && selectedMateria) {
            fetchCalificaciones(selectedEstudiante, selectedMateria)
        } else {
            setCalificaciones({
                parcial1: "",
                parcial2: "",
                ordinario: "",
                final: "",
            })
        }
    }, [selectedEstudiante, selectedMateria])

    const handleCalificacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCalificaciones((prev) => ({
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

        if (!selectedMateria) newErrors.materia = "Debe seleccionar una materia"
        if (!selectedEstudiante) newErrors.estudiante = "Debe seleccionar un estudiante"

        // Validar calificaciones (0-10)
        const campos = ["parcial1", "parcial2", "ordinario", "final"]
        campos.forEach((campo) => {
            const valor = Number.parseFloat(calificaciones[campo as keyof typeof calificaciones])
            if (isNaN(valor) || valor < 0 || valor > 10) {
                newErrors[campo] = "La calificación debe estar entre 0 y 10"
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            const payload = {
                estudianteId: Number.parseInt(selectedEstudiante),
                materiaId: Number.parseInt(selectedMateria),
                calif_p1: Number.parseFloat(calificaciones.parcial1),
                calif_r2: Number.parseFloat(calificaciones.parcial2),
                ordinario: Number.parseFloat(calificaciones.ordinario),
                calif_final: Number.parseFloat(calificaciones.final),
            }

            const response = await fetch("/api/calificaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (data.ok) {
                // Limpiar formulario
                setCalificaciones({
                    parcial1: "",
                    parcial2: "",
                    ordinario: "",
                    final: "",
                })
                setSelectedEstudiante("")
                alert("Calificaciones registradas correctamente")
            } else {
                setErrors({ general: data.mensaje || "Error al registrar calificaciones" })
            }
        } catch (error) {
            setErrors({ general: "Error de conexión" })
        } finally {
            setLoading(false)
        }
    }

    const filteredEstudiantes = estudiantes.filter((estudiante) => estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="min-h-screen bg-base-200">
            {/* Navbar */}
            <div className="shadow-lg navbar bg-base-100">
                <div className="flex-1">
                    <Link href="/dashboard" className="btn btn-ghost">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>
                </div>
            </div>

            <div className="container px-4 py-8 mx-auto">
                <div className="mb-8">
                    <h1 className="flex items-center gap-2 mb-2 text-3xl font-bold text-base-content">
                        <GraduationCap className="w-8 h-8" />
                        Registro de Calificaciones
                    </h1>
                    <p className="text-base-content/70">Registra las calificaciones de los estudiantes por materia</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Selección de Materia y Estudiante */}
                            <div className="shadow-lg card bg-base-100">
                                <div className="card-body">
                                    <h2 className="mb-4 text-xl card-title">Seleccionar Estudiante y Materia</h2>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Materia *</span>
                                            </label>
                                            <select
                                                value={selectedMateria}
                                                onChange={(e) => setSelectedMateria(e.target.value)}
                                                className={`select select-bordered ${errors.materia ? "select-error" : ""}`}
                                            >
                                                <option value="">Seleccionar materia</option>
                                                {materias.map((materia) => (
                                                    <option key={materia.id} value={materia.id}>
                                                        {materia.nombre} - {materia.profesor.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.materia && <span className="text-sm text-error">{errors.materia}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Buscar estudiante</span>
                                            </label>
                                            <div className="input-group">
                                                <span>
                                                    <Search className="w-4 h-4" />
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="Buscar por nombre..."
                                                    className="w-full input input-bordered"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control md:col-span-2">
                                            <label className="label">
                                                <span className="label-text">Estudiante *</span>
                                            </label>
                                            <select
                                                value={selectedEstudiante}
                                                onChange={(e) => setSelectedEstudiante(e.target.value)}
                                                className={`select select-bordered ${errors.estudiante ? "select-error" : ""}`}
                                            >
                                                <option value="">Seleccionar estudiante</option>
                                                {filteredEstudiantes.map((estudiante) => (
                                                    <option key={estudiante.id} value={estudiante.id}>
                                                        {estudiante.nombre} - {estudiante.correo}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.estudiante && <span className="text-sm text-error">{errors.estudiante}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Calificaciones */}
                            <div className="shadow-lg card bg-base-100">
                                <div className="card-body">
                                    <h2 className="mb-4 text-xl card-title">Calificaciones</h2>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Primer Parcial *</span>
                                                <span className="label-text-alt">0.0 - 10.0</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="parcial1"
                                                value={calificaciones.parcial1}
                                                onChange={handleCalificacionChange}
                                                className={`input input-bordered ${errors.parcial1 ? "input-error" : ""}`}
                                                placeholder="0.0"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                            />
                                            {errors.parcial1 && <span className="text-sm text-error">{errors.parcial1}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Segundo Parcial *</span>
                                                <span className="label-text-alt">0.0 - 10.0</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="parcial2"
                                                value={calificaciones.parcial2}
                                                onChange={handleCalificacionChange}
                                                className={`input input-bordered ${errors.parcial2 ? "input-error" : ""}`}
                                                placeholder="0.0"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                            />
                                            {errors.parcial2 && <span className="text-sm text-error">{errors.parcial2}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Examen Ordinario *</span>
                                                <span className="label-text-alt">0.0 - 10.0</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="ordinario"
                                                value={calificaciones.ordinario}
                                                onChange={handleCalificacionChange}
                                                className={`input input-bordered ${errors.ordinario ? "input-error" : ""}`}
                                                placeholder="0.0"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                            />
                                            {errors.ordinario && <span className="text-sm text-error">{errors.ordinario}</span>}
                                        </div>

                                        <div className="form-control flex flex-col">
                                            <label className="label">
                                                <span className="label-text">Calificación Final</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="final"
                                                value={calificaciones.final}
                                                className={`input input-bordered ${errors.final ? "input-error" : ""}`}
                                                placeholder="0.0"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Error general */}
                            {errors.general && (
                                <div className="alert alert-error">
                                    <span>{errors.general}</span>
                                </div>
                            )}

                            {/* Botón de envío */}
                            <div className="flex justify-end">
                                <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                                    {loading ? (
                                        "Guardando..."
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Registrar Calificaciones
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Panel de información */}
                    <div className="space-y-6">
                        <div className="shadow-lg card bg-base-100">
                            <div className="card-body">
                                <h3 className="text-lg card-title">Información</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Materias:</span>
                                        <span className="font-bold">{materias.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estudiantes Activos:</span>
                                        <span className="font-bold">{estudiantes.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shadow-lg card bg-base-100">
                            <div className="card-body">
                                <h3 className="text-lg card-title">Escala de Calificaciones</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Excelente:</span>
                                        <span className="badge badge-success">9.0 - 10.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Muy Bien:</span>
                                        <span className="badge badge-info">8.0 - 8.9</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Bien:</span>
                                        <span className="badge badge-warning">7.0 - 7.9</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Suficiente:</span>
                                        <span className="badge badge-secondary">6.0 - 6.9</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Insuficiente:</span>
                                        <span className="badge badge-error">0.0 - 5.9</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
