'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'
import { notifications } from '@mantine/notifications'

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await api.get('/api/announcements?limit=100')
    setAnnouncements(data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this announcement?')) return
    try {
      await api.delete(`/api/announcements/${id}`)
      notifications.show({ message: 'Deleted', color: 'green' })
      load()
    } catch {
      notifications.show({ message: 'Failed to delete', color: 'red' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
          Announcements
        </h1>
        <Link
          href="/admin/announcements/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#1DB87A' }}
        >
          + New announcement
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a: any) => (
            <div key={a.id} className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #D1EEE4' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#0B3D2E' }}>{a.title}</p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6B7B74' }}>{a.body}</p>
                  <p className="text-xs mt-1.5" style={{ color: '#6B7B74' }}>{formatDate(a.created_at)}</p>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-xs px-2 py-1 rounded flex-shrink-0"
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
