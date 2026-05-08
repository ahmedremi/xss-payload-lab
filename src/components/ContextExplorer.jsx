import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import SandboxPreview from './SandboxPreview';
import { contexts, encodeForContext, getContextSnippet, getRiskNotes } from '../utils/encoder';

function ContextExplorer({ value, onValueChange, context, onContextChange }) {
  const encodedValue = encodeForContext(value, context);
  const vulnerableSnippet = getContextSnippet(value, context, false);
  const encodedSnippet = getContextSnippet(value, context, true);
  const riskNotes = getRiskNotes(value);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
      <div className="tool-panel">
        <div className="border-b border-white/10 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">Context Explorer</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Compare the vulnerable source form with the encoded form for the exact output context.
          </p>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Payload input</span>
            <textarea
              value={value}
              onChange={(event) => onValueChange(event.target.value)}
              rows={4}
              className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-ink-950 p-3 font-mono text-sm leading-6 text-white placeholder:text-slate-500"
              spellCheck="false"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Output contexts">
            {contexts.map((item) => {
              const isActive = context === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onContextChange(item.id)}
                  className={`rounded-lg border px-3 py-3 text-left text-sm transition ${
                    isActive
                      ? 'border-teal-300/70 bg-teal-300/10 text-teal-100'
                      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-teal-300/40'
                  }`}
                >
                  <span className="block font-medium">{item.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{item.encodedLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-rose-100">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Vulnerable source
              </div>
              <pre className="code-block p-3"><code>{vulnerableSnippet}</code></pre>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-teal-100">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Encoded source
              </div>
              <pre className="code-block p-3"><code>{encodedSnippet}</code></pre>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <div className="muted-panel min-w-0 p-4">
              <h3 className="text-sm font-semibold text-white">Raw value</h3>
              <p className="mt-2 break-all font-mono text-sm leading-6 text-slate-300">{value || 'Empty input'}</p>
            </div>
            <div className="hidden items-center text-slate-500 lg:flex">
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="muted-panel min-w-0 p-4">
              <h3 className="text-sm font-semibold text-white">Encoded value</h3>
              <p className="mt-2 break-all font-mono text-sm leading-6 text-slate-300">{encodedValue || 'Empty input'}</p>
            </div>
          </div>

          <div className="muted-panel p-4">
            <h3 className="text-sm font-semibold text-white">Signals</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {riskNotes.map((note) => (
                <span key={note} className="status-pill border-amber-300/25 text-amber-100">
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SandboxPreview value={value} context={context} />
    </section>
  );
}

export default ContextExplorer;
