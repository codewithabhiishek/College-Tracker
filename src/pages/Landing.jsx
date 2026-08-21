import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  GraduationCap,
  Kanban,
  Calendar,
  FileText,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Check,
  Layers,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const { isSignedIn } = useAuth();

  const features = [
    {
      icon: Kanban,
      tag: "PIPELINE OS",
      title: "Kanban & Table Pipelines",
      desc: "Drag-and-drop universities through Researching, Applied, Interviewing, and Accepted stages with live status telemetry.",
    },
    {
      icon: Calendar,
      tag: "SCHEDULE ENGINE",
      title: "Interactive Deadline Calendar",
      desc: "Visual timeline for Early Action, Regular Decision, financial aid deadlines, and alumni interview dates.",
    },
    {
      icon: FileText,
      tag: "DOCUMENT VAULT",
      title: "Essay & Document Manager",
      desc: "Centralize your personal statements, supplemental essays, recommendation letters, and transcripts per college.",
    },
    {
      icon: TrendingUp,
      tag: "METRICS & BENCHMARKS",
      title: "Visual Acceptance Analytics",
      desc: "Interactive Recharts visualizers track acceptance likelihood, target/reach ratios, and scholarship awards.",
    },
    {
      icon: Clock,
      tag: "AUTOMATION",
      title: "Real-Time Milestone Alerts",
      desc: "Never miss a portal deadline or submission window with automated countdown timers and deadline highlights.",
    },
    {
      icon: ShieldCheck,
      tag: "AUTHENTICATION",
      title: "100% Free & Secure Storage",
      desc: "Powered by Clerk authentication and cloud-synced PostgreSQL with zero subscription paywalls.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Add Universities",
      desc: "Input target, reach, and safety schools with admission deadlines, portals, and major requirements.",
    },
    {
      step: "02",
      title: "Track Requirements",
      desc: "Manage essays, checklist items, test score submissions, and counselor recommendations in one place.",
    },
    {
      step: "03",
      title: "Secure Admissions",
      desc: "Monitor acceptances, compare financial aid packages, and make your final enrollment decision with clarity.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono selection:bg-primary selection:text-primary-foreground">
      {/* ---------------- NAVIGATION ---------------- */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 bg-primary text-primary-foreground grid place-items-center font-heading font-black text-lg border border-primary shadow-[2px_2px_0_#9353ff]">
              🎓
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight leading-none text-foreground">
                COLLEGE<span className="text-primary">.TRACKER</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                ADMISSIONS OS
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link to="/dashboard">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-5 py-2 text-xs font-bold uppercase tracking-widest border border-primary shadow-[2px_2px_0_#9353ff]">
                  Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-5 py-2 text-xs font-bold uppercase tracking-widest border border-primary shadow-[2px_2px_0_#9353ff]">
                    Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="px-4 md:px-8 pt-12 pb-16 md:pt-20 md:pb-24 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {/* Top Telemetry Tag */}
            <div className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              <span className="h-2 w-2 bg-primary animate-pulse" />
              <span>100% FREE ADMISSION MANAGEMENT OS</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05]">
              DOMINATE YOUR <br />
              <span className="text-primary bg-clip-text">COLLEGE ADMISSIONS.</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-mono max-w-xl">
              The high-velocity operating system for ambitious high school students and counselors. Track applications, manage essays, visualize acceptance probability, and crush deadlines with zero chaos.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to={isSignedIn ? "/dashboard" : "/register"}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-7 h-12 text-xs font-black uppercase tracking-widest border border-primary shadow-[4px_4px_0_#9353ff] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]">
                  {isSignedIn ? "Open Dashboard" : "Launch Workspace Free →"}
                </Button>
              </Link>

              {!isSignedIn && (
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="rounded-none px-6 h-12 text-xs font-bold uppercase tracking-widest border-border hover:border-primary hover:text-primary bg-card"
                  >
                    Portal Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Zero Subscription</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Postgres Backed</span>
              </div>
            </div>
          </div>

          {/* Live Mockup Terminal Card */}
          <div className="relative">
            <div className="border border-border bg-card p-5 md:p-6 shadow-[8px_8px_0_rgba(0,0,0,0.8)] space-y-4">
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 bg-destructive" />
                  <span className="h-3 w-3 bg-amber-500" />
                  <span className="h-3 w-3 bg-primary" />
                  <span className="text-xs font-bold tracking-widest text-muted-foreground ml-2">
                    ADMISSIONS PIPELINE [LIVE]
                  </span>
                </div>
                <span className="text-[10px] text-primary border border-primary/30 px-2 py-0.5 font-bold uppercase">
                  ACTIVE CYCLE
                </span>
              </div>

              {/* Sample University Kanban Cards */}
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="border border-border bg-background p-3.5 space-y-2 border-l-[3px] border-l-primary">
                  <div className="flex justify-between items-start">
                    <h4 className="font-heading font-bold text-sm text-foreground">MIT</h4>
                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 font-bold">REACH</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Major: Computer Science · Regular Decision</p>
                  <div className="flex justify-between text-[10px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                    <span>STATUS: INTERVIEWING</span>
                    <span className="text-primary font-bold">JAN 01</span>
                  </div>
                </div>

                <div className="border border-border bg-background p-3.5 space-y-2 border-l-[3px] border-l-[#9353ff]">
                  <div className="flex justify-between items-start">
                    <h4 className="font-heading font-bold text-sm text-foreground">STANFORD</h4>
                    <span className="text-[9px] bg-[#9353ff]/10 text-[#9353ff] px-1.5 py-0.5 font-bold">TARGET</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Major: Symbolic Systems · Early Action</p>
                  <div className="flex justify-between text-[10px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                    <span className="text-primary font-bold">STATUS: ACCEPTED ★</span>
                    <span className="text-muted-foreground">NOV 01</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Summary Bar */}
              <div className="border border-border bg-background/60 p-3 flex flex-wrap justify-between items-center text-xs font-mono gap-2">
                <div>
                  <span className="text-muted-foreground">TOTAL APPLIED: </span>
                  <span className="font-bold text-foreground">12</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ACCEPTANCE RATE: </span>
                  <span className="font-bold text-primary">33.3%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">DOCS UPLOADED: </span>
                  <span className="font-bold text-[#9353ff]">18 FILES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SYSTEM CAPABILITIES ---------------- */}
      <section className="border-t border-border bg-card/40 py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="border border-primary text-primary px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-primary/10">
              MISSION CAPABILITIES
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              ENGINEERED FOR HIGH-STAKES ADMISSIONS
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every tool required to organize, prioritize, and submit flawless applications.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="border border-border bg-card p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary transition-colors group"
                >
                  <div className="space-y-3">
                    <div className="h-10 w-10 bg-primary/10 border border-primary text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-primary tracking-widest block">{f.tag}</span>
                    <h3 className="font-heading text-lg font-bold uppercase text-foreground">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- 3 STEPS ---------------- */}
      <section className="border-t border-border py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase text-foreground">
              ADMISSION WORKFLOW
            </h2>
            <p className="text-xs text-muted-foreground">From initial college list to final enrollment acceptance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="border border-border bg-card p-6 space-y-3">
                <span className="font-heading text-2xl font-black text-primary block">{s.step}</span>
                <h3 className="font-heading text-base font-bold uppercase text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="border-t border-border bg-primary text-primary-foreground py-16 px-4 md:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight">
            START TRACKING YOUR ADMISSIONS FREE
          </h2>
          <p className="text-xs sm:text-sm text-primary-foreground/90 max-w-xl mx-auto font-mono">
            Join students worldwide managing their applications with maximum precision.
          </p>
          <div className="pt-2">
            <Link to={isSignedIn ? "/dashboard" : "/register"}>
              <Button className="bg-background text-foreground hover:bg-background/90 rounded-none px-8 h-12 text-xs font-black uppercase tracking-widest border border-border shadow-[4px_4px_0_#9353ff]">
                {isSignedIn ? "Go to Dashboard" : "Create Free Account →"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-border py-8 px-4 md:px-8 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-foreground">COLLEGE.TRACKER</span>
            <span>· Built by Abhishek © 2026</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to={isSignedIn ? "/dashboard" : "/login"} className="hover:text-primary transition-colors">
              {isSignedIn ? "Dashboard" : "Login"}
            </Link>
            <Link to="/register" className="hover:text-primary transition-colors">
              Register
            </Link>
            <a href="https://github.com/codewithabhiishek" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
