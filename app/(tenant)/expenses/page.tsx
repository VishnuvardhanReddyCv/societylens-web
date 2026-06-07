'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import api from '@/lib/api'

const CATEGORIES = ['ALL', 'MAINTENANCE', 'REPAIR', 'UTILITY', 'SECURITY', 'AMENITY', 'OTHER']

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [loading, setLoading] = useState(true)

  async function loadExpenses(category: string) {
    setLoading(true)
    const params = new URLSearchParams({ limit: '50' })
    if (category !== 'ALL') params.set('category', category)
    const { data } = await api.get(`/api/expenses?${params}`)
    setExpenses(data.data)
    setTotal(data.meta.total)
    setLoading(false)
  }

  useEffect(() => { loadExpenses(activeCategory) }, [activeCategory])

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
        Expenses
      </h1>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={
              activeCategory === cat
                ? { background: '#1DB87A', color: 'white' }
                : { background: 'white', color: '#6B7B74', border: '1px solid #D1EEE4' }
            }
          >
            {cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: '#6B7B74' }}>No expenses found.</p>
          )}
          {expenses.map((e: any) => (
            <Link
              key={e.id}
              href={`/expenses/${e.id}`}
              className="block bg-white rounded-xl p-4 hover:shadow-sm transition-shadow"
              style={{ border: '0.5px solid #D1EEE4' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm" style={{ color: '#1C2B26' }}>{e.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <CategoryBadge category={e.category} />
                    <span className="text-xs" style={{ color: '#6B7B74' }}>{formatDate(e.created_at)}</span>
                    <span className="text-xs" style={{ color: '#6B7B74' }}>
                      {e.approve_count}✓ {e.reject_count}✗
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
                  {formatCurrency(e.amount)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
