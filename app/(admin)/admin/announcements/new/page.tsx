'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'

export default function NewAnnouncementPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', body: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/announcements', form)
      notifications.show({ message: 'Announcement posted', color: 'green' })
      router.push('/admin/announcements')
    } catch {
      notifications.show({ message: 'Failed to post', color: 'red' })
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
        New Announcement
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
              placeholder="Water supply disruption – June 8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C2B26' }}>Message</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
              rows={6}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
              placeholder="Write your announcement here…"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: '#1DB87A' }}
          >
            {loading ? 'Posting…' : 'Post announcement'}
          </button>
        </form>
      </div>
    </div>
  )
}
