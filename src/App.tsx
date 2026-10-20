import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { Shell } from './components/Shell.tsx'
import { Toaster } from './components/ui.tsx'
import { useRoute } from './lib/router.ts'
import { useStore } from './lib/store.ts'
import { AiPage } from './pages/Ai.tsx'
import { AiTaskPage } from './pages/AiTask.tsx'
import { Onboarding } from './pages/Onboarding.tsx'
import { PathPage } from './pages/Path.tsx'
import { ProgressPage } from './pages/Progress.tsx'
import { SessionPage } from './pages/Session.tsx'
import { SettingsPage } from './pages/Settings.tsx'
import { Today } from './pages/Today.tsx'
import { UnitPage } from './pages/Unit.tsx'
import { WordsPage } from './pages/Words.tsx'

function useTheme() {
  const theme = useStore((s) => s.settings.theme)
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const t = theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme
      document.documentElement.dataset.theme = t
      document.querySelector('meta[name=theme-color]')?.setAttribute('content', t === 'dark' ? '#121110' : '#F3EFE6')
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])
}

export default function App() {
  useTheme()
  const onboarded = useStore((s) => s.profile.onboarded)
  const [page, param] = useRoute()

  if (!onboarded) return <Onboarding />

  if (page === 'session') {
    const minutes = parseInt(param ?? '') || 0
    return (
      <>
        <SessionPage key={param} minutes={minutes} />
        <Toaster />
      </>
    )
  }

  let content
  switch (page) {
    case 'path':
      content = <PathPage />
      break
    case 'unit':
      content = <UnitPage id={param} />
      break
    case 'words':
      content = <WordsPage />
      break
    case 'ai':
      content = param ? <AiTaskPage id={param} /> : <AiPage />
      break
    case 'progress':
      content = <ProgressPage />
      break
    case 'settings':
      content = <SettingsPage />
      break
    default:
      content = <Today />
  }

  return (
    <Shell active={page ?? ''}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${page}/${param ?? ''}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
      <Toaster />
    </Shell>
  )
}
