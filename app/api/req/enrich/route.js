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

// ── Shared AI criteria ─────────────────────────────────────────────────────
//
// SEARCH QUERY (Tavily): "[selskap] IT-avdeling ansatte teknologi Norge"
//   → targets company IT org size, structure, and tech stack from public sources
//
// AI SYSTEM RULES:
//   - Only state facts findable in public sources (website, LinkedIn, press, annual reports)
//   - Focus: company overview + IT org (size/structure/tech) + employer branding for tech candidates
//   - Never assume what the IT dept "likely" works with based on industry logic
//   - Omit any claim that cannot be confirmed from search results — do NOT guess
//   - Write in third person, neutral and concise Norwegian
//   - If little info is available: say so honestly rather than filling gaps with speculation
//
const SYSTEM = `Du hjelper norske IT-rekrutterere med å forstå kunder bedre — basert kun på offentlig tilgjengelig informasjon.

Skriv 3–5 faktabaserte setninger på norsk om selskapet. Fokuser på:
1. Hvem de er: bransje, størrelse, markedsposisjon
2. IT-avdelingen: størrelse, struktur og teknologier — KUN det som er dokumentert fra pålitelige kilder
3. Employer branding: hvordan fremstiller selskapet seg som arbeidsgiver for tech-kandidater?

Strenge regler:
- Baser deg utelukkende på tekst du faktisk finner via søk eller i kildematerialet
- Gjør ALDRI antagelser om IT-avdelingen basert på bransjekunnskap ("de bruker trolig…", "selskaper av denne typen…")
- Utelat informasjon du ikke finner — det er bedre å si lite enn å spekulere
- Hvis du finner lite: si det ærlig i én setning ("Begrenset offentlig informasjon tilgjengelig om IT-avdelingen.")
- Skriv som om du presenterer selskapet til en kvalifisert tech-kandidat som vurderer å søke`

async function synthesize(rawContext, companyName) {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: `Selskap: "${companyName}"\n\nKildemateriale fra søk:\n${rawContext}\n\nSkriv en faktabasert kundebeskrivelse basert utelukkende på det ovenfor.`,
    }],
  })
  return message.content[0]?.text?.trim()
}

export async function POST(request) {
  let body
  try { body = await request.json() } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  const { query } = body
  if (!query?.trim()) return Response.json({ error: 'No query' }, { status: 400, headers: CORS })

  const searchQuery = `"${query}" IT-avdeling ansatte teknologi Norge`

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
          const summary = await synthesize(snippets, query)
          if (summary) return Response.json({ summary }, { headers: CORS })
        }
      }
    } catch { /* fall through */ }
  }

  // ── Option 2: Claude web_search tool ─────────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Ingen søke-API konfigurert' }, { status: 503, headers: CORS })
  }

  try {
    const messages = [{
      role: 'user',
      content: `Søk etter "${query}" og finn offentlig tilgjengelig informasjon om:\n- Selskapets størrelse, bransje og markedsposisjon\n- IT-avdelingen: størrelse, struktur, kjente teknologier (kun dokumentert)\n- Employer branding mot tech-kandidater\n\nBaser deg kun på det du faktisk finner. Ikke spekuler.`,
    }]
    const tools = [{ type: 'web_search_20250305', name: 'web_search' }]

    let response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM,
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
        system: SYSTEM,
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

  // ── Option 3: Claude knowledge fallback (no search) ──────────────────────
  // Note: explicitly tells Claude to only use confirmed knowledge, not speculate.
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: `Selskap: "${query}" (Norge)\n\nDu har ikke tilgang til live søkeresultater. Del kun det du med sikkerhet vet om dette selskapet fra treningsdata — ikke spekuler. Hvis du vet lite, si det kortfattet og ærlig.`,
      }],
    })
    const summary = message.content[0]?.text?.trim()
    if (summary) return Response.json({ summary }, { headers: CORS })
  } catch (e) {
    return Response.json({ error: 'Søk feilet', detail: e.message }, { status: 500, headers: CORS })
  }

  return Response.json({ error: 'Ingen resultater' }, { status: 500, headers: CORS })
}
