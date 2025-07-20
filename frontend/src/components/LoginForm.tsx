// src/components/LoginForm.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth/auth'
import API from '../lib/api'
import { AxiosError } from 'axios' // ✅ Import du type AxiosError

type LoginData = {
  email: string
  password: string
}

type LoginErrors = {
  [key: string]: string[]
}

export default function LoginForm() {
  const [form, setForm] = useState<LoginData>({ email: '', password: '' })
  const [errors, setErrors] = useState<LoginErrors | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
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
      const response = await API.post('/login', form)
      const token = response.data.token
      login(token)
      setMessage('Connexion réussie !')
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (error) {
      const axiosError = error as AxiosError<{ errors?: LoginErrors }>
      if (axiosError.response?.data?.errors) {
        setErrors(axiosError.response.data.errors)
      } else {
        setMessage("Échec de connexion.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Connexion</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <div className="mb-2">
        <input
          type="email"
          name="email"
          placeholder="Email"
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
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}
