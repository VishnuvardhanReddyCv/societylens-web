'use client'

import { useState } from 'react'
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
  IconMenu2,
  IconX,
  IconBuildingCommunity,
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
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const navItems = isAdmin ? adminNav : tenantNav

  function NavLinks({ onClick }: { onClick?: () => void }) {
    return (
      <>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={active
                ? { color: '#6EE7B7', background: 'rgba(29,184,122,0.2)' }
                : { color: 'rgba(255,255,255,0.7)' }}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </>
    )
  }

  function UserFooter() {
    return (
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
    )
  }

  return (
    <>
      {/* ── Desktop sidebar (md+) ── */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-[200px] flex-col"
        style={{ background: '#0B3D2E' }}
      >
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <IconBuildingCommunity size={20} color="#1DB87A" />
            <p className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
              SocietyLens
            </p>
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#6EE7B7' }}>Built for better communities</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <NavLinks />
        </nav>
        <UserFooter />
      </aside>

      {/* ── Mobile top bar ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-12"
        style={{ background: '#0B3D2E' }}
      >
        <div className="flex items-center gap-2">
          <IconBuildingCommunity size={18} color="#1DB87A" />
          <p className="text-white font-bold text-base" style={{ fontFamily: 'Sora, sans-serif' }}>
            SocietyLens
          </p>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="text-white p-1">
          <IconMenu2 size={22} />
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className="relative w-[240px] h-full flex flex-col"
            style={{ background: '#0B3D2E' }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <IconBuildingCommunity size={18} color="#1DB87A" />
                <p className="text-white font-bold text-base" style={{ fontFamily: 'Sora, sans-serif' }}>
                  SocietyLens
                </p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-white/70 p-1">
                <IconX size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              <NavLinks onClick={() => setDrawerOpen(false)} />
            </nav>
            <UserFooter />
          </aside>
        </div>
      )}
    </>
  )
}
