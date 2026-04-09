import { Section } from '@/components/ui/section';

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '10x', label: 'Average Efficiency Gain' },
  { value: '99%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'AI Agent Uptime' },
];

export function TrustSection() {
  return (
    <Section className="bg-navy-900/30">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Proven Results
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          Trusted by Forward-Thinking Teams
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-4xl font-bold text-cyan-400 sm:text-5xl">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
