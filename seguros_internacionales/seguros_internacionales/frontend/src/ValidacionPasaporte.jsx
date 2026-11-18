import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function ValidacionPasaporte() {
  const [clientes, setclientes] = useState([])
  const [busqueda, setbusqueda] = useState("")
  const [estadovalidacion, setestadovalidacion] = useState(null)

  const [nuevopasaporte, setnuevopasaporte] = useState("")
  const [nuevonombre, setnuevonombre] = useState("")

  const cargarclientes = () => {
    fetch("/api/seguros/clientes")
      .then(res => res.json())
      .then(data => setclientes(data))
  }

  useEffect(() => {
    cargarclientes()
  }, [])

  const buscarpasaporte = (e) => {
    e.preventDefault()
    if (!busqueda.trim()) return

    fetch(`/api/seguros/clientes/validar/${encodeURIComponent(busqueda.trim())}`)
      .then(res => res.json())
      .then(data => setestadovalidacion(data))
  }

  const registrarcliente = (e) => {
    e.preventDefault()
    fetch("/api/seguros/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numero_pasaporte: nuevopasaporte,
        nombre_completo: nuevonombre,
        estado: "Activo"
      })
    })
    .then(res => {
      if (res.ok) {
        cargarclientes()
        setnuevopasaporte("")
        setnuevonombre("")
      } else {
        alert("Error al registrar cliente. El pasaporte ya existe.")
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
                <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-0.5">Soporte & Asegurados</p>
                <h1 className="text-xl font-bold tracking-wide text-white">Validación por <span className="text-emerald-400">Pasaporte</span></h1>
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg border border-white/10">
              Panel Principal
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Buscador de Pasaporte */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-10">
            <h2 className="text-lg font-bold text-white mb-6">Verificar Identidad del Cliente</h2>
            <form onSubmit={buscarpasaporte} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Número de Pasaporte</label>
                <input type="text" value={busqueda} onChange={e => setbusqueda(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Ej. AB123456" required />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-black text-sm tracking-wide py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.4)] border border-emerald-300/50">
                Buscar Cliente
              </button>
            </form>

            {estadovalidacion && (
              <div className={`mt-6 p-5 rounded-2xl border ${estadovalidacion.encontrado ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-red-950/40 border-red-500/40 text-red-300'}`}>
                <p className="text-lg font-black">{estadovalidacion.mensaje}</p>
                {estadovalidacion.cliente && (
                  <p className="text-xs text-neutral-300 mt-1">
                    Asegurado: <span className="font-bold text-white">{estadovalidacion.cliente.nombre_completo}</span> ({estadovalidacion.cliente.numero_pasaporte})
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Registro rápido de asegurados */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-12">
            <h2 className="text-lg font-bold text-white mb-6">Registrar Nuevo Asegurado</h2>
            <form onSubmit={registrarcliente} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Número de Pasaporte</label>
                <input type="text" value={nuevopasaporte} onChange={e => setnuevopasaporte(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="XY987654" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Nombre Completo</label>
                <input type="text" value={nuevonombre} onChange={e => setnuevonombre(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Laura Torres" required />
              </div>
              <button type="submit" className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm tracking-wide py-3.5 px-4 rounded-xl border border-white/20">
                Registrar Asegurado
              </button>
            </form>
          </div>

          <div className="mb-10 flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Asegurados Registrados</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {clientes.map((c) => (
              <div key={c.id} className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-black/50 border border-white/10 px-3 py-1 rounded-lg text-sm font-black text-amber-400">{c.numero_pasaporte}</span>
                  <span className="text-xs font-bold text-emerald-400">{c.estado}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{c.nombre_completo}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValidacionPasaporte
