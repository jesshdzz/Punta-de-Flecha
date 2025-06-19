"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Download, Search, Calendar, User, Tag, FileText } from "lucide-react"

interface Material {
    id: number
    titulo: string
    descripcion: string
    categoria: string
    fecha: string
    profesor: {
        id: number
        nombre: string
    }
    grupo: {
        id: number
        nombre: string
        grado: number
    }
    archivos: Array<{
        id: number
        nombreArchivo: string
        urlNube: string
    }>
}

export default function MaterialesEstudiantePage() {
    const [materiales, setMateriales] = useState<Material[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategoria, setFilterCategoria] = useState("todas")

    useEffect(() => {
        fetchMateriales()
    }, [])

    const fetchMateriales = async () => {
        try {
            const response = await fetch("/api/materiales")
            const data = await response.json()
            if (data.ok) {
                setMateriales(data.materiales)
            }
        } catch (error) {
            console.error("Error al obtener materiales:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredMateriales = materiales.filter((material) => {
        const matchesSearch =
            material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategoria = filterCategoria === "todas" || material.categoria === filterCategoria
        return matchesSearch && matchesCategoria
    })

    const categorias = ["Matemáticas", "Lenguaje", "Ciencias", "Historia", "Otro"]

    const handleDownload = (archivo: Material["archivos"][0]) => {
        window.open(archivo.urlNube, "_blank")
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
                        <BookOpen className="w-8 h-8" />
                        Materiales Educativos
                    </h1>
                    <p className="text-base-content/70">Accede y descarga los materiales de tus materias</p>
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
                                        placeholder="Buscar materiales..."
                                        className="w-full input input-bordered"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-control">
                                <select
                                    className="select select-bordered"
                                    value={filterCategoria}
                                    onChange={(e) => setFilterCategoria(e.target.value)}
                                >
                                    <option value="todas">Todas las categorías</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria} value={categoria}>
                                            {categoria}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Materials Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMateriales.map((material) => (
                        <div key={material.id} className="transition-shadow shadow-lg card bg-base-100 hover:shadow-xl">
                            <div className="card-body">
                                <div className="flex items-start justify-between mb-2">
                                    <h2 className="text-lg card-title line-clamp-2">{material.titulo}</h2>
                                    <div className="badge badge-primary badge-sm">{material.categoria}</div>
                                </div>

                                <p className="mb-4 text-sm text-base-content/70 line-clamp-3">{material.descripcion}</p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-base-content/60">
                                        <User className="w-4 h-4" />
                                        <span>{material.profesor.nombre}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-base-content/60">
                                        <Tag className="w-4 h-4" />
                                        <span>
                                            Grupo {material.grupo.nombre} - Grado {material.grupo.grado}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-base-content/60">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(material.fecha).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="my-4 divider"></div>

                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                                        <FileText className="w-4 h-4" />
                                        Archivos disponibles:
                                    </h4>
                                    {material.archivos.map((archivo) => (
                                        <div key={archivo.id} className="flex items-center gap-2 p-2 rounded bg-base-200">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="flex-1 text-sm truncate">{archivo.nombreArchivo}</span>
                                            <button className="btn btn-primary btn-xs" onClick={() => handleDownload(archivo)}>
                                                <Download className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="justify-end mt-4 card-actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            // Download all files
                                            material.archivos.forEach((archivo) => handleDownload(archivo))
                                        }}
                                    >
                                        <Download className="w-4 h-4" />
                                        Descargar Todo
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMateriales.length === 0 && (
                    <div className="py-12 text-center">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                        <p className="mb-4 text-lg text-base-content/70">
                            {searchTerm || filterCategoria !== "todas"
                                ? "No se encontraron materiales con los filtros aplicados"
                                : "No hay materiales disponibles"}
                        </p>
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
                    <div className="shadow-lg stat bg-base-100">
                        <div className="stat-title">Total Materiales</div>
                        <div className="stat-value text-primary">{materiales.length}</div>
                    </div>
                    <div className="shadow-lg stat bg-base-100">
                        <div className="stat-title">Categorías</div>
                        <div className="stat-value text-secondary">{new Set(materiales.map((m) => m.categoria)).size}</div>
                    </div>
                    <div className="shadow-lg stat bg-base-100">
                        <div className="stat-title">Profesores</div>
                        <div className="stat-value text-accent">{new Set(materiales.map((m) => m.profesor.id)).size}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
