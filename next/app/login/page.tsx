"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [formData, setFormData] = useState({
        correo: "",
        contrasena: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (data.ok) {
                router.push("/dashboard")
            } else {
                setError(data.mensaje || "Error al iniciar sesión")
            }
        } catch (error) {
            setError("Error de conexión")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md shadow-xl card bg-base-100">
                <div className="card-body">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-primary">PuntaFlecha</h1>
                        <p className="text-base-content/70">Sistema de Gestión Escolar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Correo electrónico</span>
                            </label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className="w-full input input-bordered"
                                placeholder="tu@correo.com"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Contraseña</span>
                            </label>
                            <input
                                type="password"
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                className="w-full input input-bordered"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="mt-6 form-control">
                            <button type="submit" className={`btn btn-primary w-full ${loading ? "loading" : ""}`} disabled={loading}>
                                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </button>
                        </div>
                    </form>

                    <div className="divider">Usuarios de prueba</div>
                    <div className="space-y-1 text-sm text-base-content/70">
                        <p>
                            <strong>Secretaria:</strong> secretaria@test.com / 123456
                        </p>
                        <p>
                            <strong>Profesor:</strong> profesor@test.com / 123456
                        </p>
                        <p>
                            <strong>Estudiante:</strong> estudiante@test.com / 123456
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
