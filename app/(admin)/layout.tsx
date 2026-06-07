import Sidebar from '@/components/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#F5F7F5' }}>
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-[200px] p-4 pt-16 md:p-5 md:pt-5 min-h-screen">
        {children}
      </main>
    </div>
  )
}
