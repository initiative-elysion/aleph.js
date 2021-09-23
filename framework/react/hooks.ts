import type { RouterURL } from '../../types.d.ts'
import { useContext, useMemo } from 'https://esm.sh/react@17.0.2'
import util from '../../shared/util.ts'
import events from '../core/events.ts'
import { RouterContext, SSRContext } from './context.ts'
import { inDeno } from './helper.ts'

export class AsyncUseDenoError extends Error { }

/**
 * `useRouter` returns current `RouterURL` of page routing.
 *
 * ```tsx
 * export default function App() {
 *   const { locale, pathname, routePath, params, query } = useRouter()
 *   return <p>{pathname}</p>
 * }
 * ```
 */
export function useRouter(): RouterURL {
  return useContext(RouterContext)
}

/**
 * `useDeno` hacks in Deno runtime at build time(SSR).
 *
 * ```tsx
 * export default function App() {
 *   const version = useDeno(() => Deno.version.deno)
 *   return <p>{version}</p>
 * }
 * ```
 */
export function useDeno<T = any>(callback: (request: Request) => (T | Promise<T>), options?: { key?: string | number, revalidate?: number | boolean | { date: number } }): T {
  const { key, revalidate } = options || {}
  const uuid = arguments[2] // generated by compiler
  const id = useMemo(() => [uuid, key].filter(Boolean).join('-'), [key])
  const { request, dataCache } = useContext(SSRContext)
  const router = useRouter()

  return useMemo(() => {
    const href = router.toString()
    const dataUrl = `pagedata://${href}`

    if (inDeno) {
      if (id in dataCache) {
        return dataCache[id]  // 2+ pass
      }

      let expires = 0
      if (util.isNumber(revalidate)) {
        expires = Date.now() + Math.round(revalidate * 1000)
      } else if (revalidate === true) {
        expires = Date.now() - 1000
      } else if (util.isPlainObject(revalidate) && util.isNumber(revalidate.date)) {
        expires = revalidate.date
      }
      const value = callback(request)
      events.emit(`useDeno-${dataUrl}`, { id, value, expires })

      // thow an `AsyncUseDenoError` to break current rendering
      if (value instanceof Promise) {
        throw new AsyncUseDenoError()
      }

      dataCache[id] = value
      return value
    }

    const data = (window as any)[`${dataUrl}#${id}`]
    return data?.value
  }, [id, router, dataCache, request])
}
