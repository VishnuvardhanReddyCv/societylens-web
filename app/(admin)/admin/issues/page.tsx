'use client'

import { useEffect, useState } from 'react'
import StatusBadge from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'
import { notifications } from '@mantine/notifications'

const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED']

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<any[]>([])
  const [activeStatus, setActiveStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  async function load(status: string) {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (status !== 'ALL') params.set('status', status)
    const { data } = await api.get(`/api/issues?${params}`)
    setIssues(data.data)
    setLoading(false)
  }

  useEffect(() => { load(activeStatus) }, [activeStatus])

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    try {
      await api.patch(`/api/issues/${id}`, { status })
      notifications.show({ message: 'Status updated', color: 'green' })
      load(activeStatus)
    } catch {
      notifications.show({ message: 'Failed to update status', color: 'red' })
    } finally {
      setUpdating(null)
    }
  }

  const statusLabels: Record<string, string> = {
    ALL: 'All', OPEN: 'Open', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved'
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
        Issues
      </h1>

      <div className="flex gap-2 flex-wrap mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={
              activeStatus === s
                ? { background: '#1DB87A', color: 'white' }
                : { background: 'white', color: '#6B7B74', border: '1px solid #D1EEE4' }
            }
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: '#1DB87A', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue: any) => (
            <div key={issue.id} className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #D1EEE4' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: '#1C2B26' }}>{issue.title}</p>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#6B7B74' }}>{issue.description}</p>
                  <p className="text-xs mt-1.5" style={{ color: '#6B7B74' }}>
                    Reported {formatDate(issue.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={issue.status} />
                  <select
                    value={issue.status}
                    onChange={(e) => updateStatus(issue.id, e.target.value)}
                    disabled={updating === issue.id}
                    className="text-xs px-2 py-1.5 rounded-lg outline-none"
                    style={{ border: '1px solid #D1EEE4', color: '#1C2B26', background: 'white' }}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
