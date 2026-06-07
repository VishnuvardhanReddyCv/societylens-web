'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { notifications } from '@mantine/notifications'

export default function SettingsPage() {
  const [form, setForm] = useState({ name: '', address: '', city: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/api/complexes/me').then(({ data }) => {
      const { name, address, city } = data.data
      setForm({ name, address, city })
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.patch('/api/admin/settings', form)
      notifications.show({ message: 'Settings saved', color: 'green' })
    } catch {
      notifications.show({ message: 'Failed to save', color: 'red' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
        Community Settings
      </h1>

      <div className="bg-white rounded-2xl p-6" style={{ border: '0.5px solid #D1EEE4' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>
              Community Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: '#1DB87A' }}
          >
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
