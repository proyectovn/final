import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import SolicitudesAtencion from "./SolicitudesAtencion"
import Reembolsos from "./Reembolsos"
import Clinicas from "./Clinicas"
import ValidacionPasaporte from "./ValidacionPasaporte"
import AlertasViaje from "./AlertasViaje"

function Inicio() {
  const [mensaje, setmensaje] = useState("Estableciendo enlace seguro con el servidor...")
  const [conectado, setconectado] = useState(false)

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        setmensaje(data.message)
        setconectado(true)
      })
      .catch(err => {
        setmensaje("Error de enlace. Verifica que Uvicorn esté activo.")
        setconectado(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 relative overflow-hidden flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.4)] border border-emerald-300/40">
            <span className="font-black text-neutral-950 text-2xl tracking-tighter">SIS</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">Panel de Control</h2>
        <p className="mt-2 text-center text-sm text-neutral-400 font-medium">Sistema Internacional de Seguros & Asistencia</p>
      </div>

      <div className="mt-8 relative z-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white/[0.03] backdrop-blur-3xl py-8 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] sm:rounded-3xl sm:px-10 border border-white/10 relative overflow-hidden">
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl backdrop-blur-md flex items-center border ${conectado ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-red-950/30 border-red-500/30 text-red-300'}`}>
              <div className={`w-3 h-3 rounded-full ${conectado ? 'bg-emerald-400 animate-ping' : 'bg-red-500'} mr-3 shrink-0`}></div>
              <p className="text-xs font-semibold">{mensaje}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/solicitudes" className="flex justify-center items-center text-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                Atención Médica
              </Link>
              <Link to="/reembolsos" className="flex justify-center items-center text-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                Reembolsos
              </Link>
              <Link to="/clinicas" className="flex justify-center items-center text-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                Clínicas Aliadas
              </Link>
              <Link to="/pasaportes" className="flex justify-center items-center text-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                Validar Pasaporte
              </Link>
              <Link to="/alertas" className="col-span-2 flex justify-center items-center text-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                Alertas de Viaje por País
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/solicitudes" element={<SolicitudesAtencion />} />
        <Route path="/reembolsos" element={<Reembolsos />} />
        <Route path="/clinicas" element={<Clinicas />} />
        <Route path="/pasaportes" element={<ValidacionPasaporte />} />
        <Route path="/alertas" element={<AlertasViaje />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
