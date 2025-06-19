"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, BookOpen, GraduationCap, FileText, BarChart3, UserPlus, Settings, LogOut } from "lucide-react"

interface Usuario {
    id: number
    nombre: string
    correo: string
    puesto: string
}

export default function DashboardPage() {
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchUsuario()
    }, [])

    const fetchUsuario = async () => {
        try {
            const response = await fetch("/api/auth/me")
            const data = await response.json()

            if (data.ok) {
                setUsuario(data.usuario)
            } else {
                router.push("/login")
            }
        } catch (error) {
            console.error("Error al obtener usuario:", error)
            router.push("/login")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            router.push("/login")
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    const menuItems = [
        {
            title: "Gestión de Estudiantes",
            description: "Administrar estudiantes, altas, bajas y actualizaciones",
            icon: Users,
            href: "/estudiantes",
            color: "bg-blue-500",
            roles: ["Secretaria", "Administrador"],
        },
        {
            title: "Material Educativo",
            description:
                usuario?.puesto === "Estudiante"
                    ? "Ver y descargar materiales de clase"
                    : "Subir y gestionar materiales de clase",
            icon: BookOpen,
            href: usuario?.puesto === "Estudiante" ? "/materiales/estudiante" : "/materiales",
            color: "bg-green-500",
            roles: ["Profesor", "Administrador", "Estudiante"],
        },
        {
            title: "Calificaciones",
            description:
                usuario?.puesto === "Estudiante" ? "Consultar tus calificaciones" : "Registrar y consultar calificaciones",
            icon: GraduationCap,
            href: "/calificaciones",
            color: "bg-purple-500",
            roles: ["Profesor", "Administrador", "Estudiante", "Padre_familia"],
        },
        {
            title: "Asistencias",
            description:
                usuario?.puesto === "Estudiante" ? "Consultar tus asistencias" : "Control de asistencias por materia",
            icon: FileText,
            href: "/asistencias",
            color: "bg-orange-500",
            roles: ["Profesor", "Administrador", "Estudiante", "Padre_familia"],
        },
        {
            title: "Reportes",
            description: "Generar reportes y estadísticas",
            icon: BarChart3,
            href: "/reportes",
            color: "bg-red-500",
            roles: ["Administrador", "Secretaria"],
        },
    ]

    const filteredMenuItems = menuItems.filter((item) => item.roles.includes(usuario?.puesto || ""))

    return (
        <div className="min-h-screen bg-base-200">
            {/* Navbar */}
            <div className="shadow-lg navbar bg-base-100">
                <div className="flex-1">
                    <Link href="/dashboard" className="text-xl font-bold btn btn-ghost text-primary">
                        PuntaFlecha
                    </Link>
                </div>
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="flex items-center justify-center w-10 rounded-full bg-primary text-primary-content">
                                {usuario?.nombre.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li className="menu-title">
                                <span>{usuario?.nombre}</span>
                                <span className="text-xs opacity-60">{usuario?.puesto}</span>
                            </li>
                            <li>
                                <a>
                                    <Settings className="w-4 h-4" />
                                    Configuración
                                </a>
                            </li>
                            <li>
                                <a onClick={handleLogout}>
                                    <LogOut className="w-4 h-4" />
                                    Cerrar Sesión
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 py-8 mx-auto">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-base-content">Bienvenido, {usuario?.nombre}</h1>
                    <p className="text-base-content/70">Panel de control - {usuario?.puesto}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                    <div className="rounded-lg shadow stat bg-base-100">
                        <div className="stat-figure text-primary">
                            <Users className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Total Estudiantes</div>
                        <div className="stat-value text-primary">150</div>
                        <div className="stat-desc">↗︎ 12 nuevos este mes</div>
                    </div>

                    <div className="rounded-lg shadow stat bg-base-100">
                        <div className="stat-figure text-secondary">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Materiales</div>
                        <div className="stat-value text-secondary">45</div>
                        <div className="stat-desc">↗︎ 8 subidos esta semana</div>
                    </div>

                    <div className="rounded-lg shadow stat bg-base-100">
                        <div className="stat-figure text-accent">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Promedio General</div>
                        <div className="stat-value text-accent">8.5</div>
                        <div className="stat-desc">↗︎ +0.3 vs mes anterior</div>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMenuItems.map((item, index) => {
                        const IconComponent = item.icon
                        return (
                            <Link key={index} href={item.href}>
                                <div className="transition-shadow shadow-lg cursor-pointer card bg-base-100 hover:shadow-xl">
                                    <div className="card-body">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`p-3 rounded-lg ${item.color} text-white`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg card-title">{item.title}</h2>
                                            </div>
                                        </div>
                                        <p className="text-base-content/70">{item.description}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Quick Actions */}
                {usuario?.puesto === "Secretaria" && (
                    <div className="mt-8">
                        <h2 className="mb-4 text-2xl font-bold">Acciones Rápidas</h2>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/estudiantes/nuevo" className="btn btn-primary">
                                <UserPlus className="w-4 h-4" />
                                Registrar Nuevo Estudiante
                            </Link>
                            <Link href="/estudiantes" className="btn btn-outline">
                                <Users className="w-4 h-4" />
                                Ver Todos los Estudiantes
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
