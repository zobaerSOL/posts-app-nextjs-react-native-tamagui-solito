// Client-side loading helpers for native screens (native has no server to fetch on).
import { Paragraph, Spinner, YStack } from '@my/ui'
import { useEffect, useState } from 'react'

export function useAsync<T>(load: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<string>()
  useEffect(() => {
    let alive = true
    load()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(String(e.message ?? e)))
    return () => {
      alive = false
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return { data, error }
}

export function Status({ error }: { error?: string }) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$4"
    >
      {error ? <Paragraph color="$red10">{error}</Paragraph> : <Spinner />}
    </YStack>
  )
}
