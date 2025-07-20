import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../lib/api'
import { AxiosError } from 'axios' 

type FormData = {
  fullName: string
  email: string
  password: string
}

type ValidationErrors = {
  [key: string]: string[]
}

export default function RegisterForm() {
  const [form, setForm] = useState<FormData>({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<ValidationErrors | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setErrors(null)

    try {
      await API.post('/register', form) 
      setMessage('Inscription réussie !')
      setTimeout(() => navigate('/login'), 1000)
    } catch (error) {
  const axiosError = error as AxiosError<{ errors: { [key: string]: string[] } }>
  if (axiosError.response?.data?.errors) {
    setErrors(axiosError.response.data.errors)
  } else {
    setMessage("Erreur inconnue.")
  }
} finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Inscription</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <div className="mb-2">
        <input
          type="text"
          name="fullName"
          placeholder="Nom complet"
          value={form.fullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors?.fullName && <p className="text-red-600">{errors.fullName[0]}</p>}
      </div>

      <div className="mb-2">
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors?.email && <p className="text-red-600">{errors.email[0]}</p>}
      </div>

      <div className="mb-4">
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors?.password && <p className="text-red-600">{errors.password[0]}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Enregistrement...' : 'S’inscrire'}
      </button>
    </form>
  )
}
