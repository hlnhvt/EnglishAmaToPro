import { ITEMS, orderedUnits } from '../content/index.ts'
import type { Drill, PatternItem, VocabItem } from '../content/types.ts'
import { fillCloze } from './grading.ts'
import { isDue } from './srs.ts'
import type { AppState, Mistake } from './store.ts'

type Base = { key: string; itemId: string; variant: string; firstTime?: boolean; practice?: boolean }

export type Ex =
  | (Base & { k: 'learnVocab'; item: VocabItem })
  | (Base & { k: 'learnPattern'; item: PatternItem })
  | (Base & { k: 'cloze'; text: string; vi?: string; hint?: string; fuzzy: boolean; explain?: string; item: VocabItem | PatternItem })
  | (Base & { k: 'recall'; item: VocabItem })
  | (Base & { k: 'dictation'; sentence: string; vi: string })
  | (Base & { k: 'fix'; wrong: string; answers: string[]; vi?: string; explain: string })
  | (Base & { k: 'twoTier'; drill: Extract<Drill, { type: 'twoTier' }>; item: PatternItem })
  | (Base & { k: 'transform'; drill: Extract<Drill, { type: 'transform' }> })
  | (Base & { k: 'speak'; sentence: string; vi: string })
  | (Base & { k: 'mistake'; mistake: Mistake })

export type ExKind = Ex['k']

export const KIND_LABEL: Record<ExKind, string> = {
  learnVocab: 'Từ mới',
  learnPattern: 'Mẫu câu mới',
  cloze: 'Điền vào chỗ trống',
  recall: 'Nhớ lại từ',
  dictation: 'Nghe & chép',
  fix: 'Sửa câu sai',
  twoTier: 'Chọn & giải thích',
  transform: 'Viết lại câu',
  speak: 'Nói theo',
  mistake: 'Sổ lỗi của bạn',
}

const COST: Record<ExKind, number> = {
  learnVocab: 25,
  learnPattern: 60,
  cloze: 22,
  recall: 18,
  dictation: 35,
  fix: 40,
  twoTier: 35,
  transform: 40,
  speak: 25,
  mistake: 30,
}

let seq = 0
const nextKey = () => `x${++seq}`
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

function vocabVariants(item: VocabItem, seen: number): string[] {
  const v = ['recall', ...item.examples.map((_, i) => `cloze:${i}`)]
  if (seen >= 2) v.push(...item.examples.map((_, i) => `dict:${i}`))
  return v
}

/** Tạo bài tập cho một mục với một biến thể cụ thể */
export function makeEx(itemId: string, variant: string, mistakes: Record<string, Mistake>, extra: Partial<Base> = {}): Ex | null {
  const key = nextKey()
  if (itemId.startsWith('m-')) {
    const mistake = mistakes[itemId]
    return mistake ? { k: 'mistake', key, itemId, variant: 'mistake', mistake, ...extra } : null
  }
  const ref = ITEMS.get(itemId)
  if (!ref) return null
  const { item } = ref
  const [kind, idxStr] = variant.split(':')
  const idx = Number(idxStr ?? 0)
  if (item.kind === 'vocab') {
    if (kind === 'learn') return { k: 'learnVocab', key, itemId, variant, item, ...extra }
    if (kind === 'recall') return { k: 'recall', key, itemId, variant, item, ...extra }
    const ex = item.examples[idx] ?? item.examples[0]
    if (kind === 'dict') return { k: 'dictation', key, itemId, variant, sentence: fillCloze(ex.en), vi: ex.vi, ...extra }
    if (kind === 'speak') return { k: 'speak', key, itemId, variant, sentence: fillCloze(ex.en), vi: ex.vi, practice: true, ...extra }
    return { k: 'cloze', key, itemId, variant, text: ex.en, vi: ex.vi, fuzzy: true, item, ...extra }
  }
  if (kind === 'learn') return { k: 'learnPattern', key, itemId, variant, item, ...extra }
  const d = item.drills[idx] ?? item.drills[0]
  switch (d.type) {
    case 'cloze':
      return { k: 'cloze', key, itemId, variant, text: d.text, vi: d.vi, hint: d.hint, explain: d.explain, fuzzy: false, item, ...extra }
    case 'fix':
      return { k: 'fix', key, itemId, variant, wrong: d.wrong, answers: d.answers, vi: d.vi, explain: d.explain, ...extra }
    case 'twoTier':
      return { k: 'twoTier', key, itemId, variant, drill: d, item, ...extra }
    case 'transform':
      return { k: 'transform', key, itemId, variant, drill: d, ...extra }
  }
}

/** Chọn biến thể khác lần trước để luôn gặp từ trong ngữ cảnh mới */
export function reviewVariant(itemId: string, state: Pick<AppState, 'cards'>, avoid?: string): string {
  if (itemId.startsWith('m-')) return 'mistake'
  const ref = ITEMS.get(itemId)
  if (!ref) return ''
  const rec = state.cards[itemId]
  const last = avoid ?? rec?.lastVariant
  const all =
    ref.item.kind === 'vocab' ? vocabVariants(ref.item, rec?.seen ?? 0) : ref.item.drills.map((_, i) => `drill:${i}`)
  const options = all.filter((v) => v !== last)
  return pick(options.length ? options : all)
}

export const NEW_PER_SESSION: Record<number, number> = { 15: 4, 30: 6, 45: 8, 60: 10 }

export interface SessionPlan {
  queue: Ex[]
  reviews: number
  fresh: number
  estMinutes: number
}

export function planSession(state: AppState, minutes: number, speakOK: boolean, now = new Date()): SessionPlan {
  const budget = minutes * 60 * 0.9
  const { cards, mistakes, profile } = state

  const due = Object.entries(cards)
    .filter(([id, rec]) => (id.startsWith('m-') ? !!mistakes[id] : ITEMS.has(id)) && isDue(rec.card, now))
    .sort((a, b) => new Date(a[1].card.due).getTime() - new Date(b[1].card.due).getTime())
    .map(([id]) => id)

  // Mục mới: unit đang tập trung trước, sau đó theo lộ trình
  let units = orderedUnits(profile.topics)
  if (profile.focusUnitId) {
    const f = units.find((u) => u.id === profile.focusUnitId)
    if (f) units = [f, ...units.filter((u) => u !== f)]
  }
  let quota = NEW_PER_SESSION[minutes] ?? 6
  // Nợ ôn tập nhiều thì học mới ít lại
  if (due.length > minutes * 1.5) quota = Math.ceil(quota / 2)
  const fresh: string[] = []
  outer: for (const u of units) {
    for (const it of u.items) {
      if (quota <= 0) break outer
      if (cards[it.id]) continue
      fresh.push(it.id)
      quota -= it.kind === 'pattern' ? 2 : 1
    }
  }

  const blocks: Ex[][] = fresh.map((id) => {
    const item = ITEMS.get(id)!.item
    if (item.kind === 'vocab') {
      return [makeEx(id, 'learn', mistakes)!, makeEx(id, 'cloze:0', mistakes, { firstTime: true })!]
    }
    return [
      makeEx(id, 'learn', mistakes)!,
      makeEx(id, 'drill:0', mistakes, { firstTime: true })!,
      makeEx(id, `drill:${Math.min(1, item.drills.length - 1)}`, mistakes)!,
    ]
  })
  const newCost = blocks.flat().reduce((s, e) => s + COST[e.k], 0)

  const reviews: Ex[] = []
  let spent = newCost
  for (const id of due) {
    const ex = makeEx(id, reviewVariant(id, state), mistakes)
    if (!ex) continue
    if (spent + COST[ex.k] > budget && reviews.length >= 5) break
    reviews.push(ex)
    spent += COST[ex.k]
  }

  // Xen kẽ, kiểm tra lùi một nhịp: học A → học B → kiểm tra A → ôn → học C → kiểm tra B …
  // để bài kiểm tra không chỉ là nhớ ngắn hạn ngay sau khi vừa đọc.
  const queue: Ex[] = []
  const r = [...reviews]
  let pendingTests: Ex[] = []
  for (const b of blocks) {
    queue.push(b[0])
    queue.push(...pendingTests)
    queue.push(...r.splice(0, 2))
    pendingTests = b.slice(1)
  }
  queue.push(...r.splice(0, 1))
  queue.push(...pendingTests)
  queue.push(...r)

  // Củng cố: nghe-chép các từ mới học, rồi nói theo
  const newVocab = fresh.filter((id) => ITEMS.get(id)!.item.kind === 'vocab')
  for (const id of newVocab) {
    if (spent + COST.dictation > budget) break
    const item = ITEMS.get(id)!.item as VocabItem
    queue.push(makeEx(id, `dict:${item.examples.length > 1 ? 1 : 0}`, mistakes)!)
    spent += COST.dictation
  }
  if (speakOK && minutes >= 30) {
    const pool = [...newVocab, ...reviews.filter((e) => ITEMS.get(e.itemId)?.item.kind === 'vocab').map((e) => e.itemId)]
    for (const id of pool.slice(0, minutes >= 45 ? 3 : 2)) {
      const item = ITEMS.get(id)!.item as VocabItem
      queue.push(makeEx(id, `speak:${Math.floor(Math.random() * item.examples.length)}`, mistakes)!)
      spent += COST.speak
    }
  }

  return {
    queue,
    reviews: reviews.length,
    fresh: fresh.length,
    estMinutes: Math.max(1, Math.round(spent / 60)),
  }
}

/** Số thẻ đến hạn (để hiển thị ở trang chủ) */
export function dueCount(state: Pick<AppState, 'cards' | 'mistakes'>, now = new Date()): number {
  return Object.entries(state.cards).filter(
    ([id, rec]) => (id.startsWith('m-') ? !!state.mistakes[id] : ITEMS.has(id)) && isDue(rec.card, now),
  ).length
}
