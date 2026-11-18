import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function AlertasViaje() {
  const [alertas, setalertas] = useState([])
  const [paisconsulta, setpaisconsulta] = useState("")
  const [resultadoconsulta, setresultadoconsulta] = useState(null)

  const [paisnuevo, setpaisnuevo] = useState("")
  const [nivelalerta, setnivelalerta] = useState("Alta")
  const [mensajealerta, setmensajealerta] = useState("")

  const cargaralertas = () => {
    fetch("/api/seguros/alertas")
      .then(res => res.json())
      .then(data => setalertas(data))
  }

  useEffect(() => {
    cargaralertas()
  }, [])

  const consultaralerta = (e) => {
    e.preventDefault()
    if (!paisconsulta.trim()) return

    fetch(`/api/seguros/alertas/consultar/${encodeURIComponent(paisconsulta.trim())}`)
      .then(res => res.json())
      .then(data => setresultadoconsulta(data))
  }

  const guardaralerta = (e) => {
    e.preventDefault()
    fetch("/api/seguros/alertas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pais: paisnuevo,
        nivel_alerta: nivelalerta,
        mensaje_alerta: mensajealerta
      })
    })
    .then(res => {
      if (res.ok) {
        cargaralertas()
        setpaisnuevo("")
        setmensajealerta("")
      } else {
        alert("Error al registrar la alerta de viaje.")
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
                <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-0.5">Seguridad & Prevención</p>
                <h1 className="text-xl font-bold tracking-wide text-white">Alertas de <span className="text-emerald-400">Viaje por País</span></h1>
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg border border-white/10">
              Panel Principal
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Consulta de alerta por país */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-10">
            <h2 className="text-lg font-bold text-white mb-6">Consultar Avisos de Seguridad del Destino</h2>
            <form onSubmit={consultaralerta} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">País a Visitar</label>
                <input type="text" value={paisconsulta} onChange={e => setpaisconsulta(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Ej. Japón" required />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-black text-sm tracking-wide py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.4)] border border-emerald-300/50">
                Consultar Alertas
              </button>
            </form>

            {resultadoconsulta && (
              <div className={`mt-6 p-5 rounded-2xl border ${resultadoconsulta.tiene_alerta ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' : 'bg-white/5 border-white/10 text-neutral-300'}`}>
                <p className="text-xs uppercase tracking-widest font-bold mb-1">
                  {resultadoconsulta.tiene_alerta ? `Advertencia en ${resultadoconsulta.pais} (Nivel: ${resultadoconsulta.nivel_alerta})` : `Destino: ${resultadoconsulta.pais}`}
                </p>
                <p className="text-base font-bold text-white">{resultadoconsulta.mensaje}</p>
              </div>
            )}
          </div>

          {/* Registro de nueva alerta */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-12">
            <h2 className="text-lg font-bold text-white mb-6">Registrar Aviso de Seguridad</h2>
            <form onSubmit={guardaralerta} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">País</label>
                <input type="text" value={paisnuevo} onChange={e => setpaisnuevo(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Brasil" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Nivel</label>
                <select value={nivelalerta} onChange={e => setnivelalerta(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner">
                  <option value="Baja" className="bg-neutral-900">Baja</option>
                  <option value="Moderado" className="bg-neutral-900">Moderado</option>
                  <option value="Alta" className="bg-neutral-900">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Mensaje de Advertencia</label>
                <input type="text" value={mensajealerta} onChange={e => setmensajealerta(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Vacuna contra fiebre amarilla obligatoria" required />
              </div>
              <button type="submit" className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm tracking-wide py-3.5 px-4 rounded-xl border border-white/20">
                Guardar Alerta
              </button>
            </form>
          </div>

          <div className="mb-10 flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Alertas Vigentes</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {alertas.map((a) => (
              <div key={a.id} className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white">{a.pais}</h3>
                  <span className="bg-black/50 border border-white/10 px-3 py-1 rounded-lg text-xs font-black text-amber-400">
                    {a.nivel_alerta}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{a.mensaje_alerta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertasViaje
