'use client'

import { useState } from 'react'

type Alumno = {
  estudianteId: number
  nombre:       string
  correo:       string
  telefono:     string
  grupoId:      number | null
  estado:       string
}

type BajaPayload = {
  estudianteId: number
  tipo:         'BajaTemporal' | 'BajaDefinitiva'
  motivo:       string
}

export default function BajaEstudiantePage() {
  const [estudianteId, setEstudianteId] = useState('')
  const [buscando,    setBuscando]    = useState(false)
  const [enviando,    setEnviando]    = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [alumno,      setAlumno]      = useState<Alumno | null>(null)

  const [tipo,   setTipo]   = useState<'BajaTemporal'|'BajaDefinitiva'>('BajaTemporal')
  const [motivo, setMotivo] = useState('')

  async function buscar() {
    if (!estudianteId.trim()) {
      setError('🔎 Debes ingresar un ID')
      return
    }
    setError(null)
    setBuscando(true)
    try {
      const res  = await fetch(`/api/baja/${estudianteId}`)
      const json = await res.json()
      if (!json.ok) {
        setError(json.mensaje)
        setAlumno(null)
      } else {
        setAlumno(json.alumno)
      }
    } catch {
      setError('❌ Error de red')
      setAlumno(null)
    } finally {
      setBuscando(false)
    }
  }

  async function confirmar(e: React.FormEvent) {
    e.preventDefault()
    if (!alumno) {
      setError('🔎 Primero busca al estudiante')
      return
    }
    if (motivo.trim().length < 5) {
      setError('✏️ El motivo debe tener al menos 5 caracteres')
      return
    }
    setError(null)
    setEnviando(true)

    const payload: BajaPayload = {
      estudianteId: alumno.estudianteId,
      tipo,
      motivo: motivo.trim()
    }

    try {
      const res  = await fetch('/api/baja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!json.ok) {
        setError(json.mensaje)
      } else {
        alert('✅ Baja registrada')
        setMotivo('')
      }
    } catch {
      setError('❌ Error de red')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center">Dar de Baja Estudiante</h1>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="ID Estudiante"
          value={estudianteId}
          onChange={e => setEstudianteId(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={buscar}
          disabled={buscando}
          className="bg-green-600 text-white px-4 rounded"
        >
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {alumno && (
        <form onSubmit={confirmar} className="space-y-4">
          <div className="p-4 bg-gray-50 rounded space-y-1 text-gray-800">
            <p><strong>Nombre:</strong>   {alumno.nombre}</p>
            <p><strong>Correo:</strong>   {alumno.correo}</p>
            <p><strong>Teléfono:</strong> {alumno.telefono}</p>
            <p><strong>Grupo ID:</strong> {alumno.grupoId ?? '—'}</p>
            <p><strong>Estado:</strong>   {alumno.estado}</p>
          </div>

          <fieldset className="flex gap-4">
            <legend className="font-medium">Tipo de Baja</legend>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="tipo"
                value="BajaTemporal"
                checked={tipo === 'BajaTemporal'}
                onChange={() => setTipo('BajaTemporal')}
              />
              Temporal
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="tipo"
                value="BajaDefinitiva"
                checked={tipo === 'BajaDefinitiva'}
                onChange={() => setTipo('BajaDefinitiva')}
              />
              Definitiva
            </label>
          </fieldset>

          <textarea
            placeholder="Motivo de la baja"
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
          />

          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 text-white px-6 py-2 rounded w-full disabled:bg-gray-400"
          >
            {enviando ? 'Procesando...' : 'Confirmar Baja'}
          </button>
        </form>
      )}
    </div>
  )
}