import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Reembolsos() {
  const [reembolsos, setreembolsos] = useState([])
  const [montogastado, setmontogastado] = useState("")
  const [numerocuenta, setnumerocuenta] = useState("")
  const [numeropasaporte, setnumeropasaporte] = useState("")
  const [mensaje, setmensaje] = useState("")
  const [error, seterror] = useState("")

  const cargardatos = () => {
    fetch("/api/seguros/reembolsos")
      .then(res => res.json())
      .then(data => setreembolsos(data))
  }

  useEffect(() => {
    cargardatos()
  }, [])

  const guardarreembolso = (e) => {
    e.preventDefault()
    setmensaje("")
    seterror("")

    const monto = parseFloat(montogastado)
    if (isNaN(monto) || monto <= 0) {
      seterror("Monto no válido")
      return
    }

    const nuevoreembolso = {
      monto_gastado: monto,
      numero_cuenta_bancaria: numerocuenta,
      numero_pasaporte: numeropasaporte || null
    }

    fetch("/api/seguros/reembolsos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoreembolso)
    })
    .then(async res => {
      const data = await res.json()
      if (res.ok) {
        setmensaje(data.message || "Solicitud de reembolso guardada con éxito")
        cargardatos()
        setmontogastado("")
        setnumerocuenta("")
        setnumeropasaporte("")
      } else {
        seterror(data.detail || "Monto no válido")
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
                <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-0.5">Devolución de Gastos Médicos</p>
                <h1 className="text-xl font-bold tracking-wide text-white">Gestión de <span className="text-emerald-400">Reembolsos</span></h1>
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg border border-white/10">
              Panel Principal
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-12 relative overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-6">Registrar Gasto Médico para Reembolso</h2>

            <form onSubmit={guardarreembolso} noValidate className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Monto Gastado (USD) *</label>
                <input type="number" step="0.01" value={montogastado} onChange={e => setmontogastado(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="125.50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Número de Cuenta Bancaria *</label>
                <input type="text" value={numerocuenta} onChange={e => setnumerocuenta(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="001-987654-01" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Pasaporte (Opcional)</label>
                <input type="text" value={numeropasaporte} onChange={e => setnumeropasaporte(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="AB123456" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-black text-sm tracking-wide py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.4)] border border-emerald-300/50">
                Guardar
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm font-bold">
                {error}
              </div>
            )}

            {mensaje && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm font-bold">
                {mensaje}
              </div>
            )}
          </div>

          <div className="mb-10 flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Solicitudes de Reembolso</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reembolsos.map((r) => (
              <div key={r.id} className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 group">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-black text-emerald-400">${r.monto_gastado.toFixed(2)}</span>
                  <span className="bg-black/50 border border-white/10 px-3 py-1 rounded-lg text-xs font-black text-amber-400">
                    {r.estado_reembolso}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-2">Cuenta Bancaria: <span className="text-white font-semibold">{r.numero_cuenta_bancaria}</span></p>
              </div>
            ))}
          </div>

          {reembolsos.length === 0 && (
            <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/[0.01]">
              <p className="text-neutral-500 text-sm">No hay solicitudes de reembolso registradas todavía.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reembolsos
