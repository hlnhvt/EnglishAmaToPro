// Âm báo nhỏ bằng WebAudio, không cần file âm thanh.

let ctx: AudioContext | null = null

function ac(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, dur: number, gain = 0.06, type: OscillatorType = 'sine') {
  const c = ac()
  if (!c) return
  const t = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

export const sfx = {
  correct() {
    tone(660, 0, 0.12)
    tone(990, 0.08, 0.18)
  },
  almost() {
    tone(587, 0, 0.16)
  },
  wrong() {
    tone(196, 0, 0.18, 0.05, 'triangle')
  },
  finish() {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.26, 0.05))
  },
}
