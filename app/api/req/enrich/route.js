// Client enrichment via Tavily Search API.
// Set TAVILY_API_KEY in .env.local to enable.
// Get a free key at: https://tavily.com (1 000 requests/month free tier)
//
// Alternative: swap the fetch call below for Perplexity API if preferred —
// endpoint: https://api.perplexity.ai/chat/completions, model: sonar-pro.
// Perplexity returns a conversational answer; Tavily returns structured snippets.
// Both work. Tavily is the better default for structured company data extraction.

const CORS = {
  'Access-Control-Allow-Origin': 'https://jungeltelegrafen.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET() {
  return Response.json({ ok: true, configured: Boolean(process.env.TAVILY_API_KEY) }, { headers: CORS })
}

export async function POST(request) {
  if (!process.env.TAVILY_API_KEY) {
    return Response.json({ error: 'TAVILY_API_KEY not configured' }, { status: 503, headers: CORS })
  }

  let body
  try { body = await request.json() } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  const { query } = body
  if (!query?.trim()) return Response.json({ error: 'No query' }, { status: 400, headers: CORS })

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: `${query} selskap Norge`,
      search_depth: 'advanced',
      max_results: 3,
      include_answer: true,
      include_domains: [],
      exclude_domains: ['linkedin.com'],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return Response.json({ error: `Tavily feil: ${err}` }, { status: 502, headers: CORS })
  }

  const data = await res.json()

  const parts = []
  if (data.answer)                 parts.push(data.answer)
  if (data.results?.[0]?.content) parts.push(data.results[0].content.slice(0, 400))

  return Response.json({ summary: parts.join('\n\n').trim() }, { headers: CORS })
}
