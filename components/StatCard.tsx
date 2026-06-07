interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
}

export default function StatCard({ label, value, sub, icon }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-5 flex flex-col gap-2"
      style={{ border: '0.5px solid #D1EEE4' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: '#6B7B74' }}>
          {label}
        </p>
        {icon && (
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F0FAF6', color: '#1DB87A' }}>
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#0B3D2E' }}>
        {value}
      </p>
      {sub && <p className="text-xs" style={{ color: '#6B7B74' }}>{sub}</p>}
    </div>
  )
}
