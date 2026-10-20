// Đọc to (speechSynthesis) và nhận giọng nói (Web Speech API, chủ yếu Chrome/Edge).

let cachedVoices: SpeechSynthesisVoice[] = []

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!ttsSupported()) return Promise.resolve([])
  const now = speechSynthesis.getVoices()
  if (now.length) {
    cachedVoices = now
    return Promise.resolve(englishVoices(now))
  }
  return new Promise((resolve) => {
    const done = () => {
      cachedVoices = speechSynthesis.getVoices()
      resolve(englishVoices(cachedVoices))
    }
    speechSynthesis.addEventListener('voiceschanged', done, { once: true })
    setTimeout(done, 1500)
  })
}

export function englishVoices(list = cachedVoices): SpeechSynthesisVoice[] {
  return list.filter((v) => v.lang.toLowerCase().startsWith('en'))
}

/** Ưu tiên giọng tự nhiên (Natural/Online/Google) tiếng Mỹ */
function pickVoice(uri?: string): SpeechSynthesisVoice | undefined {
  const en = englishVoices()
  if (uri) {
    const v = en.find((x) => x.voiceURI === uri)
    if (v) return v
  }
  const score = (v: SpeechSynthesisVoice) =>
    (v.lang === 'en-US' ? 4 : 0) + (/natural|online|neural/i.test(v.name) ? 3 : 0) + (/google/i.test(v.name) ? 2 : 0)
  return [...en].sort((a, b) => score(b) - score(a))[0]
}

export interface SpeakOptions {
  rate?: number
  voiceURI?: string
  onEnd?: () => void
}

export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!ttsSupported()) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const v = pickVoice(opts.voiceURI)
  if (v) {
    u.voice = v
    u.lang = v.lang
  } else {
    u.lang = 'en-US'
  }
  u.rate = opts.rate ?? 0.95
  if (opts.onEnd) u.onend = opts.onEnd
  speechSynthesis.speak(u)
}

export function stopSpeaking(): void {
  if (ttsSupported()) speechSynthesis.cancel()
}

// ---- Nhận giọng nói ----

interface RecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

type RecognitionCtor = new () => RecognitionLike

function getCtor(): RecognitionCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function recognitionSupported(): boolean {
  return typeof window !== 'undefined' && !!getCtor()
}

export interface Listening {
  result: Promise<string[]>
  stop: () => void
}

/** Nghe một lượt, trả về các phương án nhận dạng (tối đa 3) */
export function listenOnce(lang = 'en-US'): Listening {
  const Ctor = getCtor()
  if (!Ctor) return { result: Promise.reject(new Error('unsupported')), stop: () => {} }
  const rec = new Ctor()
  rec.lang = lang
  rec.interimResults = false
  rec.maxAlternatives = 3
  rec.continuous = false
  const result = new Promise<string[]>((resolve, reject) => {
    let got: string[] = []
    rec.onresult = (e) => {
      const r = e.results[0]
      got = Array.from({ length: r.length }, (_, i) => r[i].transcript)
    }
    rec.onerror = (e) => reject(new Error(e.error))
    rec.onend = () => resolve(got)
  })
  rec.start()
  return { result, stop: () => rec.stop() }
}
