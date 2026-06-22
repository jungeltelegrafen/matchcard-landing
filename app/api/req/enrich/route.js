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

export async function POST(request) {
  let body
  try { body = await request.json() } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  const { query } = body
  if (!query?.trim()) return Response.json({ error: 'No query' }, { status: 400, headers: CORS })

  // ── Option 1: Tavily (real-time web search) ───────────────────────────────
  if (process.env.TAVILY_API_KEY) {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: `${query} selskap Norge`,
          search_depth: 'advanced',
          max_results: 3,
          include_answer: true,
          exclude_domains: ['linkedin.com'],
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const parts = []
        if (data.answer) parts.push(data.answer)
        if (data.results?.[0]?.content) parts.push(data.results[0].content.slice(0, 400))
        const summary = parts.join('\n\n').trim()
        if (summary) return Response.json({ summary }, { headers: CORS })
      }
    } catch { /* fall through */ }
  }

  // ── Option 2: Claude with web_search tool ─────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Ingen søke-API konfigurert' }, { status: 503, headers: CORS })
  }

  const userPrompt = `Finn informasjon om selskapet "${query}" i Norge. Skriv 2–5 korte, presise setninger om hvem de er, hva de gjør, bransje, størrelse og hva slags IT-kompetanse de typisk trenger. Svar på norsk.`

  // Try with web_search tool first (real-time results)
  try {
    const messages = [{ role: 'user', content: userPrompt }]
    const tools = [{ type: 'web_search_20250305', name: 'web_search' }]

    let response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      tools,
      messages,
    })

    // Handle tool use loop (max 2 more turns)
    for (let i = 0; i < 2 && response.stop_reason === 'tool_use'; i++) {
      messages.push({ role: 'assistant', content: response.content })
      const toolResults = response.content
        .filter(b => b.type === 'tool_use')
        .map(b => ({ type: 'tool_result', tool_use_id: b.id, content: 'Search completed.' }))
      messages.push({ role: 'user', content: toolResults })
      response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
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

  // ── Option 3: Claude knowledge fallback ───────────────────────────────────
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: userPrompt + '\n\nHvis du ikke har nok informasjon, si det kort og ærlig.',
      }],
    })
    const summary = message.content[0]?.text?.trim()
    if (summary) return Response.json({ summary }, { headers: CORS })
  } catch (e) {
    return Response.json({ error: 'Søk feilet', detail: e.message }, { status: 500, headers: CORS })
  }

  return Response.json({ error: 'Ingen resultater' }, { status: 500, headers: CORS })
}
