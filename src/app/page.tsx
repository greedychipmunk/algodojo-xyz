import { HeroSection } from '@/components/sections/hero-section';
import { ServicesOverview } from '@/components/sections/services-overview';
import { FeaturedTutorials } from '@/components/sections/featured-tutorials';
import { TrustSection } from '@/components/sections/trust-section';
import { CtaSection } from '@/components/sections/cta-section';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Algo Dojo, LLC',
  url: 'https://algodojo.xyz',
  description:
    'AI/ML consulting firm specializing in agentic AI, machine learning, and business process automation.',
  sameAs: [
    'https://github.com/algodojo',
    'https://linkedin.com/company/algodojo',
    'https://x.com/algodojo',
  ],
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ServicesOverview />
      <FeaturedTutorials />
      <TrustSection />
      <CtaSection />
    </main>
  );
}
