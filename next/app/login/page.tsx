"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, Eye, EyeOff } from "lucide-react"
import { SistemaAutenticacion } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await SistemaAutenticacion.iniciarSesion(formData.email, formData.password)

      if (result.success && result.usuario) {
        // Redirigir según el tipo de usuario
        switch (result.usuario.tipo) {
          case "administrador":
            router.push("/dashboard/admin")
            break
          case "profesor":
            router.push("/dashboard/profesor")
            break
          case "secretaria":
            router.push("/dashboard/secretaria")
            break
          case "padre":
            router.push("/dashboard/padre")
            break
          case "estudiante":
            router.push("/dashboard/estudiante")
            break
          default:
            router.push("/dashboard")
        }
      } else {
        setError(result.error || "Error al iniciar sesión")
      }
    } catch (error) {
      setError("Error del sistema. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</CardTitle>
          <CardDescription className="dark:text-gray-300">Sistema de Administración Escolar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="usuario@escuela.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 dark:text-white">Usuarios de prueba:</h4>
            <div className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
              <div>
                <strong>Admin:</strong> admin@escuela.com / admin123
              </div>
              <div>
                <strong>Profesor:</strong> juan@escuela.com / prof123
              </div>
              <div>
                <strong>Secretaria:</strong> secretaria@escuela.com / sec123
              </div>
              <div>
                <strong>Padre:</strong> padre@escuela.com / padre123
              </div>
              <div>
                <strong>Estudiante:</strong> estudiante@escuela.com / est123
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
