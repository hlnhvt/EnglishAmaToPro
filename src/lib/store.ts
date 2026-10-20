import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TopicId } from '../content/types.ts'
import { addDays, dayKey, diffDays } from './date.ts'
import { newCard, reviewCard, toGrade, type AttemptOutcome, type StoredCard } from './srs.ts'

export type ThemePref = 'system' | 'light' | 'dark'

export interface Profile {
  name: string
  topics: TopicId[]
  dailyMinutes: number
  onboarded: boolean
  createdAt: string
  focusUnitId?: string
}

export interface Settings {
  theme: ThemePref
  sound: boolean
  voiceURI?: string
  rate: number
  speaking: boolean
}

export interface CardRec {
  card: StoredCard
  seen: number
  correct: number
  lastVariant?: string
  added: string
}

export interface DayStat {
  seconds: number
  answered: number
  correct: number
  learned: number
  sessions: number
}

export interface Streak {
  current: number
  best: number
  lastDay?: string
  freezes: number
  frozen: string[]
}

export interface Calib {
  sure: { n: number; ok: number }
  guess: { n: number; ok: number }
  dontKnow: number
}

export interface Submission {
  id: string
  taskId?: string
  title: string
  prompt: string
  answer: string
  createdAt: string
  status: 'pending' | 'graded'
  score?: number | null
  feedback?: string
  gradedAt?: string
}

export interface Mistake {
  id: string
  wrong: string
  right: string
  why: string
  source: string
  createdAt: string
}

interface Data {
  profile: Profile
  settings: Settings
  cards: Record<string, CardRec>
  days: Record<string, DayStat>
  streak: Streak
  calib: Calib
  submissions: Submission[]
  mistakes: Record<string, Mistake>
}

interface Actions {
  completeOnboarding: (p: Pick<Profile, 'name' | 'topics' | 'dailyMinutes'>) => void
  setProfile: (p: Partial<Profile>) => void
  setSettings: (s: Partial<Settings>) => void
  recordAttempt: (a: { itemId: string; variant: string; outcome: AttemptOutcome; firstTime?: boolean }) => void
  addTime: (seconds: number) => void
  completeSession: () => void
  addSubmission: (s: Omit<Submission, 'id' | 'createdAt' | 'status'>) => string
  gradeSubmission: (id: string, feedback: string, score: number | null, mistakes: Omit<Mistake, 'id' | 'createdAt' | 'source'>[]) => number
  deleteSubmission: (id: string) => void
  deleteMistake: (id: string) => void
  importData: (raw: unknown) => void
  resetAll: () => void
}

export type AppState = Data & Actions

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)

const emptyDay = (): DayStat => ({ seconds: 0, answered: 0, correct: 0, learned: 0, sessions: 0 })

const initial = (): Data => ({
  profile: { name: '', topics: ['daily', 'work', 'meetings'], dailyMinutes: 30, onboarded: false, createdAt: dayKey() },
  settings: { theme: 'system', sound: true, rate: 0.95, speaking: true },
  cards: {},
  days: {},
  streak: { current: 0, best: 0, freezes: 0, frozen: [] },
  calib: { sure: { n: 0, ok: 0 }, guess: { n: 0, ok: 0 }, dontKnow: 0 },
  submissions: [],
  mistakes: {},
})

/** Chuỗi ngày đang hiển thị: nếu đã lỡ quá số ngày đóng băng thì về 0 */
export function liveStreak(s: Streak, today = dayKey()): { days: number; atRisk: boolean; doneToday: boolean } {
  if (!s.lastDay) return { days: 0, atRisk: false, doneToday: false }
  const gap = diffDays(s.lastDay, today)
  if (gap === 0) return { days: s.current, atRisk: false, doneToday: true }
  const missed = gap - 1
  if (missed <= s.freezes) return { days: s.current, atRisk: true, doneToday: false }
  return { days: 0, atRisk: false, doneToday: false }
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initial(),

      completeOnboarding: (p) => set((s) => ({ profile: { ...s.profile, ...p, onboarded: true, createdAt: dayKey() } })),

      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

      setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),

      recordAttempt: ({ itemId, variant, outcome, firstTime }) =>
        set((s) => {
          const now = new Date()
          const today = dayKey(now)
          const prev = s.cards[itemId]
          const base = prev?.card ?? newCard(now)
          const rec: CardRec = {
            card: reviewCard(base, toGrade(outcome), now),
            seen: (prev?.seen ?? 0) + 1,
            correct: (prev?.correct ?? 0) + (outcome.correct ? 1 : 0),
            lastVariant: variant,
            added: prev?.added ?? today,
          }
          const day = { ...(s.days[today] ?? emptyDay()) }
          day.answered++
          if (outcome.correct) day.correct++
          if (firstTime && !prev) day.learned++
          const calib = structuredClone(s.calib)
          if (outcome.confidence === 'dont_know') calib.dontKnow++
          else {
            const bucket = outcome.confidence === 'sure' ? calib.sure : calib.guess
            bucket.n++
            if (outcome.correct) bucket.ok++
          }
          return { cards: { ...s.cards, [itemId]: rec }, days: { ...s.days, [today]: day }, calib }
        }),

      addTime: (seconds) =>
        set((s) => {
          const today = dayKey()
          const day = { ...(s.days[today] ?? emptyDay()) }
          day.seconds += Math.round(seconds)
          return { days: { ...s.days, [today]: day } }
        }),

      completeSession: () =>
        set((s) => {
          const today = dayKey()
          const day = { ...(s.days[today] ?? emptyDay()) }
          day.sessions++
          const st = { ...s.streak, frozen: [...s.streak.frozen] }
          if (st.lastDay !== today) {
            const gap = st.lastDay ? diffDays(st.lastDay, today) : Infinity
            const missed = gap - 1
            if (gap === 1) st.current++
            else if (Number.isFinite(gap) && missed <= st.freezes) {
              st.freezes -= missed
              for (let i = 1; i <= missed; i++) st.frozen.push(addDays(st.lastDay!, i))
              st.current++
            } else st.current = 1
            st.lastDay = today
            if (st.current % 7 === 0) st.freezes = Math.min(2, st.freezes + 1)
            st.best = Math.max(st.best, st.current)
          }
          return { streak: st, days: { ...s.days, [today]: day } }
        }),

      addSubmission: (sub) => {
        const id = uid()
        set((s) => ({
          submissions: [{ ...sub, id, createdAt: new Date().toISOString(), status: 'pending' }, ...s.submissions],
        }))
        return id
      },

      gradeSubmission: (id, feedback, score, mistakes) => {
        const sub = get().submissions.find((x) => x.id === id)
        if (!sub) return 0
        const now = new Date()
        const newMistakes: Record<string, Mistake> = {}
        const newCards: Record<string, CardRec> = {}
        const known = new Set(Object.values(get().mistakes).map((m) => m.wrong.toLowerCase()))
        for (const m of mistakes) {
          if (known.has(m.wrong.toLowerCase())) continue
          const mid = `m-${uid()}`
          newMistakes[mid] = { ...m, id: mid, source: sub.title, createdAt: now.toISOString() }
          newCards[mid] = { card: newCard(now), seen: 0, correct: 0, added: dayKey(now) }
        }
        set((s) => ({
          submissions: s.submissions.map((x) =>
            x.id === id ? { ...x, status: 'graded', feedback, score, gradedAt: now.toISOString() } : x,
          ),
          mistakes: { ...s.mistakes, ...newMistakes },
          cards: { ...s.cards, ...newCards },
        }))
        return Object.keys(newMistakes).length
      },

      deleteSubmission: (id) => set((s) => ({ submissions: s.submissions.filter((x) => x.id !== id) })),

      deleteMistake: (id) =>
        set((s) => {
          const mistakes = { ...s.mistakes }
          const cards = { ...s.cards }
          delete mistakes[id]
          delete cards[id]
          return { mistakes, cards }
        }),

      importData: (raw) => {
        const obj = (raw as { state?: Partial<Data> })?.state ?? (raw as Partial<Data>)
        if (!obj || typeof obj !== 'object' || !('profile' in obj)) throw new Error('File không đúng định dạng')
        set({ ...initial(), ...obj })
      },

      resetAll: () => set(initial()),
    }),
    {
      name: 'amatopro:v1',
      version: 1,
      partialize: (s) => {
        const { profile, settings, cards, days, streak, calib, submissions, mistakes } = s
        return { profile, settings, cards, days, streak, calib, submissions, mistakes }
      },
    },
  ),
)

export const todayStat = (days: Record<string, DayStat>) => days[dayKey()] ?? emptyDay()
