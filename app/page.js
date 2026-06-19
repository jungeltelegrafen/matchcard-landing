import Header from '@/components/Header'
import ServiceCard from '@/components/ServiceCard'
import AnimatedGradientText from '@/components/magicui/animated-gradient-text'
import services from '@/services.json'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="mx-auto max-w-6xl px-6 pb-24">

        {/* Hero */}
        <section className="py-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light px-4 py-1.5 text-sm font-semibold text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            ✦ Now live: CV Generator
          </div>

          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            <AnimatedGradientText>
              Marketplace Automation
            </AnimatedGradientText>
            <br />
            <span className="text-primary">&amp; AI Tools for NC</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-tx-muted leading-relaxed">
            A suite of intelligent tools to streamline your recruitment operations —
            from CV parsing to consultant matching.
          </p>
        </section>

        {/* Grid */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.name} service={service} index={i} />
          ))}
        </section>

      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-tx-muted">
        © 2026 Matchcard. Built for Nordic Commerce.
      </footer>
    </div>
  )
}
