// Kiểm tra cấu trúc nội dung bài học: node scripts/validate-content.ts
import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Drill, Unit } from '../src/content/types.ts'

const dir = resolve(import.meta.dirname, '../src/content/units')
const files = readdirSync(dir).filter((f) => f.endsWith('.ts')).sort()
const errors: string[] = []
const warnings: string[] = []
const ids = new Set<string>()
let vocab = 0
let patterns = 0
let drills = 0
let tasks = 0

const bracketCount = (s: string) => (s.match(/\[[^\]]+\]/g) ?? []).length
const unique = (id: string, where: string) => {
  if (ids.has(id)) errors.push(`${where}: trùng id "${id}"`)
  ids.add(id)
}

function checkDrill(d: Drill, where: string) {
  drills++
  if (!d.explain?.trim()) errors.push(`${where}: thiếu explain`)
  switch (d.type) {
    case 'cloze':
      if (bracketCount(d.text) !== 1) errors.push(`${where}: cloze phải có đúng 1 [..] — "${d.text}"`)
      break
    case 'fix':
      if (!d.answers.length) errors.push(`${where}: fix thiếu answers`)
      if (d.answers.some((a) => a.trim().toLowerCase() === d.wrong.trim().toLowerCase()))
        errors.push(`${where}: fix có answer trùng câu sai`)
      break
    case 'twoTier':
      if (d.options.length < 3) errors.push(`${where}: twoTier cần >= 3 options`)
      if (!d.correct.length || d.correct.some((i) => i < 0 || i >= d.options.length))
        errors.push(`${where}: twoTier correct không hợp lệ`)
      if (d.reasons.length < 3) errors.push(`${where}: twoTier cần >= 3 reasons`)
      if (d.reasonCorrect < 0 || d.reasonCorrect >= d.reasons.length)
        errors.push(`${where}: twoTier reasonCorrect không hợp lệ`)
      break
    case 'transform':
      if (!d.answers.length) errors.push(`${where}: transform thiếu answers`)
      break
  }
}

for (const f of files) {
  const mod = await import(pathToFileURL(join(dir, f)).href)
  const unit: Unit | undefined = mod.default
  if (!unit) {
    errors.push(`${f}: không có export default`)
    continue
  }
  unique(unit.id, f)
  for (const item of unit.items) {
    const where = `${f} › ${item.id}`
    unique(item.id, where)
    if (item.kind === 'vocab') {
      vocab++
      if (item.examples.length < 2) errors.push(`${where}: cần >= 2 examples`)
      for (const ex of item.examples) {
        if (bracketCount(ex.en) !== 1) errors.push(`${where}: example phải có đúng 1 [..] — "${ex.en}"`)
        if (!ex.vi.trim()) errors.push(`${where}: example thiếu vi`)
      }
      const head = item.term.toLowerCase().split(/\s+/)[0]
      if (head.length > 3 && item.def.toLowerCase().includes(head))
        warnings.push(`${where}: def có chứa "${head}"`)
    } else {
      patterns++
      if (item.drills.length < 4) errors.push(`${where}: cần >= 4 drills`)
      item.drills.forEach((d, i) => checkDrill(d, `${where} › drill ${i}`))
    }
  }
  for (const t of unit.aiTasks) {
    tasks++
    unique(t.id, `${f} › ${t.id}`)
    if (t.kind === 'translation' && !t.source) errors.push(`${f} › ${t.id}: translation thiếu source`)
  }
}

console.log(`${files.length} unit · ${vocab} từ · ${patterns} mẫu câu · ${drills} drill · ${tasks} bài AI`)
warnings.forEach((w) => console.log('WARN ', w))
errors.forEach((e) => console.log('ERROR', e))
process.exit(errors.length ? 1 : 0)
