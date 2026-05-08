import { Ban, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cspRules, cspTestCases } from '../data/csp';

function CSPPlayground() {
  const defaultRules = cspRules.reduce((rules, rule) => ({
    ...rules,
    [rule.id]: rule.defaultEnabled,
  }), {});
  const [enabledRules, setEnabledRules] = useState(defaultRules);

  const activeDirectives = useMemo(
    () => cspRules.filter((rule) => enabledRules[rule.id]).map((rule) => rule.directive),
    [enabledRules],
  );

  const toggleRule = (ruleId) => {
    setEnabledRules((rules) => ({
      ...rules,
      [ruleId]: !rules[ruleId],
    }));
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="tool-panel">
        <div className="border-b border-white/10 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">CSP Playground</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Toggle simplified policy rules and see which payload classes would be stopped.
          </p>
        </div>

        <div className="divide-y divide-white/10">
          {cspRules.map((rule) => (
            <label key={rule.id} className="flex cursor-pointer gap-3 p-4 transition hover:bg-white/[0.025] sm:p-5">
              <input
                type="checkbox"
                checked={enabledRules[rule.id]}
                onChange={() => toggleRule(rule.id)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-ink-950 accent-teal-300"
              />
              <span>
                <span className="block font-medium text-white">{rule.label}</span>
                <span className="mt-1 block font-mono text-xs text-teal-100">{rule.directive}</span>
                <span className="mt-2 block text-sm leading-6 text-slate-400">{rule.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="tool-panel p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-teal-100">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Generated policy
          </div>
          <pre className="code-block mt-3 p-4"><code>{activeDirectives.length > 0 ? activeDirectives.join('; ') : 'No CSP rules enabled'}</code></pre>
        </div>

        <div className="tool-panel overflow-hidden">
          <div className="border-b border-white/10 p-4 sm:p-5">
            <h3 className="text-lg font-semibold text-white">Test cases</h3>
          </div>
          <div className="divide-y divide-white/10">
            {cspTestCases.map((testCase) => {
              const blockingRules = testCase.blockedBy.filter((ruleId) => enabledRules[ruleId]);
              const isBlocked = blockingRules.length > 0;

              return (
                <article key={testCase.id} className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_160px]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-white">{testCase.name}</h4>
                      <span className={`status-pill ${isBlocked ? 'border-lime-300/25 text-lime-100' : 'border-rose-300/25 text-rose-100'}`}>
                        {isBlocked ? 'Blocked' : 'Allowed'}
                      </span>
                    </div>
                    <pre className="code-block mt-3 p-3"><code>{testCase.sample}</code></pre>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{testCase.note}</p>
                  </div>
                  <div className="flex items-start lg:justify-end">
                    {isBlocked ? (
                      <div className="inline-flex items-center gap-2 rounded-lg border border-lime-300/25 bg-lime-300/10 px-3 py-2 text-sm text-lime-100">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        Stopped
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-lg border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
                        <Ban className="h-4 w-4" aria-hidden="true" />
                        Can execute
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CSPPlayground;
