'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function WithdrawPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState('GoPay')
  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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

  async function handleWithdraw(e) {
    e.preventDefault()
    setError('')
    const pointsNeeded = parseInt(amount) * 100
    if (pointsNeeded > (profile?.points || 0)) {
      setError('Poin tidak cukup!')
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('withdrawals').insert({
      user_id: user?.id,
      amount: parseInt(amount),
      points_used: pointsNeeded,
      method,
      account_info: account,
      status: 'pending'
    })
    setSuccess(true)
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
        <h2 className="text-white font-semibold">Withdraw</h2>
      </nav>
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <p className="text-gray-400 text-sm">Poin tersedia</p>
          <p className="text-4xl font-bold text-yellow-400 mt-1">{profile?.points || 0} Poin</p>
          <p className="text-gray-500 text-sm mt-2">100 poin = Rp 1.000</p>
        </div>
        {success ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
            <p className="text-green-400 text-xl font-bold">✅ Permintaan Withdraw Dikirim!</p>
            <p className="text-gray-400 mt-2">Admin akan memproses dalam 1x24 jam</p>
            <a href="/dashboard" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Kembali ke Dashboard
            </a>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Metode Pembayaran</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none">
                <option>GoPay</option>
                <option>OVO</option>
                <option>DANA</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Nomor Akun / Rekening</label>
              <input type="text" value={account} onChange={(e) => setAccount(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none" placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Jumlah Withdraw (Rp)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="10000" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none" placeholder="50000" />
              {amount && <p className="text-gray-500 text-xs mt-1">Poin dibutuhkan: {parseInt(amount) * 100}</p>}
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
              Ajukan Withdraw
            </button>
          </form>
        )}
      </div>
    </div>
  )
}