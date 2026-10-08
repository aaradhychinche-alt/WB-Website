import { ThemeProvider } from './themeContext'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { TheChangeSection } from './components/TheChangeSection'
import { BlastRadiusSection } from './components/BlastRadiusSection'
import { DashboardSection } from './components/DashboardSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { CliSection } from './components/CliSection'
import { KubernetesSection } from './components/KubernetesSection'
import { IntegrationsSection } from './components/IntegrationsSection'
import { ChaosDistinctionSection } from './components/ChaosDistinctionSection'
import { FinalCtaSection } from './components/FinalCtaSection'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <ThemeProvider>
      <div className="app-root">
        <Navbar />
        <main>
        {/* 01 PRODUCT / HERO */}
        <HeroSection />

        {/* 02 THE CHANGE */}
        <TheChangeSection />

        {/* 03 THE BLAST RADIUS */}
        <BlastRadiusSection />

        {/* 04 THE DASHBOARD */}
        <DashboardSection />

        {/* 05 HOW IT WORKS */}
        <HowItWorksSection />

        {/* 06 CLI */}
        <CliSection />

        {/* 07 KUBERNETES V1 — AVAILABLE NOW */}
        <KubernetesSection />

        {/* 08 INTEGRATIONS (ECOSYSTEM) */}
        <IntegrationsSection />

        {/* PRODUCT PHILOSOPHY: NOT ANOTHER CHAOS EXPERIMENT */}
        <ChaosDistinctionSection />

        {/* 09 FINAL CTA */}
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  </ThemeProvider>
  )
}
