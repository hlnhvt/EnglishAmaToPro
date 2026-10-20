import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, Clock, Copy, Flame, PenLine, Sparkles, Target, ThumbsUp, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Cloze, Dictation, Fix, LearnPattern, LearnVocab, MistakeEx, Recall, Speak, Transform, TwoTier, type Result } from '../components/exercises.tsx'
import { Bar, Button, Card, cx, Kbd, toast } from '../components/ui.tsx'
import { orderedUnits } from '../content/index.ts'
import { buildExplainPrompt, copyText } from '../lib/ai.ts'
import { go } from '../lib/router.ts'
import { KIND_LABEL, makeEx, planSession, reviewVariant, type Ex } from '../lib/session.ts'
import { sfx } from '../lib/sound.ts'
import { recognitionSupported, stopSpeaking } from '../lib/speech.ts'
import { liveStreak, useStore } from '../lib/store.ts'

interface Stats {
  answered: number
  correct: number
  sureN: number
  sureOk: number
  guessN: number
  guessOk: number
  learned: number
  start: number
}

function ExerciseView({ ex, locked, onSubmit }: { ex: Ex; locked: boolean; onSubmit: (r: Result) => void }) {
  switch (ex.k) {
    case 'learnVocab':
      return <LearnVocab ex={ex} locked={locked} onSubmit={onSubmit} />
    case 'learnPattern':
      return <LearnPattern ex={ex} locked={locked} onSubmit={onSubmit} />
    case 'cloze':
      return <Cloze ex={ex} locked={locked} onSubmit={onSubmit} />
    case 'recall':
      return <Recall ex={ex} locked={locked} onSubmit={onSubmit} />
    case 'dictation':
      return <Dictation ex={ex} locked={locked} onSubmit={onSubmit} />
    case 'fix':
      return <Fix ex={ex} locked={locked} onSubmit={onSubmit} />
    case 'twoTier':
      return <TwoTier ex={ex} locked={locked} onSubmit={onSubmit} />
    case 'transform':
      return <Transform ex={ex} locked={locked} onSubmit={onSubmit} />
    case 'speak':
      return <Speak ex={ex} locked={locked} onSubmit={onSubmit} />
    case 'mistake':
      return <MistakeEx ex={ex} locked={locked} onSubmit={onSubmit} />
  }
}

export function SessionPage({ minutes }: { minutes: number }) {
  const [plan] = useState(() => planSession(useStore.getState(), minutes || useStore.getState().profile.dailyMinutes, useStore.getState().settings.speaking && recognitionSupported()))
  const [queue, setQueue] = useState<Ex[]>(plan.queue)
  const [idx, setIdx] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [overridden, setOverridden] = useState(false)
  const [finished, setFinished] = useState<Stats | null>(null)
  const stats = useRef<Stats>({ answered: 0, correct: 0, sureN: 0, sureOk: 0, guessN: 0, guessOk: 0, learned: 0, start: Date.now() })
  const lastTick = useRef(Date.now())
  const retried = useRef(new Set<string>())
  const soundOn = useStore((s) => s.settings.sound)

  const ex = queue[idx]

  const tick = () => {
    const now = Date.now()
    useStore.getState().addTime(Math.min((now - lastTick.current) / 1000, 90))
    lastTick.current = now
  }

  const finish = useCallback(() => {
    tick()
    useStore.getState().completeSession()
    if (soundOn) sfx.finish()
    setFinished({ ...stats.current })
  }, [soundOn])

  const advance = useCallback(
    (len: number) => {
      stopSpeaking()
      setResult(null)
      setOverridden(false)
      if (idx + 1 >= len) finish()
      else setIdx(idx + 1)
    },
    [idx, finish],
  )

  const onSubmit = useCallback(
    (r: Result) => {
      tick()
      if (r.verdict === 'info') {
        advance(queue.length)
        return
      }
      setResult(r)
      if (soundOn) {
        if (r.verdict === 'correct') sfx.correct()
        else if (r.verdict === 'almost') sfx.almost()
        else sfx.wrong()
      }
    },
    [advance, soundOn, queue.length],
  )

  const commit = useCallback(() => {
    if (!result || !ex) return
    const verdict = overridden ? 'correct' : result.verdict
    const correct = verdict === 'correct' || verdict === 'almost'
    let q = queue
    if (!ex.practice) {
      useStore.getState().recordAttempt({
        itemId: ex.itemId,
        variant: ex.variant,
        firstTime: ex.firstTime,
        outcome: { correct, almost: verdict === 'almost', hints: result.hints, confidence: result.confidence },
      })
      const s = stats.current
      s.answered++
      if (correct) s.correct++
      if (result.confidence === 'sure') {
        s.sureN++
        if (correct) s.sureOk++
      } else if (result.confidence === 'guess') {
        s.guessN++
        if (correct) s.guessOk++
      }
      if (ex.firstTime) s.learned++
      // Sai → làm lại sau vài câu với dạng bài khác
      if (!correct && !retried.current.has(ex.itemId)) {
        retried.current.add(ex.itemId)
        const st = useStore.getState()
        const re = makeEx(ex.itemId, reviewVariant(ex.itemId, st, ex.variant), st.mistakes)
        if (re) {
          q = [...queue.slice(0, idx + 4), re, ...queue.slice(idx + 4)]
          setQueue(q)
        }
      }
    }
    advance(q.length)
  }, [result, ex, overridden, idx, advance, queue])

  // Enter để tiếp tục khi đang xem phản hồi
  useEffect(() => {
    if (!result) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        commit()
      }
    }
    const t = setTimeout(() => window.addEventListener('keydown', h), 50)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', h)
    }
  }, [result, commit])

  const exit = () => {
    stopSpeaking()
    if (!finished && stats.current.answered >= 8) useStore.getState().completeSession()
    go('/')
  }

  if (!queue.length) return <EmptySession onExit={exit} />
  if (finished) return <Summary stats={finished} minutes={minutes} />

  const progress = (idx + (result ? 1 : 0)) / queue.length
  const tagText = ex.firstTime ? 'mới' : ex.k.startsWith('learn') ? 'học' : ex.practice ? 'luyện' : 'ôn tập'

  return (
    <div className="min-h-dvh pb-48">
      <div className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
          <button onClick={exit} className="text-ink-2 hover:text-ink" aria-label="Thoát">
            <X size={20} strokeWidth={1.75} />
          </button>
          <Bar value={progress} tone="accent" className="flex-1" />
          <span className="font-mono text-[12px] text-muted">
            {Math.min(idx + 1, queue.length)}/{queue.length}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-8 md:pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={ex.key}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="eyebrow !text-ink-2">{KIND_LABEL[ex.k]}</span>
              <span className="eyebrow">· {tagText}</span>
            </div>
            <motion.div animate={result && (result.verdict === 'wrong' || result.verdict === 'skip') && !overridden ? { x: [0, -7, 7, -4, 4, 0] } : {}} transition={{ duration: 0.35 }}>
              <Card className="p-6 md:p-10">
                <ExerciseView ex={ex} locked={!!result} onSubmit={onSubmit} />
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>{result && <Feedback key={ex.key} ex={ex} result={result} overridden={overridden} onOverride={() => setOverridden(true)} onNext={commit} />}</AnimatePresence>
    </div>
  )
}

function Feedback({ ex, result, overridden, onOverride, onNext }: { ex: Ex; result: Result; overridden: boolean; onOverride: () => void; onNext: () => void }) {
  const v = overridden ? 'correct' : result.verdict
  const tone = v === 'correct' ? 'good' : v === 'almost' ? 'warn' : 'bad'
  const bg = { good: 'bg-good-soft border-good/30', warn: 'bg-warn-soft border-warn/30', bad: 'bg-bad-soft border-bad/30' }[tone]
  const fg = { good: 'text-good', warn: 'text-warn', bad: 'text-bad' }[tone]
  const title =
    v === 'correct' ? (overridden ? 'Đã tính là đúng.' : 'Chính xác.') : v === 'almost' ? (ex.k === 'dictation' || ex.k === 'speak' ? 'Gần đúng.' : 'Gần đúng — chú ý chính tả.') : v === 'skip' ? 'Không sao — giờ bạn đã biết.' : 'Chưa đúng.'

  let sub: string | null = null
  if (!overridden && !ex.practice) {
    if (v === 'correct' && result.confidence === 'guess') sub = 'Bạn đoán đúng. App vẫn sẽ hỏi lại sớm để chắc là bạn thật sự hiểu.'
    else if (v === 'wrong' && result.confidence === 'sure') sub = 'Bạn đã chắc chắn — đây là một điểm mù. App sẽ cho bạn gặp lại nhiều hơn.'
    else if (v === 'correct' && result.hints > 0) sub = 'Đúng nhờ gợi ý — lần sau thử không dùng gợi ý nhé.'
  }

  const askAi = async () => {
    const ok = await copyText(buildExplainPrompt({ question: result.question, mine: result.mine, expected: result.expected ?? '', note: result.explain }))
    toast(ok ? 'Đã sao chép — dán vào AI chat bất kỳ' : 'Không sao chép được')
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      className={cx('fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)]', bg)}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5 md:flex-row md:items-end">
        <div className="flex flex-1 gap-3">
          <motion.div initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card', fg)}>
            {v === 'correct' || v === 'almost' ? <Check size={18} strokeWidth={2.5} /> : <X size={18} strokeWidth={2.5} />}
          </motion.div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className={cx('font-display text-[21px] leading-tight', fg)}>{title}</div>
            {v !== 'correct' && result.expected && ex.k !== 'dictation' && ex.k !== 'speak' && (
              <div className="text-[15px]">
                <span className="text-muted">Đáp án: </span>
                <span className="font-display text-[17px]">{result.expected}</span>
              </div>
            )}
            {result.detail && <div className="text-[14px] text-ink-2">{result.detail}</div>}
            {result.explain && <div className="text-[14px] text-ink-2">{result.explain}</div>}
            {sub && <div className="text-[13px] italic text-ink-2">{sub}</div>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={askAi} icon={<Copy size={14} strokeWidth={1.75} />} title="Sao chép câu hỏi + câu trả lời để hỏi AI">
            Hỏi AI
          </Button>
          {result.allowOverride && v === 'wrong' && !overridden && (
            <Button variant="ghost" size="sm" onClick={onOverride} icon={<ThumbsUp size={14} strokeWidth={1.75} />} title="Câu của bạn cũng đúng nhưng khác đáp án mẫu">
              Tôi viết cũng đúng
            </Button>
          )}
          <Button onClick={onNext} className="min-w-36">
            Tiếp tục <Kbd className="ml-1 opacity-60">↵</Kbd>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function EmptySession({ onExit }: { onExit: () => void }) {
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <div className="font-display text-[36px]">Hôm nay đã xong hết.</div>
        <p className="mt-2 text-ink-2">Không còn thẻ đến hạn và chưa có mục mới. Thử làm một bài viết để AI chấm nhé.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={onExit}>
            Về trang chủ
          </Button>
          <Button onClick={() => go('/ai')}>Bài viết AI</Button>
        </div>
      </div>
    </div>
  )
}

function CountUp({ to, className }: { to: number; className?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 900)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <span className={className}>{n}</span>
}

function Summary({ stats, minutes }: { stats: Stats; minutes: number }) {
  const streak = useStore((s) => s.streak)
  const profile = useStore((s) => s.profile)
  const cards = useStore((s) => s.cards)
  const submissions = useStore((s) => s.submissions)
  const live = liveStreak(streak)
  const mins = Math.max(1, Math.round((Date.now() - stats.start) / 60000))
  const acc = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0
  const sureAcc = stats.sureN ? Math.round((stats.sureOk / stats.sureN) * 100) : null

  const suggestion = useMemo(() => {
    const done = new Set(submissions.map((s) => s.taskId))
    for (const u of orderedUnits(profile.topics)) {
      if (!u.items.some((i) => cards[i.id])) continue
      const t = u.aiTasks.find((x) => !done.has(x.id))
      if (t) return t
    }
    return null
  }, [submissions, cards, profile.topics])

  const calibMsg =
    sureAcc == null
      ? null
      : sureAcc >= 90
        ? `Khi bạn chắc chắn, bạn đúng ${sureAcc}%. Cảm giác "biết" của bạn rất đáng tin.`
        : sureAcc >= 70
          ? `Khi chắc chắn, bạn đúng ${sureAcc}%. Vài chỗ bạn tưởng biết nhưng chưa — đó chính là thứ app sẽ ôn thêm.`
          : `Khi chắc chắn, bạn chỉ đúng ${sureAcc}%. Hãy bấm "Đoán thử" khi chưa chắc — app sẽ ôn đúng chỗ hơn.`

  const tiles = [
    { icon: Clock, label: 'phút', value: mins },
    { icon: Target, label: '% chính xác', value: acc },
    { icon: Sparkles, label: 'mục mới', value: stats.learned },
    { icon: Flame, label: 'ngày liên tiếp', value: live.days },
  ]

  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-4 py-14 md:py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
        <div className="eyebrow">Xong buổi học</div>
        <h1 className="mt-2 font-display text-[44px] leading-[1.02] tracking-[-0.03em] md:text-[56px]">
          Thêm một ngày
          <br />
          <span className="italic text-accent">không bỏ cuộc.</span>
        </h1>
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
            <Card className="p-4">
              <t.icon size={16} strokeWidth={1.75} className="text-muted" />
              <CountUp to={t.value} className="mt-3 block font-display text-[34px] leading-none" />
              <div className="mt-1 text-[12px] text-muted">{t.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {calibMsg && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="mt-3 p-5">
            <div className="eyebrow mb-2">Độ tin cậy của bạn</div>
            <p className="text-[15px] text-ink-2">{calibMsg}</p>
            {stats.guessN > 0 && (
              <p className="mt-1 text-[13px] text-muted">
                Câu bấm "Đoán thử": đúng {stats.guessOk}/{stats.guessN}.
              </p>
            )}
          </Card>
        </motion.div>
      )}

      {suggestion && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Card className="mt-3 flex items-center gap-4 p-5">
            <PenLine size={20} strokeWidth={1.75} className="shrink-0 text-accent" />
            <div className="flex-1">
              <div className="text-[15px] font-medium">Còn sức? Viết một bài ngắn: {suggestion.title}</div>
              <div className="text-[13px] text-muted">Viết xong, sao chép sang AI chat để chấm và chữa.</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => go(`/ai/${suggestion.id}`)}>
              Làm bài
            </Button>
          </Card>
        </motion.div>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => go('/')}>
          Về trang chủ
        </Button>
        <Button onClick={() => (window.location.hash = `/session/${minutes || 15}-${Date.now() % 1000}`)} icon={<ArrowRight size={16} strokeWidth={1.75} />}>
          Học thêm một lượt
        </Button>
      </div>
    </div>
  )
}
