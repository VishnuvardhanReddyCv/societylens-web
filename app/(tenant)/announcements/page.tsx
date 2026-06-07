'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/announcements?limit=50').then(({ data }) => {
      setAnnouncements(data.data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
        Announcements
      </h1>

      <div className="space-y-4">
        {announcements.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: '#6B7B74' }}>No announcements yet.</p>
        )}
        {announcements.map((a: any) => (
          <div key={a.id} className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #D1EEE4' }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-semibold text-sm" style={{ color: '#0B3D2E' }}>{a.title}</h2>
              <span className="text-xs flex-shrink-0" style={{ color: '#6B7B74' }}>{formatDate(a.created_at)}</span>
            </div>
            <p className="text-sm whitespace-pre-line" style={{ color: '#1C2B26' }}>{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
