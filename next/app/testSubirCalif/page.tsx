'use client'

import { useState } from 'react'

export default function SubirCalificacionPage() {
  const [formulario, setFormulario] = useState({
    estudianteId: '',
    materiaId: '',
    parcial1: '',
    parcial2: '',
    examenFinal: '',
    asistencias: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')
    setCargando(true)

    try {
      const res = await fetch('/api/calificaciones/subir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estudianteId: parseInt(formulario.estudianteId),
          materiaId: parseInt(formulario.materiaId),
          parcial1: parseFloat(formulario.parcial1),
          parcial2: parseFloat(formulario.parcial2),
          examenFinal: parseFloat(formulario.examenFinal),
          asistencias: parseInt(formulario.asistencias)
        })
      })

      const data = await res.json()
      if (data.ok) {
        setMensaje('✅ Calificación registrada con éxito.')
        setFormulario({
          estudianteId: '',
          materiaId: '',
          parcial1: '',
          parcial2: '',
          examenFinal: '',
          asistencias: ''
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
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Subir Calificación</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="estudianteId" value={formulario.estudianteId} onChange={handleChange} placeholder="ID del Estudiante" type="number" className="input input-bordered w-full" required />
        <input name="materiaId" value={formulario.materiaId} onChange={handleChange} placeholder="ID de la Materia" type="number" className="input input-bordered w-full" required />
        <input name="parcial1" value={formulario.parcial1} onChange={handleChange} placeholder="Calificación Parcial 1" type="number" className="input input-bordered w-full" required />
        <input name="parcial2" value={formulario.parcial2} onChange={handleChange} placeholder="Calificación Parcial 2" type="number" className="input input-bordered w-full" required />
        <input name="examenFinal" value={formulario.examenFinal} onChange={handleChange} placeholder="Examen Final" type="number" className="input input-bordered w-full" required />
        <input name="asistencias" value={formulario.asistencias} onChange={handleChange} placeholder="Porcentaje de Asistencias" type="number" className="input input-bordered w-full" required />

        <button className="btn btn-primary w-full" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrar Calificación'}
        </button>
      </form>

      {mensaje && <div className="mt-4 text-center">{mensaje}</div>}
    </div>
  )
}
