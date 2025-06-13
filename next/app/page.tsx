"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SistemaAutenticacion } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const usuario = SistemaAutenticacion.obtenerUsuarioActual()

    if (usuario) {
      // Redirigir según el tipo de usuario
      switch (usuario.tipo) {
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
          router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

// Dashboard component can be kept as is for now, as it seems to be a separate page
// If needed, it can be integrated into the HomePage component later
