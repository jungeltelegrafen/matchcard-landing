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
  "hybridDetaljer": "",
  "soknadsfrist": "",
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
  "webUrl": "",
  "tilbudsformat": "",
  "sellingPoints": "",
  "prosessenVidere": "",
  "andreLeverandorer": "",
  "andreKandidater": "",
  "annet": "",
  "generelleNotater": ""
}`

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
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  const { text, brief, mode = 'fill' } = body

  let userPrompt

  if (mode === 'anonymize') {
    if (!brief) return Response.json({ error: 'No brief provided' }, { status: 400, headers: CORS })
    userPrompt = `Du får et JSON-objekt med felter fra en konsulentbriefing. Din oppgave er å fjerne alle referanser til klientens navn, selskapet, merkenavn og personidentifiserende informasjon fra ALLE fritekstfelter.

Regler:
- Erstatt klientnavn med generiske beskrivelser (f.eks. "klienten", "bedriften", "organisasjonen")
- Behold all faglig og teknisk informasjon intakt
- Endre IKKE logistikkfelter (datoer, budsjett, roller osv.)
- Endre IKKE lister (maHa, fintAHa) — bare fritekstfelter
- Returner BARE et JSON-objekt med de feltene du faktisk endret (ikke alle felter)

BRIEF:
${JSON.stringify(brief, null, 2).slice(0, 10000)}`
  } else if (mode === 'distill') {
    if (!text?.trim()) return Response.json({ error: 'No text provided' }, { status: 400, headers: CORS })
    userPrompt = `Du er ekspert på å identifisere faglig kjerne i IT-konsulentbehov.

Analyser all informasjonen nedenfor og generer:

1. "kjernenIBehovet": Hva er den faglige kompetansekjernen konsulenten MÅ besitte?
   - Identifiser det overordnede fagdomenet (f.eks. nettverksarkitektur, fullstack-utvikling, dataplatform, skymigrering)
   - Trekk ut de 2–3 viktigste spesifikke teknologiene/kompetansene: vekt de som nevnes oftest, nevnes først, eller fremheves eksplisitt
   - Inkluder senioriteten hvis den er tydelig
   - Nevn personlige egenskaper KUN hvis de er eksplisitt avgjørende for rollen
   - Bruk faglig skjønn der dataene er mangelfulle — men marker det ikke
   - IKKE beskriv kunden, bransjen eller prosjektkonteksten
   Skriv 1–2 presise setninger som en kompetanseprofil. Eksempel: "Erfaren nettverksarkitekt med sterk kompetanse i Cisco og Palo Alto, vant til komplekse hybridmiljøer og selvstendig arbeid."

2. "maHa": De 3–5 absolutt viktigste kompetansekravene som korte, presise strenger

Svar med JSON som BARE inneholder disse to feltene.

INFORMASJON:
${text.slice(0, 8000)}`
  } else {
    // fill mode
    if (!text?.trim()) return Response.json({ error: 'No text provided' }, { status: 400, headers: CORS })
    userPrompt = `Ekstraher all tilgjengelig informasjon fra følgende kildemateriell og fyll ut feltene nedenfor.
Bruk null for felt du ikke kan finne. Ikke finn på informasjon.

Viktige instruksjoner for tekstfelter:
- kjernenIBehovet: Identifiser det overordnede fagdomenet konsulenten skal dekke og de 2–3 viktigste spesifikke teknologiene/kompetansene (vekt dem som er nevnt oftest, nevnt først, eller eksplisitt fremhevet). Inkluder senioriteten hvis tydelig. Personlige egenskaper kun hvis eksplisitt avgjørende. Ikke nevn kunden, bransjen eller prosjektkonteksten. Skriv 1–2 presise setninger som en kompetanseprofil — ikke en stillingsbeskrivelse. Eksempel: "Erfaren dataingeniør med sterk kompetanse i Spark og Azure Data Factory, vant til å designe skalerbare datapipelines i finanssektoren."
- Alle andre tekstfelter (prosjektbeskrivelse, arbeidsoppgaver, kundebeskrivelse, hvaUtlosteBehovet osv.): Behold den fulle teksten fra kilden — unngå bare duplikate setninger, men kutt ikke ned
- tilbudsformat: UTELUKKENDE om FORMATET for innsending av CVer/kandidater til denne kunden — f.eks. "Standard NC CV", "Kompetanseskjema fra kunden", "Opplasting til kundeportal", "Kodegjennomgang + GitHub-profil", "E-post med PDF-vedlegg". IKKE om prosjektmetodikk eller leveranse. La stå tomt hvis kildematerialet ikke nevner spesifikke innsendingskrav.
- onsiteRemote må være en av: "Onsite", "Remote", "Hybrid"
- maHa og fintAHa skal være lister med strenger
- Datoer skal være på ISO-format: YYYY-MM-DD

Returner BARE dette JSON-skjemaet utfylt:
${FILL_SCHEMA}

KILDEMATERIELL:
${text.slice(0, 16000)}`
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const raw = message.content[0].text.trim()
      .replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
    const data = JSON.parse(raw)

    return Response.json(data, { headers: CORS })
  } catch (e) {
    console.error('Extract error:', e)
    return Response.json({ error: 'Extraction failed', detail: e.message }, { status: 500, headers: CORS })
  }
}
