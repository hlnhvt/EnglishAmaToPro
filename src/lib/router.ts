import { useSyncExternalStore } from 'react'

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getHash = () => window.location.hash

/** '#/unit/u01' → ['unit', 'u01'] */
export function useRoute(): string[] {
  const hash = useSyncExternalStore(subscribe, getHash)
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean)
}

export function go(path: string): void {
  window.location.hash = path.startsWith('/') ? path : `/${path}`
  window.scrollTo({ top: 0 })
}
