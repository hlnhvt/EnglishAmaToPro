import { motion } from 'motion/react'
import { useMemo } from 'react'
import { Card, cx, PageHeader, stagger } from '../components/ui.tsx'
import { ITEMS } from '../content/index.ts'
import { addDays, dayKey, fromDayKey } from '../lib/date.ts'
import { mastery, MASTERY_LABEL, type Mastery } from '../lib/srs.ts'
import { useStore } from '../lib/store.ts'

const WEEKS = 20

export function ProgressPage() {
  const days = useStore((s) => s.days)
  const cards = useStore((s) => s.cards)
  const streak = useStore((s) => s.streak)
  const calib = useStore((s) => s.calib)
  const submissions = useStore((s) => s.submissions)

  const today = dayKey()
  // Lưới bắt đầu từ thứ Hai của tuần cách đây WEEKS tuần
  const grid = useMemo(() => {
    const dow = (fromDayKey(today).getDay() + 6) % 7
    const start = addDays(today, -dow - (WEEKS - 1) * 7)
    return Array.from({ length: WEEKS }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)))
  }, [today])

  const totalMin = Math.round(Object.values(days).reduce((s, d) => s + d.seconds, 0) / 60)
  const studyDays = Object.values(days).filter((d) => d.sessions > 0 || d.seconds > 120).length

  const dist = useMemo(() => {
    const c: Record<Mastery, number> = { new: 0, learning: 0, young: 0, mature: 0 }
    for (const [id] of ITEMS) c[mastery(cards[id]?.card)]++
    return c
  }, [cards])
  const totalItems = ITEMS.size || 1

  const scores = submissions
    .filter((s) => s.status === 'graded' && s.score != null)
    .sort((a, b) => (a.gradedAt ?? '').localeCompare(b.gradedAt ?? ''))
    .map((s) => s.score as number)

  const level = (sec: number) => (sec <= 0 ? 0 : sec < 600 ? 1 : sec < 1500 ? 2 : sec < 2700 ? 3 : 4)
  const shade = ['bg-sunk', 'bg-accent/25', 'bg-accent/50', 'bg-accent/75', 'bg-accent']

  const pct = (o: { n: number; ok: number }) => (o.n ? Math.round((o.ok / o.n) * 100) : null)
  const sureP = pct(calib.sure)
  const guessP = pct(calib.guess)

  return (
    <div>
      <PageHeader eyebrow="Nhìn lại" title="Tiến bộ của bạn" />

      <motion.div {...stagger(1)} className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Tổng thời gian', `${totalMin}`, 'phút'],
          ['Ngày đã học', `${studyDays}`, 'ngày'],
          ['Chuỗi dài nhất', `${streak.best}`, 'ngày'],
          ['Đã thuộc lâu', `${dist.mature}`, 'mục'],
        ].map(([l, v, u]) => (
          <Card key={l} className="p-4">
            <div className="eyebrow">{l}</div>
            <div className="mt-2 font-display text-[34px] leading-none">
              {v} <span className="text-[14px] text-muted">{u}</span>
            </div>
          </Card>
        ))}
      </motion.div>

      <motion.div {...stagger(2)}>
        <Card className="mb-4 overflow-x-auto p-5">
          <div className="eyebrow mb-4">{WEEKS} tuần gần nhất</div>
          <div className="flex gap-1">
            {grid.map((week, w) => (
              <div key={w} className="flex flex-col gap-1">
                {week.map((d) => {
                  const sec = days[d]?.seconds ?? 0
                  const future = d > today
                  return (
                    <motion.div
                      key={d}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: future ? 0.25 : 1, scale: 1 }}
                      transition={{ delay: w * 0.015 }}
                      title={`${d}: ${Math.round(sec / 60)} phút`}
                      className={cx('h-3.5 w-3.5 rounded-[3px]', shade[level(sec)], d === today && 'ring-1 ring-ink ring-offset-1 ring-offset-card', streak.frozen.includes(d) && 'bg-line-2')}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
            ít
            {shade.map((s) => (
              <span key={s} className={cx('h-3 w-3 rounded-[3px]', s)} />
            ))}
            nhiều
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div {...stagger(3)}>
          <Card className="h-full p-5">
            <div className="eyebrow mb-4">Bạn biết thật hay đoán?</div>
            {[
              ['Khi bấm "Kiểm tra" (chắc chắn)', sureP, calib.sure.n, 'bg-ink'],
              ['Khi bấm "Đoán thử"', guessP, calib.guess.n, 'bg-accent'],
            ].map(([label, p, n, c]) => (
              <div key={label as string} className="mb-4">
                <div className="flex justify-between text-[13px]">
                  <span className="text-ink-2">{label}</span>
                  <span className="font-mono">{p == null ? '—' : `${p}% đúng`}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sunk">
                  <motion.div className={cx('h-full rounded-full', c as string)} initial={{ width: 0 }} animate={{ width: `${p ?? 0}%` }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} />
                </div>
                <div className="mt-1 font-mono text-[11px] text-muted">{n as number} câu</div>
              </div>
            ))}
            <p className="text-[13px] text-muted">
              Lý tưởng: "chắc chắn" đúng trên 90%. Bấm "Không biết" {calib.dontKnow} lần — trung thực như vậy giúp lịch ôn chính xác hơn.
            </p>
          </Card>
        </motion.div>

        <motion.div {...stagger(4)}>
          <Card className="h-full p-5">
            <div className="eyebrow mb-4">Mức độ ghi nhớ · {ITEMS.size} mục</div>
            <div className="flex h-3 overflow-hidden rounded-full bg-sunk">
              {(['mature', 'young', 'learning'] as Mastery[]).map((m) => (
                <motion.div key={m} className={{ mature: 'bg-good', young: 'bg-accent', learning: 'bg-warn', new: '' }[m]} initial={{ width: 0 }} animate={{ width: `${(dist[m] / totalItems) * 100}%` }} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-y-2 text-[13px]">
              {(['mature', 'young', 'learning', 'new'] as Mastery[]).map((m) => (
                <div key={m} className="flex items-center gap-2">
                  <span className={cx('h-2.5 w-2.5 rounded-sm', { mature: 'bg-good', young: 'bg-accent', learning: 'bg-warn', new: 'bg-sunk border border-line-2' }[m])} />
                  <span className="text-ink-2">{MASTERY_LABEL[m]}</span>
                  <span className="ml-auto mr-4 font-mono">{dist[m]}</span>
                </div>
              ))}
            </div>
            <div className="eyebrow mb-3 mt-6">Điểm bài viết AI</div>
            {scores.length < 2 ? (
              <p className="text-[13px] text-muted">Cần ít nhất 2 bài đã chấm để vẽ xu hướng.</p>
            ) : (
              <Spark values={scores} />
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function Spark({ values }: { values: number[] }) {
  const w = 300
  const h = 70
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (w - 8) + 4, h - 4 - (v / 10) * (h - 8)])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const last = pts[pts.length - 1]
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={`Điểm gần nhất ${values[values.length - 1]}/10`}>
      <line x1="0" x2={w} y1={h - 4 - 0.8 * (h - 8)} y2={h - 4 - 0.8 * (h - 8)} stroke="var(--c-line)" strokeDasharray="3 4" />
      <motion.path d={d} fill="none" stroke="var(--c-ink)" strokeWidth="1.75" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill="var(--c-accent)" />
      <text x={last[0] - 6} y={last[1] - 8} textAnchor="end" className="fill-ink font-mono text-[10px]">
        {values[values.length - 1]}
      </text>
    </svg>
  )
}
