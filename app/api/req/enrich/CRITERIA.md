# Enrich Client — AI Search Criteria

The `POST /api/req/enrich` route generates a short, factual description of a client company for use in the Behovsavklarer brief (`kundebeskrivelse` field).

---

## Output format

Exactly **one paragraph**, plain prose. 2–5 sentences. No titles, headers, markdown, labels, or section names of any kind. Must not begin with the company name followed by a dash or colon.

The paragraph covers: who the company is, industry, size, market position, ownership, and other relevant factual context — all in natural flowing text.

---

## What is explicitly excluded

- **Tech stack and specific tools** — belongs in other fields (`arbeidsoppgaver`, `prosjektbeskrivelse`)
- **Employer branding narrative** — the client description field is for factual company context only
- **Assumptions** — never write "de bruker trolig", "selskaper av denne typen…", or any inference not backed by a source
- **Section headers or labels** — output is a single plain paragraph
- **Speculation** — if something is not findable, omit it; a shorter accurate description beats a longer guessed one

---

## Source criteria

Only confirmed public information:
- Company website (about, careers)
- Press releases and news articles
- LinkedIn company page
- Annual reports
- Public registries (Proff, Brønnøysund, etc.)

---

## Search query (Tavily)

```
"[selskap]" ansatte arbeidsmiljø kultur arbeidsgiver Norge
```

---

## AI pipeline

1. **Tavily search** → raw snippets synthesized by Claude using the system prompt
2. **Claude web_search tool** (if Tavily unavailable) → same system prompt
3. **Claude knowledge fallback** → told to share only confirmed knowledge, not speculate

All three paths use the same system prompt.

---

## Example output (Fremtind)

> Fremtind er Norges største skadeforsikringsselskap med mellom 1 000 og 5 000 ansatte, dannet gjennom fusjonen mellom forsikringsselskapene til SpareBank 1 og DNB i 2019 og senere merger med Eika Forsikring, noe som gir selskapet en markedsandel på rundt 20 prosent i det norske privatforsikringsmarkedet. Selskapet er heleid av de to morbanksgruppene og har hovedkontor i Oslo.
