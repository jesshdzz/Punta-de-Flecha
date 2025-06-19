"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, Plus, Search, Edit, Trash2, Eye, ArrowLeft } from "lucide-react"

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
    tutor: {
        nombre: string
        correo: string
        telefono: string
    } | null
}

export default function EstudiantesPage() {
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
    const [filteredEstudiantes, setFilteredEstudiantes] = useState<Estudiante[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterEstado, setFilterEstado] = useState("todos")
    const router = useRouter()

    useEffect(() => {
        fetchEstudiantes()
    }, [])

    useEffect(() => {
        filterEstudiantes()
    }, [estudiantes, searchTerm, filterEstado])

    const fetchEstudiantes = async () => {
        try {
            const response = await fetch("/api/estudiantes")
            const data = await response.json()

            if (data.ok) {
                setEstudiantes(data.estudiantes)
            } else {
                console.error("Error al obtener estudiantes:", data.mensaje)
            }
        } catch (error) {
            console.error("Error al obtener estudiantes:", error)
        } finally {
            setLoading(false)
        }
    }

    const filterEstudiantes = () => {
        let filtered = estudiantes

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(
                (estudiante) =>
                    estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    estudiante.correo.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        // Filtrar por estado
        if (filterEstado !== "todos") {
            filtered = filtered.filter((estudiante) => estudiante.estado === filterEstado)
        }

        setFilteredEstudiantes(filtered)
    }

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case "Activo":
                return "badge badge-success"
            case "BajaTemporal":
                return "badge badge-warning"
            case "BajaDefinitiva":
                return "badge badge-error"
            default:
                return "badge badge-ghost"
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
                <div className="flex-none">
                    <Link href="/estudiantes/nuevo" className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Nuevo Estudiante
                    </Link>
                </div>
            </div>

            <div className="container px-4 py-8 mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="flex items-center gap-2 mb-2 text-3xl font-bold text-base-content">
                        <Users className="w-8 h-8" />
                        Gestión de Estudiantes
                    </h1>
                    <p className="text-base-content/70">Administra los estudiantes registrados en el sistema</p>
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
                                        placeholder="Buscar por nombre o correo..."
                                        className="w-full input input-bordered"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-control">
                                <select
                                    className="select select-bordered"
                                    value={filterEstado}
                                    onChange={(e) => setFilterEstado(e.target.value)}
                                >
                                    <option value="todos">Todos los estados</option>
                                    <option value="Activo">Activos</option>
                                    <option value="BajaTemporal">Baja Temporal</option>
                                    <option value="BajaDefinitiva">Baja Definitiva</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
                    <div className="rounded-lg shadow stat bg-base-100">
                        <div className="stat-title">Total</div>
                        <div className="stat-value text-primary">{estudiantes.length}</div>
                    </div>
                    <div className="rounded-lg shadow stat bg-base-100">
                        <div className="stat-title">Activos</div>
                        <div className="stat-value text-success">{estudiantes.filter((a) => a.estado === "Activo").length}</div>
                    </div>
                    <div className="rounded-lg shadow stat bg-base-100">
                        <div className="stat-title">Baja Temporal</div>
                        <div className="stat-value text-warning">{estudiantes.filter((a) => a.estado === "BajaTemporal").length}</div>
                    </div>
                    <div className="rounded-lg shadow stat bg-base-100">
                        <div className="stat-title">Baja Definitiva</div>
                        <div className="stat-value text-error">{estudiantes.filter((a) => a.estado === "BajaDefinitiva").length}</div>
                    </div>
                </div>

                {/* Table */}
                <div className="shadow-lg card bg-base-100">
                    <div className="p-0 card-body">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Grupo</th>
                                        <th>Estado</th>
                                        <th>Tutor</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEstudiantes.map((estudiante) => (
                                        <tr key={estudiante.id}>
                                            <td>
                                                <div className="font-bold">{estudiante.nombre}</div>
                                                <div className="text-sm opacity-50">ID: {estudiante.id}</div>
                                            </td>
                                            <td>{estudiante.correo}</td>
                                            <td>{estudiante.telefono}</td>
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
                                                <span className={getEstadoBadge(estudiante.estado)}>{estudiante.estado}</span>
                                            </td>
                                            <td>
                                                {estudiante.tutor ? (
                                                    <div>
                                                        <div className="font-semibold">{estudiante.tutor.nombre}</div>
                                                        <div className="text-sm opacity-50">{estudiante.tutor.telefono}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-base-content/50">Sin tutor</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <Link href={`/estudiantes/${estudiante.id}`} className="btn btn-ghost btn-sm" title="Ver detalles">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link href={`/estudiantes/${estudiante.id}/editar`} className="btn btn-ghost btn-sm" title="Editar">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        className="btn btn-ghost btn-sm text-error"
                                                        title="Dar de baja"
                                                        onClick={() => router.push(`/estudiantes/${estudiante.id}/baja`)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredEstudiantes.length === 0 && (
                            <div className="py-8 text-center">
                                <Users className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                                <p className="text-base-content/70">
                                    {searchTerm || filterEstado !== "todos"
                                        ? "No se encontraron estudiantes con los filtros aplicados"
                                        : "No hay estudiantes registrados"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
