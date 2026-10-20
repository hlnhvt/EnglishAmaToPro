// Tạo prompt để dán vào bất kỳ AI chat nào, và đọc lại phản hồi (điểm + danh sách lỗi).
import type { AiTask } from '../content/types.ts'

const KIND_LABEL: Record<AiTask['kind'], string> = {
  writing: 'Viết',
  translation: 'Dịch Việt → Anh',
  roleplay: 'Nhập vai (trả lời tình huống)',
}

const LEARNER =
  'Học viên là người Việt, trình độ khoảng A2–B1, đang làm Business Analyst lead trong ngành IT. ' +
  'Mục tiêu: dùng tiếng Anh trong giao tiếp hằng ngày và trong công việc.'

const OUTPUT_RULES = `## Cách trả lời (bằng tiếng Việt, đúng thứ tự)
1. **Nhận xét chung** (2–3 câu): điểm mạnh và điều cần cải thiện nhất.
2. **Danh sách lỗi**: mỗi lỗi một dòng, ĐÚNG định dạng sau để app tự đọc được:
   LỖI: <đoạn sai, chép nguyên văn> => <đoạn đã sửa> | <giải thích ngắn bằng tiếng Việt>
   Gồm cả lỗi ngữ pháp, từ vựng, cách diễn đạt chưa tự nhiên. Nếu không có lỗi, ghi "LỖI: không có".
3. **Bản viết lại**: giữ nguyên ý của học viên, tự nhiên như người bản xứ đi làm, trình độ B1–B2.
4. **3 cụm từ nên học** từ bản viết lại, kèm nghĩa tiếng Việt.
5. Dòng CUỐI CÙNG ghi đúng định dạng: ĐIỂM: <số>/10

Chấm nghiêm túc, không dễ dãi. Nếu bài lạc đề, thiếu ý hoặc quá ngắn, hãy nói rõ và trừ điểm.`

export function buildTaskPrompt(task: AiTask, answer: string): string {
  const lines = [
    'Bạn là giáo viên tiếng Anh giàu kinh nghiệm, chuyên dạy người Việt đi làm trong ngành IT.',
    LEARNER,
    '',
    '## Đề bài',
    `- Dạng bài: ${KIND_LABEL[task.kind]}`,
    `- Tình huống: ${task.brief}`,
    `- Yêu cầu: ${task.task}`,
  ]
  if (task.source) lines.push(`- Đoạn tiếng Việt cần dịch:\n"""\n${task.source}\n"""`)
  if (task.minWords) lines.push(`- Độ dài tối thiểu: ${task.minWords} từ`)
  lines.push('', '## Tiêu chí chấm', ...task.criteria.map((c) => `- ${c}`))
  lines.push('', '## Bài làm của học viên', '"""', answer.trim(), '"""', '', OUTPUT_RULES)
  return lines.join('\n')
}

export function buildFreePrompt(context: string, answer: string): string {
  return [
    'Bạn là giáo viên tiếng Anh giàu kinh nghiệm, chuyên dạy người Việt đi làm trong ngành IT.',
    LEARNER,
    '',
    '## Bối cảnh / mục đích của đoạn văn',
    context.trim() || '(Học viên không ghi bối cảnh)',
    '',
    '## Đoạn tiếng Anh học viên viết',
    '"""',
    answer.trim(),
    '"""',
    '',
    OUTPUT_RULES,
  ].join('\n')
}

export function buildExplainPrompt(p: { question: string; mine: string; expected: string; note?: string }): string {
  return [
    'Tôi là người Việt đang học tiếng Anh (trình độ A2–B1, làm BA trong ngành IT). Giải thích giúp tôi bằng tiếng Việt, ngắn gọn:',
    '',
    `Câu hỏi: ${p.question}`,
    `Câu trả lời của tôi: ${p.mine || '(bỏ trống)'}`,
    `Đáp án app đưa ra: ${p.expected}`,
    p.note ? `Ghi chú của app: ${p.note}` : '',
    '',
    '1. Câu trả lời của tôi đúng, chấp nhận được, hay sai? Vì sao?',
    '2. Quy tắc cần nhớ là gì (1–2 câu)?',
    '3. Cho 3 câu ví dụ khác dùng đúng quy tắc này, ưu tiên ngữ cảnh công việc IT.',
  ]
    .filter((l) => l !== '')
    .join('\n')
}

export interface ParsedMistake {
  wrong: string
  right: string
  why: string
}

export interface ParsedFeedback {
  score: number | null
  mistakes: ParsedMistake[]
}

const clean = (s: string) => s.replace(/\*\*|__|`/g, '').trim()
const unquote = (s: string) => s.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim()

export function parseFeedback(text: string): ParsedFeedback {
  const plain = clean(text)
  let score: number | null = null
  const scores = [...plain.matchAll(/(?:ĐIỂM|DIEM|ĐIỂM SỐ|SCORE)\s*:?\s*(\d+(?:[.,]\d+)?)\s*\/\s*10/gi)]
  if (scores.length) {
    const v = parseFloat(scores[scores.length - 1][1].replace(',', '.'))
    if (!Number.isNaN(v) && v >= 0 && v <= 10) score = v
  }
  const mistakes: ParsedMistake[] = []
  for (const raw of plain.split(/\r?\n/)) {
    const line = raw.replace(/^[\s>*\-•\d.)]+/, '')
    const m = line.match(/^(?:LỖI|LOI|ERROR)\s*:\s*(.+?)\s*(?:=>|→|->)\s*(.+?)(?:\s*\|\s*(.+))?$/i)
    if (!m) continue
    const wrong = unquote(m[1])
    const right = unquote(m[2])
    if (!wrong || !right || /^không có/i.test(wrong) || wrong.toLowerCase() === right.toLowerCase()) continue
    mistakes.push({ wrong, right, why: (m[3] ?? '').trim() })
  }
  return { score, mistakes }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}
