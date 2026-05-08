import {
  BookOpen,
  Braces,
  FlaskConical,
  Library,
  MonitorPlay,
  Puzzle,
  ShieldCheck,
} from 'lucide-react';

export const tabs = [
  { id: 'library', label: 'Payloads', icon: Library },
  { id: 'context', label: 'Contexts', icon: Braces },
  { id: 'sandbox', label: 'Sandbox', icon: MonitorPlay },
  { id: 'challenges', label: 'Challenges', icon: Puzzle },
  { id: 'csp', label: 'CSP', icon: ShieldCheck },
  { id: 'explainer', label: 'XSS 101', icon: BookOpen },
];

function Navbar({ activeTab, onTabChange }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-teal-300/30 bg-teal-300/10 text-teal-200">
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">XSS Payload Lab</h1>
              <p className="text-sm text-slate-400">Static browser security playground</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="status-pill border-teal-300/25 text-teal-200">No backend</span>
            <span className="status-pill border-lime-300/25 text-lime-200">Sandboxed iframe</span>
            <span className="status-pill border-amber-300/25 text-amber-200">Context-aware encoding</span>
          </div>
        </div>

        <nav aria-label="Lab sections" className="flex gap-2 overflow-x-auto pb-1" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                className={`icon-button shrink-0 px-3 py-2 text-sm ${
                  isActive
                    ? 'border-teal-300/70 bg-teal-300/10 text-teal-100'
                    : 'text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
