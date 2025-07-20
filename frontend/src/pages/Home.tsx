// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Home() {
  const navigate = useNavigate()

  // Rediriger vers dashboard si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) navigate('/dashboard')
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">
      <div className="bg-white bg-opacity-10 shadow-2xl rounded-2xl p-10 max-w-md w-full text-center backdrop-blur-sm border border-white/20">
        <img
          src="/logo.png"
          alt="Bienvenue"
          className="w-24 h-24 mx-auto mb-4 rounded-full shadow-md border-2 border-white/30"
        />
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Bienvenue sur TimeTrack QR</h1>
        <p className="text-gray-300 mb-6">
          Gagnez du temps, contrôlez la présence, visualisez les statistiques en un scan.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md transition"
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-transparent hover:bg-white/10 text-blue-400 font-semibold py-2 px-4 rounded border border-blue-500 transition shadow-md"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  )
}
