export type Level = 'A2' | 'B1' | 'B2' | 'C1'

export type TopicId = 'daily' | 'work' | 'meetings' | 'writing' | 'travel' | 'tech'

/**
 * Câu ví dụ. Phần cần người học tự gõ đặt trong [ngoặc vuông].
 * Nhiều đáp án được chấp nhận thì phân tách bằng "|", đáp án đầu tiên là đáp án chuẩn.
 *   "I [have finished|'ve finished] the draft."
 */
export interface Example {
  en: string
  vi: string
}

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'phrasal verb'
  | 'expression'

export interface VocabItem {
  kind: 'vocab'
  id: string
  /** Dạng gốc: "stakeholder", "follow up on" */
  term: string
  pos: PartOfSpeech
  /** Chỉ điền khi chắc chắn chính xác (giọng Mỹ, phiên âm rộng). */
  ipa?: string
  /** Nghĩa tiếng Việt ngắn gọn */
  vi: string
  /** Định nghĩa tiếng Anh dễ hiểu, KHÔNG chứa chính từ đó */
  def: string
  /** 2–3 câu, mỗi câu có đúng một cụm [..] chứa dạng của term */
  examples: Example[]
  /** Ghi chú tiếng Việt: collocation, lỗi người Việt hay mắc */
  note?: string
}

export type Drill =
  /** Điền vào chỗ trống, text chứa đúng một [..] */
  | { type: 'cloze'; text: string; vi?: string; hint?: string; explain: string }
  /** Câu có lỗi sai, người học gõ lại toàn bộ câu đúng */
  | { type: 'fix'; wrong: string; answers: string[]; vi?: string; explain: string }
  /** Trắc nghiệm hai tầng: chọn TẤT CẢ đáp án đúng, rồi chọn lý do */
  | {
      type: 'twoTier'
      question: string
      vi?: string
      options: string[]
      correct: number[]
      reasons: string[]
      reasonCorrect: number
      explain: string
    }
  /** Viết lại câu theo yêu cầu */
  | { type: 'transform'; instruction: string; source: string; answers: string[]; explain: string }

export interface PatternItem {
  kind: 'pattern'
  id: string
  /** Tên ngắn tiếng Việt */
  title: string
  /** Giải thích tiếng Việt 2–4 câu, có thể dùng **in đậm** */
  summary: string
  /** Công thức, ví dụ "have/has + V3" */
  form?: string
  examples: Example[]
  drills: Drill[]
}

export type Item = VocabItem | PatternItem

export interface AiTask {
  id: string
  kind: 'writing' | 'translation' | 'roleplay'
  /** Tiêu đề tiếng Việt */
  title: string
  /** Tình huống, tiếng Việt */
  brief: string
  /** Đề bài tiếng Anh */
  task: string
  /** Chỉ dùng cho translation: đoạn tiếng Việt cần dịch */
  source?: string
  minWords?: number
  /** Tiêu chí chấm, tiếng Việt */
  criteria: string[]
}

export interface Unit {
  id: string
  order: number
  level: Level
  topic: TopicId
  title: string
  titleVi: string
  /** "Sau bài này bạn có thể…" */
  goal: string
  items: Item[]
  aiTasks: AiTask[]
}
