import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import ApproachSection from "@/components/ApproachSection";
import WorkSection from "@/components/WorkSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-background">
      <Hero />
      <StatsSection />
      <ServicesSection />
      <ApproachSection />
      <WorkSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
