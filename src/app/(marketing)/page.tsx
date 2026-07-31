import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TutorialsPreview } from "@/components/sections/tutorials-preview";
import { CtaSection } from "@/components/sections/cta-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { getAllTutorials } from "@/lib/content";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Algo Dojo — AI/ML Consulting & Education",
  description:
    "We examine business workflows and apply agentic AI and ML to optimize those workflows through automation. Free and premium tutorials on AI, ML, and automation.",
});

export default async function HomePage() {
  const tutorials = await getAllTutorials();
  const featured = tutorials.slice(0, 3);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TutorialsPreview tutorials={featured} />
      <CtaSection
        title="Ready to Optimize Your Workflows?"
        description="Let's discuss how agentic AI can transform your business processes."
        buttonText="Get in Touch"
        buttonHref="/contact"
      />
      <NewsletterSection />
    </>
  );
}
