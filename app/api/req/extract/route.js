import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CORS = {
  'Access-Control-Allow-Origin': 'https://jungeltelegrafen.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

const SYSTEM = `Du er en assistent som hjelper norske IT-rekrutterere med å strukturere klientbehov.
Bruk norsk i alle feltverdier. Les kildemateriell på norsk eller engelsk og svar alltid på norsk.
NC er et norsk IT-bemanningsbyrå som matcher riktig konsulent til kundens behov — ikke et leveranseselskap.
Svar BARE med gyldig JSON, ingen forklaring, ingen markdown-blokker.`

const FILL_SCHEMA = `{
  "rolle": "",
  "antallKonsulenter": "",
  "stillingsprosent": "",
  "oppstartsdato": "",
  "varighet": "",
  "arbeidslokasjon": "",
  "onsiteRemote": "Hybrid",
  "senioritet": "",
  "spraakkrav": "",
  "budsjett": "",
  "leveransefristCver": "",
  "kjernenIBehovet": "",
  "hvaUtlosteBehovet": "",
  "kundebeskrivelse": "",
  "prosjektbeskrivelse": "",
  "teambeskrivelse": "",
  "arbeidsoppgaver": "",
  "maHa": [],
  "fintAHa": [],
  "personligeEgenskaper": "",
  "sellingPoints": "",
  "prosessenVidere": "",
  "andreLeverandorer": "",
  "andreKandidater": "",
  "annet": "",
  "generelleNotater": ""
}`

// Health check + availability probe
export async function GET() {
  return Response.json({ ok: true, configured: Boolean(process.env.ANTHROPIC_API_KEY) }, { headers: CORS })
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 503, headers: CORS })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { text, mode = 'fill' } = body
  if (!text?.trim()) return Response.json({ error: 'No text provided' }, { status: 400 })

  const userPrompt = mode === 'distill'
    ? `Basert på følgende informasjon om konsulentbehovet, generer:
1. "kjernenIBehovet": 1–2 setninger som destillerer essensen av behovet klart og presist
2. "maHa": de 3 viktigste kompetansekravene som strenge strenger i en liste

Svar med JSON som BARE inneholder disse to feltene.

INFORMASJON:
${text.slice(0, 8000)}`
    : `Ekstraher all tilgjengelig informasjon fra følgende kildemateriell og fyll ut feltene nedenfor.
Bruk null for felt du ikke kan finne. Ikke finn på informasjon.
onsiteRemote må være en av: "Onsite", "Remote", "Hybrid".
maHa og fintAHa skal være lister med strenger.

Returner BARE dette JSON-skjemaet utfylt:
${FILL_SCHEMA}

KILDEMATERIELL:
${text.slice(0, 12000)}`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const raw  = message.content[0].text.trim()
      .replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
    const data = JSON.parse(raw)

    return Response.json(data, { headers: CORS })
  } catch (e) {
    console.error('Extract error:', e)
    return Response.json({ error: 'Extraction failed', detail: e.message }, { status: 500, headers: CORS })
  }
}
