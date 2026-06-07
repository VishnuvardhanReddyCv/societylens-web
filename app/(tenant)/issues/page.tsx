'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'

const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED']
const STATUS_DOTS: Record<string, string> = {
  OPEN: '#EF4444',
  IN_PROGRESS: '#F59E0B',
  RESOLVED: '#10B981',
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<any[]>([])
  const [activeStatus, setActiveStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)

  async function load(status: string) {
    setLoading(true)
    const params = new URLSearchParams({ limit: '50' })
    if (status !== 'ALL') params.set('status', status)
    const { data } = await api.get(`/api/issues?${params}`)
    setIssues(data.data)
    setLoading(false)
  }

  useEffect(() => { load(activeStatus) }, [activeStatus])

  const statusLabels: Record<string, string> = {
    ALL: 'All', OPEN: 'Open', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
          Issues
        </h1>
        <Link
          href="/issues/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#1DB87A' }}
        >
          + Report issue
        </Link>
      </div>

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
          {issues.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: '#6B7B74' }}>No issues found.</p>
          )}
          {issues.map((issue: any) => (
            <div
              key={issue.id}
              className="bg-white rounded-xl p-4"
              style={{ border: '0.5px solid #D1EEE4' }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: STATUS_DOTS[issue.status] || '#6B7B74' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm" style={{ color: '#1C2B26' }}>{issue.title}</p>
                    <StatusBadge status={issue.status} />
                  </div>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6B7B74' }}>{issue.description}</p>
                  <p className="text-xs mt-1.5" style={{ color: '#6B7B74' }}>Reported {formatDate(issue.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
