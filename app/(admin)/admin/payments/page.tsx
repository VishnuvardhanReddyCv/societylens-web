'use client'

import { useEffect, useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import api from '@/lib/api'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:  { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  APPROVED: { bg: '#D1FAE5', text: '#065F46', label: 'Approved' },
  REJECTED: { bg: '#FEE2E2', text: '#991B1B', label: 'Rejected' },
}

export default function AdminPaymentsPage() {
  const [payments, setPayments]   = useState<any[]>([])
  const [summary, setSummary]     = useState<any[]>([])
  const [tenants, setTenants]     = useState<any[]>([])
  const [filter, setFilter]       = useState('ALL')
  const [loading, setLoading]     = useState(true)
  const [acting, setActing]       = useState<string | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({ user_id: '', amount: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const [pRes, sRes, tRes] = await Promise.all([
      api.get('/api/payments?limit=200'),
      api.get('/api/payments/summary'),
      api.get('/api/admin/tenants?limit=100'),
    ])
    setPayments(pRes.data.data)
    setSummary(sRes.data.data)
    setTenants(tRes.data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function approve(id: string) {
    setActing(id)
    try {
      await api.patch(`/api/payments/${id}/approve`)
      notifications.show({ message: 'Payment approved', color: 'green' })
      load()
    } catch { notifications.show({ message: 'Failed', color: 'red' }) }
    finally { setActing(null) }
  }

  async function reject(id: string) {
    setActing(id)
    try {
      await api.patch(`/api/payments/${id}/reject`)
      notifications.show({ message: 'Payment rejected', color: 'orange' })
      load()
    } catch { notifications.show({ message: 'Failed', color: 'red' }) }
    finally { setActing(null) }
  }

  async function handleRecord(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/api/payments', {
        user_id: form.user_id,
        amount: parseFloat(form.amount),
        description: form.description,
      })
      notifications.show({ message: 'Payment recorded and auto-approved', color: 'green' })
      setForm({ user_id: '', amount: '', description: '' })
      setShowForm(false)
      load()
    } catch (err: any) {
      notifications.show({ message: err.response?.data?.detail || 'Failed', color: 'red' })
    } finally { setSubmitting(false) }
  }

  const totalCollected = summary.reduce((s: number, t: any) => s + t.total_paid, 0)
  const pendingCount   = payments.filter((p: any) => p.status === 'PENDING').length

  const filtered = filter === 'ALL' ? payments : payments.filter((p: any) => p.status === filter)

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
          <p className="text-sm mt-0.5" style={{ color: '#6B7B74' }}>Approve tenant payments and record on their behalf</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#1DB87A' }}
        >
          {showForm ? 'Cancel' : '+ Record payment'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #D1EEE4' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#6B7B74' }}>Total Collected</p>
          <p className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>{formatCurrency(totalCollected)}</p>
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #D1EEE4' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#6B7B74' }}>Pending Approvals</p>
          <p className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: pendingCount > 0 ? '#92400E' : '#0B3D2E' }}>{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #D1EEE4' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#6B7B74' }}>Total Transactions</p>
          <p className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>{payments.length}</p>
        </div>
      </div>

      {/* Record payment form */}
      {showForm && (
        <div className="bg-white rounded-xl p-5 mb-6" style={{ border: '1.5px solid #1DB87A' }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: '#0B3D2E' }}>Record payment for tenant</h2>
          <form onSubmit={handleRecord} className="flex gap-3 flex-wrap items-end">
            <div className="flex-[2] min-w-[160px]">
              <label className="block text-xs font-medium mb-1" style={{ color: '#1C2B26' }}>Tenant</label>
              <select
                required
                value={form.user_id}
                onChange={e => setForm({ ...form, user_id: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
              >
                <option value="">Select tenant…</option>
                {tenants.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
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
            <div className="flex-[2] min-w-[180px]">
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
              {submitting ? 'Recording…' : 'Record & approve'}
            </button>
          </form>
          <p className="text-xs mt-3" style={{ color: '#6B7B74' }}>Payments recorded by admin are auto-approved and immediately count toward collected total.</p>
        </div>
      )}

      {/* Per-tenant summary */}
      <div className="bg-white rounded-xl overflow-hidden mb-6" style={{ border: '0.5px solid #D1EEE4' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#F0FAF6' }}>
          <h2 className="font-semibold text-sm" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>Per-tenant summary</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #F0FAF6' }}>
              <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Resident</th>
              <th className="text-left px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Unit</th>
              <th className="text-right px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Total paid</th>
              <th className="text-right px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Count</th>
              <th className="text-right px-5 py-3 text-xs font-medium" style={{ color: '#6B7B74' }}>Last payment</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((s: any, i: number) => (
              <tr key={s.user_id} style={{ borderBottom: i < summary.length - 1 ? '1px solid #F0FAF6' : 'none' }}>
                <td className="px-5 py-3 font-medium" style={{ color: '#1C2B26' }}>{s.name}</td>
                <td className="px-5 py-3" style={{ color: '#6B7B74' }}>{s.unit_number || '—'}</td>
                <td className="px-5 py-3 text-right font-bold" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>{formatCurrency(s.total_paid)}</td>
                <td className="px-5 py-3 text-right" style={{ color: '#6B7B74' }}>{s.payment_count}</td>
                <td className="px-5 py-3 text-right" style={{ color: '#6B7B74' }}>{s.last_payment_at ? formatDate(s.last_payment_at) : '—'}</td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm" style={{ color: '#6B7B74' }}>No payments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* All payments with approve/reject */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #D1EEE4' }}>
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: '#F0FAF6' }}>
          <h2 className="font-semibold text-sm flex-1" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>All payments</h2>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
              style={filter === f
                ? { background: '#1DB87A', color: 'white' }
                : { background: '#F0FAF6', color: '#6B7B74' }}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="divide-y" style={{ borderColor: '#F0FAF6' }}>
          {filtered.length === 0 && (
            <p className="px-5 py-8 text-center text-sm" style={{ color: '#6B7B74' }}>No payments in this filter.</p>
          )}
          {filtered.map((p: any) => {
            const s = STATUS_STYLE[p.status] ?? STATUS_STYLE.PENDING
            return (
              <div key={p.id} className="px-5 py-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm" style={{ color: '#1C2B26' }}>{p.payer_name}</span>
                    {p.payer_unit && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#F0FAF6', color: '#0B3D2E' }}>{p.payer_unit}</span>}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.text }}>{s.label}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7B74' }}>{p.description} · {formatDate(p.created_at)}</p>
                </div>
                <span className="text-sm font-bold flex-shrink-0 mx-3" style={{ color: '#0B3D2E', fontFamily: 'Sora, sans-serif' }}>{formatCurrency(p.amount)}</span>
                {p.status === 'PENDING' && (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => approve(p.id)}
                      disabled={acting === p.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                      style={{ background: '#D1FAE5', color: '#065F46' }}
                    >
                      <IconCheck size={13} /> Approve
                    </button>
                    <button
                      onClick={() => reject(p.id)}
                      disabled={acting === p.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                      style={{ background: '#FEE2E2', color: '#991B1B' }}
                    >
                      <IconX size={13} /> Reject
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
