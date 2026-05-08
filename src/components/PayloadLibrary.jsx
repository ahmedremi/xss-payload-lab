import { Check, Copy, Search, SendToBack } from 'lucide-react';
import { useMemo, useState } from 'react';
import { payloadCategories, payloads } from '../data/payloads';

const severityStyles = {
  High: 'border-rose-300/30 bg-rose-400/10 text-rose-200',
  Medium: 'border-amber-300/30 bg-amber-400/10 text-amber-100',
  Low: 'border-lime-300/30 bg-lime-400/10 text-lime-100',
};

function PayloadLibrary({ selectedPayloadId, onSelectPayload, onUsePayload }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [copiedId, setCopiedId] = useState('');

  const filteredPayloads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return payloads.filter((payload) => {
      const matchesCategory = category === 'All' || payload.category === category;
      const matchesQuery = !normalizedQuery
        || payload.name.toLowerCase().includes(normalizedQuery)
        || payload.payload.toLowerCase().includes(normalizedQuery)
        || payload.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const copyPayload = async (payload) => {
    try {
      await navigator.clipboard.writeText(payload.payload);
      setCopiedId(payload.id);
      window.setTimeout(() => setCopiedId(''), 1200);
    } catch {
      setCopiedId('');
    }
  };

  return (
    <section className="tool-panel">
      <div className="border-b border-white/10 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Payload Library</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
              Curated, harmless proof payloads grouped by the output context they are designed to test.
            </p>
          </div>
          <label className="relative block w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search payloads"
              className="h-10 w-full rounded-lg border border-white/10 bg-ink-950 pl-9 pr-3 text-sm text-white placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Payload categories">
          {payloadCategories.map((item) => {
            const isActive = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-sm transition ${
                  isActive
                    ? 'border-teal-300/70 bg-teal-300/10 text-teal-100'
                    : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-teal-300/40'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="divide-y divide-white/10">
        {filteredPayloads.map((payload) => {
          const isSelected = selectedPayloadId === payload.id;

          return (
            <article
              key={payload.id}
              className={`grid gap-4 p-4 transition sm:p-5 lg:grid-cols-[1fr_auto] ${
                isSelected ? 'bg-teal-300/[0.06]' : 'hover:bg-white/[0.025]'
              }`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white">{payload.name}</h3>
                  <span className={`status-pill ${severityStyles[payload.severity] || severityStyles.Medium}`}>
                    {payload.severity}
                  </span>
                  <span className="status-pill">{payload.category}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{payload.description}</p>
                <pre className="code-block mt-3 p-3"><code>{payload.payload}</code></pre>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  <span className="font-medium text-teal-200">Fix: </span>
                  {payload.fix}
                </p>
              </div>

              <div className="flex items-start gap-2 lg:flex-col">
                <button
                  type="button"
                  onClick={() => {
                    onSelectPayload(payload);
                    onUsePayload(payload);
                  }}
                  className="icon-button px-3 py-2 text-sm"
                >
                  <SendToBack className="h-4 w-4" aria-hidden="true" />
                  <span>Use</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyPayload(payload)}
                  className="icon-button px-3 py-2 text-sm"
                >
                  {copiedId === payload.id ? (
                    <Check className="h-4 w-4 text-lime-200" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{copiedId === payload.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PayloadLibrary;
