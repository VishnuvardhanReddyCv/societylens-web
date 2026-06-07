'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  IconLayoutDashboard,
  IconReceipt,
  IconAlertCircle,
  IconSpeakerphone,
  IconUsers,
  IconQrcode,
  IconSettings,
  IconLogout,
  IconWallet,
} from '@tabler/icons-react'
import { getInitials } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const tenantNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <IconLayoutDashboard size={18} /> },
  { href: '/payments', label: 'Payments', icon: <IconWallet size={18} /> },
  { href: '/expenses', label: 'Expenses', icon: <IconReceipt size={18} /> },
  { href: '/issues', label: 'Issues', icon: <IconAlertCircle size={18} /> },
  { href: '/announcements', label: 'Announcements', icon: <IconSpeakerphone size={18} /> },
]

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <IconLayoutDashboard size={18} /> },
  { href: '/admin/payments', label: 'Payments', icon: <IconWallet size={18} /> },
  { href: '/admin/expenses', label: 'Expenses', icon: <IconReceipt size={18} /> },
  { href: '/admin/issues', label: 'Issues', icon: <IconAlertCircle size={18} /> },
  { href: '/admin/announcements', label: 'Announcements', icon: <IconSpeakerphone size={18} /> },
  { href: '/admin/tenants', label: 'Tenants', icon: <IconUsers size={18} /> },
  { href: '/admin/invite', label: 'Invite Code', icon: <IconQrcode size={18} /> },
  { href: '/admin/settings', label: 'Settings', icon: <IconSettings size={18} /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const navItems = isAdmin ? adminNav : tenantNav

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[200px] flex flex-col"
      style={{ background: '#0B3D2E' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-white/10">
        <p className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          SocietyLens
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#6EE7B7' }}>
          Built for better communities
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'text-teal-300 bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              style={active ? { color: '#6EE7B7', background: 'rgba(29,184,122,0.2)' } : {}}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: '#1DB87A', color: 'white' }}
          >
            {getInitials(session?.user?.name || 'U')}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs truncate" style={{ color: '#6EE7B7' }}>
              {isAdmin ? 'Admin' : 'Tenant'}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 text-white/60 hover:text-white/90 text-xs w-full transition-colors"
        >
          <IconLogout size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
