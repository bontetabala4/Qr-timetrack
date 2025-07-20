import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TabNavigation from '../components/TabNavigation'
import { logout } from '../auth/auth'
import GenerateTab from '../components/Tabs/GenerateTab';
import HistoryTab from '../components/Tabs/HistoryTab';
import AdminTab from '../components/Tabs/AdminTab';

import API from '../lib/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts'


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('scan')
  const navigate = useNavigate()
  const [scanData, setScanData] = useState([])
  const [userStats, setUserStats] = useState([])

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scanResponse = await API.get('/dashboard/stats')
        const userStatsResponse = await API.get('/dashboard/users')
        setScanData(scanResponse.data)
        setUserStats(userStatsResponse.data)
      } catch (error) {
        console.error('Erreur chargement des stats:', error)
      }
    }
    fetchData()
  }, [])

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">

          <h1 className="text-2xl font-bold text-gray-800">
            Bienvenue {user.fullName ?? 'Utilisateur'} !
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

<div className="mt-6">
  {activeTab === 'scan' && <p>📷 Scanner un code QR ici...</p>}
  {activeTab === 'generate' && <GenerateTab />}
  {activeTab === 'history' && <HistoryTab />}
  {activeTab === 'admin' && <AdminTab />}
</div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Statistiques de présence</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Présences par jour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Utilisateurs actifs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userStats}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                >
                  {userStats.map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

