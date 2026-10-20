import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Crosshair, PenLine } from 'lucide-react'
import { useState } from 'react'
import { Button, Card, cx, Empty, Rich, SpeakButton, stagger, Tag, toast } from '../components/ui.tsx'
import { UNITS, topicLabel } from '../content/index.ts'
import { fillCloze } from '../lib/grading.ts'
import { go } from '../lib/router.ts'
import { mastery, MASTERY_LABEL, type Mastery } from '../lib/srs.ts'
import { useStore } from '../lib/store.ts'

export const MASTERY_TONE: Record<Mastery, 'plain' | 'warn' | 'accent' | 'good'> = { new: 'plain', learning: 'warn', young: 'accent', mature: 'good' }

export function UnitPage({ id }: { id?: string }) {
  const unit = UNITS.find((u) => u.id === id)
  const cards = useStore((s) => s.cards)
  const profile = useStore((s) => s.profile)
  const setProfile = useStore((s) => s.setProfile)
  const submissions = useStore((s) => s.submissions)
  const [open, setOpen] = useState<string | null>(null)

  if (!unit) return <Empty icon={<ArrowLeft />} title="Không tìm thấy unit" />

  const focus = profile.focusUnitId === unit.id
  const vocab = unit.items.filter((i) => i.kind === 'vocab')
  const patterns = unit.items.filter((i) => i.kind === 'pattern')

  return (
    <div>
      <button onClick={() => go('/path')} className="mb-6 flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
        <ArrowLeft size={14} /> Lộ trình
      </button>
      <motion.header {...stagger(0)} className="mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{unit.level}</Tag>
          <Tag>{topicLabel(unit.topic)}</Tag>
        </div>
        <div className="mt-4 flex items-start gap-4">
          <span className="font-display text-[56px] italic leading-[0.9] text-accent">{String(unit.order).padStart(2, '0')}</span>
          <div>
            <h1 className="font-display text-[34px] leading-[1.05] tracking-[-0.02em] md:text-[42px]">{unit.title}</h1>
            <div className="mt-1 text-ink-2">{unit.titleVi}</div>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-[15px] text-ink-2">{unit.goal}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant={focus ? 'soft' : 'outline'}
            icon={<Crosshair size={15} strokeWidth={1.75} />}
            onClick={() => {
              setProfile({ focusUnitId: focus ? undefined : unit.id })
              toast(focus ? 'Đã bỏ tập trung' : 'Các buổi học sẽ ưu tiên unit này')
            }}
          >
            {focus ? 'Đang tập trung' : 'Tập trung unit này'}
          </Button>
          <Button
            onClick={() => {
              setProfile({ focusUnitId: unit.id })
              go(`/session/${profile.dailyMinutes}`)
            }}
          >
            Học ngay <ArrowRight size={16} strokeWidth={1.75} />
          </Button>
        </div>
      </motion.header>

      <section className="mb-10">
        <div className="eyebrow mb-3">Từ & cụm từ · {vocab.length}</div>
        <Card className="divide-y divide-line overflow-hidden">
          {vocab.map((v) => {
            if (v.kind !== 'vocab') return null
            const m = mastery(cards[v.id]?.card)
            const isOpen = open === v.id
            return (
              <div key={v.id}>
                <button onClick={() => setOpen(isOpen ? null : v.id)} className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-sunk/50">
                  <div className="min-w-0 flex-1">
                    <span className="font-display text-[18px]">{v.term}</span>
                    <span className="ml-3 text-[14px] text-muted">{m === 'new' ? '· · ·' : v.vi}</span>
                  </div>
                  <Tag tone={MASTERY_TONE[m]}>{MASTERY_LABEL[m]}</Tag>
                </button>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden bg-paper/60 px-5 pb-4">
                    <div className="flex items-center gap-3 pt-1 text-[14px]">
                      <SpeakButton text={v.term} />
                      {v.ipa && <span className="font-mono text-[12px] text-muted">{v.ipa}</span>}
                      <span>{v.vi}</span>
                    </div>
                    <p className="mt-1 text-[13px] italic text-ink-2">{v.def}</p>
                    <ul className="mt-3 space-y-1.5">
                      {v.examples.map((e, i) => (
                        <li key={i} className="text-[14px]">
                          <span className="font-display text-[16px]">{fillCloze(e.en)}</span>
                          <span className="ml-2 text-muted">{e.vi}</span>
                        </li>
                      ))}
                    </ul>
                    {v.note && (
                      <p className="mt-3 text-[13px] text-ink-2">
                        <Rich text={v.note} />
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            )
          })}
        </Card>
        <p className="mt-2 text-[12px] text-muted">Nghĩa của mục chưa học được ẩn đi — để lần đầu gặp trong bài học bạn phải tự suy nghĩ.</p>
      </section>

      <section className="mb-10">
        <div className="eyebrow mb-3">Ngữ pháp & mẫu câu · {patterns.length}</div>
        <div className="grid gap-3 md:grid-cols-2">
          {patterns.map((p) => {
            if (p.kind !== 'pattern') return null
            const m = mastery(cards[p.id]?.card)
            return (
              <Card key={p.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-display text-[19px] leading-snug">{p.title}</div>
                  <Tag tone={MASTERY_TONE[m]}>{MASTERY_LABEL[m]}</Tag>
                </div>
                {p.form && <div className="mt-3 inline-block rounded-md bg-sunk px-2 py-1 font-mono text-[12px]">{p.form}</div>}
                <p className={cx('mt-3 text-[14px] text-ink-2', m === 'new' && 'line-clamp-2')}>
                  <Rich text={p.summary} />
                </p>
                <div className="mt-3 font-mono text-[11px] text-muted">{p.drills.length} bài luyện</div>
              </Card>
            )
          })}
        </div>
      </section>

      <section>
        <div className="eyebrow mb-3">Bài viết chấm bằng AI · {unit.aiTasks.length}</div>
        <div className="grid gap-3 md:grid-cols-2">
          {unit.aiTasks.map((t) => {
            const subs = submissions.filter((s) => s.taskId === t.id)
            const best = subs.reduce<number | null>((b, s) => (s.score != null && (b == null || s.score > b) ? s.score : b), null)
            return (
              <Card key={t.id} className="group flex cursor-pointer items-start gap-4 p-5 transition-colors hover:border-line-2" onClick={() => go(`/ai/${t.id}`)}>
                <PenLine size={18} strokeWidth={1.75} className="mt-1 shrink-0 text-accent" />
                <div className="flex-1">
                  <div className="font-medium">{t.title}</div>
                  <div className="mt-1 line-clamp-2 text-[13px] text-muted">{t.brief}</div>
                  <div className="mt-2 font-mono text-[11px] text-muted">
                    {subs.length ? `${subs.length} lần nộp${best != null ? ` · cao nhất ${best}/10` : ''}` : 'chưa làm'}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
