import { motion } from 'motion/react'
import { BookOpen, ClipboardCheck, Flame, LineChart, Map as MapIcon, Settings, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { go } from '../lib/router.ts'
import { liveStreak, useStore } from '../lib/store.ts'
import { cx } from './ui.tsx'

const NAV = [
  { id: '', label: 'Hôm nay', icon: Sun },
  { id: 'path', label: 'Lộ trình', icon: MapIcon },
  { id: 'words', label: 'Sổ từ', icon: BookOpen },
  { id: 'ai', label: 'Chấm bài', icon: ClipboardCheck },
  { id: 'progress', label: 'Tiến bộ', icon: LineChart },
]

const isActive = (id: string, active: string) => (id === '' ? active === '' || active === 'today' : active === id || (id === 'path' && active === 'unit'))

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cx('flex items-baseline gap-0.5 font-display text-[22px] tracking-[-0.03em]', className)}>
      <span className="italic">ama</span>
      <span className="text-accent">·</span>
      <span>to</span>
      <span className="text-accent">·</span>
      <span className="font-semibold">pro</span>
    </div>
  )
}

export function Shell({ active, children }: { active: string; children: ReactNode }) {
  const streak = useStore((s) => s.streak)
  const pending = useStore((s) => s.submissions.filter((x) => x.status === 'pending').length)
  const live = liveStreak(streak)

  return (
    <div className="min-h-dvh md:pl-60">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-paper/80 px-4 py-6 backdrop-blur md:flex">
        <button onClick={() => go('/')} className="mb-10 px-2 text-left">
          <Wordmark />
          <div className="eyebrow mt-1">từ A2 đến thành thạo</div>
        </button>
        <nav className="flex flex-col gap-0.5">
          {[...NAV, { id: 'settings', label: 'Cài đặt', icon: Settings }].map((n) => {
            const on = isActive(n.id, active)
            return (
              <button
                key={n.id}
                onClick={() => go(`/${n.id}`)}
                className={cx('relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors', on ? 'text-ink' : 'text-ink-2 hover:text-ink')}
              >
                {on && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-lg border border-line bg-card" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <n.icon size={18} strokeWidth={1.75} className="relative" />
                <span className="relative">{n.label}</span>
                {n.id === 'ai' && pending > 0 && <span className="relative ml-auto rounded-full bg-accent px-1.5 font-mono text-[10px] leading-4 text-accent-ink">{pending}</span>}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-line bg-card p-3">
          <div className="flex items-center gap-2">
            <Flame size={18} strokeWidth={1.75} className={live.doneToday ? 'text-accent' : 'text-muted'} />
            <span className="font-mono text-lg">{live.days}</span>
            <span className="text-[13px] text-muted">ngày liên tiếp</span>
          </div>
          <div className="mt-1 text-[12px] text-muted">{live.doneToday ? 'Hôm nay đã học. Tốt lắm.' : 'Hôm nay chưa học.'}</div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/85 px-4 backdrop-blur md:hidden">
        <button onClick={() => go('/')}>
          <Wordmark className="text-[19px]" />
        </button>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-[13px]">
            <Flame size={16} strokeWidth={1.75} className={live.doneToday ? 'text-accent' : 'text-muted'} />
            {live.days}
          </span>
          <button onClick={() => go('/settings')} className="text-ink-2" aria-label="Cài đặt">
            <Settings size={19} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 md:px-10 md:pb-16 md:pt-12">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map((n) => {
          const on = isActive(n.id, active)
          return (
            <button key={n.id} onClick={() => go(`/${n.id}`)} className={cx('relative flex h-16 flex-col items-center justify-center gap-1 text-[10.5px]', on ? 'text-ink' : 'text-muted')}>
              {on && <motion.span layoutId="tab-dot" className="absolute top-0 h-[2px] w-8 rounded-full bg-accent" />}
              <n.icon size={20} strokeWidth={on ? 2 : 1.6} />
              {n.label}
              {n.id === 'ai' && pending > 0 && <span className="absolute right-[calc(50%-18px)] top-2.5 h-2 w-2 rounded-full bg-accent" />}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
