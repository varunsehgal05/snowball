import { createFileRoute } from "@tanstack/react-router";
import { lazy, useEffect, useRef, useState, Suspense } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { useReveal } from "@/hooks/useReveal";
import SnowfallBackground from "@/components/SnowfallBackground";
import { GLSLHills } from "@/components/GLSLHills";

const MistCanvas = lazy(() => import("@/components/three/MistCanvas"));
const SnowballCanvas = lazy(() => import("@/components/three/SnowballCanvas"));
const MountainCanvas = lazy(() => import("@/components/three/MountainCanvas"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Snowball — AI GTM agency for YC founders" },
      {
        name: "description",
        content:
          "Snowball runs LinkedIn and email outbound from your own profile, in your voice, turning cold lists into warm investor, customer and candidate meetings.",
      },
      { property: "og:title", content: "Snowball — AI GTM agency for YC founders" },
      {
        property: "og:description",
        content:
          "Outbound engineered for founders: campaigns in your voice, run from your profile, compounding into qualified meetings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "Work", href: "#process" },
  { label: "Philosophy", href: "#momentum" },
  { label: "Founders", href: "#founders" },
  { label: "Contact", href: "#contact" },
];

const STEPS = [
  {
    n: "01",
    eyebrow: "VOICE_MODEL",
    title: "Learn voice",
    body: "A model trained on your historical communications maps the semantic structures, cadence and vocabulary that make a message read as unmistakably yours.",
  },
  {
    n: "02",
    eyebrow: "DEPLOYMENT",
    title: "Run campaigns",
    body: "Omnichannel deployment across LinkedIn and email, targeting predefined ICP subsets asynchronously, with human review before anything leaves your account.",
  },
  {
    n: "03",
    eyebrow: "HANDOFF",
    title: "Take meetings",
    body: "Frictionless handoff to calendar scheduling for qualified interactions only. You show up to the conversation, not the pipeline management.",
  },
];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  
  useReveal([isLoading]);
  
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      
      if (scrollTrackRef.current) {
        // Calculate global scroll progress for the horizontal track
        const rect = scrollTrackRef.current.getBoundingClientRect();
        const scrollableHeight = rect.height - window.innerHeight;
        // If we're on mobile, rect.height might be close to document height. 
        // On desktop it's explicitly set to 600vh.
        if (scrollableHeight > 0) {
          const scrolledDistance = -rect.top;
          const progress = Math.min(1, Math.max(0, scrolledDistance / scrollableHeight));
          setGlobalProgress(progress);
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLoading]);

  // Smooth scroll handler for nav links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isDesktop || !horizontalContainerRef.current || !scrollTrackRef.current) return;
    
    // For desktop horizontal layout, we need to map the section's horizontal offset
    // back to a vertical scroll position.
    const section = horizontalContainerRef.current.querySelector(href);
    if (section) {
      e.preventDefault();
      const containerWidth = horizontalContainerRef.current.scrollWidth - window.innerWidth;
      const sectionOffsetLeft = (section as HTMLElement).offsetLeft;
      
      // Calculate what % of the horizontal track this is
      const targetProgress = sectionOffsetLeft / containerWidth;
      
      // Map that back to the vertical scroll track height
      const trackRect = scrollTrackRef.current.getBoundingClientRect();
      const scrollableHeight = trackRect.height - window.innerHeight;
      const targetVerticalScroll = window.scrollY + trackRect.top + (targetProgress * scrollableHeight);
      
      window.scrollTo({
        top: targetVerticalScroll,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
        <ClientOnly>
          <SnowfallBackground count={100} color="#8FD3FF" />
        </ClientOnly>
        <div className="z-10 text-center space-y-4">
          <h1 className="font-display text-4xl text-glacier animate-pulse">Loading Snowball...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <ClientOnly>
        <Suspense fallback={null}>
          <MistCanvas />
        </Suspense>
      </ClientOnly>

      {/* Nav */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-border transition-all duration-500 ${
          scrolled ? "bg-background/80 shadow-[0_1px_24px_-12px_rgba(43,110,150,0.35)] backdrop-blur-md" : "bg-background"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" onClick={(e) => handleNavClick(e, '#top')} className="font-display text-2xl leading-none tracking-tight text-foreground">
            Snowball
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="link-wipe text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="rounded-full bg-glacier px-5 py-2 text-sm font-medium text-glacier-deep transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--glow-glacier)]"
          >
            Book discovery
          </a>
        </nav>
      </header>

      {/* The Scroll Track */}
      <div 
        ref={scrollTrackRef} 
        style={{ height: isDesktop ? '600vh' : 'auto' }}
      >
        <div className={isDesktop ? "sticky top-0 h-screen w-full overflow-hidden" : ""}>
          
          {/* Continuous Mountain Background spanning the journey */}
          <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000" style={{ opacity: globalProgress > 0.05 ? 1 : 0 }}>
            <ClientOnly>
              <Suspense fallback={null}>
                <MountainCanvas progress={globalProgress} />
              </Suspense>
            </ClientOnly>
          </div>
          
          {/* Horizontal Layout Container */}
          <div 
            ref={horizontalContainerRef}
            className={`relative z-10 flex ${isDesktop ? 'flex-row h-full w-[max-content] items-stretch' : 'flex-col'}`}
            style={{ 
              transform: isDesktop ? `translate3d(calc(-${globalProgress} * (100% - 100vw)), 0, 0)` : 'none', 
              willChange: isDesktop ? 'transform' : 'auto'
            }}
          >
            
            {/* 1. Hero */}
            <section id="top" className={`relative overflow-hidden ${isDesktop ? 'w-screen shrink-0 h-full flex items-center justify-center' : 'px-6 pb-24 pt-36 min-h-screen flex items-center'}`}>
              <div className="absolute inset-0 z-0 pointer-events-none opacity-80" style={{ opacity: Math.max(0, 0.8 - globalProgress * 4) }}>
                <ClientOnly>
                  <GLSLHills width="100%" height="100%" cameraZ={120} speed={0.2} />
                </ClientOnly>
              </div>
              <ClientOnly>
                <SnowfallBackground count={40} color="#8FD3FF" speed={0.5} zIndex={0} />
              </ClientOnly>
              <div className="w-full max-w-6xl px-6 relative z-10">
                <div className="relative mx-auto max-w-3xl border border-border px-8 py-14 text-center bg-background/50 backdrop-blur-[2px]">
                  <Corner className="-left-px -top-px" />
                  <Corner className="-right-px -top-px rotate-90" />
                  <Corner className="-bottom-px -right-px rotate-180" />
                  <Corner className="-bottom-px -left-px -rotate-90" />
                  <p className="relative inline-block font-display text-xl italic text-muted-foreground">
                    under construction.
                    <span className="absolute left-[-6%] top-1/2 h-px w-[112%] -rotate-6 bg-muted-foreground/60" />
                  </p>
                  <h1 className="mt-6 font-display text-5xl leading-[1.05] text-glacier sm:text-7xl">
                    engineered for founders.
                  </h1>
                </div>

                <div className="relative mt-14 overflow-hidden transition-opacity duration-500" style={{ opacity: Math.max(0, 1 - globalProgress * 5) }}>
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--glacier) 22%, transparent), transparent 70%)" }}
                  />
                  <div className="relative h-[380px] w-full sm:h-[460px]">
                    <ClientOnly>
                      <Suspense fallback={null}>
                        <SnowballCanvas growth={Math.min(1, globalProgress * 5)} />
                      </Suspense>
                    </ClientOnly>
                  </div>
                  <span className="absolute right-8 top-8 font-mono text-xs tracking-widest text-glacier-deep">
                    ↘ compounding.
                  </span>
                  <span className="absolute bottom-6 left-8 font-mono text-[11px] text-muted-foreground/70">
                    space to jump
                  </span>
                </div>

                {!isDesktop && (
                  <div className="mt-10 flex justify-center">
                    <span
                      className="font-mono text-xs tracking-[0.35em] text-muted-foreground"
                      style={{ animation: "drift-bob 2.2s ease-in-out infinite" }}
                    >
                      scroll
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Spacer for horizontal padding */}
            {isDesktop && <div className="w-[10vw] shrink-0" />}

            {/* 2. Process */}
            <section id="process" className={`relative z-10 ${isDesktop ? 'flex flex-row items-center h-full gap-16 px-12 shrink-0' : 'border-t border-border px-6 py-28 bg-background/40 backdrop-blur-sm'}`}>
              <div className={`${isDesktop ? 'w-[400px]' : 'mb-12'} reveal mix-blend-difference`}>
                <h2 className="font-display text-4xl text-foreground sm:text-5xl">The Process</h2>
                <p className="mt-5 text-muted-foreground">
                  We run LinkedIn and email outbound from your own profile, written in your voice — so the
                  first impression a prospect gets is the founder, not an agency.
                </p>
                <div className="mt-10 space-y-2 border border-border bg-frost p-5 font-mono text-xs text-glacier-deep backdrop-blur-md">
                  <p>SYS_CONFIG // OUTBOUND_PROTOCOL</p>
                  <p className="text-muted-foreground">Active Nodes: 3</p>
                  <p className="text-muted-foreground">Status: nominal</p>
                </div>
              </div>

              <div className={`${isDesktop ? 'flex flex-row gap-8 items-center h-full' : 'space-y-5'}`}>
                {STEPS.map((step, i) => (
                  <div key={i} className="reveal relative flex flex-col gap-4 border border-border/30 bg-transparent p-8 min-w-[320px] max-w-[320px] mix-blend-difference transition-all duration-500 hover:border-glacier/50">
                    <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-glacier-deep">
                      <span>{step.eyebrow}</span>
                      <span>{step.n}</span>
                    </div>
                    <h3 className="font-display text-2xl text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Spacer */}
            {isDesktop && <div className="w-[15vw] shrink-0" />}

            {/* 3. Momentum */}
            <section id="momentum" className={`relative z-10 ${isDesktop ? 'w-screen shrink-0 h-full flex flex-col justify-center px-24' : 'border-t border-border py-28 bg-background/20 backdrop-blur-[2px] px-6'}`}>
              <div className="max-w-2xl reveal mix-blend-difference">
                <h2 className="font-display text-5xl sm:text-7xl text-foreground leading-[1.1]">Momentum<br/>compounds.</h2>
                <p className="mt-8 text-lg text-muted-foreground max-w-lg" style={{ transitionDelay: "120ms" }}>
                  Week one is a trickle. By week eight the same motion is returning warm intros, investor
                  replies and candidate pipeline — the results build on themselves.
                </p>
              </div>
            </section>

            {/* 4. Founders */}
            <section id="founders" className={`relative z-10 ${isDesktop ? 'w-screen shrink-0 h-full flex flex-col justify-center px-24' : 'border-t border-border bg-background px-6 py-24'}`}>
              <div className="max-w-4xl reveal mix-blend-difference">
                <p className="font-mono text-xs tracking-[0.3em] text-glacier-deep">FOUNDERS // FIELD_NOTES</p>
                <blockquote className="mt-8 max-w-3xl font-display text-4xl sm:text-5xl leading-tight text-foreground">
                  "It reads exactly like me. That's the whole thing — replies come back as conversations,
                  not as leads."
                </blockquote>
                <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-3">
                  {[
                    ["MEETINGS / QUARTER", "40+"],
                    ["REPLY RATE", "11.4%"],
                    ["FOUNDER HOURS / WEEK", "< 1"],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-transparent p-10 transition-colors hover:bg-background/10">
                      <p className="font-mono text-[11px] tracking-widest text-muted-foreground">{label}</p>
                      <p className="mt-4 font-display text-5xl text-glacier-deep">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Contact & Footer unified for horizontal end */}
            <section id="contact" className={`relative z-10 ${isDesktop ? 'w-screen shrink-0 h-full flex flex-col justify-between' : 'border-t border-border'}`}>
              
              {/* Contact Area */}
              <div className={`flex-1 flex flex-col justify-center ${isDesktop ? 'px-24' : 'px-6 py-28 text-center'}`}>
                <div className={isDesktop ? 'max-w-3xl' : 'mx-auto max-w-3xl'}>
                  <h2 className="reveal font-display text-4xl leading-tight text-foreground sm:text-6xl">
                    Book a call and we'll show you exactly what we'd send on your behalf.
                  </h2>
                  <div className="reveal mt-12" style={{ transitionDelay: "120ms" }}>
                    <a
                      href="mailto:hello@snowball.gtm"
                      className="inline-flex items-center gap-2 rounded-full bg-glacier px-10 py-4 text-base font-medium text-glacier-deep transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--glow-glacier)]"
                    >
                      Schedule call →
                    </a>
                  </div>
                  <div className={`reveal mt-10 flex gap-8 text-sm text-muted-foreground ${!isDesktop && 'justify-center'}`}>
                    <a className="link-wipe hover:text-foreground" href="mailto:hello@snowball.gtm">
                      hello@snowball.gtm
                    </a>
                    <a className="link-wipe hover:text-foreground" href="https://linkedin.com">
                      LinkedIn
                    </a>
                    <a className="link-wipe hover:text-foreground" href="https://x.com">
                      X
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer Area */}
              <footer className={`${isDesktop ? 'border-t border-border/50 bg-background/50 backdrop-blur-md px-12 py-8' : 'border-t border-border px-6 py-12'}`}>
                <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-display text-2xl text-foreground">Snowball</p>
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                      © {new Date().getFullYear()} Snowball GTM — all rights reserved.
                    </p>
                  </div>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <a className="link-wipe hover:text-foreground" href="#top">
                      Privacy
                    </a>
                    <a className="link-wipe hover:text-foreground" href="#top">
                      Technical Spec
                    </a>
                    <a className="link-wipe hover:text-foreground" href="#top">
                      Terms
                    </a>
                  </div>
                </div>
              </footer>

            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      className={`bracket-in absolute h-4 w-4 border-l border-t border-glacier-deep ${className}`}
      aria-hidden
    />
  );
}
