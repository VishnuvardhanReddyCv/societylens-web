'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'

const CATEGORIES = ['MAINTENANCE', 'REPAIR', 'UTILITY', 'SECURITY', 'AMENITY', 'OTHER']

export default function NewExpensePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'MAINTENANCE',
    description: '',
    receipt_url: '',
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/expenses', {
        ...form,
        amount: parseFloat(form.amount),
      })
      notifications.show({ message: 'Expense created', color: 'green' })
      router.push('/admin/expenses')
    } catch (err: any) {
      notifications.show({ message: err.response?.data?.detail || 'Failed to create', color: 'red' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <button onClick={() => router.back()} className="text-sm mb-5" style={{ color: '#6B7B74' }}>
        ← Back
      </button>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
        New Expense
      </h1>

      <div className="bg-white rounded-2xl p-6" style={{ border: '0.5px solid #D1EEE4' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
              placeholder="Elevator AMC – Annual"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
              placeholder="85000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
              placeholder="Optional details about this expense"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>Receipt URL (optional)</label>
            <input
              type="url"
              value={form.receipt_url}
              onChange={(e) => setForm({ ...form, receipt_url: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
              placeholder="https://drive.google.com/..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: '#1DB87A' }}
          >
            {loading ? 'Creating…' : 'Create expense'}
          </button>
        </form>
      </div>
    </div>
  )
}
