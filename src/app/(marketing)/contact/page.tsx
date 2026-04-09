import type { Metadata } from 'next';
import { Section } from '@/components/ui/section';
import { ContactForm } from '@/components/sections/contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Algo Dojo for a free consultation on AI/ML consulting, automation, and workflow optimization.',
};

const contactInfo = [
  {
    title: 'Email',
    value: 'hello@algodojo.xyz',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: 'Response Time',
    value: 'Within 24 hours',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Consultation',
    value: 'Free, no commitment',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <main>
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Get in Touch
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            Let&apos;s Talk About Your AI Strategy
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            Book a free consultation to discuss how agentic AI and automation can transform your
            business workflows.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
            <p className="mt-2 text-slate-400">
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="flex items-start gap-4 rounded-xl border border-navy-700 bg-navy-900/50 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-cyan-400">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{info.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}
