// src/lib/api.ts
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3333', // ou Railway plus tard
  headers: {
    'Content-Type': 'application/json',
  },
})

export default API
