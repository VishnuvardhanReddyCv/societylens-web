const categoryStyles: Record<string, { bg: string; text: string }> = {
  MAINTENANCE: { bg: '#F0FAF6', text: '#0B3D2E' },
  REPAIR:      { bg: '#FEF3C7', text: '#92400E' },
  UTILITY:     { bg: '#EDE9FE', text: '#4C1D95' },
  SECURITY:    { bg: '#F0FAF6', text: '#065F46' },
  AMENITY:     { bg: '#FEE2E2', text: '#991B1B' },
  OTHER:       { bg: '#F3F4F6', text: '#374151' },
}

export default function CategoryBadge({ category }: { category: string }) {
  const style = categoryStyles[category] ?? { bg: '#F3F4F6', text: '#374151' }
  const label = category.charAt(0) + category.slice(1).toLowerCase()
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: style.bg, color: style.text }}
    >
      {label}
    </span>
  )
}
