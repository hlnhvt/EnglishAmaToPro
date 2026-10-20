// Chấm bài tự động trên máy: so khớp chuỗi có chuẩn hoá, gần đúng chính tả, so sánh từng từ.

const CONTRACTIONS: [RegExp, string][] = [
  [/\bcan't\b/g, 'cannot'],
  [/\bwon't\b/g, 'will not'],
  [/\bshan't\b/g, 'shall not'],
  [/\b(\w+)n't\b/g, '$1 not'],
  [/\b(\w+)'re\b/g, '$1 are'],
  [/\b(\w+)'ve\b/g, '$1 have'],
  [/\b(\w+)'ll\b/g, '$1 will'],
  [/\bi'm\b/g, 'i am'],
  [/\bcan not\b/g, 'cannot'],
]

export function normalize(s: string, { keepPunct = false } = {}): string {
  let t = s
    .toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
  for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep)
  if (!keepPunct) {
    t = t
      .replace(/[.,!?;:"()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return t
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = cur
  }
  return prev[b.length]
}

const SUFFIXES = /(ies|ied|ing|es|ed|er|est|ly|s|d)$/

/** Khác nhau chỉ ở đuôi biến tố (meeting/meetings, finish/finished) → đó là lỗi ngữ pháp, không phải chính tả. */
function isInflectionSlip(a: string, b: string): boolean {
  const wa = a.split(' ')
  const wb = b.split(' ')
  if (wa.length !== wb.length) return false
  for (let i = 0; i < wa.length; i++) {
    if (wa[i] === wb[i]) continue
    const sa = wa[i].replace(SUFFIXES, '')
    const sb = wb[i].replace(SUFFIXES, '')
    if (sa === sb || wa[i].startsWith(wb[i]) || wb[i].startsWith(wa[i])) return true
  }
  return false
}

export type Verdict = 'correct' | 'almost' | 'wrong'

export interface CheckResult {
  verdict: Verdict
  /** Đáp án gần với câu trả lời nhất, để hiển thị */
  expected: string
}

/**
 * fuzzy = true: cho phép lỗi gõ nhỏ (1 ký tự với từ ≥ 5 chữ, 2 ký tự với cụm > 10 chữ),
 * nhưng không bỏ qua lỗi biến tố như thiếu -s, -ed.
 */
export function checkTyped(input: string, answers: string[], fuzzy = false): CheckResult {
  const n = normalize(input)
  let best = { ans: answers[0], dist: Infinity }
  for (const ans of answers) {
    const na = normalize(ans)
    if (n === na) return { verdict: 'correct', expected: ans }
    const d = levenshtein(n, na)
    if (d < best.dist) best = { ans, dist: d }
  }
  if (fuzzy && n.length > 0) {
    const na = normalize(best.ans)
    const limit = na.length > 10 ? 2 : na.length >= 5 ? 1 : 0
    if (best.dist <= limit && !isInflectionSlip(n, na)) return { verdict: 'almost', expected: best.ans }
  }
  return { verdict: 'wrong', expected: best.ans }
}

/** Tách câu có [đáp án|đáp án khác] */
export interface ClozeParts {
  before: string
  after: string
  answers: string[]
}

export function parseCloze(text: string): ClozeParts {
  const m = text.match(/^(.*?)\[([^\]]+)\](.*)$/)
  if (!m) return { before: text, after: '', answers: [''] }
  return { before: m[1], after: m[3], answers: m[2].split('|').map((s) => s.trim()) }
}

/** Bỏ ngoặc, giữ đáp án chuẩn */
export function fillCloze(text: string): string {
  return text.replace(/\[([^\]|]+)(?:\|[^\]]*)?\]/g, '$1')
}

export type WordStatus = 'ok' | 'missing' | 'extra'
export interface WordDiff {
  word: string
  status: WordStatus
}

const tokens = (s: string) => normalize(s).split(' ').filter(Boolean)

/** So sánh từng từ theo LCS. Trả về danh sách từ theo câu mẫu (ok/missing) xen từ thừa (extra). */
export function diffWords(expected: string, input: string): { parts: WordDiff[]; score: number } {
  const display = expected.replace(/\s+/g, ' ').trim().split(' ')
  const e = tokens(expected)
  const a = tokens(input)
  // Nếu chuẩn hoá làm số token khác (do viết tắt), dùng token đã chuẩn hoá để hiển thị
  const shown = display.length === e.length ? display : e
  const dp: number[][] = Array.from({ length: e.length + 1 }, () => Array(a.length + 1).fill(0))
  for (let i = e.length - 1; i >= 0; i--)
    for (let j = a.length - 1; j >= 0; j--)
      dp[i][j] = e[i] === a[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const parts: WordDiff[] = []
  let i = 0
  let j = 0
  while (i < e.length || j < a.length) {
    if (i < e.length && j < a.length && e[i] === a[j]) {
      parts.push({ word: shown[i], status: 'ok' })
      i++
      j++
    } else if (j < a.length && (i >= e.length || dp[i][j + 1] >= dp[i + 1][j])) {
      parts.push({ word: a[j], status: 'extra' })
      j++
    } else {
      parts.push({ word: shown[i], status: 'missing' })
      i++
    }
  }
  const ok = parts.filter((p) => p.status === 'ok').length
  const extra = parts.filter((p) => p.status === 'extra').length
  const score = e.length ? Math.max(0, (ok - extra * 0.5) / e.length) : 0
  return { parts, score }
}

/** Gợi ý theo cấp: 1 = chữ cái đầu, 2 = khung chữ, 3 = lộ một nửa */
export function hintMask(answer: string, level: number): string {
  if (level <= 0) return ''
  return answer
    .split(' ')
    .map((w) => {
      if (level === 1) return w[0] + '…'
      const keep = level === 2 ? 1 : Math.ceil(w.length / 2)
      return w
        .split('')
        .map((ch, i) => (i < keep || !/[a-z]/i.test(ch) ? ch : '_'))
        .join(' ')
    })
    .join('   ')
}

export function wordCount(s: string): number {
  return s.trim() ? s.trim().split(/\s+/).length : 0
}
