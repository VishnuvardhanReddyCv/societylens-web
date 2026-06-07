'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'
import { getInitials } from '@/lib/utils'

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/admin/tenants?limit=100').then(({ data }) => {
      setTenants(data.data)
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
        Tenants
        <span className="ml-2 text-sm font-normal" style={{ color: '#6B7B74' }}>({tenants.length})</span>
      </h1>

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #D1EEE4' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #D1EEE4' }}>
              <th className="text-left px-5 py-3 font-medium" style={{ color: '#6B7B74' }}>Resident</th>
              <th className="text-left px-5 py-3 font-medium" style={{ color: '#6B7B74' }}>Email</th>
              <th className="text-left px-5 py-3 font-medium" style={{ color: '#6B7B74' }}>Unit</th>
              <th className="text-left px-5 py-3 font-medium" style={{ color: '#6B7B74' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t: any, i: number) => (
              <tr
                key={t.id}
                style={{ borderBottom: i < tenants.length - 1 ? '1px solid #F0FAF6' : 'none' }}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: '#F0FAF6', color: '#0B3D2E' }}
                    >
                      {getInitials(t.name)}
                    </div>
                    <span style={{ color: '#1C2B26' }}>{t.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3" style={{ color: '#6B7B74' }}>{t.email}</td>
                <td className="px-5 py-3">
                  {t.unit_number ? (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: '#F0FAF6', color: '#0B3D2E' }}
                    >
                      {t.unit_number}
                    </span>
                  ) : (
                    <span style={{ color: '#6B7B74' }}>—</span>
                  )}
                </td>
                <td className="px-5 py-3" style={{ color: '#6B7B74' }}>{formatDate(t.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tenants.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: '#6B7B74' }}>No tenants yet.</p>
        )}
      </div>
    </div>
  )
}
