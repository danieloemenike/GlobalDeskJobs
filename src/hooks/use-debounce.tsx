/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-debounce.ts
import { useCallback, useRef } from 'react'

type AnyFunction = (...args: any[]) => void

export function useDebounce<T extends AnyFunction>(
  callback: T,
  delay: number = 0 //increase this when there is an endpoint 
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }) as T,
    [callback, delay]
  )
}