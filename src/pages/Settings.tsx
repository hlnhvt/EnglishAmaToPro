import { Check, Download, Monitor, Moon, Sun, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button, Card, cx, PageHeader, Segmented, toast } from '../components/ui.tsx'
import { TOPICS } from '../content/index.ts'
import { dayKey } from '../lib/date.ts'
import { loadVoices, recognitionSupported, speak } from '../lib/speech.ts'
import { useStore, type ThemePref } from '../lib/store.ts'

function Row({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-line py-5 last:border-0 md:flex-row md:items-center md:justify-between">
      <div className="max-w-md">
        <div className="text-[15px] font-medium">{title}</div>
        {desc && <div className="mt-0.5 text-[13px] text-muted">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={cx('relative h-6 w-11 rounded-full transition-colors', on ? 'bg-ink' : 'bg-line-2')} role="switch" aria-checked={on}>
      <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}

export function SettingsPage() {
  const s = useStore()
  const { profile, settings, setProfile, setSettings } = s
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void loadVoices().then(setVoices)
  }, [])

  const exportData = () => {
    const raw = localStorage.getItem('amatopro:v1') ?? '{}'
    const blob = new Blob([raw], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `amatopro-backup-${dayKey()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importData = async (f: File) => {
    try {
      const json = JSON.parse(await f.text())
      if (!confirm('Dữ liệu hiện tại sẽ bị thay bằng file sao lưu. Tiếp tục?')) return
      s.importData(json)
      toast('Đã khôi phục dữ liệu')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'File không hợp lệ')
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Tuỳ chỉnh" title="Cài đặt" />

      <Card className="mb-4 px-6">
        <Row title="Tên của bạn">
          <input value={profile.name} onChange={(e) => setProfile({ name: e.target.value })} className="h-10 w-56 rounded-xl border border-line-2 bg-paper px-3 text-[14px] outline-none focus:border-ink/50" />
        </Row>
        <Row title="Thời gian học mỗi ngày" desc="Mục tiêu mặc định cho buổi học.">
          <Segmented value={profile.dailyMinutes} onChange={(v) => setProfile({ dailyMinutes: v })} options={[15, 30, 45, 60].map((m) => ({ value: m, label: `${m}′` }))} />
        </Row>
        <div className="border-b border-line py-5">
          <div className="text-[15px] font-medium">Chủ đề ưu tiên</div>
          <div className="mt-0.5 text-[13px] text-muted">Unit thuộc chủ đề này được học trước trong cùng trình độ.</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const on = profile.topics.includes(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => setProfile({ topics: on ? profile.topics.filter((x) => x !== t.id) : [...profile.topics, t.id] })}
                  className={cx('flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] transition-colors', on ? 'border-ink bg-ink text-paper' : 'border-line-2 text-ink-2 hover:border-ink/40')}
                >
                  {on && <Check size={13} strokeWidth={2.5} />}
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
        <Row title="Giao diện">
          <Segmented<ThemePref>
            value={settings.theme}
            onChange={(v) => setSettings({ theme: v })}
            options={[
              { value: 'light', label: <Sun size={15} strokeWidth={1.75} /> },
              { value: 'system', label: <Monitor size={15} strokeWidth={1.75} /> },
              { value: 'dark', label: <Moon size={15} strokeWidth={1.75} /> },
            ]}
          />
        </Row>
        <Row title="Âm báo đúng / sai">
          <Toggle on={settings.sound} onChange={(v) => setSettings({ sound: v })} />
        </Row>
      </Card>

      <Card className="mb-4 px-6">
        <Row title="Giọng đọc" desc="Giọng có chữ Natural / Online thường tự nhiên hơn (tuỳ trình duyệt và hệ điều hành).">
          <div className="flex items-center gap-2">
            <select value={settings.voiceURI ?? ''} onChange={(e) => setSettings({ voiceURI: e.target.value || undefined })} className="h-10 max-w-64 rounded-xl border border-line-2 bg-paper px-3 text-[13px] outline-none">
              <option value="">Tự chọn</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={() => speak('Could you clarify the acceptance criteria for this user story?', { rate: settings.rate, voiceURI: settings.voiceURI })}>
              Nghe thử
            </Button>
          </div>
        </Row>
        <Row title="Tốc độ đọc" desc={`${settings.rate.toFixed(2)}×`}>
          <input type="range" min={0.6} max={1.2} step={0.05} value={settings.rate} onChange={(e) => setSettings({ rate: Number(e.target.value) })} className="w-56 accent-[var(--c-accent)]" />
        </Row>
        <Row title="Bài luyện nói" desc={recognitionSupported() ? 'Thêm bài nói theo vào buổi học từ 30 phút.' : 'Trình duyệt này không hỗ trợ nhận giọng nói. Hãy dùng Chrome hoặc Edge.'}>
          <Toggle on={settings.speaking} onChange={(v) => setSettings({ speaking: v })} />
        </Row>
      </Card>

      <Card className="px-6">
        <Row title="Sao lưu dữ liệu" desc="Mọi tiến độ chỉ lưu trong trình duyệt này (localStorage). Xoá dữ liệu trình duyệt là mất — hãy sao lưu định kỳ.">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportData} icon={<Download size={14} strokeWidth={1.75} />}>
              Xuất file
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} icon={<Upload size={14} strokeWidth={1.75} />}>
              Nhập file
            </Button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
          </div>
        </Row>
        <Row title="Xoá toàn bộ dữ liệu" desc="Bắt đầu lại từ đầu. Không thể hoàn tác.">
          <Button
            variant="ghost"
            size="sm"
            className="text-bad"
            onClick={() => {
              if (confirm('Xoá toàn bộ tiến độ học? Không thể hoàn tác.') && confirm('Chắc chắn chứ?')) {
                s.resetAll()
                window.location.hash = '/'
              }
            }}
          >
            Xoá dữ liệu
          </Button>
        </Row>
      </Card>
    </div>
  )
}
