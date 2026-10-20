import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Check, Copy, ExternalLink, NotebookPen, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, Card, cx, Empty, toast } from '../components/ui.tsx'
import { TASKS } from '../content/index.ts'
import type { AiTask } from '../content/types.ts'
import { buildTaskPrompt, copyText, parseFeedback } from '../lib/ai.ts'
import { wordCount } from '../lib/grading.ts'
import { go } from '../lib/router.ts'
import { useStore, type Submission } from '../lib/store.ts'

const draftKey = (id: string) => `amatopro:draft:${id}`
const readDraft = (id: string) => {
  try {
    return localStorage.getItem(draftKey(id)) ?? ''
  } catch {
    return ''
  }
}
const writeDraft = (id: string, v: string) => {
  try {
    if (v) localStorage.setItem(draftKey(id), v)
    else localStorage.removeItem(draftKey(id))
  } catch {
    /* bỏ qua */
  }
}

export function AiTaskPage({ id }: { id: string }) {
  const submissions = useStore((s) => s.submissions)
  if (id.startsWith('s-')) {
    const sub = submissions.find((s) => s.id === id.slice(2))
    if (!sub) return <Empty icon={<ArrowLeft />} title="Không tìm thấy bài nộp" />
    const task = sub.taskId ? TASKS.get(sub.taskId)?.task : undefined
    return <SubmissionView sub={sub} task={task} />
  }
  const ref = TASKS.get(id)
  if (!ref) return <Empty icon={<ArrowLeft />} title="Không tìm thấy đề bài" />
  return <WriteView task={ref.task} unitTitle={ref.unit.title} />
}

function Back() {
  return (
    <button onClick={() => go('/ai')} className="mb-6 flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
      <ArrowLeft size={14} /> Chấm bài
    </button>
  )
}

function TaskBrief({ task }: { task: AiTask }) {
  return (
    <Card className="p-6 md:p-8">
      <div className="eyebrow">Tình huống</div>
      <p className="mt-2 text-[15px] text-ink-2">{task.brief}</p>
      <div className="eyebrow mt-6">Đề bài</div>
      <p className="mt-2 font-display text-[21px] leading-snug">{task.task}</p>
      {task.source && (
        <div className="mt-4 rounded-xl border border-line bg-paper px-4 py-3 text-[15px] leading-relaxed">
          <div className="eyebrow mb-1">Đoạn cần dịch</div>
          {task.source}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-2">
        {task.minWords && <span>Tối thiểu {task.minWords} từ</span>}
        {task.criteria.map((c) => (
          <span key={c} className="flex items-center gap-1.5">
            <Check size={13} className="text-muted" /> {c}
          </span>
        ))}
      </div>
    </Card>
  )
}

function WriteView({ task, unitTitle }: { task: AiTask; unitTitle: string }) {
  const addSubmission = useStore((s) => s.addSubmission)
  const [text, setText] = useState(() => readDraft(task.id))
  const words = wordCount(text)
  const min = task.minWords ?? 0
  useEffect(() => writeDraft(task.id, text), [task.id, text])

  const submit = async () => {
    const prompt = buildTaskPrompt(task, text)
    const id = addSubmission({ taskId: task.id, title: task.title, prompt, answer: text })
    writeDraft(task.id, '')
    const ok = await copyText(prompt)
    toast(ok ? 'Đã sao chép — dán vào AI chat bất kỳ' : 'Không sao chép được, hãy copy thủ công')
    go(`/ai/s-${id}`)
  }

  return (
    <div>
      <Back />
      <div className="eyebrow">{unitTitle}</div>
      <h1 className="mb-6 mt-2 font-display text-[32px] leading-tight tracking-[-0.02em] md:text-[40px]">{task.title}</h1>
      <TaskBrief task={task} />
      <div className="mt-6">
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          spellCheck={false}
          placeholder="Viết bài của bạn ở đây. Đừng dùng công cụ dịch — sai cũng được, AI sẽ chữa."
          className="w-full resize-y rounded-2xl border border-line-2 bg-card px-5 py-4 font-display text-[18px] leading-relaxed outline-none placeholder:text-muted/70 focus:border-ink/50"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-sunk">
              <motion.div className={cx('h-full', words >= min ? 'bg-good' : 'bg-accent')} animate={{ width: `${Math.min(1, min ? words / min : 1) * 100}%` }} />
            </div>
            <span className="font-mono text-[12px] text-muted">
              {words}
              {min ? `/${min}` : ''} từ
            </span>
          </div>
          <span className="text-[12px] text-muted">Bản nháp được tự lưu.</span>
          <Button className="ml-auto" disabled={words < Math.max(5, Math.round(min * 0.6))} onClick={submit} icon={<Copy size={15} strokeWidth={1.75} />}>
            Nộp & sao chép cho AI
          </Button>
        </div>
      </div>
    </div>
  )
}

function SubmissionView({ sub, task }: { sub: Submission; task?: AiTask }) {
  const gradeSubmission = useStore((s) => s.gradeSubmission)
  const deleteSubmission = useStore((s) => s.deleteSubmission)
  const [reply, setReply] = useState('')
  const [manual, setManual] = useState('')
  const [added, setAdded] = useState<number | null>(null)
  const parsed = useMemo(() => parseFeedback(reply), [reply])

  const copy = async () => {
    const ok = await copyText(sub.prompt)
    toast(ok ? 'Đã sao chép' : 'Không sao chép được')
  }

  const save = () => {
    const score = parsed.score ?? (manual ? Math.max(0, Math.min(10, parseFloat(manual.replace(',', '.')))) : null)
    const n = gradeSubmission(sub.id, reply, Number.isNaN(score as number) ? null : score, parsed.mistakes)
    setAdded(n)
    toast(n ? `Đã lưu · ${n} lỗi vào sổ ôn tập` : 'Đã lưu kết quả')
  }

  return (
    <div>
      <Back />
      <div className="flex items-start justify-between gap-4">
        <h1 className="mb-6 font-display text-[32px] leading-tight tracking-[-0.02em] md:text-[40px]">{sub.title}</h1>
        <button
          onClick={() => {
            if (confirm('Xoá bài nộp này?')) {
              deleteSubmission(sub.id)
              go('/ai')
            }
          }}
          className="mt-3 text-muted hover:text-bad"
          title="Xoá"
        >
          <Trash2 size={17} strokeWidth={1.75} />
        </button>
      </div>

      {task && sub.status === 'pending' && (
        <div className="mb-4">
          <TaskBrief task={task} />
        </div>
      )}

      <Card className="p-6">
        <div className="eyebrow mb-2">Bài của bạn</div>
        <p className="whitespace-pre-wrap font-display text-[18px] leading-relaxed">{sub.answer}</p>
      </Card>

      {sub.status === 'pending' ? (
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.4fr]">
          <Card className="p-5">
            <div className="font-display text-[22px] italic text-accent">1</div>
            <div className="mt-1 font-medium">Dán vào AI chat</div>
            <p className="mt-1 text-[13px] text-muted">Prompt đã có đề, tiêu chí, bài làm và định dạng trả lời để app đọc được.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={copy} icon={<Copy size={14} strokeWidth={1.75} />}>
                Sao chép lại
              </Button>
              {[
                ['ChatGPT', 'https://chatgpt.com/'],
                ['Claude', 'https://claude.ai/new'],
                ['Gemini', 'https://gemini.google.com/app'],
              ].map(([n, u]) => (
                <a key={n} href={u} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1 rounded-[10px] border border-line-2 px-3 text-[13px] text-ink-2 hover:border-ink/40 hover:text-ink">
                  {n} <ExternalLink size={12} />
                </a>
              ))}
            </div>
            <details className="mt-4 text-[12px] text-muted">
              <summary className="cursor-pointer">Xem prompt</summary>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-sunk p-3 font-mono text-[11px] text-ink-2">{sub.prompt}</pre>
            </details>
          </Card>
          <Card className="p-5">
            <div className="font-display text-[22px] italic text-accent">2</div>
            <div className="mt-1 font-medium">Dán phản hồi của AI vào đây</div>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={9}
              placeholder="Dán toàn bộ câu trả lời của AI…"
              className="mt-3 w-full resize-y rounded-xl border border-line-2 bg-paper px-3 py-2.5 text-[13px] leading-relaxed outline-none focus:border-ink/50"
            />
            <AnimatePresence>
              {reply.trim() && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
                    {parsed.score != null ? (
                      <span>
                        Điểm đọc được: <b className="font-display text-[18px]">{parsed.score}/10</b>
                      </span>
                    ) : (
                      <label className="flex items-center gap-2 text-warn">
                        Không thấy dòng "ĐIỂM: x/10" — nhập tay:
                        <input value={manual} onChange={(e) => setManual(e.target.value)} className="h-8 w-16 rounded-lg border border-line-2 bg-paper px-2 text-ink outline-none" placeholder="7" />
                      </label>
                    )}
                    <span className="text-muted">· {parsed.mistakes.length} lỗi sẽ vào sổ ôn tập</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-4 flex justify-end">
              <Button disabled={!reply.trim()} onClick={save}>
                Lưu kết quả
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <GradedView sub={sub} added={added} />
      )}
    </div>
  )
}

function GradedView({ sub, added }: { sub: Submission; added: number | null }) {
  const mistakes = useMemo(() => parseFeedback(sub.feedback ?? '').mistakes, [sub.feedback])
  const s = sub.score
  return (
    <div className="mt-6 space-y-4">
      <Card className="flex items-center gap-6 p-6">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className={cx('font-display text-[64px] leading-none', s == null ? 'text-muted' : s >= 8 ? 'text-good' : s >= 6 ? 'text-warn' : 'text-bad')}>
          {s ?? '–'}
          <span className="text-[20px] text-muted">/10</span>
        </motion.div>
        <div className="text-[14px] text-ink-2">
          {s == null ? 'Không có điểm.' : s >= 8 ? 'Rất tốt. Hãy thử đề khó hơn hoặc viết dài hơn.' : s >= 6 ? 'Khá. Ôn lại các lỗi bên dưới rồi viết lại bài này sau vài ngày.' : 'Chưa ổn — bình thường thôi. Các lỗi đã vào sổ, bạn sẽ gặp lại chúng trong buổi học.'}
          {added != null && added > 0 && (
            <div className="mt-1 flex items-center gap-1.5 text-accent">
              <NotebookPen size={14} /> Đã thêm {added} lỗi vào sổ ôn tập
            </div>
          )}
        </div>
      </Card>
      {mistakes.length > 0 && (
        <Card className="divide-y divide-line">
          {mistakes.map((m, i) => (
            <div key={i} className="px-5 py-3">
              <div className="font-display text-[16px] text-bad line-through decoration-1">{m.wrong}</div>
              <div className="font-display text-[16px] text-good">{m.right}</div>
              {m.why && <div className="text-[13px] text-ink-2">{m.why}</div>}
            </div>
          ))}
        </Card>
      )}
      <details className="rounded-2xl border border-line bg-card p-5">
        <summary className="cursor-pointer text-[14px] font-medium">Toàn bộ phản hồi của AI</summary>
        <div className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-ink-2">{sub.feedback}</div>
      </details>
    </div>
  )
}
