import { Code2, Database, Globe2, MousePointerClick, ShieldCheck } from 'lucide-react';

const xssTypes = [
  {
    title: 'Reflected XSS',
    icon: Globe2,
    flow: ['Request parameter', 'Server response', 'Browser parser'],
    description: 'The payload comes from the current request and is immediately reflected into the response.',
  },
  {
    title: 'Stored XSS',
    icon: Database,
    flow: ['Saved input', 'Database record', 'Other users'],
    description: 'The payload is saved first, then rendered later for one or more users.',
  },
  {
    title: 'DOM XSS',
    icon: MousePointerClick,
    flow: ['Client source', 'JavaScript transform', 'DOM sink'],
    description: 'The vulnerable flow happens in browser JavaScript without needing a server-rendered payload.',
  },
];

const sinkExamples = [
  { sink: 'innerHTML', safer: 'textContent or sanitized HTML' },
  { sink: 'outerHTML', safer: 'DOM construction APIs' },
  { sink: 'insertAdjacentHTML', safer: 'createElement plus text nodes' },
  { sink: 'document.write', safer: 'Avoid in application code' },
  { sink: 'href', safer: 'URL parser plus protocol allowlist' },
  { sink: 'script text', safer: 'JSON data blocks or external scripts' },
];

function XSSExplainer() {
  return (
    <section className="space-y-5">
      <div className="tool-panel p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-white">XSS Mental Model</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
          Cross-site scripting appears when untrusted data crosses from data into executable browser syntax.
          The defensive question is always the same: which context is this value entering?
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {xssTypes.map((type) => {
          const Icon = type.icon;

          return (
            <article key={type.title} className="tool-panel p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-300/30 bg-teal-300/10 text-teal-200">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white">{type.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{type.description}</p>
              <div className="mt-4 grid gap-2">
                {type.flow.map((step, index) => (
                  <div key={step} className="flex items-center gap-2 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-xs text-slate-300">
                      {index + 1}
                    </span>
                    <span className="text-slate-300">{step}</span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="tool-panel overflow-hidden">
          <div className="border-b border-white/10 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-teal-200" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-white">Common DOM sinks</h3>
            </div>
          </div>
          <div className="divide-y divide-white/10">
            {sinkExamples.map((item) => (
              <div key={item.sink} className="grid gap-3 p-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:p-5">
                <code className="font-mono text-sm text-rose-100">{item.sink}</code>
                <span className="text-sm leading-6 text-slate-300">{item.safer}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tool-panel p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-lime-200" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-white">Practical order</h3>
          </div>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>1. Prefer APIs that keep user input as text.</li>
            <li>2. Encode for the exact output context.</li>
            <li>3. Validate URL schemes before navigation.</li>
            <li>4. Use CSP as a second layer, not the only fix.</li>
            <li>5. Treat custom HTML rendering as high-risk code.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default XSSExplainer;
