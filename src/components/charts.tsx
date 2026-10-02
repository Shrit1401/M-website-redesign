'use client'

import { useId, useState } from 'react'

interface Point {
  label: string
  value: number
}

const niceMax = (v: number) => {
  const p = 10 ** Math.floor(Math.log10(v || 1))
  return Math.ceil(v / p) * p
}

export function AreaChart({ data, format = String, height = 240 }: { data: Point[]; format?: (n: number) => string; height?: number }) {
  const [hover, setHover] = useState<number | null>(null)
  const gid = useId()
  const w = 640
  const h = height
  const pad = { t: 12, r: 12, b: 28, l: 52 }
  const max = niceMax(Math.max(...data.map((d) => d.value), 1) * 1.1)
  const x = (i: number) => pad.l + (i * (w - pad.l - pad.r)) / Math.max(data.length - 1, 1)
  const y = (v: number) => pad.t + (1 - v / max) * (h - pad.t - pad.b)
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${h - pad.b} L${x(0)},${h - pad.b} Z`
  const ticks = [0, 0.5, 1].map((t) => max * t)
  const short = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(Math.round(n)))

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible text-brand-500" onMouseLeave={() => setHover(null)} role="img" aria-label="Chart">
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".12" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} className="stroke-line" />
            <text x={pad.l - 10} y={y(t) + 4} textAnchor="end" className="fill-faint text-[10px] tabular-nums">{t === 0 ? '0' : `$${short(t)}`}</text>
          </g>
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <g key={i}>
            <text x={x(i)} y={h - 8} textAnchor="middle" className="fill-faint text-[10px]">{d.label}</text>
            <rect x={x(i) - (w - pad.l) / data.length / 2} y={0} width={(w - pad.l) / data.length} height={h - pad.b} fill="transparent" onMouseEnter={() => setHover(i)} />
          </g>
        ))}
        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={h - pad.b} className="stroke-slate-300 dark:stroke-white/20" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(data[hover].value)} r="4.5" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2.5 py-1.5 text-xs text-on-brand"
          style={{ left: `${(x(hover) / w) * 100}%`, top: `${(y(data[hover].value) / h) * 100}%`, marginTop: -10 }}
        >
          <div className="opacity-70">{data[hover].label}</div>
          <div className="font-semibold tabular-nums">{format(data[hover].value)}</div>
        </div>
      )}
    </div>
  )
}

export function BarList({ data, format = String }: { data: Point[]; format?: (n: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <ul className="space-y-1">
      {data.map((d) => (
        <li key={d.label} className="relative flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px]">
          <span className="absolute inset-y-0 left-0 rounded-md bg-brand-50" style={{ width: `${(d.value / max) * 100}%` }} />
          <span className="relative truncate pr-3">{d.label}</span>
          <span className="relative tabular-nums">{format(d.value)}</span>
        </li>
      ))}
    </ul>
  )
}

export function Bars({ data, height = 140, unit = '' }: { data: Point[]; height?: number; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-2.5">
      {data.map((d, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-2">
          <span className="text-[11px] font-semibold text-muted tabular-nums opacity-0 transition group-hover:opacity-100">{d.value}{unit}</span>
          <div
            className={`w-full max-w-7 rounded-sm transition-colors ${i === data.length - 1 ? 'bg-brand-500' : d.value ? 'bg-slate-200 group-hover:bg-slate-400 dark:bg-[#1f2270]' : 'bg-line'}`}
            style={{ height: Math.max((d.value / max) * height, 4) }}
          />
          <span className="text-[11px] text-muted">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
