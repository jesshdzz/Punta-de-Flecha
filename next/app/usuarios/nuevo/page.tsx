"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { SistemaValidacion } from "@/lib/sistema-validacion"
import type { Usuario, Profesor, Administrador, PersonalSecretaria } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NuevoUsuarioPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    tipo: "" as "administrador" | "profesor" | "secretaria" | "padre" | "",
  })
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)
  const router = useRouter()

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (!SistemaValidacion.validarNombre(formData.nombre)) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres"
    }

    if (!SistemaValidacion.validarEmail(formData.email)) {
      nuevosErrores.email = "Ingrese un email válido"
    }

    if (!SistemaValidacion.validarPassword(formData.password)) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!formData.tipo) {
      nuevosErrores.tipo = "Seleccione un tipo de usuario"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setGuardando(true)

    try {
      const db = BaseDatos.getInstance()

      let nuevoUsuario: Usuario
      const baseUser = {
        id: "usr_" + Date.now().toString(),
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        tipo: formData.tipo,
        fechaCreacion: new Date(),
        activo: true,
      }

      switch (formData.tipo) {
        case "profesor":
          nuevoUsuario = {
            ...baseUser,
            materias: [],
            grupos: [],
          } as Profesor
          break
        case "administrador":
          nuevoUsuario = {
            ...baseUser,
            permisos: ["all"],
          } as Administrador
          break
        case "secretaria":
          nuevoUsuario = {
            ...baseUser,
            departamento: "Administración",
          } as PersonalSecretaria
          break
        default:
          nuevoUsuario = baseUser as Usuario
      }

      if (db.crearUsuario(nuevoUsuario)) {
        alert("Usuario registrado exitosamente")
        router.push("/usuarios")
      } else {
        alert("Error: El usuario ya existe")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al registrar el usuario")
    } finally {
      setGuardando(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errores[field]) {
      setErrores((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/usuarios">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Usuarios
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alta de Usuario</h1>
          <p className="text-gray-600">Registrar un nuevo usuario en el sistema</p>
        </div>

        <Card className="bg-white shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>Complete todos los campos requeridos para registrar al usuario</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ingrese el nombre completo"
                  className={errores.nombre ? "border-red-500" : ""}
                />
                {errores.nombre && <p className="text-sm text-red-500">{errores.nombre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="usuario@escuela.com"
                  className={errores.email ? "border-red-500" : ""}
                />
                {errores.email && <p className="text-sm text-red-500">{errores.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={errores.password ? "border-red-500" : ""}
                />
                {errores.password && <p className="text-sm text-red-500">{errores.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Usuario *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                  <SelectTrigger className={errores.tipo ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccione el tipo de usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="profesor">Profesor</SelectItem>
                    <SelectItem value="secretaria">Personal de Secretaría</SelectItem>
                    <SelectItem value="padre">Padre de Familia</SelectItem>
                  </SelectContent>
                </Select>
                {errores.tipo && <p className="text-sm text-red-500">{errores.tipo}</p>}
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/usuarios" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={guardando} className="flex-1">
                  {guardando ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Registrar Usuario
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
