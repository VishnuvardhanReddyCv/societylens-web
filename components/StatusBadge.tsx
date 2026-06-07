const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  OPEN: { bg: '#FEE2E2', text: '#991B1B', label: 'Open' },
  IN_PROGRESS: { bg: '#FEF3C7', text: '#92400E', label: 'In Progress' },
  RESOLVED: { bg: '#D1FAE5', text: '#065F46', label: 'Resolved' },
}

export default function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? { bg: '#F3F4F6', text: '#374151', label: status }
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}
