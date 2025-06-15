"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SistemaAutenticacion } from "@/lib/auth"
import type { Usuario } from "@/types"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string[]
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole, redirectTo = "/login" }: AuthGuardProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = SistemaAutenticacion.obtenerUsuarioActual()

      if (!currentUser) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && !requiredRole.includes(currentUser.tipo)) {
        router.push("/unauthorized")
        return
      }

      setUsuario(currentUser)
      setLoading(false)
    }

    checkAuth()
  }, [router, requiredRole, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return usuario ? <>{children}</> : null
}
