import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  const { text } = await request.json()
  if (!text) return Response.json({ error: 'No text provided' }, { status: 400 })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Extract the CV/resume data from the text below and return ONLY a JSON object with this exact structure. No markdown, no explanation, just the JSON.

{
  "personal": {
    "firstName": "", "lastName": "", "title": "", "email": "",
    "phone": "", "location": "", "linkedin": "", "summary": ""
  },
  "experience": [{ "company": "", "role": "", "startDate": "", "endDate": "", "location": "", "bullets": [""] }],
  "education": [{ "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "" }],
  "skills": [{ "category": "", "items": [""] }],
  "languages": [{ "language": "", "proficiency": "" }]
}

CV TEXT:
${text.slice(0, 12000)}`,
    }],
  })

  const raw  = message.content[0].text.trim()
  const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const data = JSON.parse(json)

  if (Array.isArray(data.skills)) {
    data.skills = data.skills.map(g => ({
      ...g,
      items: Array.isArray(g.items) ? g.items : String(g.items).split(/,\s*/).filter(Boolean),
    }))
  }

  return Response.json(data)
}
