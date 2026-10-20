import { motion } from 'motion/react'
import { ArrowUpRight, Crosshair } from 'lucide-react'
import { Bar, Card, cx, PageHeader, stagger, Tag } from '../components/ui.tsx'
import { LEVELS, orderedUnits, topicLabel, UNITS } from '../content/index.ts'
import { go } from '../lib/router.ts'
import { mastery } from '../lib/srs.ts'
import { useStore } from '../lib/store.ts'

export function PathPage() {
  const cards = useStore((s) => s.cards)
  const profile = useStore((s) => s.profile)
  const units = orderedUnits(profile.topics)

  const levelStat = (lv: string) => {
    const items = UNITS.filter((u) => u.level === lv).flatMap((u) => u.items)
    const strong = items.filter((i) => ['young', 'mature'].includes(mastery(cards[i.id]?.card))).length
    return { total: items.length, strong }
  }

  return (
    <div>
      <PageHeader eyebrow="Lộ trình CEFR" title="Từ A2 đến thành thạo" />

      {/* Thang trình độ */}
      <motion.div {...stagger(1)} className="mb-10 grid grid-cols-5 gap-1.5">
        {LEVELS.map((lv) => {
          const st = lv.id === 'A1' ? null : levelStat(lv.id)
          const pct = lv.id === 'A1' ? 1 : st && st.total ? st.strong / st.total : 0
          const soon = st && st.total === 0
          const isCurrent = lv.id === 'A2'
          return (
            <div key={lv.id} className={cx('rounded-xl border p-3', isCurrent ? 'border-ink bg-card' : 'border-line')}>
              <div className="flex items-baseline justify-between">
                <span className={cx('font-display text-[22px]', soon && 'text-muted')}>{lv.label}</span>
                {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </div>
              <div className="mb-2 text-[11px] text-muted">{soon ? 'sắp có' : lv.desc}</div>
              <Bar value={pct} tone={lv.id === 'A1' ? 'good' : 'ink'} />
            </div>
          )
        })}
      </motion.div>
      <p className="-mt-6 mb-10 text-[12px] text-muted">Thanh tiến độ tính theo số mục đã "vững" (nhớ được qua nhiều ngày), không phải số mục đã xem.</p>

      <div className="space-y-3">
        {units.map((u, i) => {
          const learned = u.items.filter((it) => cards[it.id]).length
          const strong = u.items.filter((it) => ['young', 'mature'].includes(mastery(cards[it.id]?.card))).length
          const focus = profile.focusUnitId === u.id
          return (
            <motion.div key={u.id} {...stagger(i + 2)}>
              <Card className="group flex cursor-pointer items-center gap-5 p-5 transition-colors hover:border-line-2" onClick={() => go(`/unit/${u.id}`)}>
                <div className="w-12 shrink-0 text-center font-display text-[34px] italic leading-none text-muted transition-colors group-hover:text-accent">{String(u.order).padStart(2, '0')}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{u.level}</Tag>
                    <Tag tone={profile.topics.includes(u.topic) ? 'accent' : 'plain'}>{topicLabel(u.topic)}</Tag>
                    {focus && (
                      <Tag tone="good">
                        <Crosshair size={10} /> đang tập trung
                      </Tag>
                    )}
                  </div>
                  <div className="mt-2 font-display text-[21px] leading-tight">{u.title}</div>
                  <div className="text-[13px] text-muted">{u.titleVi}</div>
                  <div className="mt-3 flex items-center gap-3">
                    <Bar value={learned / u.items.length} className="max-w-56 flex-1" />
                    <span className="font-mono text-[11px] text-muted">
                      {learned}/{u.items.length} · vững {strong}
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={18} strokeWidth={1.5} className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
