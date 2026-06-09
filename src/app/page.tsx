'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import logo from '../../public/omiralogo.png';
import Link from 'next/link';
import {
  Users, TrendingUp, Calendar, Star, ArrowRight, CheckCircle2,
  BarChart3, Shield, ChevronRight,
} from '@/components/ui/Icons';

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(end: number, inView: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const totalFrames = Math.round(duration / 16);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round((frame / totalFrames) * end));
      if (frame >= totalFrames) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, inView, duration]);
  return count;
}

// ─── Reveal wrapper ──────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Animated stat counter ───────────────────────────────────────────────────

function StatItem({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, inView } = useInView(0.3);
  const count = useCounter(value, inView);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
        {count}{suffix}
      </div>
      <div className="text-dark-400 text-sm">{label}</div>
    </div>
  );
}

// ─── Animated score bar ──────────────────────────────────────────────────────

function ScoreBar({
  label,
  score,
  delay = 0,
  inView,
}: {
  label: string;
  score: number;
  delay?: number;
  inView: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-dark-900 border border-dark-700 hover:border-brand-500/30 transition-colors duration-300">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-dark-300">{label}</span>
        <span className="text-sm font-bold text-brand-400">{score} / 10</span>
      </div>
      <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-brand rounded-full transition-all duration-1000 ease-out"
          style={{ width: inView ? `${score * 10}%` : '0%', transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  { icon: Users,      title: 'Full Pipeline Visibility',  desc: 'Track every applicant from first touch to active rep. Never lose anyone in the process.' },
  { icon: BarChart3,  title: 'Recruiting Funnel',         desc: 'Visual funnel shows exactly where candidates drop off and where to focus your energy.' },
  { icon: Calendar,   title: 'Smart Calendar',            desc: "All interviews and trainings in one view. Leadership knows what's coming before the day starts." },
  { icon: Star,       title: 'Rep Quality Scoring',       desc: 'Score reps on 5 dimensions. A/B/C tier classification happens automatically.' },
  { icon: TrendingUp, title: 'Performance Tracking',      desc: 'Calls, meetings booked, and revenue tracked weekly per rep. Spot stars and laggards instantly.' },
  { icon: Shield,     title: 'Multi-Business Support',    desc: 'Manage reps across Vexon, EasyScale, Telenza, Solv Global, and CTC Courts in one place.' },
];

const statuses = [
  'Applied', 'Contacted', 'Interview Scheduled', 'Interview Completed',
  'Hired', 'Training 1', 'Training 2', 'Training 3', 'Active Rep',
];

const scoringDims = [
  { label: 'Work Ethic',     score: 9 },
  { label: 'Coachability',   score: 8 },
  { label: 'Communication',  score: 10 },
  { label: 'Consistency',    score: 8 },
  { label: 'Overall Rating', score: 9 },
];

const tiers = [
  { tier: 'A Player', desc: 'Future leader — score 8.0+',          color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
  { tier: 'B Player', desc: 'Solid contributor — score 5.0–7.9',   color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  { tier: 'C Player', desc: 'Needs improvement — below 5.0',       color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
];

const plans = [
  { name: 'Starter', price: '$49',  features: ['3 team members', '1 business', 'Full pipeline tracking', 'Calendar view'],                                    highlight: false },
  { name: 'Growth',  price: '$99',  features: ['10 team members', '5 businesses', 'Rep scoring & tiers', 'Performance tracking', 'Priority support'],         highlight: true  },
  { name: 'Scale',   price: '$199', features: ['Unlimited members', 'Unlimited businesses', 'Everything in Growth', 'Advanced analytics', 'Dedicated support'], highlight: false },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const scoringRef = useRef<HTMLDivElement>(null);
  const [scoringInView, setScoringInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = scoringRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setScoringInView(true); },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">

      {/* ── Ambient background orbs ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[130px] animate-float-slow animate-glow-pulse" />
        <div className="absolute top-[35%] -right-[15%] w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[110px] animate-float-delayed" />
        <div className="absolute bottom-[5%] left-[15%] w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[90px] animate-float" />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-dark-800/60 bg-dark-950/90 backdrop-blur-xl shadow-lg shadow-dark-950/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
                      <Image src={logo} alt="EASN Logo" className="h-10 w-10 rounded-lg object-contain" width={40} height={40} />

          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-dark-300">
            {([['#features', 'Features'], ['#pipeline', 'Pipeline'], ['#pricing', 'Pricing']] as const).map(
              ([href, label]) => (
                <a key={href} href={href} className="relative group hover:text-white transition-colors duration-200">
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brand-400 group-hover:w-full transition-all duration-300" />
                </a>
              ),
            )}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-dark-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="relative btn-primary text-sm overflow-hidden group shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 transition-shadow duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-brand-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-28 px-6 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-5%,rgba(99,102,241,0.18),transparent)]" />
        <div className="max-w-4xl mx-auto relative">

          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Built for high-volume sales recruiting
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            Your entire
            <span className="gradient-text block">recruiting pipeline</span>
            in one view.
          </h1>

          <p
            className="text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
            style={{ animationDelay: '0.35s' }}
          >
            Stop losing candidates in spreadsheets. Omira gives leadership complete visibility
            from first application to active, performing rep — with zero confusion.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            {/* Primary CTA with animated gradient */}
            <Link
              href="/signup"
              className="relative inline-flex items-center justify-center gap-2 text-base px-8 py-3.5 rounded-lg font-semibold text-white overflow-hidden group shadow-lg shadow-brand-500/25 hover:shadow-brand-500/45 transition-shadow duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-brand-500 via-violet-500 to-brand-600 bg-[size:200%_100%] animate-gradient-x" />
            </Link>

            <Link
              href="/login"
              className="btn-secondary text-base px-8 py-3.5 border border-dark-700 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all duration-300"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-dark-800/50 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem value={14}  label="Status stages tracked" />
          <StatItem value={5}   label="Businesses in one view" />
          <StatItem value={3}   label="Training stages monitored" />
          <StatItem value={100} label="Pipeline visibility" suffix="%" />
        </div>
      </section>

      {/* ── Pipeline ────────────────────────────────────────────────────── */}
      <section id="pipeline" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Every stage. Zero guesswork.</h2>
            <p className="text-dark-400 text-lg">
              14 status stages tracked automatically. Leadership always knows where everyone stands.
            </p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-3">
            {statuses.map((s, i) => (
              <Reveal key={s} delay={i * 55}>
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2.5 rounded-xl border border-dark-700 bg-dark-900/80 text-sm font-medium text-dark-200 hover:border-brand-500/50 hover:text-white hover:bg-brand-500/10 transition-all duration-300 cursor-default select-none">
                    {s}
                  </div>
                  {i < statuses.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-brand-500/50 flex-shrink-0" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-dark-900/25">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything leadership needs</h2>
            <p className="text-dark-400 text-lg">No bloat. No complexity. Just the features that move the needle.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 75}>
                <div className="h-full p-6 rounded-2xl border border-dark-700 bg-dark-900/80 hover:border-brand-500/40 hover:bg-dark-900 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center mb-5 group-hover:bg-brand-500/25 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rep Scoring ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div ref={scoringRef} className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Know exactly who your A players are.
            </h2>
            <p className="text-dark-400 leading-relaxed mb-8">
              Score every rep on Work Ethic, Coachability, Communication, Consistency, and Overall
              Rating. The system automatically places them into A, B, or C tiers — no subjectivity.
            </p>
            <div className="space-y-3">
              {tiers.map((t, i) => (
                <div
                  key={t.tier}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border ${t.color} hover:scale-[1.02] transition-transform duration-200`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">{t.tier}</span>
                    <span className="text-sm opacity-70 ml-2">{t.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="space-y-4">
            {scoringDims.map(({ label, score }, i) => (
              <ScoreBar
                key={label}
                label={label}
                score={score}
                delay={i * 110}
                inView={scoringInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-dark-900/25">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, honest pricing</h2>
            <p className="text-dark-400 text-lg">Start free. Upgrade when you grow.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 90}>
                <div
                  className={`relative p-7 rounded-2xl border h-full flex flex-col transition-all duration-300 hover:-translate-y-1.5 ${
                    plan.highlight
                      ? 'border-brand-500 bg-brand-500/10 shadow-2xl shadow-brand-500/10'
                      : 'border-dark-700 bg-dark-900/80 hover:border-dark-600'
                  }`}
                >
                  {plan.highlight && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-500/8 to-transparent pointer-events-none" />
                      <div className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">Most Popular</div>
                    </>
                  )}
                  <div className="text-2xl font-bold mb-1">{plan.name}</div>
                  <div className="text-4xl font-extrabold mb-6">
                    {plan.price}
                    <span className="text-sm text-dark-400 font-normal">/mo</span>
                  </div>
                  <ul className="flex-1 space-y-3 text-sm text-dark-300 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      plan.highlight
                        ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20'
                        : 'border border-dark-600 hover:border-brand-500 text-dark-200 hover:text-white hover:bg-brand-500/10'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_50%_50%,rgba(99,102,241,0.13),transparent)]" />
        <Reveal className="max-w-2xl mx-auto relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to see your full pipeline?</h2>
          <p className="text-dark-400 text-lg mb-10">Set up in minutes. No credit card required.</p>
          <Link
            href="/signup"
            className="relative inline-flex items-center gap-2 text-base px-10 py-4 rounded-xl font-semibold text-white overflow-hidden group shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 transition-shadow duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-brand-500 to-violet-600" />
            <span className="absolute inset-0 bg-gradient-to-r from-brand-600 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </Reveal>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-dark-800/50 py-8 px-6 text-center text-dark-500 text-sm">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/omiralogo.png"
            alt="Omira"
            width={80}
            height={26}
            className="object-contain opacity-50"
          />
        </div>
        <p>© {new Date().getFullYear()} Omira. Built for sales organizations that move fast.</p>
      </footer>
    </div>
  );
}
