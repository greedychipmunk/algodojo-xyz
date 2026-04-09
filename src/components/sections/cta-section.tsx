import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';

export function CtaSection() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-2xl border border-navy-700 bg-navy-900/50 px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to Optimize Your Workflows?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          Book a free consultation to discover how agentic AI and automation
          can transform your business processes.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/contact" size="lg">
            Book a Free Consultation
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </Section>
  );
}
