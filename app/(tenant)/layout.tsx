import Sidebar from '@/components/Sidebar'

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#F5F7F5' }}>
      <Sidebar />
      <main className="flex-1 ml-[200px] p-5 min-h-screen">
        {children}
      </main>
    </div>
  )
}
