import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, CircleHelp, Lightbulb, Mic, Play, Snail, Square, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { checkTyped, diffWords, fillCloze, hintMask, parseCloze, type WordDiff } from '../lib/grading.ts'
import type { Ex } from '../lib/session.ts'
import { listenOnce, recognitionSupported, speak, stopSpeaking } from '../lib/speech.ts'
import type { Confidence } from '../lib/srs.ts'
import { useStore } from '../lib/store.ts'
import { Button, cx, Kbd, Rich, SpeakButton, Tag } from './ui.tsx'

export type Verdict = 'correct' | 'almost' | 'wrong' | 'info' | 'skip'

export interface Result {
  verdict: Verdict
  confidence: Confidence
  hints: number
  mine: string
  expected?: string
  explain?: string
  question: string
  allowOverride?: boolean
  detail?: ReactNode
}

interface Props<K extends Ex['k']> {
  ex: Extract<Ex, { k: K }>
  locked: boolean
  onSubmit: (r: Result) => void
}

// ---------- Thành phần dùng chung ----------

function AnswerBar({
  canSubmit,
  onSubmit,
  hint,
}: {
  canSubmit: boolean
  onSubmit: (c: Confidence) => void
  hint?: { level: number; max: number; onHint: () => void }
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      {hint && (
        <Button variant="ghost" size="sm" onClick={hint.onHint} disabled={hint.level >= hint.max} icon={<Lightbulb size={15} strokeWidth={1.75} />}>
          Gợi ý {hint.level > 0 && <span className="font-mono text-[11px] text-muted">{hint.level}/{hint.max}</span>}
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={() => onSubmit('dont_know')} icon={<CircleHelp size={15} strokeWidth={1.75} />}>
        Không biết
      </Button>
      <div className="ml-auto flex gap-2">
        <Button variant="outline" disabled={!canSubmit} onClick={() => onSubmit('guess')} title="Bạn chưa chắc? App sẽ ôn lại sớm hơn">
          Đoán thử <Kbd className="ml-1 hidden opacity-50 sm:inline">⇧↵</Kbd>
        </Button>
        <Button disabled={!canSubmit} onClick={() => onSubmit('sure')}>
          Kiểm tra <Kbd className="ml-1 hidden opacity-60 sm:inline">↵</Kbd>
        </Button>
      </div>
    </div>
  )
}

/** Enter = chắc chắn, Shift+Enter = đoán */
const submitKeys = (ok: boolean, submit: (c: Confidence) => void) => (e: KeyboardEvent) => {
  if (e.key !== 'Enter') return
  e.preventDefault()
  if (ok) submit(e.shiftKey ? 'guess' : 'sure')
}

export function DiffLine({ parts }: { parts: WordDiff[] }) {
  return (
    <p className="flex flex-wrap gap-x-1.5 gap-y-1 font-display text-[19px] leading-relaxed">
      {parts.map((p, i) => (
        <span
          key={i}
          className={cx(
            p.status === 'missing' && 'rounded bg-bad-soft px-1 text-bad underline decoration-dotted underline-offset-4',
            p.status === 'extra' && 'text-muted line-through decoration-bad/70',
          )}
          title={p.status === 'missing' ? 'Bạn thiếu / sai từ này' : p.status === 'extra' ? 'Từ thừa hoặc sai' : undefined}
        >
          {p.word}
        </span>
      ))}
    </p>
  )
}

function Prompt({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('font-display text-[24px] leading-[1.4] tracking-[-0.01em] md:text-[28px]', className)}>{children}</div>
}

function Vi({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-[15px] text-ink-2">{children}</p>
}

function SentenceInput({
  value,
  onChange,
  onKeyDown,
  locked,
  rows = 2,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onKeyDown: (e: KeyboardEvent) => void
  locked: boolean
  rows?: number
  placeholder?: string
}) {
  return (
    <textarea
      autoFocus
      rows={rows}
      value={value}
      readOnly={locked}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="mt-6 w-full resize-none rounded-xl border border-line-2 bg-paper px-4 py-3 font-display text-[19px] leading-relaxed outline-none transition-colors placeholder:text-muted/70 focus:border-ink/50"
    />
  )
}

// ---------- Học mới ----------

export function LearnVocab({ ex, onSubmit }: Props<'learnVocab'>) {
  const { item } = ex
  const { rate, voiceURI } = useStore((s) => s.settings)
  useEffect(() => {
    const t = setTimeout(() => speak(item.term, { rate, voiceURI }), 350)
    return () => clearTimeout(t)
  }, [item.term, rate, voiceURI])
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => e.key === 'Enter' && onSubmit({ verdict: 'info', confidence: 'sure', hints: 0, mine: '', question: '' })
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onSubmit])
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone="accent">{item.pos}</Tag>
        {item.ipa && <span className="font-mono text-[13px] text-muted">{item.ipa}</span>}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <h2 className="font-display text-[44px] leading-none tracking-[-0.03em] md:text-[56px]">{item.term}</h2>
        <SpeakButton text={item.term} size={22} />
        <SpeakButton text={item.term} slow size={16} className="opacity-60" />
      </div>
      <p className="mt-4 text-lg font-medium">{item.vi}</p>
      <p className="mt-1 text-[15px] italic text-ink-2">{item.def}</p>
      <div className="rule my-6" />
      <ul className="space-y-4">
        {item.examples.map((e, i) => {
          const p = parseCloze(e.en)
          return (
            <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="flex gap-3">
              <SpeakButton text={fillCloze(e.en)} size={16} className="mt-1.5 shrink-0" />
              <div>
                <p className="font-display text-[19px] leading-snug">
                  {p.before}
                  <span className="underline decoration-accent decoration-2 underline-offset-4">{p.answers[0]}</span>
                  {p.after}
                </p>
                <p className="mt-0.5 text-sm text-muted">{e.vi}</p>
              </div>
            </motion.li>
          )
        })}
      </ul>
      {item.note && (
        <div className="mt-6 rounded-xl border border-warn/25 bg-warn-soft px-4 py-3 text-[14px] text-ink-2">
          <span className="eyebrow mr-2 !text-warn">Lưu ý</span>
          <Rich text={item.note} />
        </div>
      )}
      <div className="mt-8 flex justify-end">
        <Button onClick={() => onSubmit({ verdict: 'info', confidence: 'sure', hints: 0, mine: '', question: '' })} kbd="↵">
          Đã nắm — kiểm tra tôi <ArrowRight size={16} strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  )
}

export function LearnPattern({ ex, onSubmit }: Props<'learnPattern'>) {
  const { item } = ex
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => e.key === 'Enter' && onSubmit({ verdict: 'info', confidence: 'sure', hints: 0, mine: '', question: '' })
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onSubmit])
  return (
    <div>
      <Tag tone="accent">Ngữ pháp</Tag>
      <h2 className="mt-4 font-display text-[32px] leading-tight tracking-[-0.02em] md:text-[38px]">{item.title}</h2>
      {item.form && <div className="mt-5 inline-block rounded-lg border border-line-2 bg-sunk px-3 py-2 font-mono text-[14px]">{item.form}</div>}
      <p className="mt-5 text-[16px] leading-relaxed text-ink-2">
        <Rich text={item.summary} />
      </p>
      <div className="rule my-6" />
      <ul className="space-y-4">
        {item.examples.map((e, i) => (
          <li key={i} className="flex gap-3">
            <SpeakButton text={fillCloze(e.en)} size={16} className="mt-1.5 shrink-0" />
            <div>
              <p className="font-display text-[19px] leading-snug">{fillCloze(e.en)}</p>
              <p className="mt-0.5 text-sm text-muted">{e.vi}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-end">
        <Button onClick={() => onSubmit({ verdict: 'info', confidence: 'sure', hints: 0, mine: '', question: '' })} kbd="↵">
          Đã hiểu — luyện ngay <ArrowRight size={16} strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  )
}

// ---------- Điền chỗ trống ----------

export function Cloze({ ex, locked, onSubmit }: Props<'cloze'>) {
  const parts = useMemo(() => parseCloze(ex.text), [ex.text])
  const [val, setVal] = useState('')
  const [hints, setHints] = useState(0)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const isVocab = ex.item.kind === 'vocab'
  const maxHint = isVocab ? 3 : 2
  const answer = parts.answers[0]

  const submit = (c: Confidence) => {
    const r = c === 'dont_know' ? { verdict: 'wrong' as const, expected: answer } : checkTyped(val, parts.answers, ex.fuzzy)
    const v: Verdict = c === 'dont_know' ? 'skip' : r.verdict
    setVerdict(v)
    onSubmit({
      verdict: v,
      confidence: c,
      hints,
      mine: val,
      expected: r.expected,
      explain: ex.explain ?? (ex.item.kind === 'vocab' ? `${ex.item.term} = ${ex.item.vi}` : undefined),
      question: `${parts.before}____${parts.after}${ex.hint ? ` ${ex.hint}` : ''}${ex.vi ? ` (${ex.vi})` : ''}`,
    })
  }

  const width = Math.max(answer.length, val.length, 4) + 2
  const hintText = hints === 3 && ex.item.kind === 'vocab' ? `từ gốc: ${ex.item.term}` : hintMask(answer, hints)

  return (
    <div>
      <Prompt>
        {parts.before}
        <span className="relative inline-block align-baseline">
          <input
            autoFocus
            value={val}
            readOnly={locked}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={submitKeys(!!val.trim() && !locked, submit)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            style={{ width: `${width}ch` }}
            className={cx(
              'mx-1 border-b-2 bg-transparent px-1 text-center font-display outline-none transition-colors',
              !locked && 'border-ink/30 focus:border-accent',
              locked && (verdict === 'correct' ? 'border-good text-good' : verdict === 'almost' ? 'border-warn text-warn' : 'border-bad text-bad line-through decoration-1'),
            )}
          />
          <AnimatePresence>
            {locked && verdict !== 'correct' && (
              <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-display text-[17px] text-good">
                {answer}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        {parts.after}
        {ex.hint && <span className="ml-2 font-sans text-[15px] text-muted">{ex.hint}</span>}
      </Prompt>
      {ex.vi && <Vi>{ex.vi}</Vi>}
      {hints > 0 && !locked && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 inline-block rounded-lg bg-sunk px-3 py-1.5 font-mono text-[14px] tracking-wider text-ink-2">
          {hintText}
        </motion.div>
      )}
      {locked && (
        <div className="mt-6">
          <SpeakButton text={fillCloze(ex.text)} label="Nghe cả câu" />
        </div>
      )}
      {!locked && <AnswerBar canSubmit={!!val.trim()} onSubmit={submit} hint={{ level: hints, max: maxHint, onHint: () => setHints((h) => h + 1) }} />}
    </div>
  )
}

// ---------- Nhớ lại từ từ nghĩa ----------

export function Recall({ ex, locked, onSubmit }: Props<'recall'>) {
  const { item } = ex
  const [val, setVal] = useState('')
  const [hints, setHints] = useState(0)
  const answers = [item.term, ...(item.term.startsWith('to ') ? [item.term.slice(3)] : [])]
  const submit = (c: Confidence) => {
    const r = c === 'dont_know' ? { verdict: 'wrong' as const, expected: item.term } : checkTyped(val, answers, true)
    onSubmit({
      verdict: c === 'dont_know' ? 'skip' : r.verdict,
      confidence: c,
      hints,
      mine: val,
      expected: item.term,
      explain: item.note,
      question: `Từ/cụm tiếng Anh nghĩa là "${item.vi}" (${item.def})`,
    })
  }
  return (
    <div>
      <div className="eyebrow">Gõ từ tiếng Anh có nghĩa</div>
      <Prompt className="mt-3">{item.vi}</Prompt>
      <p className="mt-2 text-[15px] italic text-ink-2">
        “{item.def}” <span className="not-italic text-muted">· {item.pos}</span>
      </p>
      <input
        autoFocus
        value={val}
        readOnly={locked}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={submitKeys(!!val.trim() && !locked, submit)}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        placeholder="Gõ câu trả lời…"
        className="mt-6 h-14 w-full rounded-xl border border-line-2 bg-paper px-4 font-display text-[24px] outline-none placeholder:text-[17px] placeholder:text-muted/70 focus:border-ink/50"
      />
      {hints > 0 && !locked && <div className="mt-3 inline-block rounded-lg bg-sunk px-3 py-1.5 font-mono text-[14px] tracking-wider text-ink-2">{hintMask(item.term, hints)}</div>}
      {locked && (
        <div className="mt-4 flex items-center gap-3">
          <span className="font-display text-[22px]">{item.term}</span>
          {item.ipa && <span className="font-mono text-[13px] text-muted">{item.ipa}</span>}
          <SpeakButton text={item.term} />
        </div>
      )}
      {!locked && <AnswerBar canSubmit={!!val.trim()} onSubmit={submit} hint={{ level: hints, max: 3, onHint: () => setHints((h) => h + 1) }} />}
    </div>
  )
}

// ---------- Nghe chép ----------

export function Dictation({ ex, locked, onSubmit }: Props<'dictation'>) {
  const [val, setVal] = useState('')
  const [plays, setPlays] = useState(0)
  const [diff, setDiff] = useState<WordDiff[] | null>(null)
  const { rate, voiceURI } = useStore((s) => s.settings)
  const play = (slow = false) => {
    speak(ex.sentence, { rate: slow ? Math.max(0.5, rate - 0.35) : rate, voiceURI })
    setPlays((p) => p + 1)
  }
  useEffect(() => {
    const t = setTimeout(() => speak(ex.sentence, { rate, voiceURI }), 400)
    return () => {
      clearTimeout(t)
      stopSpeaking()
    }
  }, [ex.sentence, rate, voiceURI])

  const submit = (c: Confidence) => {
    const d = diffWords(ex.sentence, c === 'dont_know' ? '' : val)
    setDiff(d.parts)
    const verdict: Verdict = c === 'dont_know' ? 'skip' : d.score >= 0.999 ? 'correct' : d.score >= 0.85 ? 'almost' : 'wrong'
    onSubmit({
      verdict,
      confidence: c,
      hints: plays > 4 ? 1 : 0,
      mine: val,
      expected: ex.sentence,
      explain: ex.vi,
      question: 'Nghe và chép lại câu',
      detail: <span className="font-mono text-[12px]">Khớp {Math.round(d.score * 100)}% số từ</span>,
    })
  }

  return (
    <div>
      <div className="eyebrow">Nghe rồi gõ lại chính xác cả câu</div>
      <div className="mt-6 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => play()}
          className="grid h-16 w-16 place-items-center rounded-full bg-ink text-paper shadow-[0_3px_0_0_rgba(0,0,0,.25)]"
          aria-label="Phát lại"
        >
          <Play size={24} strokeWidth={1.75} className="ml-0.5" />
        </motion.button>
        <Button variant="outline" size="sm" onClick={() => play(true)} icon={<Snail size={15} strokeWidth={1.75} />}>
          Chậm
        </Button>
        <span className="font-mono text-[12px] text-muted">đã nghe {plays + 1} lần</span>
      </div>
      {!locked ? (
        <SentenceInput value={val} onChange={setVal} onKeyDown={submitKeys(!!val.trim(), submit)} locked={locked} placeholder="Gõ những gì bạn nghe được…" />
      ) : (
        <div className="mt-6 space-y-3">
          {diff && <DiffLine parts={diff} />}
          <p className="text-[15px] text-ink-2">{ex.vi}</p>
        </div>
      )}
      {!locked && <AnswerBar canSubmit={!!val.trim()} onSubmit={submit} />}
    </div>
  )
}

// ---------- Sửa câu sai / Sổ lỗi ----------

function Rewrite({
  label,
  shown,
  vi,
  answers,
  explain,
  locked,
  onSubmit,
  prefill,
  instruction,
}: {
  label: string
  shown: string
  vi?: string
  answers: string[]
  explain: string
  locked: boolean
  onSubmit: (r: Result) => void
  prefill: boolean
  instruction?: string
}) {
  const [val, setVal] = useState(prefill ? shown : '')
  const [diff, setDiff] = useState<WordDiff[] | null>(null)
  const submit = (c: Confidence) => {
    const unchanged = prefill && val.trim() === shown.trim()
    const r = c === 'dont_know' || unchanged ? { verdict: 'wrong' as const, expected: answers[0] } : checkTyped(val, answers, false)
    setDiff(diffWords(r.expected, val).parts)
    onSubmit({
      verdict: c === 'dont_know' ? 'skip' : r.verdict,
      confidence: c,
      hints: 0,
      mine: val,
      expected: r.expected,
      explain,
      question: `${instruction ?? label}: "${shown}"`,
      allowOverride: c !== 'dont_know' && !unchanged,
    })
  }
  return (
    <div>
      <div className="eyebrow">{label}</div>
      {instruction && <p className="mt-2 text-[15px] text-ink-2">{instruction}</p>}
      <Prompt className="mt-3">
        <span className={cx(prefill && 'decoration-bad/50 decoration-wavy underline-offset-[6px]', prefill && locked && 'underline')}>{shown}</span>
      </Prompt>
      {vi && <Vi>{vi}</Vi>}
      {!locked ? (
        <SentenceInput value={val} onChange={setVal} onKeyDown={submitKeys(!!val.trim(), submit)} locked={false} placeholder="Gõ câu đúng…" />
      ) : (
        <div className="mt-6 rounded-xl border border-line bg-paper px-4 py-3">
          <div className="eyebrow mb-1.5">So với đáp án</div>
          {diff && <DiffLine parts={diff} />}
        </div>
      )}
      {!locked && <AnswerBar canSubmit={!!val.trim()} onSubmit={submit} />}
    </div>
  )
}

export function Fix({ ex, locked, onSubmit }: Props<'fix'>) {
  return <Rewrite label="Câu này có lỗi — sửa lại cho đúng" shown={ex.wrong} vi={ex.vi} answers={ex.answers} explain={ex.explain} locked={locked} onSubmit={onSubmit} prefill />
}

export function Transform({ ex, locked, onSubmit }: Props<'transform'>) {
  return <Rewrite label="Viết lại câu" instruction={ex.drill.instruction} shown={ex.drill.source} answers={ex.drill.answers} explain={ex.drill.explain} locked={locked} onSubmit={onSubmit} prefill={false} />
}

export function MistakeEx({ ex, locked, onSubmit }: Props<'mistake'>) {
  const m = ex.mistake
  return <Rewrite label={`Sổ lỗi · từ bài "${m.source}"`} instruction="Bạn từng viết như dưới đây. Viết lại cho đúng." shown={m.wrong} answers={[m.right]} explain={m.why || `Đúng: ${m.right}`} locked={locked} onSubmit={onSubmit} prefill />
}

// ---------- Trắc nghiệm hai tầng ----------

function shuffleIdx(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function TwoTier({ ex, locked, onSubmit }: Props<'twoTier'>) {
  const d = ex.drill
  const optOrder = useMemo(() => shuffleIdx(d.options.length), [d])
  const reasonOrder = useMemo(() => shuffleIdx(d.reasons.length), [d])
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [reason, setReason] = useState<number | null>(null)
  const [step, setStep] = useState<'choose' | 'reason'>('choose')

  const toggle = (i: number) =>
    setPicked((p) => {
      const n = new Set(p)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })

  const submit = (c: Confidence) => {
    const setOk = picked.size === d.correct.length && d.correct.every((i) => picked.has(i))
    const reasonOk = reason === d.reasonCorrect
    const verdict: Verdict = c === 'dont_know' ? 'skip' : setOk && reasonOk ? 'correct' : 'wrong'
    onSubmit({
      verdict,
      confidence: c,
      hints: 0,
      mine: `${[...picked].map((i) => d.options[i]).join(' + ') || '(không chọn)'} — lý do: ${reason != null ? d.reasons[reason] : '(không chọn)'}`,
      expected: `${d.correct.map((i) => d.options[i]).join(' + ')}`,
      explain: d.explain,
      question: `${d.question} | Lựa chọn: ${d.options.join(' / ')}`,
      detail: c !== 'dont_know' && setOk && !reasonOk ? <span>Đáp án đúng nhưng <b>lý do sai</b> — có thể bạn đang đúng nhờ cảm giác.</span> : undefined,
    })
  }

  // Phím số 1–4 để chọn
  useEffect(() => {
    if (locked) return
    const h = (e: globalThis.KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= 6) {
        if (step === 'choose' && n <= optOrder.length) toggle(optOrder[n - 1])
        if (step === 'reason' && n <= reasonOrder.length) setReason(reasonOrder[n - 1])
      }
      if (e.key === 'Enter') {
        if (step === 'choose' && picked.size) setStep('reason')
        else if (step === 'reason' && reason != null) submit(e.shiftKey ? 'guess' : 'sure')
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  const optClass = (i: number) => {
    const sel = picked.has(i)
    if (!locked) return sel ? 'border-ink bg-ink text-paper' : 'border-line-2 bg-paper hover:border-ink/40'
    const ok = d.correct.includes(i)
    if (ok) return 'border-good bg-good-soft text-ink'
    if (sel) return 'border-bad bg-bad-soft text-ink'
    return 'border-line bg-paper opacity-60'
  }

  return (
    <div>
      <div className="eyebrow">Chọn TẤT CẢ đáp án đúng — có thể nhiều hơn một</div>
      <Prompt className="mt-3">{d.question}</Prompt>
      {d.vi && <Vi>{d.vi}</Vi>}
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {optOrder.map((i, n) => (
          <button
            key={i}
            disabled={locked || step === 'reason'}
            onClick={() => toggle(i)}
            className={cx('flex items-center gap-3 rounded-xl border px-4 py-3 text-left font-display text-[17px] transition-all', optClass(i), step === 'reason' && !locked && !picked.has(i) && 'opacity-50')}
          >
            <span className={cx('grid h-5 w-5 shrink-0 place-items-center rounded border font-mono text-[10px]', picked.has(i) ? 'border-current' : 'border-line-2 text-muted')}>
              {picked.has(i) ? <Check size={12} strokeWidth={3} /> : n + 1}
            </span>
            {d.options[i]}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {(step === 'reason' || locked) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <div className="eyebrow mb-3 mt-8">Vì sao? Chọn lý do đúng</div>
            <div className="grid gap-2">
              {reasonOrder.map((i, n) => {
                const sel = reason === i
                const cls = !locked
                  ? sel
                    ? 'border-ink bg-sunk'
                    : 'border-line-2 bg-paper hover:border-ink/40'
                  : i === d.reasonCorrect
                    ? 'border-good bg-good-soft'
                    : sel
                      ? 'border-bad bg-bad-soft'
                      : 'border-line bg-paper opacity-60'
                return (
                  <button key={i} disabled={locked} onClick={() => setReason(i)} className={cx('flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-all', cls)}>
                    <span className={cx('mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border', sel ? 'border-ink' : 'border-line-2')}>
                      {sel && <span className="h-2 w-2 rounded-full bg-ink" />}
                    </span>
                    <span>
                      <span className="mr-2 font-mono text-[11px] text-muted">{n + 1}</span>
                      {d.reasons[i]}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!locked && step === 'choose' && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => submit('dont_know')} icon={<CircleHelp size={15} strokeWidth={1.75} />}>
            Không biết
          </Button>
          <Button className="ml-auto" disabled={!picked.size} onClick={() => setStep('reason')} kbd="↵">
            Tiếp: vì sao? <ArrowRight size={16} strokeWidth={1.75} />
          </Button>
        </div>
      )}
      {!locked && step === 'reason' && <AnswerBar canSubmit={reason != null} onSubmit={submit} />}
    </div>
  )
}

// ---------- Nói theo ----------

export function Speak({ ex, locked, onSubmit }: Props<'speak'>) {
  const supported = recognitionSupported()
  const [state, setState] = useState<'idle' | 'listening' | 'done' | 'error'>('idle')
  const [heard, setHeard] = useState('')
  const [diff, setDiff] = useState<WordDiff[] | null>(null)
  const stopRef = useRef<() => void>(() => {})

  const start = () => {
    stopSpeaking()
    setState('listening')
    const l = listenOnce()
    stopRef.current = l.stop
    l.result
      .then((alts) => {
        if (!alts.length) {
          setState('error')
          return
        }
        const best = alts.map((a) => ({ a, d: diffWords(ex.sentence, a) })).sort((x, y) => y.d.score - x.d.score)[0]
        setHeard(best.a)
        setDiff(best.d.parts)
        setState('done')
        const verdict: Verdict = best.d.score >= 0.9 ? 'correct' : best.d.score >= 0.7 ? 'almost' : 'wrong'
        onSubmit({
          verdict,
          confidence: 'sure',
          hints: 0,
          mine: best.a,
          expected: ex.sentence,
          explain: 'Bài nói chỉ để luyện, không ảnh hưởng lịch ôn. Nhận dạng giọng nói của trình duyệt có thể sai — hãy tự nghe lại và so sánh.',
          question: 'Đọc to câu',
          detail: <span className="font-mono text-[12px]">Máy nghe được {Math.round(best.d.score * 100)}% số từ</span>,
        })
      })
      .catch(() => setState('error'))
  }

  return (
    <div>
      <div className="eyebrow">Nghe mẫu, rồi đọc to cả câu</div>
      <Prompt className="mt-3">{ex.sentence}</Prompt>
      <Vi>{ex.vi}</Vi>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SpeakButton text={ex.sentence} label="Nghe mẫu" />
        <SpeakButton text={ex.sentence} slow label="Chậm" className="opacity-70" />
      </div>
      {!supported ? (
        <div className="mt-6 rounded-xl border border-line bg-sunk p-4 text-sm text-ink-2">
          Trình duyệt này không hỗ trợ nhận giọng nói (nên dùng Chrome hoặc Edge). Bạn vẫn có thể đọc to theo mẫu rồi bấm tiếp.
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={() => onSubmit({ verdict: 'info', confidence: 'sure', hints: 0, mine: '', question: '' })}>
              Tôi đã đọc xong
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3">
          {!locked && (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => (state === 'listening' ? stopRef.current() : start())}
              className={cx('relative grid h-20 w-20 place-items-center rounded-full text-accent-ink', state === 'listening' ? 'bg-bad' : 'bg-accent')}
              aria-label="Ghi âm"
            >
              {state === 'listening' && <motion.span className="absolute inset-0 rounded-full bg-bad" animate={{ scale: [1, 1.35], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} />}
              {state === 'listening' ? <Square size={22} strokeWidth={2} className="relative" /> : <Mic size={28} strokeWidth={1.75} />}
            </motion.button>
          )}
          <div className="text-sm text-muted">
            {state === 'idle' && 'Bấm micro và đọc'}
            {state === 'listening' && 'Đang nghe… bấm để dừng'}
            {state === 'error' && 'Không nghe rõ. Thử lại nhé.'}
          </div>
          {state === 'error' && !locked && (
            <Button variant="ghost" size="sm" onClick={() => onSubmit({ verdict: 'info', confidence: 'sure', hints: 0, mine: '', question: '' })}>
              Bỏ qua câu này
            </Button>
          )}
          {state === 'done' && diff && (
            <div className="w-full rounded-xl border border-line bg-paper px-4 py-3">
              <div className="eyebrow mb-1.5">Máy nghe được: “{heard}”</div>
              <DiffLine parts={diff} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const VerdictIcon = ({ v }: { v: Verdict }) =>
  v === 'correct' ? <Check size={18} strokeWidth={2.25} /> : v === 'almost' ? <Check size={18} strokeWidth={2.25} /> : <X size={18} strokeWidth={2.25} />
