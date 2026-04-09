import type { Metadata } from 'next';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Algo Dojo — an AI/ML consulting firm helping businesses optimize workflows through agentic AI and automation.',
};

const values = [
  {
    title: 'Results Over Hype',
    description:
      'We focus on measurable business outcomes, not flashy demos. Every solution we build is designed to deliver concrete ROI.',
  },
  {
    title: 'Practical AI',
    description:
      'We apply AI where it makes sense. Not every problem needs a neural network — we choose the right tool for the job.',
  },
  {
    title: 'Knowledge Sharing',
    description:
      'Our tutorials and blog exist because we believe in making AI accessible. Rising tides lift all boats.',
  },
  {
    title: 'Client Partnership',
    description:
      'We work alongside your team, transferring knowledge at every step. Our goal is your independence, not your dependence.',
  },
];

const team = [
  {
    name: 'Coming Soon',
    role: 'Founding Team',
    description: 'We are building our team page. Check back soon for team member profiles.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            About Us
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            Making AI Work for Real Businesses
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            Algo Dojo was founded on a simple premise: AI should create measurable value, not just
            impressive demos. We combine deep technical expertise with practical business
            understanding to deliver automation that actually works.
          </p>
        </div>
      </Section>

      <Section className="bg-navy-900/30">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Our Story</h2>
            <div className="mt-6 space-y-4 text-slate-300">
              <p>
                We started Algo Dojo because we saw a gap between AI&apos;s potential and how most
                businesses were actually using it. Companies were spending millions on AI
                initiatives that never made it past the proof-of-concept stage.
              </p>
              <p>
                The problem wasn&apos;t the technology — it was the approach. Teams were chasing
                the latest models and frameworks without first understanding their workflows,
                data, and actual business needs.
              </p>
              <p>
                We take a different approach. We start with your business processes, identify
                where AI can have the biggest impact, and build solutions that integrate
                seamlessly into how your team already works.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-navy-700 bg-navy-900/50 p-8">
            <h3 className="text-xl font-bold text-white">Our Mission</h3>
            <p className="mt-4 text-lg text-slate-300">
              To help businesses unlock the full potential of AI and automation — delivering
              practical, production-ready solutions that create measurable value from day one.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-cyan-400">50+</p>
                <p className="mt-1 text-sm text-slate-400">Projects Delivered</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-400">10x</p>
                <p className="mt-1 text-sm text-slate-400">Avg Efficiency Gain</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Our Values</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            The principles that guide everything we do.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {values.map((value) => (
            <Card key={value.title}>
              <h3 className="text-lg font-semibold text-white">{value.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{value.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-navy-900/30">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Our Team</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A team of engineers, researchers, and strategists passionate about practical AI.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          {team.map((member) => (
            <Card key={member.name} className="max-w-sm text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-800">
                <svg
                  className="h-10 w-10 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-cyan-400">{member.role}</p>
              <p className="mt-2 text-sm text-slate-400">{member.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
