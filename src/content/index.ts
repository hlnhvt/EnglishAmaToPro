import type { AiTask, Item, Level, TopicId, Unit, VocabItem } from './types.ts'

const modules = import.meta.glob<{ default: Unit }>('./units/*.ts', { eager: true })

export const UNITS: Unit[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order)

export interface ItemRef {
  item: Item
  unit: Unit
}

export const ITEMS = new Map<string, ItemRef>()
export const TASKS = new Map<string, { task: AiTask; unit: Unit }>()
for (const unit of UNITS) {
  for (const item of unit.items) ITEMS.set(item.id, { item, unit })
  for (const task of unit.aiTasks) TASKS.set(task.id, { task, unit })
}

export const ALL_VOCAB: VocabItem[] = UNITS.flatMap((u) =>
  u.items.filter((i): i is VocabItem => i.kind === 'vocab'),
)

export const TOPICS: { id: TopicId; label: string; desc: string }[] = [
  { id: 'daily', label: 'Giao tiếp hằng ngày', desc: 'Small talk, kế hoạch, cảm xúc, ý kiến' },
  { id: 'work', label: 'Công việc BA / IT', desc: 'Vai trò, requirement, ước lượng, ưu tiên' },
  { id: 'meetings', label: 'Họp & thảo luận', desc: 'Hỏi lại, xác nhận, phản biện lịch sự' },
  { id: 'writing', label: 'Email & báo cáo', desc: 'Cập nhật tiến độ, email công việc' },
  { id: 'travel', label: 'Công tác & du lịch', desc: 'Sân bay, khách sạn, đi lại' },
  { id: 'tech', label: 'Giải thích hệ thống', desc: 'Mô tả luồng, tính năng, kỹ thuật' },
]

export const topicLabel = (id: TopicId) => TOPICS.find((t) => t.id === id)?.label ?? id

export const LEVELS: { id: Level | 'A1'; label: string; desc: string }[] = [
  { id: 'A1', label: 'A1', desc: 'Khởi đầu' },
  { id: 'A2', label: 'A2', desc: 'Sơ cấp' },
  { id: 'B1', label: 'B1', desc: 'Trung cấp' },
  { id: 'B2', label: 'B2', desc: 'Trung cao' },
  { id: 'C1', label: 'C1', desc: 'Thành thạo' },
]

/** Thứ tự học đề xuất: unit thuộc chủ đề yêu thích lên trước, trong cùng trình độ */
export function orderedUnits(preferred: TopicId[]): Unit[] {
  const lv: Record<Level, number> = { A2: 0, B1: 1, B2: 2, C1: 3 }
  return [...UNITS].sort((a, b) => {
    if (lv[a.level] !== lv[b.level]) return lv[a.level] - lv[b.level]
    const pa = preferred.includes(a.topic) ? 0 : 1
    const pb = preferred.includes(b.topic) ? 0 : 1
    return pa - pb || a.order - b.order
  })
}

/** Câu của ngày: chọn cố định theo ngày từ các ví dụ */
export function phraseOfDay(key: string): { en: string; vi: string; term: string } | null {
  if (!ALL_VOCAB.length) return null
  let h = 0
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const v = ALL_VOCAB[h % ALL_VOCAB.length]
  const ex = v.examples[h % v.examples.length]
  return { en: ex.en, vi: ex.vi, term: v.term }
}
