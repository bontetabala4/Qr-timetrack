import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-bold">TimeTrack QR</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Accueil</Link>
          <Link to="/login" className="hover:underline">Se connecter</Link>
          <Link to="/register" className="hover:underline">Créer un compte</Link>
        </nav>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <footer className="bg-gray-200 text-center text-sm py-3">
        © 2025 TimeTrack QR — Tous droits réservés
      </footer>
    </div>
  )
}
