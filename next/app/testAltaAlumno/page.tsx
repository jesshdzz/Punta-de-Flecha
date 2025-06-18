'use client'

import { useState } from 'react'

export default function AltaAlumnoPage() {
    const [formulario, setFormulario] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        contrasena: '',
        grupoId: '',
        montoInscripcion: '',
        documentos: [] as File[],
        tutor: {
            nombre: '',
            correo: '',
            telefono: '',
            domicilio: ''
        }
    })

    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Manejo especial para campos anidados como tutor
        if (e.target.name.startsWith('tutor.')) {
            const field = e.target.name.split('.')[1]
            setFormulario({
                ...formulario,
                tutor: {
                    ...formulario.tutor,
                    [field]: e.target.value
                }
            })
            return
        }

        setFormulario({ ...formulario, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setCargando(true)
        setMensaje('')

        try {
            const res = await fetch('/api/alumnos/alta', {
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
                    montoInscripcion: '',
                    documentos: [],
                    tutor: {
                        nombre: '',
                        correo: '',
                        telefono: '',
                        domicilio: ''
                    }
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
                <input name="tutor.nombre" value={formulario.tutor.nombre} onChange={handleChange} placeholder="Nombre del tutor" className="input input-bordered w-full" required />
                <input name="tutor.correo" value={formulario.tutor.correo} onChange={handleChange} placeholder="Correo del tutor" className="input input-bordered w-full" type="email" required />
                <input name="tutor.telefono" value={formulario.tutor.telefono} onChange={handleChange} placeholder="Teléfono del tutor" className="input input-bordered w-full" required />
                <input name="tutor.domicilio" value={formulario.tutor.domicilio} onChange={handleChange} placeholder="Domicilio del tutor" className="input input-bordered w-full" required />
                <div className="mt-4">
                    <label className="block mb-2">Documentos (opcional):</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files || [])
                            setFormulario({ ...formulario, documentos: files })
                        }}
                        className="file-input file-input-bordered w-full"
                    />
                </div>                

                <button className="btn btn-primary w-full" disabled={cargando}>
                    {cargando ? 'Registrando...' : 'Registrar Alumno'}
                </button>
            </form>

            {mensaje && <div className="mt-4 text-center">{mensaje}</div>}
        </div>
    )
}
