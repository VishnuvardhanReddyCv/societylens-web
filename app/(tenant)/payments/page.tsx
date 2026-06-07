'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatCurrency, formatDate } from '@/lib/utils'
import api from '@/lib/api'
import { notifications } from '@mantine/notifications'

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:  { bg: '#FEF3C7', text: '#92400E', label: 'Pending approval' },
  APPROVED: { bg: '#D1FAE5', text: '#065F46', label: 'Approved' },
  REJECTED: { bg: '#FEE2E2', text: '#991B1B', label: 'Rejected' },
}

export default function TenantPaymentsPage() {
  const { data: session } = useSession()
  const [payments, setPayments]     = useState<any[]>([])
  const [summary, setSummary]       = useState<any[]>([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState({ amount: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const [pRes, sRes] = await Promise.all([
      api.get('/api/payments?limit=100'),
      api.get('/api/payments/summary'),
    ])
    setPayments(pRes.data.data)
    setTotal(pRes.data.meta.total)
    setSummary(sRes.data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/api/payments', { amount: parseFloat(form.amount), description: form.description })
      notifications.show({ message: 'Payment recorded — awaiting admin approval', color: 'green' })
      setForm({ amount: '', description: '' })
      setShowForm(false)
      load()
    } catch (err: any) {
      notifications.show({ message: err.response?.data?.detail || 'Failed to record', color: 'red' })
    } finally {
      setSubmitting(false)
    }
  }

  const myTotal = summary.find((s: any) => s.user_id === (session?.user as any)?.sub)?.total_paid ?? 0

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>Payments</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7B74' }}>Record your maintenance payments and track community contributions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#1DB87A' }}
        >
          {showForm ? 'Cancel' : '+ Record payment'}
        </button>
      </div>

      {/* Record payment form */}
      {showForm && (
        <div className="bg-white rounded-xl p-5 mb-6" style={{ border: '1.5px solid #1DB87A' }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: '#0B3D2E' }}>Record a payment</h2>
          <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium mb-1" style={{ color: '#1C2B26' }}>Amount (₹)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="5000"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: '1px solid #D1EEE4', color: '#1C2B26' }}
              />
            </div>
            <div className="flex-[2] min-w-[200px]">
              <label className="block text-xs font-medium mb-1" style={{ color: '#1C2B26' }}>Description</label>
              <input
                type="text"
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Maintenance dues – June 2024"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: '1px solid #D1EEE4', color: '#1C2B26' }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: '#1DB87A' }}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>
          <p className="text-xs mt-3" style={{ color: '#6B7B74' }}>
            Your payment will be visible to all residents and confirmed once the admin approves it.
          </p>
        </div>
      )}

      {/* Tenant payment summary table */}
      <div className="bg-white rounded-xl overflow-hidden mb-6" style={{ border: '0.5px solid #D1EEE4' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#F0FAF6' }}>
          <h2 className="font-semibold text-sm" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
            Community contributions
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#6B7B74' }}>Approved payments per resident</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #F0FAF6' }}>
              <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Resident</th>
              <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Unit</th>
              <th className="text-right px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Total paid</th>
              <th className="text-right px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Payments</th>
              <th className="text-right px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Last payment</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((s: any, i: number) => (
              <tr
                key={s.user_id}
                style={{
                  borderBottom: i < summary.length - 1 ? '1px solid #F0FAF6' : 'none',
                  background: s.email === session?.user?.email ? '#F0FAF6' : 'white',
                }}
              >
                <td className="px-5 py-3 font-medium" style={{ color: '#1C2B26' }}>
                  {s.name}
                  {s.email === session?.user?.email && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: '#D1EEE4', color: '#0B3D2E' }}>you</span>
                  )}
                </td>
                <td className="px-5 py-3" style={{ color: '#6B7B74' }}>{s.unit_number || '—'}</td>
                <td className="px-5 py-3 text-right font-bold" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
                  {formatCurrency(s.total_paid)}
                </td>
                <td className="px-5 py-3 text-right" style={{ color: '#6B7B74' }}>{s.payment_count}</td>
                <td className="px-5 py-3 text-right" style={{ color: '#6B7B74' }}>
                  {s.last_payment_at ? formatDate(s.last_payment_at) : '—'}
                </td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm" style={{ color: '#6B7B74' }}>No payments recorded yet.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #D1EEE4' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#F0FAF6' }}>
          <h2 className="font-semibold text-sm" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
            All payments
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: '#F0FAF6' }}>
          {payments.length === 0 && (
            <p className="px-5 py-8 text-center text-sm" style={{ color: '#6B7B74' }}>No payments yet.</p>
          )}
          {payments.map((p: any) => {
            const s = STATUS_STYLE[p.status] ?? STATUS_STYLE.PENDING
            return (
              <div key={p.id} className="px-5 py-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm" style={{ color: '#1C2B26' }}>{p.payer_name}</span>
                    {p.payer_unit && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#F0FAF6', color: '#0B3D2E' }}>{p.payer_unit}</span>}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.text }}>{s.label}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7B74' }}>{p.description}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7B74' }}>{formatDate(p.created_at)}</p>
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>
                  {formatCurrency(p.amount)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
