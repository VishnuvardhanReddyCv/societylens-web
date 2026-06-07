'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'

export default function NewIssuePage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/issues', form)
      notifications.show({ message: 'Issue reported successfully', color: 'green' })
      router.push('/issues')
    } catch {
      notifications.show({ message: 'Failed to submit issue', color: 'red' })
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
        Report an Issue
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
              placeholder="Brief description of the issue"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={5}
              placeholder="Describe the issue in detail — location, severity, how long it's been happening…"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: '#1DB87A' }}
          >
            {loading ? 'Submitting…' : 'Submit issue'}
          </button>
        </form>
      </div>
    </div>
  )
}
