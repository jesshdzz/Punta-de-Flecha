"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Download, Eye, ArrowLeft, BookOpen, FileText, Video, Presentation } from "lucide-react"
import { BaseDatos } from "@/lib/database"
import { FileStorage } from "@/lib/file-storage"
import type { MaterialEducativo } from "@/types"
import Link from "next/link"

// Convierte base64 a Blob URL
function base64ToBlobUrl(data: string): string {
  const [, base64] = data.includes(',') ? data.split(',') : ['', data]
  const mime = data.split(',')[0].split(':')[1].split(';')[0] || ''
  const byteChars = atob(base64)
  const byteNumbers = new Uint8Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i)
  const blob = new Blob([byteNumbers], { type: mime }) // :contentReference[oaicite:1]{index=1}
  return URL.createObjectURL(blob)
}

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
        descripcion: "Revolución Mexicana - Contexto histórico",
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

  const handlePrevisualizar = (materialId: string, tipo: string) => {
    if (tipo === "video") {
      // Para videos, mostrar URL o abrir en nueva ventana
      const material = materiales.find((m) => m.id === materialId)
      if (material?.url) {
        window.open(material.url, "_blank")
      } else {
        alert("No hay URL disponible para este video")
      }
      return
    }

    // Para archivos, usar el sistema de almacenamiento
    const archivo = FileStorage.obtenerArchivo(materialId)
    if (archivo) {
      if (FileStorage.previsualizarArchivo(materialId)) {
        console.log("Archivo previsualizado exitosamente")
      } else {
        alert("Error al previsualizar el archivo")
      }
    } else {
      alert("No hay archivo disponible para previsualizar")
    }
  }

  const handleDescargar = (materialId: string, tipo: string) => {
    if (tipo === "video") {
      // Para videos, copiar URL al portapapeles
      const material = materiales.find((m) => m.id === materialId)
      if (material?.url) {
        navigator.clipboard
          .writeText(material.url)
          .then(() => {
            alert("URL del video copiada al portapapeles")
          })
          .catch(() => {
            alert(`URL del video: ${material.url}`)
          })
      } else {
        alert("No hay URL disponible para este video")
      }
      return
    }

    // Para archivos, usar el sistema de almacenamiento
    const archivo = FileStorage.obtenerArchivo(materialId)
    if (archivo) {
      if (FileStorage.descargarArchivo(materialId)) {
        console.log("Archivo descargado exitosamente")
      } else {
        alert("Error al descargar el archivo")
      }
    } else {
      alert("No hay archivo disponible para descargar")
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-green-900/30">
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

          <h1 className="text-3xl font-bold text-base-content mb-2">Material Educativo</h1>
          <p className="text-base-content/70">Consultar y gestionar recursos educativos del sistema</p>
        </div>

        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Biblioteca de Recursos</CardTitle>
                <CardDescription>Total de materiales: {materialesFiltrados.length}</CardDescription>
              </div>
              <Link href="/materiales/nuevo">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:text-white">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrevisualizar(material.id, material.tipo)}
                            title="Previsualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDescargar(material.id, material.tipo)}
                            title="Descargar"
                          >
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
