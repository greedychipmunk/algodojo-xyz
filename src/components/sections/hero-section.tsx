import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 rounded-full bg-teal-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
          AI/ML Consulting &amp; Automation
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Transform Your Workflows with{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Agentic AI
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
          We analyze your business processes and deploy intelligent AI agents, machine learning
          models, and automation to make them faster, smarter, and more efficient.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/contact" size="lg">
            Book a Consultation
          </Button>
          <Button href="/tutorials" variant="outline" size="lg">
            Explore Tutorials
          </Button>
        </div>
      </div>
    </section>
  );
}
