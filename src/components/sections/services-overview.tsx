import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: 'Agentic AI Consulting',
    description:
      'Design and deploy autonomous AI agents that handle complex, multi-step business processes with minimal human intervention.',
    icon: (
      <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: 'ML Model Development',
    description:
      'Build, train, and integrate custom machine learning models tailored to your data and business objectives.',
    icon: (
      <svg className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5L12 7.5l3 1.5V12" />
      </svg>
    ),
  },
  {
    title: 'Process Automation',
    description:
      'Identify bottlenecks in your workflows and implement intelligent automation that reduces manual effort and error rates.',
    icon: (
      <svg className="h-8 w-8 text-cyan-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
      </svg>
    ),
  },
];

export function ServicesOverview() {
  return (
    <Section className="bg-navy-900/30">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">What We Do</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          End-to-End AI Solutions
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          From strategy to deployment, we help you leverage AI and machine learning
          to transform how your business operates.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title} className="flex flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-navy-800">
              {service.icon}
            </div>
            <h3 className="text-lg font-semibold text-white">{service.title}</h3>
            <p className="mt-2 flex-1 text-sm text-slate-400">{service.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button href="/services" variant="outline">
          View All Services
        </Button>
      </div>
    </Section>
  );
}
