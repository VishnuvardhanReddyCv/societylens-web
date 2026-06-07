'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import api from '@/lib/api'
import { notifications } from '@mantine/notifications'

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await api.get('/api/expenses?limit=100')
    setExpenses(data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return
    try {
      await api.delete(`/api/expenses/${id}`)
      notifications.show({ message: 'Expense deleted', color: 'green' })
      load()
    } catch {
      notifications.show({ message: 'Failed to delete', color: 'red' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
          Expenses
        </h1>
        <Link
          href="/admin/expenses/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#1DB87A' }}
        >
          + New expense
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((e: any) => (
            <div key={e.id} className="bg-white rounded-xl p-4 flex items-start justify-between gap-3" style={{ border: '0.5px solid #D1EEE4' }}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: '#1C2B26' }}>{e.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <CategoryBadge category={e.category} />
                  <span className="text-xs" style={{ color: '#6B7B74' }}>{formatDate(e.created_at)}</span>
                  <span className="text-xs" style={{ color: '#6B7B74' }}>
                    {e.approve_count}✓ {e.reject_count}✗
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-bold" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
                  {formatCurrency(e.amount)}
                </span>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-xs px-2 py-1 rounded"
                  style={{ color: '#991B1B', background: '#FEE2E2' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
