import ServiceCard from '@/components/ServiceCard'
import services from '@/services.json'

export default function Home() {
  const live        = services.filter(s => s.status === 'live')
  const sandbox     = services.filter(s => s.status === 'sandbox')
  const suggestions = services.filter(s => s.status === 'suggestion')

  return (
    <div className="min-h-screen bg-bg">
      <main className="mx-auto max-w-6xl px-6 pb-32">

        <section className="relative py-24 text-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{
            backgroundImage: 'radial-gradient(circle, #C97B4B 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)',
          }} />
          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[64px] leading-[1.1] text-primary">
              Marketplace Automation<br />&amp; AI Tools for NC
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-[17px] text-tx-muted leading-relaxed">
              A growing suite of intelligent tools — from instant CV generation to semantic consultant matching.
            </p>
          </div>
        </section>

        {/* Live — tools integrated into matchcard.no */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Live</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          {live.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((s, i) => <ServiceCard key={s.name} service={s} index={i} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 p-10 text-center text-sm text-tx-muted">
              Tools reviewed and integrated into matchcard.no will appear here.
            </div>
          )}
        </div>

        {/* Sandbox — GitHub Pages prototypes */}
        {sandbox.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-tx-muted">Sandbox</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sandbox.map((s, i) => <ServiceCard key={s.name} service={s} index={live.length + i} />)}
            </div>
          </div>
        )}

        {/* Roadmap */}
        {suggestions.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-tx-muted">On the roadmap</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((s, i) => <ServiceCard key={s.name} service={s} index={live.length + sandbox.length + i} />)}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
