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

export async function GET() {
  const configured = Boolean(process.env.ANTHROPIC_API_KEY) || Boolean(process.env.TAVILY_API_KEY)
  return Response.json({ ok: true, configured }, { headers: CORS })
}

// ── AI system prompts ─────────────────────────────────────────────────────────
// Full criteria documented in CRITERIA.md next to this file.
const SYSTEM_NO = `Du hjelper norske IT-rekrutterere med å raskt forstå hvem kunden er.

Skriv ETT avsnitt på norsk — 2 til 5 setninger. Ingen titler, headers, markdown, eller labels av noe slag.

Innholdet skal dekke: hvem selskapet er, bransje, størrelse, markedsposisjon, eierskap og annen relevant faktabasert kontekst.

Absolutte regler:
- Kun bekreftet offentlig informasjon (selskapets nettside, presse, årsrapporter, offentlige registre)
- Ingen tech stack, ingen spesifikke teknologier eller systemvalg
- Ingen antagelser — utelat informasjon du ikke finner, spekuler aldri
- Ingen overskrifter, ingen labels, ikke start med selskapets navn etterfulgt av tankestrek eller kolon
- Hvis lite finnes: skriv det du med sikkerhet vet i 1–2 setninger`

const SYSTEM_EN = `You help IT recruiters quickly understand who the client is.

Write ONE paragraph in English — 2 to 5 sentences. No titles, headers, markdown, or labels of any kind.

Cover: who the company is, industry, size, market position, ownership and other relevant factual context.

Absolute rules:
- Only confirmed public information (company website, press, annual reports, public registers)
- No tech stack, no specific technologies or system choices
- No assumptions — omit information you cannot find, never speculate
- No headings, no labels, do not start with the company name followed by a dash or colon
- If little is available: write what you know with certainty in 1–2 sentences`

function getSystem(lang) { return lang === 'en' ? SYSTEM_EN : SYSTEM_NO }

async function synthesize(rawContext, companyName, lang) {
  const system = getSystem(lang)
  const prompt = lang === 'en'
    ? `Company: "${companyName}"\n\nSearch source material:\n${rawContext}\n\nWrite one factual paragraph (2–5 sentences) based solely on the above. No titles or labels.`
    : `Selskap: "${companyName}"\n\nKildemateriale fra søk:\n${rawContext}\n\nSkriv ett faktabasert avsnitt (2–5 setninger) basert utelukkende på det ovenfor. Ingen titler eller labels.`
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system,
    messages: [{ role: 'user', content: prompt }],
  })
  return message.content[0]?.text?.trim()
}

export async function POST(request) {
  let body
  try { body = await request.json() } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  const { query, lang = 'no' } = body
  if (!query?.trim()) return Response.json({ error: 'No query' }, { status: 400, headers: CORS })

  const searchQuery = lang === 'en'
    ? `"${query}" employees culture employer tech company`
    : `"${query}" ansatte arbeidsmiljø kultur arbeidsgiver Norge`

  // ── Option 1: Tavily → Claude synthesis ──────────────────────────────────
  if (process.env.TAVILY_API_KEY) {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: searchQuery,
          search_depth: 'advanced',
          max_results: 5,
          include_answer: false,
          exclude_domains: ['linkedin.com'],
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const snippets = (data.results || [])
          .map(r => `[${r.url}]\n${r.content}`)
          .filter(Boolean)
          .join('\n\n')
          .slice(0, 4000)

        if (snippets) {
          const summary = await synthesize(snippets, query, lang)
          if (summary) return Response.json({ summary }, { headers: CORS })
        }
      }
    } catch { /* fall through */ }
  }

  // ── Option 2: Claude web_search tool ─────────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'No search API configured' }, { status: 503, headers: CORS })
  }

  try {
    const searchPrompt = lang === 'en'
      ? `Search for "${query}" and find public information about the company: size, industry, market position, and what they communicate about their work environment and culture as a tech employer. Do not mention tech stack.`
      : `Søk etter "${query}" og finn offentlig informasjon om selskapet: størrelse, bransje, markedsposisjon, og hva de kommuniserer om arbeidsmiljø og kultur som tech-arbeidsgiver. Ikke nevn tech stack.`

    const messages = [{ role: 'user', content: searchPrompt }]
    const tools = [{ type: 'web_search_20250305', name: 'web_search' }]
    const system = getSystem(lang)

    let response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system,
      tools,
      messages,
    })

    for (let i = 0; i < 2 && response.stop_reason === 'tool_use'; i++) {
      messages.push({ role: 'assistant', content: response.content })
      const toolResults = response.content
        .filter(b => b.type === 'tool_use')
        .map(b => ({ type: 'tool_result', tool_use_id: b.id, content: 'Search completed.' }))
      messages.push({ role: 'user', content: toolResults })
      response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system,
        tools,
        messages,
      })
    }

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')
      .trim()

    if (text) return Response.json({ summary: text }, { headers: CORS })
  } catch { /* web_search tool not available — fall through */ }

  // ── Option 3: Claude knowledge fallback ──────────────────────────────────
  try {
    const fallbackPrompt = lang === 'en'
      ? `Company: "${query}". You have no live search results. Share only what you know with certainty from training data — do not speculate. No titles or labels.`
      : `Selskap: "${query}" (Norge). Du har ikke live søkeresultater. Del kun det du med sikkerhet vet fra treningsdata — ikke spekuler. Ingen titler eller labels.`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: getSystem(lang),
      messages: [{ role: 'user', content: fallbackPrompt }],
    })
    const summary = message.content[0]?.text?.trim()
    if (summary) return Response.json({ summary }, { headers: CORS })
  } catch (e) {
    return Response.json({ error: 'Search failed', detail: e.message }, { status: 500, headers: CORS })
  }

  return Response.json({ error: 'No results' }, { status: 500, headers: CORS })
}
