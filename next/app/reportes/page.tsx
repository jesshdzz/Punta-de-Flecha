"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, Users, FileText, Download, Eye } from "lucide-react"

interface Estadisticas {
    totalEstudiantes: number
    estudiantesActivos: number
    totalProfesores: number
    totalMaterias: number
    totalMateriales: number
    promedioCalificaciones: number
    promedioAsistencias: number
    tramitesRecientes: number
    estudiantesPorGrado: number
}

export default function ReportesPage() {
    const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEstadisticas()
    }, [])

    const fetchEstadisticas = async () => {
        try {
            const response = await fetch("/api/reportes/estadisticas-generales")
            const data = await response.json()
            if (data.ok) {
                setEstadisticas(data.estadisticas)
            }
        } catch (error) {
            console.error("Error al obtener estadísticas:", error)
        } finally {
            setLoading(false)
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
                    <Link href="/dashboard" className="btn btn-ghost">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>
                </div>
            </div>

            <div className="container px-4 py-8 mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="flex items-center gap-2 mb-2 text-3xl font-bold text-base-content">
                        <BarChart3 className="w-8 h-8" />
                        Centro de Reportes
                    </h1>
                    <p className="text-base-content/70">Estadísticas y reportes del sistema educativo</p>
                </div>

                {/* General Statistics */}
                {estadisticas && (
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="shadow-lg stat bg-base-100">
                            <div className="stat-figure text-primary">
                                <Users className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Total Estudiantes</div>
                            <div className="stat-value text-primary">{estadisticas.totalEstudiantes}</div>
                            <div className="stat-desc">{estadisticas.estudiantesActivos} activos</div>
                        </div>

                        <div className="shadow-lg stat bg-base-100">
                            <div className="stat-figure text-secondary">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Materiales</div>
                            <div className="stat-value text-secondary">{estadisticas.totalMateriales}</div>
                            <div className="stat-desc">{estadisticas.totalMaterias} materias</div>
                        </div>

                        <div className="shadow-lg stat bg-base-100">
                            <div className="stat-figure text-accent">
                                <BarChart3 className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Promedio General</div>
                            <div className="stat-value text-accent">{estadisticas.promedioCalificaciones.toFixed(1)}</div>
                            <div className="stat-desc">Calificaciones</div>
                        </div>

                        <div className="shadow-lg stat bg-base-100">
                            <div className="stat-figure text-info">
                                <Users className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Asistencia</div>
                            <div className="stat-value text-info">{estadisticas.promedioAsistencias.toFixed(0)}%</div>
                            <div className="stat-desc">Promedio general</div>
                        </div>
                    </div>
                )}

                {/* Report Categories */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Student Reports */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 card-title">
                                <Users className="w-5 h-5 text-primary" />
                                Reportes de Estudiantes
                            </h2>
                            <p className="text-base-content/70">
                                Información detallada sobre estudiantes, calificaciones y asistencias
                            </p>
                            <div className="justify-end card-actions">
                                <Link href="/reportes/estudiantes" className="btn btn-primary btn-sm">
                                    <Eye className="w-4 h-4" />
                                    Ver Reportes
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Academic Reports */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 card-title">
                                <BarChart3 className="w-5 h-5 text-secondary" />
                                Reportes Académicos
                            </h2>
                            <p className="text-base-content/70">Análisis de rendimiento académico y estadísticas de calificaciones</p>
                            <div className="justify-end card-actions">
                                <Link href="/reportes/academicos" className="btn btn-secondary btn-sm">
                                    <Eye className="w-4 h-4" />
                                    Ver Reportes
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Material Reports */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 card-title">
                                <FileText className="w-5 h-5 text-accent" />
                                Reportes de Materiales
                            </h2>
                            <p className="text-base-content/70">Estadísticas de uso y distribución de materiales educativos</p>
                            <div className="justify-end card-actions">
                                <Link href="/reportes/materiales" className="btn btn-accent btn-sm">
                                    <Eye className="w-4 h-4" />
                                    Ver Reportes
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Financial Reports */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 card-title">
                                <BarChart3 className="w-5 h-5 text-info" />
                                Reportes Financieros
                            </h2>
                            <p className="text-base-content/70">Información sobre pagos, inscripciones y estados financieros</p>
                            <div className="justify-end card-actions">
                                <button className="btn btn-info btn-sm" disabled>
                                    <Download className="w-4 h-4" />
                                    Próximamente
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Administrative Reports */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 card-title">
                                <Users className="w-5 h-5 text-warning" />
                                Reportes Administrativos
                            </h2>
                            <p className="text-base-content/70">Trámites, bajas, reinscripciones y actividad del sistema</p>
                            <div className="justify-end card-actions">
                                <button className="btn btn-warning btn-sm" disabled>
                                    <Download className="w-4 h-4" />
                                    Próximamente
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Custom Reports */}
                    <div className="shadow-lg card bg-base-100">
                        <div className="card-body">
                            <h2 className="flex items-center gap-2 card-title">
                                <FileText className="w-5 h-5 text-error" />
                                Reportes Personalizados
                            </h2>
                            <p className="text-base-content/70">Crea reportes personalizados según tus necesidades específicas</p>
                            <div className="justify-end card-actions">
                                <Link href="/reportes/personalizado" className="btn btn-error btn-sm">
                                    <Eye className="w-4 h-4" />
                                    Crear Reporte
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="mb-4 text-2xl font-bold">Acciones Rápidas</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/reportes/estudiantes" className="btn btn-primary">
                            <Users className="w-4 h-4" />
                            Ver Estudiantes por Grupo
                        </Link>
                        <button className="btn btn-outline" onClick={() => window.print()}>
                            <Download className="w-4 h-4" />
                            Imprimir Estadísticas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
