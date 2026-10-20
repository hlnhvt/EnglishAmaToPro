import { motion } from 'motion/react'
import { ArrowUpRight, ClipboardList, Hourglass, PenLine } from 'lucide-react'
import { useState } from 'react'
import { Button, Card, cx, Empty, PageHeader, Segmented, stagger, Tag } from '../components/ui.tsx'
import { orderedUnits } from '../content/index.ts'
import { buildFreePrompt, copyText } from '../lib/ai.ts'
import { wordCount } from '../lib/grading.ts'
import { go } from '../lib/router.ts'
import { useStore } from '../lib/store.ts'
import { toast } from '../components/ui.tsx'

type Tab = 'tasks' | 'pending' | 'graded' | 'free'

const KIND: Record<string, string> = { writing: 'Viết', translation: 'Dịch', roleplay: 'Nhập vai' }

export function AiPage() {
  const submissions = useStore((s) => s.submissions)
  const cards = useStore((s) => s.cards)
  const topics = useStore((s) => s.profile.topics)
  const pending = submissions.filter((s) => s.status === 'pending')
  const graded = submissions.filter((s) => s.status === 'graded')
  const [tab, setTab] = useState<Tab>(pending.length ? 'pending' : 'tasks')

  return (
    <div>
      <PageHeader eyebrow="Chấm bằng AI chat bất kỳ" title="Viết & được chữa" />

      <motion.div {...stagger(1)} className="mb-8 grid gap-3 md:grid-cols-3">
        {[
          ['1', 'Viết bài trong app', 'Theo đề có sẵn hoặc đoạn văn thật của bạn (email, tài liệu).'],
          ['2', 'Sao chép, dán sang AI', 'App gói sẵn đề, tiêu chí và bài làm. Dán vào ChatGPT, Claude, Gemini…'],
          ['3', 'Dán phản hồi về app', 'App đọc điểm và các dòng LỖI, đưa lỗi vào sổ để ôn lại theo lịch.'],
        ].map(([n, t, d]) => (
          <div key={n} className="flex gap-3">
            <span className="font-display text-[30px] italic leading-none text-accent">{n}</span>
            <div>
              <div className="text-[14px] font-medium">{t}</div>
              <div className="text-[13px] text-muted">{d}</div>
            </div>
          </div>
        ))}
      </motion.div>

      <Segmented
        className="mb-6"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'tasks', label: 'Đề bài' },
          { value: 'pending', label: `Chờ chấm${pending.length ? ` · ${pending.length}` : ''}` },
          { value: 'graded', label: `Đã chấm${graded.length ? ` · ${graded.length}` : ''}` },
          { value: 'free', label: 'Tự tạo' },
        ]}
      />

      {tab === 'tasks' && (
        <div className="space-y-8">
          {orderedUnits(topics).map((u) => {
            const started = u.items.some((i) => cards[i.id])
            return (
              <section key={u.id} className={cx(!started && 'opacity-70')}>
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="font-display text-[15px] italic text-muted">{String(u.order).padStart(2, '0')}</span>
                  <span className="text-[14px] font-medium">{u.title}</span>
                  {!started && <span className="text-[12px] text-muted">· chưa học unit này</span>}
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {u.aiTasks.map((t) => {
                    const subs = submissions.filter((s) => s.taskId === t.id)
                    const best = subs.reduce<number | null>((b, s) => (s.score != null && (b == null || s.score > b) ? s.score : b), null)
                    return (
                      <Card key={t.id} className="group flex cursor-pointer items-start gap-3 p-4 transition-colors hover:border-line-2" onClick={() => go(`/ai/${t.id}`)}>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Tag>{KIND[t.kind]}</Tag>
                            {best != null && <Tag tone={best >= 8 ? 'good' : best >= 6 ? 'warn' : 'bad'}>{best}/10</Tag>}
                          </div>
                          <div className="mt-2 font-medium">{t.title}</div>
                          <div className="mt-0.5 line-clamp-2 text-[13px] text-muted">{t.brief}</div>
                        </div>
                        <ArrowUpRight size={16} className="shrink-0 text-muted group-hover:text-ink" />
                      </Card>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {tab === 'pending' &&
        (pending.length === 0 ? (
          <Empty icon={<Hourglass size={28} strokeWidth={1.5} />} title="Không có bài nào đang chờ">
            Bài bạn đã sao chép sang AI nhưng chưa dán kết quả về sẽ nằm ở đây.
          </Empty>
        ) : (
          <div className="space-y-2">
            {pending.map((s) => (
              <Card key={s.id} className="flex cursor-pointer items-center gap-4 p-4 hover:border-line-2" onClick={() => go(`/ai/s-${s.id}`)}>
                <Hourglass size={18} strokeWidth={1.75} className="text-warn" />
                <div className="flex-1">
                  <div className="font-medium">{s.title}</div>
                  <div className="text-[12px] text-muted">
                    {new Date(s.createdAt).toLocaleString('vi-VN')} · {wordCount(s.answer)} từ
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Dán kết quả
                </Button>
              </Card>
            ))}
          </div>
        ))}

      {tab === 'graded' &&
        (graded.length === 0 ? (
          <Empty icon={<ClipboardList size={28} strokeWidth={1.5} />} title="Chưa có bài nào được chấm" />
        ) : (
          <div className="space-y-2">
            {graded.map((s) => (
              <Card key={s.id} className="flex cursor-pointer items-center gap-4 p-4 hover:border-line-2" onClick={() => go(`/ai/s-${s.id}`)}>
                <div className={cx('w-14 text-center font-display text-[26px] leading-none', s.score == null ? 'text-muted' : s.score >= 8 ? 'text-good' : s.score >= 6 ? 'text-warn' : 'text-bad')}>
                  {s.score ?? '–'}
                  <span className="text-[12px] text-muted">/10</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{s.title}</div>
                  <div className="text-[12px] text-muted">{s.gradedAt && new Date(s.gradedAt).toLocaleDateString('vi-VN')}</div>
                </div>
                <ArrowUpRight size={16} className="text-muted" />
              </Card>
            ))}
          </div>
        ))}

      {tab === 'free' && <FreeTask />}
    </div>
  )
}

function FreeTask() {
  const addSubmission = useStore((s) => s.addSubmission)
  const [title, setTitle] = useState('')
  const [context, setContext] = useState('')
  const [text, setText] = useState('')

  const create = async () => {
    const prompt = buildFreePrompt(context, text)
    const id = addSubmission({ title: title.trim() || 'Bài tự do', prompt, answer: text })
    const ok = await copyText(prompt)
    toast(ok ? 'Đã sao chép — dán vào AI chat' : 'Không sao chép được, hãy copy thủ công')
    go(`/ai/s-${id}`)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <PenLine size={18} strokeWidth={1.75} className="text-accent" />
        <div className="font-medium">Chữa một đoạn tiếng Anh thật của bạn</div>
      </div>
      <p className="mt-1 text-[13px] text-muted">Email sắp gửi, user story, tin nhắn Slack… Lỗi được lưu vào sổ để ôn — học từ chính công việc của bạn.</p>
      <div className="mt-5 grid gap-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề, ví dụ: Email gửi khách hàng về UAT" className="h-11 rounded-xl border border-line-2 bg-paper px-3 text-[14px] outline-none focus:border-ink/50" />
        <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={2} placeholder="Bối cảnh: gửi cho ai, mục đích gì, giọng điệu mong muốn…" className="resize-none rounded-xl border border-line-2 bg-paper px-3 py-2.5 text-[14px] outline-none focus:border-ink/50" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Dán hoặc viết đoạn tiếng Anh của bạn…" className="resize-y rounded-xl border border-line-2 bg-paper px-4 py-3 font-display text-[17px] leading-relaxed outline-none focus:border-ink/50" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[12px] text-muted">{wordCount(text)} từ</span>
        <Button disabled={wordCount(text) < 5} onClick={create}>
          Sao chép cho AI
        </Button>
      </div>
    </Card>
  )
}
