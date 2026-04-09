import type { Metadata } from 'next';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Algo Dojo offers agentic AI consulting, ML model development, and business process automation to optimize your workflows.',
};

const services = [
  {
    title: 'Agentic AI Consulting',
    tagline: 'Autonomous intelligence for complex workflows',
    description:
      'We design and deploy AI agents that reason, plan, and execute multi-step tasks autonomously. From customer support to data processing pipelines, our agents handle the complexity so your team can focus on strategy.',
    benefits: [
      'Reduce manual intervention by up to 80%',
      'Handle complex, branching decision trees automatically',
      'Scale operations without linear headcount growth',
      'Continuous learning and improvement from real-world feedback',
    ],
    useCases: [
      'Automated customer inquiry routing and resolution',
      'Intelligent document processing and extraction',
      'Multi-step research and analysis workflows',
      'Code review and quality assurance automation',
    ],
    process: [
      { step: '01', title: 'Discovery', description: 'Map your current workflows and identify automation opportunities.' },
      { step: '02', title: 'Design', description: 'Architect agent systems with appropriate tools and guardrails.' },
      { step: '03', title: 'Build', description: 'Develop, test, and iterate on agent implementations.' },
      { step: '04', title: 'Deploy', description: 'Launch with monitoring, fallbacks, and human-in-the-loop controls.' },
    ],
    icon: (
      <svg className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: 'ML Model Development',
    tagline: 'Custom models built for your data and goals',
    description:
      'We build machine learning models from the ground up — tailored to your data, your constraints, and your business objectives. Whether it\'s classification, forecasting, or recommendation, we deliver production-ready models.',
    benefits: [
      'Models trained on your proprietary data for maximum relevance',
      'Full MLOps pipeline — from data prep to deployment',
      'Explainable AI for stakeholder confidence',
      'Continuous monitoring and retraining strategies',
    ],
    useCases: [
      'Predictive analytics for sales and demand forecasting',
      'Natural language processing for content classification',
      'Anomaly detection for fraud and system monitoring',
      'Recommendation engines for personalized experiences',
    ],
    process: [
      { step: '01', title: 'Data Audit', description: 'Assess data quality, availability, and feature potential.' },
      { step: '02', title: 'Prototype', description: 'Build and evaluate candidate models rapidly.' },
      { step: '03', title: 'Optimize', description: 'Fine-tune performance, reduce latency, and validate results.' },
      { step: '04', title: 'Integrate', description: 'Deploy into your stack with APIs, monitoring, and alerting.' },
    ],
    icon: (
      <svg className="h-10 w-10 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5L12 7.5l3 1.5V12" />
      </svg>
    ),
  },
  {
    title: 'Business Process Automation',
    tagline: 'Eliminate bottlenecks, accelerate outcomes',
    description:
      'We map your end-to-end business processes, identify inefficiencies, and implement intelligent automation that reduces manual effort, cuts error rates, and accelerates throughput.',
    benefits: [
      'Eliminate repetitive manual tasks across departments',
      'Reduce processing errors by up to 95%',
      'Faster turnaround times for critical business processes',
      'Clear ROI with measurable efficiency metrics',
    ],
    useCases: [
      'Invoice processing and accounts payable automation',
      'Employee onboarding workflow orchestration',
      'Report generation and distribution',
      'Data migration and system integration',
    ],
    process: [
      { step: '01', title: 'Assess', description: 'Document current processes and pain points.' },
      { step: '02', title: 'Prioritize', description: 'Rank automation opportunities by impact and feasibility.' },
      { step: '03', title: 'Implement', description: 'Build and test automation with rollback capabilities.' },
      { step: '04', title: 'Measure', description: 'Track KPIs and optimize for continuous improvement.' },
    ],
    icon: (
      <svg className="h-10 w-10 text-cyan-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
      </svg>
    ),
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  provider: {
    '@type': 'Organization',
    name: 'Algo Dojo, LLC',
    url: 'https://algodojo.xyz',
  },
  serviceType: ['AI Consulting', 'Machine Learning Development', 'Business Process Automation'],
  areaServed: 'Worldwide',
};

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <article className="border-b border-navy-800 pb-16 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-navy-800">
          {service.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{service.title}</h2>
          <p className="mt-1 text-lg text-cyan-400">{service.tagline}</p>
        </div>
      </div>

      <p className="mt-6 text-slate-300">{service.description}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-white">Key Benefits</h3>
          <ul className="mt-4 space-y-3">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-slate-400">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Use Cases</h3>
          <ul className="mt-4 space-y-3">
            {service.useCases.map((useCase) => (
              <li key={useCase} className="flex items-start gap-3 text-sm text-slate-400">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                {useCase}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white">Our Process</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step) => (
            <Card key={step.step}>
              <p className="text-2xl font-bold text-cyan-400/50">{step.step}</p>
              <h4 className="mt-2 font-semibold text-white">{step.title}</h4>
              <p className="mt-1 text-sm text-slate-400">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Our Services
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            AI-Powered Solutions for Modern Business
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            We combine deep AI expertise with practical business understanding to deliver
            solutions that create measurable impact from day one.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-16">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </Section>

      <Section className="bg-navy-900/30">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-slate-400">
            Schedule a free consultation to discuss how we can help optimize your business workflows.
          </p>
          <div className="mt-8">
            <Button href="/contact" size="lg">
              Book a Free Consultation
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
