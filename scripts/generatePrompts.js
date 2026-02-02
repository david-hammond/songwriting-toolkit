import Anthropic from '@anthropic-ai/sdk'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '..', 'public', 'data', 'prompts.json')

const SYSTEM_PROMPT = `You are helping create writing prompts for songwriters doing object writing exercises.

Object writing is a technique where writers explore a topic using all their senses (sight, sound, taste, touch, smell) plus motion and emotion. The goal is to generate evocative, specific prompts that spark sensory exploration.

Generate diverse prompts across these categories:
- Physical everyday objects (kitchen items, tools, clothing, furniture, electronics)
- Natural objects (plants, rocks, weather phenomena, water, earth, sky)
- Conceptual/emotional (loneliness, anticipation, regret, hope, jealousy, nostalgia)
- Adjective + physical (rusty gate, cracked mirror, faded photograph, sticky counter)
- Settings/places (hospital, bar, bedroom, street corner, park, train station)
- Sensory experiences (sounds, smells, textures, tastes, visual details)
- Time-specific moments (3am, Sunday morning, midnight, dawn, dusk)
- Body/physical sensations (heartbeat, breath, tension, warmth, cold)
- Memory triggers (childhood items, old songs, familiar scents)
- Urban/modern life (traffic, neon signs, concrete, wifi, screens)
- Nature (seasons, animals, landscapes, storms, silence)
- Human interactions (handshakes, eye contact, whispers, crowds)

Guidelines:
- Be specific and evocative, not generic
- Avoid clichés and overused songwriting tropes
- Mix simple (one word) with complex (short phrases)
- Include some unexpected or unusual prompts
- Prompts should spark sensory exploration, not complete song ideas
- Vary between concrete physical objects, conceptual ideas, and sensory experiences`

async function generateBatch(client, batchNumber, promptsPerBatch) {
  console.log(`  Generating batch ${batchNumber}...`)

  const response = await client.messages.create({
    model: 'claude-3-5-haiku-latest',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate exactly ${promptsPerBatch} object writing prompts. Return them as a JSON array of strings, nothing else. No markdown, no explanation, just the JSON array.

Example format:
["cigarette smoke", "hospital waiting room", "rust on metal", "fluorescent light hum"]

Generate ${promptsPerBatch} diverse, evocative prompts now:`,
      },
    ],
  })

  const content = response.content[0].text.trim()

  // Parse the JSON response
  let prompts
  try {
    prompts = JSON.parse(content)
  } catch (parseError) {
    // Try to extract JSON array if wrapped in other text
    const match = content.match(/\[[\s\S]*\]/)
    if (match) {
      prompts = JSON.parse(match[0])
    } else {
      throw new Error('Could not parse prompts from response')
    }
  }

  if (!Array.isArray(prompts) || prompts.length === 0) {
    throw new Error('Invalid prompts format received')
  }

  console.log(`  ✓ Batch ${batchNumber}: ${prompts.length} prompts`)
  return prompts
}

async function generatePrompts() {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required')
    console.error('Usage: ANTHROPIC_API_KEY=your-key npm run generate')
    process.exit(1)
  }

  const client = new Anthropic({ apiKey })

  const TOTAL_PROMPTS = 5000
  const PROMPTS_PER_BATCH = 500
  const BATCHES = Math.ceil(TOTAL_PROMPTS / PROMPTS_PER_BATCH)

  console.log(`Generating ${TOTAL_PROMPTS} prompts with Claude Haiku...`)
  console.log(`Using ${BATCHES} batches of ${PROMPTS_PER_BATCH} prompts each\n`)

  try {
    const allPrompts = []

    for (let i = 1; i <= BATCHES; i++) {
      const batch = await generateBatch(client, i, PROMPTS_PER_BATCH)
      allPrompts.push(...batch)

      // Small delay to avoid rate limits
      if (i < BATCHES) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Remove duplicates
    const uniquePrompts = [...new Set(allPrompts)]

    console.log(`\n✓ Generated ${allPrompts.length} total prompts`)
    console.log(`✓ ${uniquePrompts.length} unique prompts (removed ${allPrompts.length - uniquePrompts.length} duplicates)`)

    // Ensure output directory exists
    const outputDir = dirname(OUTPUT_PATH)
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // Write prompts to file
    writeFileSync(OUTPUT_PATH, JSON.stringify(uniquePrompts, null, 2))

    console.log(`\n✅ Successfully saved to: ${OUTPUT_PATH}`)
  } catch (error) {
    console.error('\n❌ Error generating prompts:', error.message)
    process.exit(1)
  }
}

generatePrompts()
