import SidePanel from "@/components/layout/SidePanel";
import Footer from "@/components/layout/Footer";
import CursorGlow from "@/components/ui/CursorGlow";
import Hero from "@/components/hero/Hero";
import ProjectGrid from "@/components/projects/ProjectGrid";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Performance from "@/components/sections/Performance";
import { getProjects } from "@/lib/projects";
import { getContact } from "@/lib/contactStore";
import { getPerformance } from "@/lib/performanceStore";

// All four data sources live in JSON stores that the control panel mutates
// at runtime. Force dynamic rendering so edits from /control surface without
// a rebuild.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, contact, performance] = await Promise.all([
    getProjects(),
    getContact(),
    getPerformance(),
  ]);

  return (
    <main className="relative min-h-screen bg-bg text-ink">
      <CursorGlow />

      {/*
        Split layout:
        - Desktop (>= md): two columns, left column is sticky-height and
          behaves like a fixed control panel while the right column scrolls.
        - Mobile (< md): the identity panel fills the viewport as a full-page
          intro; the rest of the content scrolls in underneath it.
      */}
      <div className="relative z-10 md:grid md:grid-cols-[minmax(320px,38%)_1fr]">
        <div className="h-screen md:sticky md:top-0 md:h-screen">
          <SidePanel contact={contact} />
        </div>

        <div className="relative">
          {/* Soft edge fade so the content column eases into the identity panel.
              A gradient wash (not a hard vignette) and a hairline seam. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-bg/80 via-bg/20 to-transparent md:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-hairline to-transparent md:block"
          />
          <div className="mx-auto w-full max-w-3xl px-6 md:px-14 lg:px-16">
            <Hero />
            <ProjectGrid projects={projects} />
            <Performance data={performance} />
            <About />
            <Contact contact={contact} />
            <Footer contact={contact} />
          </div>
        </div>
      </div>
    </main>
  );
}
