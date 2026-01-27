import { useState, useCallback } from 'react'

const DATAMUSE_BASE = 'https://api.datamuse.com/words'

export function useRhymeFinder() {
  const [word, setWord] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchRhymes = useCallback(async (searchWord) => {
    const trimmed = searchWord.trim().toLowerCase()
    if (!trimmed) {
      setResults(null)
      return
    }

    setLoading(true)
    setError(null)
    setWord(trimmed)

    try {
      // Fetch perfect rhymes and near rhymes in parallel
      const [perfectRes, nearRes] = await Promise.all([
        fetch(`${DATAMUSE_BASE}?rel_rhy=${encodeURIComponent(trimmed)}&max=50`),
        fetch(`${DATAMUSE_BASE}?rel_nry=${encodeURIComponent(trimmed)}&max=30`),
      ])

      if (!perfectRes.ok || !nearRes.ok) {
        throw new Error('Failed to fetch rhymes')
      }

      const [perfectData, nearData] = await Promise.all([
        perfectRes.json(),
        nearRes.json(),
      ])

      // Extract words and remove duplicates
      const perfectWords = perfectData.map((item) => item.word)
      const perfectSet = new Set(perfectWords)
      const nearWords = nearData
        .map((item) => item.word)
        .filter((w) => !perfectSet.has(w))

      setResults({
        perfect: perfectWords,
        near: nearWords,
      })
    } catch (err) {
      setError(err.message || 'Failed to fetch rhymes')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setWord('')
    setResults(null)
    setError(null)
  }, [])

  return {
    word,
    results,
    loading,
    error,
    searchRhymes,
    clear,
  }
}
