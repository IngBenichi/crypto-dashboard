"use client"

interface MiniChartProps {
  data: number[]
  positive: boolean
}

export function MiniChart({ data, positive }: MiniChartProps) {
  const width = 100
  const height = 40
  const padding = 2

  // Normalizar datos
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Crear puntos del path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - ((value - min) / range) * (height - padding * 2) - padding
    return `${x},${y}`
  })

  const pathD = `M ${points.join(" L ")}`

  return (
    <svg width={width} height={height} className="inline-block">
      <path
        d={pathD}
        fill="none"
        stroke={positive ? "oklch(0.65 0.18 150)" : "oklch(0.55 0.22 25)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
