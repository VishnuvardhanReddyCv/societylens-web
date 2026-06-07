'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { notifications } from '@mantine/notifications'
import { IconCopy, IconRefresh } from '@tabler/icons-react'

export default function InvitePage() {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    api.get('/api/complexes/me').then(({ data }) => {
      setCode(data.data.invite_code)
      setLoading(false)
    })
  }, [])

  async function copyCode() {
    if (!code) return
    await navigator.clipboard.writeText(code)
    notifications.show({ message: 'Invite code copied!', color: 'green' })
  }

  async function regenerate() {
    if (!confirm('Generate a new invite code? The old code will stop working.')) return
    setRegenerating(true)
    try {
      const { data } = await api.patch('/api/admin/invite')
      setCode(data.data.invite_code)
      notifications.show({ message: 'New invite code generated', color: 'green' })
    } catch {
      notifications.show({ message: 'Failed to regenerate', color: 'red' })
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div className="max-w-sm">
      <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
        Invite Code
      </h1>
      <p className="text-sm mb-8" style={{ color: '#6B7B74' }}>
        Share this code with residents to let them join your community.
      </p>

      <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '0.5px solid #D1EEE4' }}>
        {loading ? (
          <div className="w-6 h-6 rounded-full border-2 animate-spin mx-auto" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
        ) : (
          <>
            <div
              className="text-5xl font-bold tracking-[0.15em] mb-2"
              style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}
            >
              {code}
            </div>
            <p className="text-xs mb-8" style={{ color: '#6B7B74' }}>6-digit invite code</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={copyCode}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ background: '#1DB87A' }}
              >
                <IconCopy size={15} />
                Copy code
              </button>
              <button
                onClick={regenerate}
                disabled={regenerating}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
                style={{ background: '#F0FAF6', color: '#0B3D2E', border: '1px solid #D1EEE4' }}
              >
                <IconRefresh size={15} className={regenerating ? 'animate-spin' : ''} />
                Regenerate
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
