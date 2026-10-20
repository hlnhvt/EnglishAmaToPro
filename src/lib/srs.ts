import { createEmptyCard, fsrs, Rating, State, type Card, type CardInput, type Grade } from 'ts-fsrs'

const scheduler = fsrs({ request_retention: 0.9, enable_fuzz: true, enable_short_term: true })

/** Thẻ lưu trong localStorage: Date đã thành chuỗi ISO */
export type StoredCard = Omit<CardInput, 'due' | 'last_review'> & { due: string; last_review?: string | null }

const toStored = (c: Card): StoredCard => JSON.parse(JSON.stringify(c))

export function newCard(now = new Date()): StoredCard {
  return toStored(createEmptyCard(now))
}

export function reviewCard(card: StoredCard, grade: Grade, now = new Date()): StoredCard {
  return toStored(scheduler.next(card as CardInput, now, grade).card)
}

export function isDue(card: StoredCard, now = new Date()): boolean {
  return new Date(card.due).getTime() <= now.getTime()
}

export type Confidence = 'sure' | 'guess' | 'dont_know'

export interface AttemptOutcome {
  correct: boolean
  almost?: boolean
  hints?: number
  confidence: Confidence
}

/**
 * Quy đổi kết quả sang điểm FSRS.
 * Đúng nhưng đoán / dùng gợi ý / sai chính tả nhẹ → Hard, để app ôn lại sớm hơn.
 */
export function toGrade(o: AttemptOutcome): Grade {
  if (!o.correct || o.confidence === 'dont_know') return Rating.Again
  if (o.confidence === 'guess' || o.almost || (o.hints ?? 0) > 0) return Rating.Hard
  return Rating.Good
}

export type Mastery = 'new' | 'learning' | 'young' | 'mature'

export function mastery(card?: StoredCard): Mastery {
  if (!card) return 'new'
  if (card.state === State.Review && card.stability >= 21) return 'mature'
  if (card.state === State.Review) return 'young'
  return 'learning'
}

export const MASTERY_LABEL: Record<Mastery, string> = {
  new: 'Chưa học',
  learning: 'Đang học',
  young: 'Đang vững',
  mature: 'Thuộc lâu',
}
