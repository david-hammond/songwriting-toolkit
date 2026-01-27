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
      // Fetch all rhyme types in parallel
      const [perfectRes, nearRes, slantRes, homophoneRes] = await Promise.all([
        fetch(`${DATAMUSE_BASE}?rel_rhy=${encodeURIComponent(trimmed)}&max=40`),
        fetch(`${DATAMUSE_BASE}?rel_nry=${encodeURIComponent(trimmed)}&max=25`),
        fetch(`${DATAMUSE_BASE}?rel_cns=${encodeURIComponent(trimmed)}&max=25`),
        fetch(`${DATAMUSE_BASE}?rel_hom=${encodeURIComponent(trimmed)}&max=10`),
      ])

      if (!perfectRes.ok || !nearRes.ok || !slantRes.ok || !homophoneRes.ok) {
        throw new Error('Failed to fetch rhymes')
      }

      const [perfectData, nearData, slantData, homophoneData] = await Promise.all([
        perfectRes.json(),
        nearRes.json(),
        slantRes.json(),
        homophoneRes.json(),
      ])

      // Extract words and remove duplicates across categories
      const perfectWords = perfectData.map((item) => item.word)
      const seenWords = new Set(perfectWords)

      const nearWords = nearData
        .map((item) => item.word)
        .filter((w) => {
          if (seenWords.has(w)) return false
          seenWords.add(w)
          return true
        })

      const slantWords = slantData
        .map((item) => item.word)
        .filter((w) => {
          if (seenWords.has(w)) return false
          seenWords.add(w)
          return true
        })

      const homophoneWords = homophoneData
        .map((item) => item.word)
        .filter((w) => {
          if (seenWords.has(w)) return false
          seenWords.add(w)
          return true
        })

      setResults({
        perfect: perfectWords,
        near: nearWords,
        slant: slantWords,
        homophones: homophoneWords,
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
