import Link from 'next/link';
import {
  Users, TrendingUp, Calendar, Star, ArrowRight, CheckCircle2,
  BarChart3, Shield, Zap, ChevronRight
} from '@/components/ui/Icons';

const features = [
  { icon: Users, title: 'Full Pipeline Visibility', desc: 'Track every applicant from first touch to active rep. Never lose anyone in the process.' },
  { icon: BarChart3, title: 'Recruiting Funnel', desc: 'Visual funnel shows exactly where candidates drop off and where to focus your energy.' },
  { icon: Calendar, title: 'Smart Calendar', desc: 'All interviews and trainings in one view. Leadership knows what\'s coming before the day starts.' },
  { icon: Star, title: 'Rep Quality Scoring', desc: 'Score reps on 5 dimensions. A/B/C tier classification happens automatically.' },
  { icon: TrendingUp, title: 'Performance Tracking', desc: 'Calls, meetings booked, and revenue tracked weekly per rep. Spot stars and laggards instantly.' },
  { icon: Shield, title: 'Multi-Business Support', desc: 'Manage reps across Vexon, EasyScale, Telenza, Solv Global, and CTC Courts in one place.' },
];

const stats = [
  { value: '14', label: 'Status stages tracked' },
  { value: '5', label: 'Businesses in one view' },
  { value: '3', label: 'Training stages monitored' },
  { value: '100%', label: 'Pipeline visibility' },
];

const statuses = [
  'Applied', 'Contacted', 'Interview Scheduled', 'Interview Completed',
  'Hired', 'Training 1', 'Training 2', 'Training 3', 'Active Rep',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-dark-800/50 backdrop-blur-md bg-dark-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Omira</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-dark-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-dark-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Built for high-volume sales recruiting
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
            Your entire
            <span className="gradient-text block">recruiting pipeline</span>
            in one view.
          </h1>
          <p className="text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop losing candidates in spreadsheets. Omira gives leadership complete visibility
            from first application to active, performing rep — with zero confusion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-base px-6 py-3">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-secondary text-base px-6 py-3 border border-dark-700">
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-dark-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-extrabold gradient-text mb-2">{s.value}</div>
              <div className="text-dark-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline Visual */}
      <section id="pipeline" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Every stage. Zero guesswork.</h2>
            <p className="text-dark-400 text-lg">14 status stages tracked automatically. Leadership always knows where everyone stands.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {statuses.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-lg border border-dark-700 bg-dark-900 text-sm font-medium text-dark-200">
                  {s}
                </div>
                {i < statuses.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-brand-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-dark-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything leadership needs</h2>
            <p className="text-dark-400 text-lg">No bloat. No complexity. Just the features that move the needle.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-dark-700 bg-dark-900 hover:border-brand-500/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4 group-hover:bg-brand-500/25 transition-colors">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rep Scoring */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Know exactly who your A players are.</h2>
            <p className="text-dark-400 leading-relaxed mb-8">
              Score every rep on Work Ethic, Coachability, Communication, Consistency, and Overall Rating.
              The system automatically places them into A, B, or C tiers — no subjectivity.
            </p>
            <div className="space-y-3">
              {[
                { tier: 'A Player', desc: 'Future leader — score 8.0+', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
                { tier: 'B Player', desc: 'Solid contributor — score 5.0–7.9', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
                { tier: 'C Player', desc: 'Needs improvement — below 5.0', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
              ].map(t => (
                <div key={t.tier} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${t.color}`}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">{t.tier}</span>
                    <span className="text-sm opacity-70 ml-2">{t.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {['Work Ethic', 'Coachability', 'Communication', 'Consistency', 'Overall Rating'].map((dim, i) => (
              <div key={dim} className="p-4 rounded-lg bg-dark-900 border border-dark-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-dark-300">{dim}</span>
                  <span className="text-sm font-bold text-brand-400">{8 + (i % 3)} / 10</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-brand rounded-full"
                    style={{ width: `${(8 + (i % 3)) * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-dark-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, honest pricing</h2>
          <p className="text-dark-400 text-lg mb-16">Start free. Upgrade when you grow.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: '$49', period: '/mo', features: ['3 team members', '1 business', 'Full pipeline tracking', 'Calendar view'], highlight: false },
              { name: 'Growth', price: '$99', period: '/mo', features: ['10 team members', '5 businesses', 'Rep scoring & tiers', 'Performance tracking', 'Priority support'], highlight: true },
              { name: 'Scale', price: '$199', period: '/mo', features: ['Unlimited members', 'Unlimited businesses', 'Everything in Growth', 'Advanced analytics', 'Dedicated support'], highlight: false },
            ].map(plan => (
              <div key={plan.name} className={`p-6 rounded-xl border ${plan.highlight ? 'border-brand-500 bg-brand-500/10' : 'border-dark-700 bg-dark-900'}`}>
                {plan.highlight && (
                  <div className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">Most Popular</div>
                )}
                <div className="text-2xl font-bold mb-1">{plan.name}</div>
                <div className="text-3xl font-extrabold mb-6">
                  {plan.price}<span className="text-sm text-dark-400 font-normal">{plan.period}</span>
                </div>
                <ul className="space-y-3 text-sm text-dark-300 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${plan.highlight ? 'bg-brand-500 text-white hover:bg-brand-600' : 'border border-dark-600 hover:border-brand-500 text-dark-200'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to see your full pipeline?</h2>
          <p className="text-dark-400 text-lg mb-10">Set up in minutes. No credit card required.</p>
          <Link href="/signup" className="btn-primary text-base px-8 py-4 inline-flex">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8 px-6 text-center text-dark-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-gradient-brand flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-dark-300">Omira</span>
        </div>
        <p>© {new Date().getFullYear()} Omira. Built for sales organizations that move fast.</p>
      </footer>
    </div>
  );
}
