"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Download, Eye, ArrowLeft, BookOpen, FileText, Video, Presentation } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import type { MaterialEducativo } from "@/types"
import Link from "next/link"

export default function MaterialesPage() {
  const [materiales, setMateriales] = useState<MaterialEducativo[]>([])
  const [filtro, setFiltro] = useState("")

  useEffect(() => {
    const db = BaseDatos.getInstance()
    // Agregar algunos materiales de ejemplo
    const materialesEjemplo: MaterialEducativo[] = [
      {
        id: "mat_1",
        titulo: "Álgebra Básica - Capítulo 1",
        descripcion: "Introducción a las ecuaciones lineales",
        tipo: "documento",
        materiaId: "mat1",
        fechaSubida: new Date("2024-01-15"),
      },
      {
        id: "mat_2",
        titulo: "Video: Geometría Plana",
        descripcion: "Explicación de figuras geométricas básicas",
        tipo: "video",
        materiaId: "mat1",
        url: "https://example.com/video1",
        fechaSubida: new Date("2024-01-20"),
      },
      {
        id: "mat_3",
        titulo: "Presentación: Historia de México",
        descripción: "Revolución Mexicana - Contexto histórico",
        tipo: "presentacion",
        materiaId: "mat2",
        fechaSubida: new Date("2024-01-25"),
      },
    ]

    materialesEjemplo.forEach((material) => {
      db.crearMaterialEducativo(material)
    })

    setMateriales(db.obtenerMaterialesEducativos())
  }, [])

  const materialesFiltrados = materiales.filter(
    (material) =>
      material.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      material.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
      material.tipo.toLowerCase().includes(filtro.toLowerCase()),
  )

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "libro":
        return <BookOpen className="h-4 w-4" />
      case "documento":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "presentacion":
        return <Presentation className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case "libro":
        return "bg-blue-100 text-blue-800"
      case "documento":
        return "bg-green-100 text-green-800"
      case "video":
        return "bg-red-100 text-red-800"
      case "presentacion":
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Material Educativo</h1>
          <p className="text-gray-600">Consultar y gestionar recursos educativos del sistema</p>
        </div>

        <Card className="bg-white shadow-lg mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Biblioteca de Recursos</CardTitle>
                <CardDescription>Total de materiales: {materialesFiltrados.length}</CardDescription>
              </div>
              <Link href="/materiales/nuevo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Material
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, descripción o tipo..."
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
                    <TableHead>Título</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha Subida</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialesFiltrados.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.titulo}</TableCell>
                      <TableCell>{material.descripcion}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getColorTipo(material.tipo)}>
                          <span className="flex items-center gap-1">
                            {getIconoTipo(material.tipo)}
                            {material.tipo.charAt(0).toUpperCase() + material.tipo.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{formatearFecha(material.fechaSubida)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {materialesFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron materiales que coincidan con la búsqueda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
