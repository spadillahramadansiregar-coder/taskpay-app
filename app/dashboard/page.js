'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    getProfile()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">TaskPay</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{profile?.email}</span>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Keluar</button>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Total Poin</p>
            <p className="text-3xl font-bold text-yellow-400">{profile?.points || 0}</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Total Penghasilan</p>
            <p className="text-3xl font-bold text-green-400">${profile?.total_earned || '0.00'}</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Status Akun</p>
            <p className="text-3xl font-bold text-blue-400">Aktif</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/tasks" className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-6 text-left transition block">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-lg font-semibold">Kerjakan Task</p>
            <p className="text-blue-200 text-sm mt-1">Selesaikan task dan dapatkan poin</p>
          </a>
          <a href="/rewards" className="bg-yellow-600 hover:bg-yellow-700 rounded-2xl p-6 text-left transition block">
            <p className="text-2xl mb-2">🎁</p>
            <p className="text-lg font-semibold">Reward</p>
            <p className="text-yellow-200 text-sm mt-1">Tukar poin dengan hadiah</p>
          </a>
          <a href="/withdraw" className="bg-green-600 hover:bg-green-700 rounded-2xl p-6 text-left transition block">
            <p className="text-2xl mb-2">💸</p>
            <p className="text-lg font-semibold">Withdraw</p>
            <p className="text-green-200 text-sm mt-1">Tarik penghasilan ke rekeningmu</p>
          </a>
          <a href="/profile" className="bg-purple-600 hover:bg-purple-700 rounded-2xl p-6 text-left transition block">
            <p className="text-2xl mb-2">👤</p>
            <p className="text-lg font-semibold">Profil</p>
            <p className="text-purple-200 text-sm mt-1">Lihat dan edit profilmu</p>
          </a>
        </div>
      </div>
    </div>
  )
}