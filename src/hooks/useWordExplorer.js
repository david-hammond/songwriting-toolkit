import { useState, useCallback } from 'react'

const DATAMUSE_BASE = 'https://api.datamuse.com/words'

const MODES = {
  rhymes: {
    label: 'Rhymes',
    fetch: async (word) => {
      const [perfectRes, nearRes, slantRes] = await Promise.all([
        fetch(`${DATAMUSE_BASE}?rel_rhy=${encodeURIComponent(word)}&max=40`),
        fetch(`${DATAMUSE_BASE}?rel_nry=${encodeURIComponent(word)}&max=25`),
        fetch(`${DATAMUSE_BASE}?rel_cns=${encodeURIComponent(word)}&max=25`),
      ])

      const [perfectData, nearData, slantData] = await Promise.all([
        perfectRes.json(),
        nearRes.json(),
        slantRes.json(),
      ])

      const perfectWords = perfectData.map((item) => item.word)
      const seenWords = new Set(perfectWords)

      const nearWords = nearData
        .map((item) => item.word)
        .filter((w) => !seenWords.has(w) && seenWords.add(w))

      const slantWords = slantData
        .map((item) => item.word)
        .filter((w) => !seenWords.has(w) && seenWords.add(w))

      return {
        sections: [
          { title: 'Perfect Rhymes', words: perfectWords, color: 'perfect' },
          { title: 'Near Rhymes', words: nearWords, color: 'near' },
          { title: 'Slant Rhymes', words: slantWords, color: 'slant' },
        ],
      }
    },
  },
  synonyms: {
    label: 'Synonyms',
    fetch: async (word) => {
      const [synRes, simRes] = await Promise.all([
        fetch(`${DATAMUSE_BASE}?rel_syn=${encodeURIComponent(word)}&max=40`),
        fetch(`${DATAMUSE_BASE}?ml=${encodeURIComponent(word)}&max=30`),
      ])

      const [synData, simData] = await Promise.all([synRes.json(), simRes.json()])

      const synWords = synData.map((item) => item.word)
      const seenWords = new Set(synWords)

      const simWords = simData
        .map((item) => item.word)
        .filter((w) => w !== word && !seenWords.has(w) && seenWords.add(w))

      return {
        sections: [
          { title: 'Synonyms', words: synWords, color: 'perfect' },
          { title: 'Similar Meaning', words: simWords, color: 'near' },
        ],
      }
    },
  },
  related: {
    label: 'Related',
    fetch: async (word) => {
      const [triggerRes, assocRes, kindRes] = await Promise.all([
        fetch(`${DATAMUSE_BASE}?rel_trg=${encodeURIComponent(word)}&max=30`),
        fetch(`${DATAMUSE_BASE}?rel_bga=${encodeURIComponent(word)}&max=20`),
        fetch(`${DATAMUSE_BASE}?rel_spc=${encodeURIComponent(word)}&max=20`),
      ])

      const [triggerData, assocData, kindData] = await Promise.all([
        triggerRes.json(),
        assocRes.json(),
        kindRes.json(),
      ])

      const seenWords = new Set()

      const triggerWords = triggerData
        .map((item) => item.word)
        .filter((w) => !seenWords.has(w) && seenWords.add(w))

      const assocWords = assocData
        .map((item) => item.word)
        .filter((w) => !seenWords.has(w) && seenWords.add(w))

      const kindWords = kindData
        .map((item) => item.word)
        .filter((w) => !seenWords.has(w) && seenWords.add(w))

      return {
        sections: [
          { title: 'Associated Words', words: triggerWords, color: 'perfect' },
          { title: 'Often Follows', words: assocWords, color: 'near' },
          { title: 'Types Of', words: kindWords, color: 'slant' },
        ],
      }
    },
  },
  adjectives: {
    label: 'Descriptors',
    fetch: async (word) => {
      const [adjRes, nounRes] = await Promise.all([
        fetch(`${DATAMUSE_BASE}?rel_jjb=${encodeURIComponent(word)}&max=40`),
        fetch(`${DATAMUSE_BASE}?rel_jja=${encodeURIComponent(word)}&max=30`),
      ])

      const [adjData, nounData] = await Promise.all([adjRes.json(), nounRes.json()])

      return {
        sections: [
          { title: 'Adjectives For This', words: adjData.map((item) => item.word), color: 'perfect' },
          { title: 'Nouns Described By This', words: nounData.map((item) => item.word), color: 'near' },
        ],
      }
    },
  },
}

export function useWordExplorer() {
  const [word, setWord] = useState('')
  const [mode, setMode] = useState('rhymes')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (searchWord, searchMode) => {
    const trimmed = searchWord.trim().toLowerCase()
    if (!trimmed) {
      setResults(null)
      return
    }

    setLoading(true)
    setError(null)
    setWord(trimmed)

    try {
      const modeConfig = MODES[searchMode]
      const data = await modeConfig.fetch(trimmed)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch results')
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
    mode,
    setMode,
    results,
    loading,
    error,
    search,
    clear,
    modes: Object.entries(MODES).map(([key, val]) => ({ key, label: val.label })),
  }
}
