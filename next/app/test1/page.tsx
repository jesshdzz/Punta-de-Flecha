'use client'
import { useState } from 'react'

export default function ReinscripcionPage() {
  const [form, setForm] = useState({
    estudianteId:      '',
    nombre:            '',
    correo:            '',
    telefono:          '',
    contrasena:        '',
    reinscribir:       false,
    grupoId:           '',
    montoReinscripcion:''
  })
  const [cargando, setCargando] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // 🚀 Busca por ID dinámico
  async function buscarEstudiante() {
    if (!form.estudianteId.trim()) {
      alert('🔎 Debes ingresar un ID')
      return
    }
    setCargando(true)
    try {
      const res = await fetch(`/api/actualizar/${form.estudianteId}`)
      const data = await res.json()
      if (!data.ok) {
        alert(`❌ ${data.mensaje}`)
      } else {
        // Relleno TODO como strings
        setForm({
          estudianteId:      data.alumno.estudianteId,
          nombre:            data.alumno.nombre,
          correo:            data.alumno.correo,
          telefono:          data.alumno.telefono,
          contrasena:        data.alumno.contrasena,
          reinscribir:       false,
          grupoId:           data.alumno.grupoId,
          montoReinscripcion:''
        })
      }
    } catch {
      alert('❌ Falla al buscar')
    } finally {
      setCargando(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.estudianteId.trim()) {
      alert('⚠️ Debes ingresar el ID')
      return
    }
    if (form.reinscribir && (!form.grupoId.trim() || !form.montoReinscripcion.trim())) {
      alert('⚠️ Grupo y monto son obligatorios para reinscribir')
      return
    }

    setEnviando(true)
    try {
      const payload: any = { estudianteId: Number(form.estudianteId) }
      if (form.nombre)            payload.nombre    = form.nombre
      if (form.correo)            payload.correo    = form.correo
      if (form.telefono)          payload.telefono  = form.telefono
      if (form.contrasena)        payload.contrasena= form.contrasena
      if (form.reinscribir) {
        payload.reinscribir        = true
        payload.grupoId            = Number(form.grupoId)
        payload.montoReinscripcion = Number(form.montoReinscripcion)
      }

      const res  = await fetch('/api/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!data.ok) alert(`❌ ${data.mensaje}`)
      else        alert('✅ Actualizado con éxito')
    } catch {
      alert('❌ Error al enviar')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center">Reinscripción / Actualización</h2>

      {/* Buscador por ID */}
      <div className="flex gap-2">
        <input
          name="estudianteId"
          type="number"
          placeholder="ID Estudiante"
          value={form.estudianteId}
          onChange={handleChange}
          className="flex-1 border p-2 rounded"
          required
        />
        <button
          type="button"
          onClick={buscarEstudiante}
          disabled={cargando}
          className="bg-green-600 text-white px-4 rounded"
        >
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Campos */}
      <input
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="correo"
        placeholder="Correo"
        value={form.correo}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="telefono"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
     <input
        name="contrasena"
        placeholder="contasena"
        value={form.contrasena}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="reinscribir"
          checked={form.reinscribir}
          onChange={handleChange}
        />
        Solicitar Reinscripción
      </label>

      {form.reinscribir && (
        <>
          <input
            name="grupoId"
            type="number"
            placeholder="Nuevo Grupo ID"
            value={form.grupoId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="montoReinscripcion"
            type="number"
            placeholder="Monto Reinscripción"
            value={form.montoReinscripcion}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="bg-blue-600 text-white w-full py-2 rounded disabled:bg-gray-400"
      >
        {enviando ? 'Actualizando...' : 'Actualizar'}
      </button>
    </form>
  )
}
