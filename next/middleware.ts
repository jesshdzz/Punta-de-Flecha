import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value
    const { pathname } = request.nextUrl

    const publicRoutes = ["/login", "/signup"]
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (token && !isPublicRoute) {
        try {
            const decoded = Buffer.from(token, "base64").toString("ascii")
            const [userId, role] = decoded.split(":")

            // Define role-based route restrictions
            const roleRoutes = {
                Estudiante: ["/dashboard", "/materiales", "/calificaciones", "/asistencias"],
                Profesor: ["/dashboard", "/materiales", "/calificaciones", "/asistencias"],
                Secretaria: ["/dashboard", "/estudiantes", "/reportes"],
                Administrador: [
                    "/dashboard",
                    "/estudiantes",
                    "/materiales",
                    "/calificaciones",
                    "/asistencias",
                    "/reportes",
                    "/usuarios",
                ],
                Padre_familia: ["/dashboard", "/calificaciones", "/asistencias"],
            }

            const allowedRoutes = roleRoutes[role as keyof typeof roleRoutes] || []
            const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route))

            if (!hasAccess) {
                return NextResponse.redirect(new URL("/accesoDenegado", request.url))
            }
        } catch (error) {
            // Invalid token, redirect to login
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
