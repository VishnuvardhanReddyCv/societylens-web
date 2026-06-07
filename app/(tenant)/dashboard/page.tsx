'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import StatCard from '@/components/StatCard'
import CategoryBadge from '@/components/CategoryBadge'
import StatusBadge from '@/components/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import api from '@/lib/api'
import {
  IconCurrencyRupee,
  IconTrendingUp,
  IconAlertCircle,
  IconHome,
} from '@tabler/icons-react'

export default function TenantDashboard() {
  const { data: session } = useSession()
  const [adminSummary, setAdminSummary] = useState<any>(null)
  const [myPaymentTotal, setMyPaymentTotal] = useState(0)
  const [expenses, setExpenses] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [expRes, annRes, payRes] = await Promise.all([
          api.get('/api/expenses?limit=5'),
          api.get('/api/announcements?limit=3'),
          api.get('/api/payments/summary'),
        ])
        setExpenses(expRes.data.data)
        setAnnouncements(annRes.data.data)
        const me = payRes.data.data.find((s: any) => s.email === session?.user?.email)
        setMyPaymentTotal(me?.total_paid ?? 0)
        const total = payRes.data.data.reduce((s: number, t: any) => s + t.total_paid, 0)
        setAdminSummary({ total_collected: total })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const totalSpent = expenses.reduce((s: number, e: any) => s + e.amount, 0)

  return (
    <div>
      <h1 className="text-xl font-bold mb-1" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
        Welcome, {session?.user?.name?.split(' ')[0]}
      </h1>
      <p className="text-sm mb-6" style={{ color: '#6B7B74' }}>Here's what's happening in your community.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Collected" value={formatCurrency(adminSummary?.total_collected ?? 0)} icon={<IconCurrencyRupee size={16} />} />
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} icon={<IconTrendingUp size={16} />} />
        <StatCard label="Your Paid" value={formatCurrency(myPaymentTotal)} sub="approved payments" icon={<IconAlertCircle size={16} />} />
        <StatCard label="Your Unit" value={session?.user?.unitId ? 'Assigned' : '—'} icon={<IconHome size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #D1EEE4' }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
            Recent Expenses
          </h2>
          {expenses.length === 0 ? (
            <p className="text-sm" style={{ color: '#6B7B74' }}>No expenses yet.</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#1C2B26' }}>{e.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CategoryBadge category={e.category} />
                      <span className="text-xs" style={{ color: '#6B7B74' }}>{formatDate(e.created_at)}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold ml-3 flex-shrink-0" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
                    {formatCurrency(e.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #D1EEE4' }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
            Recent Announcements
          </h2>
          {announcements.length === 0 ? (
            <p className="text-sm" style={{ color: '#6B7B74' }}>No announcements yet.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a: any) => (
                <div key={a.id}>
                  <p className="text-sm font-medium" style={{ color: '#1C2B26' }}>{a.title}</p>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#6B7B74' }}>{a.body}</p>
                  <p className="text-xs mt-1" style={{ color: '#6B7B74' }}>{formatDate(a.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
