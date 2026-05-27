'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const OFFERS = [
  { id: 1, title: 'Elite Challenge', network: 'MaxBounty', points: 500, category: 'Survey' },
  { id: 2, title: 'Reward Journey', network: 'AdGate Media', points: 300, category: 'Offer' },
  { id: 3, title: 'Elite Operation', network: 'CPAlead', points: 400, category: 'Task' },
  { id: 4, title: 'Premium Quest', network: 'OGAds', points: 600, category: 'Survey' },
  { id: 5, title: 'Event Operation', network: 'Toro Advertising', points: 350, category: 'Task' },
  { id: 6, title: 'Diamond Task', network: 'CPAlead', points: 450, category: 'Task' },
  { id: 7, title: 'Elite Survey', network: 'Dynata', points: 250, category: 'Survey' },
  { id: 8, title: 'Vault Challenge', network: 'MaxBounty', points: 550, category: 'Challenge' },
  { id: 9, title: 'Prime Quest', network: 'ClickDealer', points: 400, category: 'Offer' },
  { id: 10, title: 'Bonus Route', network: 'AdGate Media', points: 200, category: 'Offer' },
  { id: 11, title: 'Task Arena', network: 'Adscend Media', points: 300, category: 'Task' },
  { id: 12, title: 'Crystal Challenge', network: 'CPAlead', points: 450, category: 'Challenge' },
  { id: 13, title: 'Mission Vault', network: 'OGAds', points: 500, category: 'Task' },
  { id: 14, title: 'Core Research', network: 'Lucid Holdings', points: 350, category: 'Survey' },
  { id: 15, title: 'Smart Vault', network: 'MaxBounty', points: 400, category: 'Task' },
  { id: 16, title: 'Prime Activity', network: 'ClickDealer', points: 300, category: 'Offer' },
  { id: 17, title: 'Focus Arena', network: 'Lootably', points: 250, category: 'Task' },
  { id: 18, title: 'Dynamic Mission', network: 'Revenue Universe', points: 350, category: 'Task' },
  { id: 19, title: 'Insight Vault', network: 'Dynata', points: 300, category: 'Survey' },
  { id: 20, title: 'Resource Arena', network: 'Adscend Media', points: 400, category: 'Task' },
  { id: 21, title: 'Quest Infinity', network: 'Toro Advertising', points: 500, category: 'Task' },
  { id: 22, title: 'Smart Exploration', network: 'OfferToro', points: 350, category: 'Offer' },
  { id: 23, title: 'Core Arena', network: 'AdGate Media', points: 300, category: 'Task' },
  { id: 24, title: 'Reward Nexus', network: 'Freecash', points: 450, category: 'Offer' },
  { id: 25, title: 'Digital Operation', network: 'Offerwall.me', points: 400, category: 'Task' },
]

export default function TasksPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setLoading(false)
    }
    getUser()
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
        <h2 className="text-white font-semibold">Kerjakan Task</h2>
      </nav>
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-400 mb-6">Pilih task di bawah dan selesaikan untuk mendapatkan poin!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFERS.map((offer) => (
            <div key={offer.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{offer.title}</p>
                <p className="text-gray-400 text-sm mt-1">{offer.network}</p>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded mt-2 inline-block">{offer.category}</span>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-bold text-xl">{offer.points}</p>
                <p className="text-gray-500 text-xs">poin</p>
                <a href={offer.url || '#'} target="_blank" className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
                      Mulai
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}