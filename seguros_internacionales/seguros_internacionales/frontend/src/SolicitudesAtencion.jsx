import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function SolicitudesAtencion() {
  const [solicitudes, setsolicitudes] = useState([])
  const [paisubicacion, setpaisubicacion] = useState("")
  const [sintomas, setsintomas] = useState("")
  const [numeropasaporte, setnumeropasaporte] = useState("")
  const [resultado, setresultado] = useState(null)
  const [error, seterror] = useState("")

  const cargarsolicitudes = () => {
    fetch("/api/seguros/solicitudes")
      .then(res => res.json())
      .then(data => setsolicitudes(data))
  }

  useEffect(() => {
    cargarsolicitudes()
  }, [])

  const enviarsolicitud = (e) => {
    e.preventDefault()
    seterror("")
    setresultado(null)

    if (!paisubicacion.trim()) {
      seterror("Error: Debe ingresar un país")
      return
    }

    const nuevasolicitud = {
      pais_ubicacion: paisubicacion,
      sintomas: sintomas,
      numero_pasaporte: numeropasaporte || null
    }

    fetch("/api/seguros/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevasolicitud)
    })
    .then(async res => {
      const data = await res.json()
      if (res.ok) {
        setresultado(data)
        cargarsolicitudes()
        setpaisubicacion("")
        setsintomas("")
        setnumeropasaporte("")
      } else {
        seterror(data.detail || "Error: Debe ingresar un país")
      }
    })
  }

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10">
        <nav className="bg-white/[0.02] backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(52,211,153,0.4)]">
                <span className="font-black text-neutral-950 text-xl tracking-tighter">SIS</span>
              </div>
              <div>
                <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-0.5">Asistencia en el Extranjero</p>
                <h1 className="text-xl font-bold tracking-wide text-white">Orden de <span className="text-emerald-400">Atención Médica</span></h1>
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg border border-white/10">
              Panel Principal
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-12 relative overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-6">Solicitar Orden de Atención Médica</h2>

            <form onSubmit={enviarsolicitud} noValidate className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">País donde estoy *</label>
                <input type="text" value={paisubicacion} onChange={e => setpaisubicacion(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Ej. Japón" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Síntomas *</label>
                <input type="text" value={sintomas} onChange={e => setsintomas(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Fiebre y dolor de garganta" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Pasaporte (Opcional)</label>
                <input type="text" value={numeropasaporte} onChange={e => setnumeropasaporte(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="AB123456" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-black text-sm tracking-wide py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.4)] border border-emerald-300/50">
                Enviar
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm font-bold">
                {error}
              </div>
            )}

            {resultado && (
              <div className="mt-6 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200">
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">Hospital Asignado en {resultado.pais}</p>
                <p className="text-lg font-black text-white">{resultado.hospital_asignado}</p>
                <p className="text-sm text-amber-400 font-bold mt-1">Teléfono de contacto: {resultado.telefono_hospital}</p>
              </div>
            )}
          </div>

          <div className="mb-10 flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Historial de Solicitudes</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {solicitudes.map((s) => (
              <div key={s.id} className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400">{s.pais_ubicacion}</h3>
                  <span className="bg-black/50 border border-white/10 px-3 py-1 rounded-lg text-xs font-black text-amber-400">
                    #{s.id}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mb-3"><span className="text-neutral-500 font-bold">Síntomas:</span> {s.sintomas}</p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-emerald-400">{s.hospital_asignado}</p>
                  <p className="text-xs text-neutral-400 mt-1">Tel: {s.telefono_hospital}</p>
                </div>
              </div>
            ))}
          </div>

          {solicitudes.length === 0 && (
            <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/[0.01]">
              <p className="text-neutral-500 text-sm">No hay solicitudes de atención médica registradas todavía.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SolicitudesAtencion
