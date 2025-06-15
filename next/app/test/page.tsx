'use client'

import { useState } from 'react'

export default function AltaAlumnoPage() {
    const [formulario, setFormulario] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        contrasena: '',
        grupoId: '',
        montoInscripcion: ''
    })

    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setCargando(true)
        setMensaje('')

        try {
            const res = await fetch('/api/alumnos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formulario,
                    grupoId: parseInt(formulario.grupoId),
                    montoInscripcion: parseFloat(formulario.montoInscripcion)
                })
            })

            const data = await res.json()
            if (data.ok) {
                setMensaje('✅ Alumno registrado correctamente.')
                setFormulario({
                    nombre: '',
                    correo: '',
                    telefono: '',
                    contrasena: '',
                    grupoId: '',
                    montoInscripcion: ''
                })
            } else {
                setMensaje(`❌ ${data.mensaje}`)
            }
        } catch (err) {
            setMensaje('❌ Error inesperado.')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white shadow p-8 rounded">
            <h1 className="text-2xl font-bold mb-6 text-center">Alta de Alumno</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre completo" className="input input-bordered w-full" required />
                <input name="correo" value={formulario.correo} onChange={handleChange} placeholder="Correo electrónico" className="input input-bordered w-full" type="email" required />
                <input name="telefono" value={formulario.telefono} onChange={handleChange} placeholder="Teléfono" className="input input-bordered w-full" required />
                <input name="contrasena" value={formulario.contrasena} onChange={handleChange} placeholder="Contraseña" className="input input-bordered w-full" type="password" required />
                <input name="grupoId" value={formulario.grupoId} onChange={handleChange} placeholder="ID del grupo" className="input input-bordered w-full" type="number" required />
                <input name="montoInscripcion" value={formulario.montoInscripcion} onChange={handleChange} placeholder="Monto de inscripción" className="input input-bordered w-full" type="number" step="0.01" required />

                <button className="btn btn-primary w-full" disabled={cargando}>
                    {cargando ? 'Registrando...' : 'Registrar Alumno'}
                </button>
            </form>

            {mensaje && <div className="mt-4 text-center">{mensaje}</div>}
        </div>
    )
}
