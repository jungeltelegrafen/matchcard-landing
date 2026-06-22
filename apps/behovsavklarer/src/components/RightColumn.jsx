import InlineField from './InlineField'

export default function RightColumn({ brief, setField, pendingFill, onAccept, onReject }) {
  function f(key, extra = {}) {
    return {
      value: brief[key],
      onChange: v => setField(key, v),
      suggestion: pendingFill?.[key],
      onAccept: () => onAccept(key),
      onReject: () => onReject(key),
      ...extra,
    }
  }

  return (
    <aside className="w-[28%] flex-shrink-0 bg-bg/40 p-5 space-y-6 overflow-y-scroll print-col border-l border-border">
      <div className="space-y-6">

        <InlineField
          label="Web-URL (stillingsannonse) — Valgfri"
          placeholder="https://…"
          {...f('webUrl')}
        />

        <InlineField
          label="Tilbudsformat overfor kunden"
          type="textarea" rows={2}
          placeholder="Standard tilbudsformat: e-postformat med praktisk info + spisset CV, evt. med kompetanseskjema"
          {...f('tilbudsformat')}
        />

        <section className="space-y-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-tx">
            Samarbeidsstruktur kunde ↔ NC
          </h3>
          <InlineField
            label="Prosessen videre?"
            type="textarea" rows={3}
            placeholder="Intervjurunder, tidslinje, beslutningstaker…"
            {...f('prosessenVidere', { optional: true })}
          />
          <InlineField
            label="Andre leverandører?"
            type="textarea" rows={3}
            placeholder="Eksklusivt til NC, eller deler kunden behovet?"
            {...f('andreLeverandorer', { optional: true })}
          />
          <InlineField
            label="Andre kandidater?"
            type="textarea" rows={3}
            placeholder="Er andre konsulenter allerede vurdert?"
            {...f('andreKandidater', { optional: true })}
          />
        </section>

        <InlineField
          label="Annet / Andre behov"
          type="textarea" rows={3}
          placeholder="Tilgrensende behov, planlagte utvidelser…"
          {...f('annet', { optional: true })}
        />

        <InlineField
          label="Generelle notater"
          type="textarea" rows={4}
          placeholder="Intern notis, kontekst fra møte, oppfølgingspunkter…"
          {...f('generelleNotater', { optional: true })}
        />

      </div>
    </aside>
  )
}
