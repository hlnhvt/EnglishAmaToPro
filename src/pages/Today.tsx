import { motion } from 'motion/react'
import { ArrowRight, ClipboardCheck, Flame, Snowflake } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Bar, Button, Card, cx, Ring, Segmented, SpeakButton, stagger, Tag } from '../components/ui.tsx'
import { orderedUnits, phraseOfDay, topicLabel } from '../content/index.ts'
import { addDays, dayKey, formatLongVi, greeting, WEEKDAY_SHORT, fromDayKey } from '../lib/date.ts'
import { fillCloze, parseCloze } from '../lib/grading.ts'
import { go } from '../lib/router.ts'
import { dueCount, NEW_PER_SESSION } from '../lib/session.ts'
import { liveStreak, todayStat, useStore } from '../lib/store.ts'

export function Today() {
  const profile = useStore((s) => s.profile)
  const cards = useStore((s) => s.cards)
  const mistakes = useStore((s) => s.mistakes)
  const days = useStore((s) => s.days)
  const streak = useStore((s) => s.streak)
  const submissions = useStore((s) => s.submissions)
  const [minutes, setMinutes] = useState(profile.dailyMinutes)

  const today = dayKey()
  const stat = todayStat(days)
  const live = liveStreak(streak)
  const due = dueCount({ cards, mistakes })
  const pending = submissions.filter((s) => s.status === 'pending').length
  const phrase = phraseOfDay(today)

  const units = useMemo(() => {
    let list = orderedUnits(profile.topics)
    if (profile.focusUnitId) {
      const f = list.find((u) => u.id === profile.focusUnitId)
      if (f) list = [f, ...list.filter((u) => u !== f)]
    }
    return list
  }, [profile.topics, profile.focusUnitId])
  const current = units.find((u) => u.items.some((i) => !cards[i.id])) ?? units[0]
  const learnedIn = (id: string) => units.find((u) => u.id === id)!.items.filter((i) => cards[i.id]).length
  const unlearned = units.reduce((n, u) => n + u.items.filter((i) => !cards[i.id]).length, 0)
  const freshCount = Math.min(unlearned, NEW_PER_SESSION[minutes] ?? 6)

  const goalPct = stat.seconds / 60 / profile.dailyMinutes
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))

  const start = () => go(`/session/${minutes}`)

  return (
    <div>
      <motion.div {...stagger(0)} className="mb-8">
        <div className="eyebrow">{formatLongVi()}</div>
        <h1 className="mt-2 font-display text-[36px] leading-[1.05] tracking-[-0.025em] md:text-[48px]">
          {greeting()}, <span className="italic">{profile.name}</span>.
        </h1>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Buổi học */}
        <motion.div {...stagger(1)}>
          <Card className="relative overflow-hidden p-6 md:p-8">
            <div className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[180px] italic leading-none text-sunk">{due + freshCount}</div>
            <div className="relative">
              <div className="eyebrow">Buổi học hôm nay</div>
              <div className="mt-3 font-display text-[30px] leading-tight tracking-[-0.02em] md:text-[34px]">
                {due > 0 || freshCount > 0 ? (
                  <>
                    {due > 0 && (
                      <>
                        <span className="text-accent">{due}</span> thẻ cần ôn
                      </>
                    )}
                    {due > 0 && freshCount > 0 && <span className="text-muted"> · </span>}
                    {freshCount > 0 && <>{freshCount} mục mới</>}
                  </>
                ) : (
                  'Đã xong hết. Viết một bài nhé?'
                )}
              </div>
              <p className="mt-2 text-[14px] text-ink-2">
                Tiếp theo: <span className="font-medium text-ink">{current?.title}</span>
                {current && <span className="text-muted"> — {current.titleVi}</span>}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Segmented
                  value={minutes}
                  onChange={setMinutes}
                  options={[15, 30, 45, 60].map((m) => ({ value: m, label: `${m}′` }))}
                />
                <Button size="lg" variant="accent" onClick={start} className="ml-auto">
                  Bắt đầu <ArrowRight size={17} strokeWidth={2} />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mục tiêu + chuỗi ngày */}
        <motion.div {...stagger(2)} className="grid gap-4">
          <Card className="flex items-center gap-5 p-5">
            <Ring value={goalPct} size={72} stroke={6} tone={goalPct >= 1 ? 'good' : 'accent'}>
              <span className="font-display text-[20px]">{Math.round(stat.seconds / 60)}</span>
            </Ring>
            <div>
              <div className="eyebrow">Mục tiêu ngày</div>
              <div className="mt-1 text-[15px]">
                {Math.round(stat.seconds / 60)} / {profile.dailyMinutes} phút
              </div>
              <div className="text-[13px] text-muted">
                {stat.answered} câu · {stat.answered ? Math.round((stat.correct / stat.answered) * 100) : 0}% đúng
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span animate={live.doneToday ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.6 }}>
                  <Flame size={20} strokeWidth={1.75} className={live.doneToday ? 'text-accent' : 'text-muted'} />
                </motion.span>
                <span className="font-display text-[28px] leading-none">{live.days}</span>
                <span className="text-[13px] text-muted">ngày liên tiếp</span>
              </div>
              <span className="flex items-center gap-1 text-[12px] text-muted" title="Ngày đóng băng: lỡ một ngày vẫn giữ được chuỗi. Cứ 7 ngày liên tiếp được thêm 1 (tối đa 2).">
                <Snowflake size={14} strokeWidth={1.75} />
                {streak.freezes}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {week.map((d) => {
                const s = days[d]
                const done = (s?.sessions ?? 0) > 0
                const frozen = streak.frozen.includes(d)
                return (
                  <div key={d} className="flex flex-col items-center gap-1">
                    <div className={cx('grid h-7 w-full place-items-center rounded-md border text-[10px]', done ? 'border-ink bg-ink text-paper' : frozen ? 'border-line-2 bg-sunk text-ink-2' : 'border-line', d === today && !done && 'border-dashed border-accent')}>
                      {frozen && !done ? <Snowflake size={11} /> : null}
                    </div>
                    <span className="font-mono text-[9.5px] text-muted">{WEEKDAY_SHORT[fromDayKey(d).getDay()]}</span>
                  </div>
                )
              })}
            </div>
            {live.atRisk && <p className="mt-3 text-[12px] text-warn">Học hôm nay để giữ chuỗi — sẽ dùng ngày đóng băng cho hôm qua.</p>}
          </Card>
        </motion.div>
      </div>

      {/* Câu của ngày */}
      {phrase && (
        <motion.div {...stagger(3)} className="mt-4">
          <Card className="p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div className="eyebrow">Câu của ngày</div>
              <SpeakButton text={fillCloze(phrase.en)} />
            </div>
            <p className="mt-3 font-display text-[24px] leading-snug tracking-[-0.01em] md:text-[28px]">
              {(() => {
                const p = parseCloze(phrase.en)
                return (
                  <>
                    {p.before}
                    <span className="underline decoration-accent decoration-2 underline-offset-[5px]">{p.answers[0]}</span>
                    {p.after}
                  </>
                )
              })()}
            </p>
            <p className="mt-2 text-[14px] text-muted">{phrase.vi}</p>
          </Card>
        </motion.div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Unit hiện tại */}
        {current && (
          <motion.div {...stagger(4)}>
            <Card className="group h-full cursor-pointer p-5 transition-colors hover:border-line-2" onClick={() => go(`/unit/${current.id}`)}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="eyebrow">Đang học · {current.level}</div>
                  <div className="mt-2 font-display text-[22px] leading-tight">{current.title}</div>
                  <div className="text-[13px] text-muted">{current.titleVi}</div>
                </div>
                <Tag>{topicLabel(current.topic)}</Tag>
              </div>
              <Bar value={learnedIn(current.id) / current.items.length} className="mt-5" />
              <div className="mt-2 flex justify-between text-[12px] text-muted">
                <span>
                  {learnedIn(current.id)}/{current.items.length} mục
                </span>
                <span className="flex items-center gap-1 transition-colors group-hover:text-ink">
                  Xem unit <ArrowRight size={13} />
                </span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Chấm bài AI */}
        <motion.div {...stagger(5)}>
          <Card className="group h-full cursor-pointer p-5 transition-colors hover:border-line-2" onClick={() => go('/ai')}>
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} strokeWidth={1.75} className="text-accent" />
              <div className="eyebrow">Chấm bài bằng AI</div>
            </div>
            <div className="mt-2 font-display text-[22px] leading-tight">{pending > 0 ? `${pending} bài đang chờ bạn dán kết quả` : 'Viết, rồi để AI chữa'}</div>
            <p className="mt-1 text-[13px] text-muted">Đề + bài làm được sao chép sẵn, dán vào ChatGPT, Claude, Gemini… Lỗi được đưa vào sổ ôn tập.</p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
