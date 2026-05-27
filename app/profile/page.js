'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setUsername(data?.username || '')
      setLoading(false)
    }
    getProfile()
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ username }).eq('id', user?.id)
    setSaving(false)
    setSuccess(true)
    setProfile(prev => ({ ...prev, username }))
    setTimeout(() => setSuccess(false), 3000)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <a href="/dashboard" className="text-blue-400 font-bold text-xl">← TaskPay</a>
        <h2 className="text-white font-semibold">Profil</h2>
      </nav>
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold">
              {profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <p className="text-white font-semibold text-lg">{profile?.username || 'User'}</p>
          <p className="text-gray-400 text-sm">{profile?.email}</p>
          <div className="flex justify-center gap-6 mt-4">
            <div>
              <p className="text-yellow-400 font-bold text-xl">{profile?.points || 0}</p>
              <p className="text-gray-500 text-xs">Poin</p>
            </div>
            <div>
              <p className="text-green-400 font-bold text-xl">${profile?.total_earned || '0.00'}</p>
              <p className="text-gray-500 text-xs">Penghasilan</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSave} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
              ✅ Profil berhasil diupdate!
            </div>
          )}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" placeholder="username kamu" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input type="email" value={profile?.email} disabled className="w-full bg-gray-800 border border-gray-700 text-gray-500 rounded-lg px-4 py-3 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
        <button onClick={handleLogout} className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-3 rounded-lg transition border border-red-600/20">
          Keluar dari Akun
        </button>
      </div>
    </div>
  )
}