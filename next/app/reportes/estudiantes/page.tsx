"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Search, Download, Eye } from "lucide-react"

interface Grupo {
    id: number
    nombre: string
    grado: number
}

interface Estudiante {
    id: number
    nombre: string
    correo: string
    telefono: string
    estado: string
    grupo: {
        id: number
        nombre: string
        grado: number
    } | null
    calificaciones: Array<{
        materia: string
        parcial1: number
        parcial2: number
        ordinario: number
        final: number
    }>
    asistencias: Array<{
        materia: string
        parcial1: number
        parcial2: number
        final: number
    }>
}

export default function ReporteEstudiantesPage() {
    const [grupos, setGrupos] = useState<Grupo[]>([])
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
    const [selectedGrupo, setSelectedGrupo] = useState("")
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchGrupos()
        fetchEstudiantes()
    }, [])

    useEffect(() => {
        if (selectedGrupo) {
            fetchEstudiantes(selectedGrupo)
        } else {
            fetchEstudiantes()
        }
    }, [selectedGrupo])

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

    const fetchEstudiantes = async (grupoId?: string) => {
        try {
            const url = grupoId
                ? `/api/reportes/estudiantes-por-grupo?grupoId=${grupoId}`
                : "/api/reportes/estudiantes-por-grupo"

            const response = await fetch(url)
            const data = await response.json()
            if (data.ok) {
                setEstudiantes(data.estudiantes)
            }
        } catch (error) {
            console.error("Error al obtener estudiantes:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredEstudiantes = estudiantes.filter(
        (estudiante) =>
            estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.correo.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const getPromedioCalificaciones = (calificaciones: Estudiante["calificaciones"]) => {
        if (calificaciones.length === 0) return "0.0"
        const suma = calificaciones.reduce((acc, cal) => acc + cal.final, 0)
        return (suma / calificaciones.length).toFixed(1)
    }

    const getPromedioAsistencias = (asistencias: Estudiante["asistencias"]) => {
        if (asistencias.length === 0) return 0
        const suma = asistencias.reduce((acc, asis) => acc + asis.final, 0)
        return Math.round(suma / asistencias.length)
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
                    <Link href="/reportes" className="btn btn-ghost">
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Reportes
                    </Link>
                </div>
                <div className="flex-none">
                    <button className="btn btn-primary" onClick={() => window.print()}>
                        <Download className="w-4 h-4" />
                        Imprimir
                    </button>
                </div>
            </div>

            <div className="container px-4 py-8 mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="flex items-center gap-2 mb-2 text-3xl font-bold text-base-content">
                        <Users className="w-8 h-8" />
                        Reporte de Estudiantes
                    </h1>
                    <p className="text-base-content/70">Vista detallada de estudiantes con calificaciones y asistencias</p>
                </div>

                {/* Filters */}
                <div className="mb-6 shadow-lg card bg-base-100">
                    <div className="card-body">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1 form-control">
                                <div className="input-group">
                                    <span>
                                        <Search className="w-4 h-4" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Buscar estudiante..."
                                        className="w-full input input-bordered"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-control">
                                <select
                                    className="select select-bordered"
                                    value={selectedGrupo}
                                    onChange={(e) => setSelectedGrupo(e.target.value)}
                                >
                                    <option value="">Todos los grupos</option>
                                    {grupos.map((grupo) => (
                                        <option key={grupo.id} value={grupo.id}>
                                            {grupo.nombre} - Grado {grupo.grado}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="shadow-lg card bg-base-100">
                    <div className="p-0 card-body">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Estudiante</th>
                                        <th>Grupo</th>
                                        <th>Estado</th>
                                        <th>Promedio Calificaciones</th>
                                        <th>Promedio Asistencias</th>
                                        <th>Materias</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEstudiantes.map((estudiante) => (
                                        <tr key={estudiante.id}>
                                            <td>
                                                <div>
                                                    <div className="font-bold">{estudiante.nombre}</div>
                                                    <div className="text-sm opacity-50">{estudiante.correo}</div>
                                                </div>
                                            </td>
                                            <td>
                                                {estudiante.grupo ? (
                                                    <div>
                                                        <div className="font-semibold">{estudiante.grupo.nombre}</div>
                                                        <div className="text-sm opacity-50">Grado {estudiante.grupo.grado}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-base-content/50">Sin grupo</span>
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${estudiante.estado === "Activo"
                                                            ? "badge-success"
                                                            : estudiante.estado === "BajaTemporal"
                                                                ? "badge-warning"
                                                                : "badge-error"
                                                        }`}
                                                >
                                                    {estudiante.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold">
                                                        {getPromedioCalificaciones(estudiante.calificaciones)}
                                                    </div>
                                                    <div className="text-sm opacity-50">{estudiante.calificaciones.length} materias</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold">{getPromedioAsistencias(estudiante.asistencias)}%</div>
                                                    <div className="text-sm opacity-50">{estudiante.asistencias.length} materias</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-center">
                                                    {Math.max(estudiante.calificaciones.length, estudiante.asistencias.length)}
                                                </div>
                                            </td>
                                            <td>
                                                <Link
                                                    href={`/reportes/estudiantes/${estudiante.id}`}
                                                    className="btn btn-ghost btn-sm"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredEstudiantes.length === 0 && (
                            <div className="py-8 text-center">
                                <Users className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                                <p className="text-base-content/70">No se encontraron estudiantes con los filtros aplicados</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-4">
                    <div className="shadow-lg stat bg-base-100">
                        <div className="stat-title">Total Estudiantes</div>
                        <div className="stat-value text-primary">{filteredEstudiantes.length}</div>
                    </div>
                    <div className="shadow-lg stat bg-base-100">
                        <div className="stat-title">Estudiantes Activos</div>
                        <div className="stat-value text-success">
                            {filteredEstudiantes.filter((e) => e.estado === "Activo").length}
                        </div>
                    </div>
                    <div className="shadow-lg stat bg-base-100">
                        <div className="stat-title">Promedio General</div>
                        <div className="stat-value text-accent">
                            {filteredEstudiantes.length > 0
                                ? (
                                    filteredEstudiantes
                                        .map((e) => Number.parseFloat(getPromedioCalificaciones(e.calificaciones)))
                                        .reduce((a, b) => a + b, 0) / filteredEstudiantes.length
                                ).toFixed(1)
                                : "0.0"}
                        </div>
                    </div>
                    <div className="shadow-lg stat bg-base-100">
                        <div className="stat-title">Asistencia Promedio</div>
                        <div className="stat-value text-info">
                            {filteredEstudiantes.length > 0
                                ? Math.round(
                                    filteredEstudiantes.map((e) => getPromedioAsistencias(e.asistencias)).reduce((a, b) => a + b, 0) /
                                    filteredEstudiantes.length,
                                )
                                : 0}
                            %
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
