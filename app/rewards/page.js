'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RewardsPage() {
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

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <a href="/dashboard" className="text-blue-400 font-bold text-xl">← TaskPay</a>
        <h2 className="text-white font-semibold">Reward</h2>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <p className="text-gray-400 text-sm">Poin kamu saat ini</p>
          <p className="text-4xl font-bold text-yellow-400 mt-1">{profile?.points || 0} Poin</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'GoPay', amount: 'Rp 50.000', points: 5000 },
            { name: 'OVO', amount: 'Rp 50.000', points: 5000 },
            { name: 'DANA', amount: 'Rp 50.000', points: 5000 },
            { name: 'GoPay', amount: 'Rp 100.000', points: 10000 },
            { name: 'OVO', amount: 'Rp 100.000', points: 10000 },
            { name: 'DANA', amount: 'Rp 100.000', points: 10000 },
          ].map((reward, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{reward.name}</p>
                <p className="text-green-400 text-xl font-bold mt-1">{reward.amount}</p>
                <p className="text-gray-500 text-sm mt-1">{reward.points} poin</p>
              </div>
              <button
                disabled={(profile?.points || 0) < reward.points}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold px-4 py-2 rounded-lg transition"
              >
                Tukar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}