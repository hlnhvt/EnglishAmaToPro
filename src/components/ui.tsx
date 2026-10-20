import { motion, AnimatePresence } from 'motion/react'
import { Volume2 } from 'lucide-react'
import { create } from 'zustand'
import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { speak } from '../lib/speech.ts'
import { useStore } from '../lib/store.ts'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'soft'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink/90 shadow-[0_1px_0_0_rgba(0,0,0,.25)]',
  accent: 'bg-accent text-accent-ink hover:brightness-105 shadow-[0_2px_0_0_rgba(0,0,0,.18)]',
  outline: 'border border-line-2 bg-card text-ink hover:border-ink/40',
  ghost: 'text-ink-2 hover:bg-sunk hover:text-ink',
  soft: 'bg-sunk text-ink hover:bg-line/70',
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  kbd?: string
}

export function Button({ variant = 'primary', size = 'md', icon, kbd, className, children, ...rest }: BtnProps) {
  const sizes = { sm: 'h-8 px-3 text-[13px] gap-1.5', md: 'h-10 px-4 text-sm gap-2', lg: 'h-12 px-5 text-[15px] gap-2.5' }
  return (
    <button
      {...rest}
      className={cx(
        'inline-flex select-none items-center justify-center rounded-[10px] font-medium transition-all duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-40',
        sizes[size],
        VARIANTS[variant],
        className,
      )}
    >
      {icon}
      {children}
      {kbd && <Kbd className="ml-1 opacity-60">{kbd}</Kbd>}
    </button>
  )
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cx('rounded border border-current/25 px-1 font-mono text-[10px] leading-4 tracking-normal', className)}>
      {children}
    </kbd>
  )
}

export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={cx('rounded-2xl border border-line bg-card', className)}>
      {children}
    </div>
  )
}

export function Tag({ children, tone = 'plain', className }: { children: ReactNode; tone?: 'plain' | 'accent' | 'good' | 'bad' | 'warn'; className?: string }) {
  const tones = {
    plain: 'border-line-2 text-ink-2',
    accent: 'border-accent/40 text-accent bg-accent-soft/60',
    good: 'border-good/30 text-good bg-good-soft',
    bad: 'border-bad/30 text-bad bg-bad-soft',
    warn: 'border-warn/30 text-warn bg-warn-soft',
  }
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider', tones[tone], className)}>
      {children}
    </span>
  )
}

export function Bar({ value, className, tone = 'ink' }: { value: number; className?: string; tone?: 'ink' | 'accent' | 'good' }) {
  const c = { ink: 'bg-ink', accent: 'bg-accent', good: 'bg-good' }[tone]
  return (
    <div className={cx('h-1.5 overflow-hidden rounded-full bg-sunk', className)}>
      <motion.div
        className={cx('h-full rounded-full', c)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
      />
    </div>
  )
}

export function Ring({ value, size = 56, stroke = 5, children, tone = 'accent' }: { value: number; size?: number; stroke?: number; children?: ReactNode; tone?: 'accent' | 'good' | 'ink' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const color = { accent: 'var(--c-accent)', good: 'var(--c-good)', ink: 'var(--c-ink)' }[tone]
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--c-sunk)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.max(0, Math.min(1, value))) }}
          transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

export function Segmented<T extends string | number>({ value, options, onChange, className }: { value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={cx('relative inline-flex rounded-xl border border-line bg-sunk p-1', className)}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={cx('relative z-10 h-8 rounded-lg px-3 text-[13px] font-medium transition-colors', o.value === value ? 'text-ink' : 'text-muted hover:text-ink-2')}
        >
          {o.value === value && (
            <motion.span layoutId={`seg-${options.map((x) => x.value).join('')}`} className="absolute inset-0 -z-10 rounded-lg border border-line bg-card shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
          )}
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function SpeakButton({ text, slow, className, size = 18, label }: { text: string; slow?: boolean; className?: string; size?: number; label?: string }) {
  const { rate, voiceURI } = useStore((s) => s.settings)
  return (
    <button
      type="button"
      title={slow ? 'Nghe chậm' : 'Nghe'}
      onClick={(e) => {
        e.stopPropagation()
        speak(text, { rate: slow ? Math.max(0.5, rate - 0.35) : rate, voiceURI })
      }}
      className={cx('inline-flex items-center gap-1.5 rounded-full text-ink-2 transition-colors hover:text-accent', className)}
    >
      <Volume2 size={size} strokeWidth={1.75} />
      {label && <span className="text-[13px]">{label}</span>}
    </button>
  )
}

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring' as const, stiffness: 260, damping: 26 },
}

export const stagger = (i: number) => ({ ...fadeUp, transition: { ...fadeUp.transition, delay: i * 0.05 } })

/** Hiển thị **in đậm** trong chuỗi */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') ? (
          <strong key={i} className="font-semibold text-ink">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

// ---- Toast ----
interface ToastState {
  msg: string | null
  n: number
  show: (msg: string) => void
}
export const useToast = create<ToastState>((set) => ({ msg: null, n: 0, show: (msg) => set((s) => ({ msg, n: s.n + 1 })) }))
export const toast = (msg: string) => useToast.getState().show(msg)

export function Toaster() {
  const { msg, n } = useToast()
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => useToast.setState({ msg: null }), 2200)
    return () => clearTimeout(t)
  }, [msg, n])
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex justify-center md:bottom-8">
      <AnimatePresence>
        {msg && (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-full bg-ink px-4 py-2 text-[13px] text-paper shadow-lg"
          >
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <motion.header {...fadeUp} className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="font-display text-[34px] leading-[1.05] tracking-[-0.02em] md:text-[42px]">{title}</h1>
      </div>
      {children}
    </motion.header>
  )
}

export function Empty({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-2 px-6 py-12 text-center">
      <div className="mb-3 text-muted">{icon}</div>
      <div className="font-medium">{title}</div>
      {children && <div className="mt-1 max-w-sm text-sm text-muted">{children}</div>}
    </div>
  )
}
