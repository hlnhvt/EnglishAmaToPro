import { motion } from 'motion/react'
import { BookOpen, NotebookPen, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Card, Empty, PageHeader, Segmented, SpeakButton, Tag } from '../components/ui.tsx'
import { ALL_VOCAB } from '../content/index.ts'
import { relativeDue } from '../lib/date.ts'
import { mastery, MASTERY_LABEL, type Mastery } from '../lib/srs.ts'
import { useStore } from '../lib/store.ts'
import { MASTERY_TONE } from './Unit.tsx'

type Filter = 'all' | Mastery

export function WordsPage() {
  const cards = useStore((s) => s.cards)
  const mistakes = useStore((s) => s.mistakes)
  const deleteMistake = useStore((s) => s.deleteMistake)
  const [tab, setTab] = useState<'words' | 'mistakes'>('words')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const learned = useMemo(() => ALL_VOCAB.filter((v) => cards[v.id]), [cards])
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return learned
      .filter((v) => filter === 'all' || mastery(cards[v.id]?.card) === filter)
      .filter((v) => !needle || v.term.toLowerCase().includes(needle) || v.vi.toLowerCase().includes(needle))
      .sort((a, b) => new Date(cards[a.id].card.due).getTime() - new Date(cards[b.id].card.due).getTime())
  }, [learned, q, filter, cards])

  const counts = useMemo(() => {
    const c: Record<Mastery, number> = { new: 0, learning: 0, young: 0, mature: 0 }
    learned.forEach((v) => c[mastery(cards[v.id]?.card)]++)
    return c
  }, [learned, cards])

  const mistakeList = Object.values(mistakes).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div>
      <PageHeader eyebrow="Kho của bạn" title="Sổ từ">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'words', label: `Từ đã học · ${learned.length}` },
            { value: 'mistakes', label: `Sổ lỗi · ${mistakeList.length}` },
          ]}
        />
      </PageHeader>

      {tab === 'words' ? (
        <>
          <div className="mb-6 grid grid-cols-3 gap-2">
            {(['learning', 'young', 'mature'] as Mastery[]).map((m) => (
              <button key={m} onClick={() => setFilter(filter === m ? 'all' : m)} className={`rounded-xl border p-4 text-left transition-colors ${filter === m ? 'border-ink bg-card' : 'border-line hover:border-line-2'}`}>
                <div className="font-display text-[30px] leading-none">{counts[m]}</div>
                <div className="mt-1 text-[12px] text-muted">{MASTERY_LABEL[m]}</div>
              </button>
            ))}
          </div>
          <label className="mb-4 flex h-11 items-center gap-2 rounded-xl border border-line bg-card px-3 focus-within:border-ink/40">
            <Search size={16} strokeWidth={1.75} className="text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm từ hoặc nghĩa…" className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted" />
          </label>
          {list.length === 0 ? (
            <Empty icon={<BookOpen size={28} strokeWidth={1.5} />} title={learned.length ? 'Không có kết quả' : 'Chưa có từ nào'}>
              {learned.length ? 'Thử bộ lọc khác.' : 'Từ bạn học trong các buổi học sẽ xuất hiện ở đây cùng lịch ôn tập.'}
            </Empty>
          ) : (
            <Card className="divide-y divide-line overflow-hidden">
              {list.map((v, i) => {
                const rec = cards[v.id]
                const m = mastery(rec.card)
                return (
                  <motion.div key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i, 20) * 0.015 }} className="flex items-center gap-4 px-5 py-3">
                    <SpeakButton text={v.term} size={16} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-display text-[18px]">{v.term}</span>
                        {v.ipa && <span className="font-mono text-[11px] text-muted">{v.ipa}</span>}
                      </div>
                      <div className="truncate text-[13px] text-ink-2">{v.vi}</div>
                    </div>
                    <div className="hidden text-right sm:block">
                      <div className="font-mono text-[11px] text-muted">ôn {relativeDue(rec.card.due)}</div>
                      <div className="font-mono text-[11px] text-muted">
                        đúng {rec.correct}/{rec.seen}
                      </div>
                    </div>
                    <Tag tone={MASTERY_TONE[m]}>{MASTERY_LABEL[m]}</Tag>
                  </motion.div>
                )
              })}
            </Card>
          )}
        </>
      ) : mistakeList.length === 0 ? (
        <Empty icon={<NotebookPen size={28} strokeWidth={1.5} />} title="Sổ lỗi đang trống">
          Khi bạn dán phản hồi của AI vào app, các dòng “LỖI: … =&gt; …” sẽ được lưu ở đây và đưa vào lịch ôn tập.
        </Empty>
      ) : (
        <div className="space-y-2">
          {mistakeList.map((m) => (
            <Card key={m.id} className="group flex gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="font-display text-[17px] text-bad line-through decoration-1">{m.wrong}</div>
                <div className="font-display text-[17px] text-good">{m.right}</div>
                {m.why && <div className="mt-1 text-[13px] text-ink-2">{m.why}</div>}
                <div className="mt-1 font-mono text-[11px] text-muted">
                  {m.source} · ôn {cards[m.id] ? relativeDue(cards[m.id].card.due) : '—'}
                </div>
              </div>
              <button onClick={() => deleteMistake(m.id)} className="self-start text-muted opacity-0 transition-opacity hover:text-bad group-hover:opacity-100" title="Xoá">
                <Trash2 size={16} strokeWidth={1.75} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
