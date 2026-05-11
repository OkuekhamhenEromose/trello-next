import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ProductivitySection from '@/components/ProductivitySection'
import MessageToActionSection from '@/components/MessageToActionSection'
import FeaturesGrid from '@/components/FeaturesGrid'
import TestimonialSection from '@/components/TestimonialSection'
import CompanyLogos from '@/components/CompanyLogos'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <ProductivitySection />
        <MessageToActionSection />
        <FeaturesGrid />
        <TestimonialSection />
        <CompanyLogos />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}