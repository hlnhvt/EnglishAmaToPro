const pad = (n: number) => String(n).padStart(2, '0')

/** Khoá ngày theo giờ địa phương: 2026-10-20 */
export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key: string, n: number): string {
  const d = fromDayKey(key)
  d.setDate(d.getDate() + n)
  return dayKey(d)
}

/** Số ngày từ a đến b (b - a) */
export function diffDays(a: string, b: string): number {
  return Math.round((fromDayKey(b).getTime() - fromDayKey(a).getTime()) / 86_400_000)
}

const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
export const WEEKDAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export function formatLongVi(d: Date = new Date()): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} tháng ${d.getMonth() + 1}`
}

export function greeting(d: Date = new Date()): string {
  const h = d.getHours()
  if (h < 11) return 'Chào buổi sáng'
  if (h < 14) return 'Chào buổi trưa'
  if (h < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

/** "hôm nay", "ngày mai", "3 ngày nữa", "quá hạn" */
export function relativeDue(due: string | Date, now = new Date()): string {
  const days = diffDays(dayKey(now), dayKey(new Date(due)))
  if (days < 0) return 'quá hạn'
  if (days === 0) return 'hôm nay'
  if (days === 1) return 'ngày mai'
  if (days < 30) return `${days} ngày nữa`
  return `${Math.round(days / 30)} tháng nữa`
}
