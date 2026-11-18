import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Clinicas() {
  const [clinicas, setclinicas] = useState([])
  const [nombre, setnombre] = useState("")
  const [ciudad, setciudad] = useState("")
  const [pais, setpais] = useState("")
  const [telefono, settelefono] = useState("")

  const cargarclinicas = () => {
    fetch("/api/seguros/clinicas")
      .then(res => res.json())
      .then(data => setclinicas(data))
  }

  useEffect(() => {
    cargarclinicas()
  }, [])

  const guardarclinica = (e) => {
    e.preventDefault()
    const nuevaclinica = {
      nombre: nombre,
      ciudad: ciudad,
      pais: pais,
      telefono: telefono
    }

    fetch("/api/seguros/clinicas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaclinica)
    })
    .then(res => {
      if (res.ok) {
        cargarclinicas()
        setnombre("")
        setciudad("")
        setpais("")
        settelefono("")
      } else {
        alert("Error al registrar la clínica aliada.")
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
                <p className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-0.5">Red Médica Internacional</p>
                <h1 className="text-xl font-bold tracking-wide text-white">Lista de <span className="text-emerald-400">Clínicas Aliadas</span></h1>
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-lg border border-white/10">
              Panel Principal
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-12 relative overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-6">Registrar Nueva Clínica Aliada</h2>

            <form onSubmit={guardarclinica} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Nombre</label>
                <input type="text" value={nombre} onChange={e => setnombre(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Hospital Central" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Ciudad</label>
                <input type="text" value={ciudad} onChange={e => setciudad(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Tokio" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">País</label>
                <input type="text" value={pais} onChange={e => setpais(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="Japón" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">Teléfono</label>
                <input type="text" value={telefono} onChange={e => settelefono(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 shadow-inner" placeholder="+81 3-1234-5678" required />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-black text-sm tracking-wide py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.4)] border border-emerald-300/50">
                Guardar Clínica
              </button>
            </form>
          </div>

          <div className="mb-10 flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Directorio de Clínicas por País</h2>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          {clinicas.length > 0 ? (
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-widest text-neutral-400">
                    <th className="py-4 px-6">Nombre</th>
                    <th className="py-4 px-6">Ciudad</th>
                    <th className="py-4 px-6">País</th>
                    <th className="py-4 px-6">Teléfono</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {clinicas.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6 font-bold text-white">{c.nombre}</td>
                      <td className="py-4 px-6 text-neutral-300">{c.ciudad}</td>
                      <td className="py-4 px-6">
                        <span className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-md text-xs font-bold">
                          {c.pais}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-amber-400 font-semibold">{c.telefono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-20 border border-white/5 rounded-3xl bg-white/[0.01]">
              <p className="text-neutral-400 text-base font-bold">No hay clínicas registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Clinicas
