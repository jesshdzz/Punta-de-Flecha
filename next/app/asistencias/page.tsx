"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Save, Search } from "lucide-react"

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

export default function AsistenciasPage() {
    const [materias, setMaterias] = useState<Materia[]>([])
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
    const [selectedMateria, setSelectedMateria] = useState("")
    const [selectedEstudiante, setSelectedEstudiante] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [asistencias, setAsistencias] = useState({
        parcial1: "",
        parcial2: "",
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

    const fetchAsistencias = async (estudianteId: number, materiaId: number) => {
        try {
            const response = await fetch(`/api/asistencias?id=${estudianteId}&materiaId=${materiaId}`)
            const data = await response.json()
            if (data.ok) {
                setAsistencias({
                    parcial1: data.asistencias.asis_p1.toString(),
                    parcial2: data.asistencias.asis_p2.toString(),
                    final: data.asistencias.asis_final.toString(),
                })
                setSelectedEstudiante(data.asistencias.estudianteId.toString())
                setSelectedMateria(data.asistencias.materiaId.toString())
            } else {
                setAsistencias({
                    parcial1: "",
                    parcial2: "",
                    final: "",
                })
                setSelectedEstudiante("")
                setSelectedMateria("")
                setErrors({ general: data.mensaje || "Error al obtener asistencias" })
            }
        } catch (error) {
            console.error("Error al obtener asistencias:", error)
            setErrors({ general: "Error de conexión" })
        }
    }

    useEffect(() => {
        if (selectedEstudiante && selectedMateria) {
            fetchAsistencias(Number.parseInt(selectedEstudiante), Number.parseInt(selectedMateria))
        } else {
            setAsistencias({
                parcial1: "",
                parcial2: "",
                final: "",
            })
        }
    }, [selectedEstudiante, selectedMateria])

    const handleAsistenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAsistencias((prev) => ({
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

        // Validar asistencias (números enteros >= 0)
        const campos = ["parcial1", "parcial2", "final"]
        campos.forEach((campo) => {
            const valor = Number.parseInt(asistencias[campo as keyof typeof asistencias])
            if (isNaN(valor) || valor < 0) {
                newErrors[campo] = "La asistencia debe ser un número entero mayor o igual a 0"
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
                asis_p1: Number.parseInt(asistencias.parcial1),
                asis_p2: Number.parseInt(asistencias.parcial2),
                asis_final: Number.parseInt(asistencias.final),
            }

            const response = await fetch("/api/asistencias", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (data.ok) {
                // Limpiar formulario
                setAsistencias({
                    parcial1: "",
                    parcial2: "",
                    final: "",
                })
                setSelectedEstudiante("")
                alert("Asistencias registradas correctamente")
            } else {
                setErrors({ general: data.mensaje || "Error al registrar asistencias" })
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
                        <FileText className="w-8 h-8" />
                        Registro de Asistencias
                    </h1>
                    <p className="text-base-content/70">Registra las asistencias de los estudiantes por materia y período</p>
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

                            {/* Asistencias */}
                            <div className="shadow-lg card bg-base-100">
                                <div className="card-body">
                                    <h2 className="mb-4 text-xl card-title">Registro de Asistencias</h2>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Primer Parcial *</span>
                                                <span className="label-text-alt">Porcentaje de asistencia</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="parcial1"
                                                value={asistencias.parcial1}
                                                onChange={handleAsistenciaChange}
                                                className={`input input-bordered ${errors.parcial1 ? "input-error" : ""}`}
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.parcial1 && <span className="text-sm text-error">{errors.parcial1}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Segundo Parcial *</span>
                                                <span className="label-text-alt">Porcentaje de asistencia</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="parcial2"
                                                value={asistencias.parcial2}
                                                onChange={handleAsistenciaChange}
                                                className={`input input-bordered ${errors.parcial2 ? "input-error" : ""}`}
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.parcial2 && <span className="text-sm text-error">{errors.parcial2}</span>}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text-alt">Porcentaje de asistencia Total</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="final"
                                                value={asistencias.final}
                                                className={`input input-bordered ${errors.final ? "input-error" : ""}`}
                                                placeholder="0"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/* Información adicional */}
                                    <div className="p-4 mt-4 rounded-lg bg-base-200">
                                        <h4 className="mb-2 font-semibold">Información:</h4>
                                        <ul className="space-y-1 text-sm text-base-content/70">
                                            <li>• Registre el porcentaje de asistencia que el estudiante tuvo durante el parcial</li>
                                            <li>• Los parciales corresponden a períodos específicos del semestre</li>
                                            <li>• El total final es el cálculo automático de asistencias totales</li>
                                            <li>• Use números enteros</li>
                                        </ul>
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
                                            Registrar Asistencias
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
                                <h3 className="text-lg card-title">Estadísticas</h3>
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
                                <h3 className="text-lg card-title">Criterios de Asistencia</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Excelente:</span>
                                        <span className="badge badge-success">95% - 100%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Muy Buena:</span>
                                        <span className="badge badge-info">85% - 94%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Buena:</span>
                                        <span className="badge badge-warning">75% - 84%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Regular:</span>
                                        <span className="badge badge-secondary">65% - 74%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Deficiente:</span>
                                        <span className="badge badge-error">{"<"} 65%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shadow-lg card bg-base-100">
                            <div className="card-body">
                                <h3 className="text-lg card-title">Recordatorio</h3>
                                <p className="text-sm text-base-content/70">
                                    La asistencia es fundamental para el aprovechamiento académico. Mantenga un registro preciso para
                                    ayudar a identificar estudiantes que requieren apoyo adicional.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
