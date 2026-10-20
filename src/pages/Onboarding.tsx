import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Keyboard, MessageSquareText, ShieldQuestion } from 'lucide-react'
import { useState } from 'react'
import { Wordmark } from '../components/Shell.tsx'
import { Button, cx } from '../components/ui.tsx'
import { TOPICS } from '../content/index.ts'
import type { TopicId } from '../content/types.ts'
import { useStore } from '../lib/store.ts'

const MINUTES = [
  { v: 15, label: '15 phút', desc: 'Ôn + vài từ mới' },
  { v: 30, label: '30 phút', desc: 'Thêm nghe, nói' },
  { v: 45, label: '45 phút', desc: 'Học sâu hơn' },
  { v: 60, label: '60 phút', desc: 'Tối đa mỗi ngày' },
]

const PRINCIPLES = [
  { icon: Keyboard, title: 'Bạn tự gõ, tự nói', text: 'Phần lớn bài tập không có A/B/C/D. Biết thì gõ ra được — không loại trừ hay đoán mò được.' },
  { icon: ShieldQuestion, title: '"Kiểm tra" hay "Đoán thử"', text: 'Chắc chắn thì bấm Kiểm tra. Chưa chắc thì bấm Đoán thử — app sẽ ôn lại sớm hơn thay vì tưởng là bạn đã thuộc.' },
  { icon: MessageSquareText, title: 'AI chấm bài viết', text: 'Viết xong, app tạo sẵn đề + bài để bạn dán vào AI chat bất kỳ. Dán phản hồi lại, app lưu điểm và đưa lỗi vào sổ ôn tập.' },
]

export function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [topics, setTopics] = useState<TopicId[]>(['daily', 'work', 'meetings', 'writing'])
  const [minutes, setMinutes] = useState(30)

  const canNext = step === 0 ? name.trim().length > 0 : step === 1 ? topics.length > 0 : true
  const next = () => {
    if (!canNext) return
    if (step < 3) setStep(step + 1)
    else complete({ name: name.trim(), topics, dailyMinutes: minutes })
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-10">
      <div className="flex items-center justify-between">
        <Wordmark />
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.span key={i} animate={{ width: i === step ? 22 : 6, opacity: i <= step ? 1 : 0.3 }} className="h-1.5 rounded-full bg-ink" />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center py-10">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
            {step === 0 && (
              <>
                <div className="eyebrow mb-3">Bắt đầu</div>
                <h1 className="font-display text-[44px] leading-[1.02] tracking-[-0.03em]">
                  Mỗi ngày một chút,
                  <br />
                  <span className="italic text-accent">đến lúc thành thạo.</span>
                </h1>
                <p className="mt-5 text-ink-2">Lộ trình bắt đầu từ A2: giao tiếp hằng ngày và tiếng Anh cho công việc BA trong ngành IT.</p>
                <label className="mt-10 block">
                  <span className="eyebrow">Bạn tên là gì?</span>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                    placeholder="Tên hoặc biệt danh"
                    className="mt-2 h-14 w-full border-b-2 border-line-2 bg-transparent font-display text-[28px] outline-none placeholder:text-muted/50 focus:border-accent"
                  />
                </label>
              </>
            )}

            {step === 1 && (
              <>
                <div className="eyebrow mb-3">Chủ đề yêu thích</div>
                <h1 className="font-display text-[36px] leading-tight tracking-[-0.02em]">Bạn muốn dùng tiếng Anh vào việc gì?</h1>
                <p className="mt-3 text-ink-2">Chủ đề bạn chọn sẽ được học trước. Có thể đổi trong Cài đặt.</p>
                <div className="mt-8 grid gap-2">
                  {TOPICS.map((t) => {
                    const on = topics.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTopics(on ? topics.filter((x) => x !== t.id) : [...topics, t.id])}
                        className={cx('flex items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all', on ? 'border-ink bg-card' : 'border-line hover:border-line-2')}
                      >
                        <span className={cx('grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors', on ? 'border-ink bg-ink text-paper' : 'border-line-2')}>{on && <Check size={13} strokeWidth={3} />}</span>
                        <span>
                          <span className="block font-medium">{t.label}</span>
                          <span className="block text-[13px] text-muted">{t.desc}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="eyebrow mb-3">Thời gian mỗi ngày</div>
                <h1 className="font-display text-[36px] leading-tight tracking-[-0.02em]">Mỗi ngày bạn dành bao lâu?</h1>
                <p className="mt-3 text-ink-2">Đây là mục tiêu mặc định. Hôm nào bận, bạn vẫn chọn buổi ngắn hơn được.</p>
                <div className="mt-8 grid grid-cols-2 gap-2">
                  {MINUTES.map((m) => (
                    <button
                      key={m.v}
                      onClick={() => setMinutes(m.v)}
                      className={cx('rounded-xl border px-4 py-4 text-left transition-all', minutes === m.v ? 'border-ink bg-card' : 'border-line hover:border-line-2')}
                    >
                      <span className="block font-display text-[26px]">{m.label}</span>
                      <span className="block text-[13px] text-muted">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="eyebrow mb-3">Cách app hoạt động</div>
                <h1 className="font-display text-[36px] leading-tight tracking-[-0.02em]">Ba điều khác biệt</h1>
                <div className="mt-8 space-y-5">
                  {PRINCIPLES.map((p, i) => (
                    <motion.div key={p.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="flex gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-card">
                        <p.icon size={18} strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="mt-0.5 text-[14px] text-ink-2">{p.text}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} className={step === 0 ? 'invisible' : ''} icon={<ArrowLeft size={16} strokeWidth={1.75} />}>
          Quay lại
        </Button>
        <Button size="lg" variant={step === 3 ? 'accent' : 'primary'} disabled={!canNext} onClick={next}>
          {step === 3 ? 'Bắt đầu học' : 'Tiếp'} <ArrowRight size={16} strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  )
}
