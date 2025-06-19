"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
    const router = useRouter()

    useEffect(() => {
        // Redirigir automáticamente al dashboard
        router.push("/dashboard")
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    )
}
