'use client'

import { useEffect, useState } from 'react'
import StatCard from '@/components/StatCard'
import CategoryBadge from '@/components/CategoryBadge'
import StatusBadge from '@/components/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import api from '@/lib/api'
import {
  IconCurrencyRupee,
  IconTrendingUp,
  IconWallet,
  IconAlertCircle,
} from '@tabler/icons-react'

export default function AdminDashboard() {
  const [summary, setSummary]           = useState<any>(null)
  const [expenses, setExpenses]         = useState<any[]>([])
  const [issues, setIssues]             = useState<any[]>([])
  const [pendingPayments, setPending]   = useState(0)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    async function load() {
      const [sumRes, expRes, issRes, payRes] = await Promise.all([
        api.get('/api/admin/summary'),
        api.get('/api/expenses?limit=5'),
        api.get('/api/issues?limit=5'),
        api.get('/api/payments?status=PENDING&limit=1'),
      ])
      setSummary(sumRes.data.data)
      setExpenses(expRes.data.data)
      setIssues(issRes.data.data)
      setPending(payRes.data.meta.total)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const spendCategories = summary?.spend_by_category
    ? Object.entries(summary.spend_by_category).sort((a: any, b: any) => b[1] - a[1])
    : []
  const maxSpend = spendCategories.length > 0 ? (spendCategories[0][1] as number) : 1

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
        Admin Dashboard
      </h1>

      {pendingPayments > 0 && (
        <a href="/admin/payments" className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm font-medium" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#F59E0B', color: 'white' }}>{pendingPayments}</span>
          {pendingPayments === 1 ? '1 payment is' : `${pendingPayments} payments are`} waiting for your approval → Go to Payments
        </a>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Collected" value={formatCurrency(summary?.total_collected || 0)} icon={<IconCurrencyRupee size={16} />} />
        <StatCard label="Total Spent" value={formatCurrency(summary?.total_spent || 0)} icon={<IconTrendingUp size={16} />} />
        <StatCard label="Balance" value={formatCurrency(summary?.balance || 0)} icon={<IconWallet size={16} />} />
        <StatCard label="Open Issues" value={summary?.open_issues_count || 0} icon={<IconAlertCircle size={16} />} />
      </div>

      {/* Spend by category */}
      {spendCategories.length > 0 && (
        <div className="bg-white rounded-xl p-5 mb-6" style={{ border: '0.5px solid #D1EEE4' }}>
          <h2 className="font-semibold text-sm mb-4" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
            Spend by Category
          </h2>
          <div className="space-y-3">
            {spendCategories.map(([cat, amount]: any) => (
              <div key={cat} className="flex items-center gap-3">
                <div className="w-24 flex-shrink-0">
                  <CategoryBadge category={cat} />
                </div>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F0FAF6' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.round((amount / maxSpend) * 100)}%`, background: '#1DB87A' }}
                  />
                </div>
                <span className="text-xs font-medium w-20 text-right" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #D1EEE4' }}>
          <h2 className="font-semibold text-sm mb-4" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
            Recent Expenses
          </h2>
          <div className="space-y-3">
            {expenses.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1C2B26' }}>{e.title}</p>
                  <CategoryBadge category={e.category} />
                </div>
                <span className="text-sm font-bold" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
                  {formatCurrency(e.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Issues */}
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #D1EEE4' }}>
          <h2 className="font-semibold text-sm mb-4" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
            Recent Issues
          </h2>
          <div className="space-y-3">
            {issues.map((i: any) => (
              <div key={i.id} className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium flex-1" style={{ color: '#1C2B26' }}>{i.title}</p>
                <StatusBadge status={i.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
