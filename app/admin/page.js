'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [addPoints, setAddPoints] = useState({})

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') { window.location.href = '/dashboard'; return }
      loadData()
    }
    checkAdmin()
  }, [])

  async function loadData() {
    const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    const { data: withdrawData } = await supabase.from('withdrawals').select('*, profiles(email, username)').order('created_at', { ascending: false })
    setUsers(usersData || [])
    setWithdrawals(withdrawData || [])
    setLoading(false)
  }

  async function handleAddPoints(userId) {
    const pts = parseInt(addPoints[userId] || 0)
    if (!pts) return
    const user = users.find(u => u.id === userId)
    await supabase.from('profiles').update({ points: (user.points || 0) + pts }).eq('id', userId)
    setAddPoints(prev => ({ ...prev, [userId]: '' }))
    loadData()
  }

  async function handleWithdraw(id, status) {
    await supabase.from('withdrawals').update({ status }).eq('id', id)
    loadData()
  }

  async function handleBan(userId) {
    await supabase.from('profiles').update({ role: 'banned' }).eq('id', userId)
    loadData()
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-400">⚙️ Admin Panel</h1>
        <a href="/dashboard" className="text-gray-400 text-sm hover:text-white">← Dashboard</a>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">Total User</p>
            <p className="text-3xl font-bold text-blue-400">{users.length}</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Withdraw</p>
            <p className="text-3xl font-bold text-green-400">{withdrawals.length}</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">Withdraw Pending</p>
            <p className="text-3xl font-bold text-yellow-400">{withdrawals.filter(w => w.status === 'pending').length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            👥 Users
          </button>
          <button onClick={() => setActiveTab('withdrawals')} className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${activeTab === 'withdrawals' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            💰 Withdraw
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <p className="font-semibold">{user.username || 'No Username'}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-yellow-400 text-sm">🪙 {user.points || 0} poin</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : user.role === 'banned' ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/20 text-green-400'}`}>{user.role || 'user'}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Tambah poin"
                    value={addPoints[user.id] || ''}
                    onChange={(e) => setAddPoints(prev => ({ ...prev, [user.id]: e.target.value }))}
                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm w-32 focus:outline-none"
                  />
                  <button onClick={() => handleAddPoints(user.id)} className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg">
                    ➕
                  </button>
                  {user.role !== 'admin' && user.role !== 'banned' && (
                    <button onClick={() => handleBan(user.id)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm px-3 py-2 rounded-lg">
                      Ban
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-3">
            {withdrawals.map(w => (
              <div key={w.id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <p className="font-semibold">{w.profiles?.username || w.profiles?.email}</p>
                  <p className="text-gray-400 text-sm">{w.method} — {w.account_info}</p>
                  <p className="text-green-400 font-bold mt-1">Rp {w.amount?.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">{w.points_used} poin digunakan</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : w.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {w.status}
                  </span>
                  {w.status === 'pending' && (
                    <>
                      <button onClick={() => handleWithdraw(w.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg">
                        ✅ Approve
                      </button>
                      <button onClick={() => handleWithdraw(w.id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg">
                        ❌ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {withdrawals.length === 0 && <p className="text-gray-500 text-center py-8">Belum ada withdraw</p>}
          </div>
        )}
      </div>
    </div>
  )
}