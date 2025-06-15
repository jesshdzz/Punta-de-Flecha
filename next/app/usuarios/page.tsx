"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, ArrowLeft, Shield, GraduationCap, Users, FileText } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import type { Usuario } from "@/types"
import Link from "next/link"

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filtro, setFiltro] = useState("")

  useEffect(() => {
    const db = BaseDatos.getInstance()
    setUsuarios(db.obtenerTodosUsuarios())
  }, [])

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.tipo.toLowerCase().includes(filtro.toLowerCase()),
  )

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "administrador":
        return <Shield className="h-4 w-4" />
      case "profesor":
        return <GraduationCap className="h-4 w-4" />
      case "secretaria":
        return <FileText className="h-4 w-4" />
      case "padre":
        return <Users className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case "administrador":
        return "bg-red-100 text-red-800"
      case "profesor":
        return "bg-blue-100 text-blue-800"
      case "secretaria":
        return "bg-green-100 text-green-800"
      case "padre":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administrar profesores, secretarias y administradores del sistema</p>
        </div>

        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Lista de Usuarios</CardTitle>
                <CardDescription>Total de usuarios: {usuariosFiltrados.length}</CardDescription>
              </div>
              <Link href="/usuarios/nuevo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Alta Usuario
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o tipo..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosFiltrados.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nombre}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getColorTipo(usuario.tipo)}>
                          <span className="flex items-center gap-1">
                            {getIconoTipo(usuario.tipo)}
                            {usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={usuario.activo ? "default" : "secondary"}
                          className={usuario.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatearFecha(usuario.fechaCreacion)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {usuariosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron usuarios que coincidan con la búsqueda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
