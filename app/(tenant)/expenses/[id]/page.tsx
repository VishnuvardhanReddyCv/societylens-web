'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CategoryBadge from '@/components/CategoryBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import api from '@/lib/api'
import { notifications } from '@mantine/notifications'

export default function ExpenseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [expense, setExpense] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  async function load() {
    const { data } = await api.get(`/api/expenses/${id}`)
    setExpense(data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function castVote(value: 'APPROVE' | 'REJECT') {
    setVoting(true)
    try {
      await api.post(`/api/expenses/${id}/vote`, { value })
      await load()
      notifications.show({ message: `Vote recorded: ${value}`, color: 'green' })
    } catch {
      notifications.show({ message: 'Failed to vote', color: 'red' })
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!expense) return <p>Expense not found</p>

  const totalVotes = expense.approve_count + expense.reject_count
  const approvePercent = totalVotes > 0 ? Math.round((expense.approve_count / totalVotes) * 100) : 0

  return (
    <div className="max-w-xl">
      <button onClick={() => router.back()} className="text-sm mb-5 flex items-center gap-1" style={{ color: '#6B7B74' }}>
        ← Back
      </button>

      <div className="bg-white rounded-2xl p-6" style={{ border: '0.5px solid #D1EEE4' }}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
            {expense.title}
          </h1>
          <CategoryBadge category={expense.category} />
        </div>

        <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
          {formatCurrency(expense.amount)}
        </p>
        <p className="text-xs mb-4" style={{ color: '#6B7B74' }}>Posted {formatDate(expense.created_at)}</p>

        {expense.description && (
          <p className="text-sm mb-4" style={{ color: '#1C2B26' }}>{expense.description}</p>
        )}

        {expense.receipt_url && (
          <a
            href={expense.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline mb-4 block"
            style={{ color: '#1DB87A' }}
          >
            View receipt
          </a>
        )}

        {/* Vote tally */}
        <div className="rounded-xl p-4 mb-5" style={{ background: '#F0FAF6' }}>
          <p className="text-xs font-medium mb-2" style={{ color: '#0B3D2E' }}>Community vote</p>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#D1EEE4' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${approvePercent}%`, background: '#1DB87A' }}
              />
            </div>
            <span className="text-xs font-medium" style={{ color: '#0B3D2E' }}>{approvePercent}%</span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: '#6B7B74' }}>
            <span>{expense.approve_count} approve</span>
            <span>{expense.reject_count} reject</span>
          </div>
        </div>

        {/* Vote buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => castVote('APPROVE')}
            disabled={voting}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{
              background: expense.my_vote === 'APPROVE' ? '#1DB87A' : 'white',
              color: expense.my_vote === 'APPROVE' ? 'white' : '#1DB87A',
              border: '1.5px solid #1DB87A',
            }}
          >
            {expense.my_vote === 'APPROVE' ? '✓ Approved' : 'Approve'}
          </button>
          <button
            onClick={() => castVote('REJECT')}
            disabled={voting}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{
              background: expense.my_vote === 'REJECT' ? '#991B1B' : 'white',
              color: expense.my_vote === 'REJECT' ? 'white' : '#991B1B',
              border: '1.5px solid #FCA5A5',
            }}
          >
            {expense.my_vote === 'REJECT' ? '✗ Rejected' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}
