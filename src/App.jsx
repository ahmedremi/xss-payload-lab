import { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import PayloadLibrary from './components/PayloadLibrary';
import ContextExplorer from './components/ContextExplorer';
import SandboxPreview from './components/SandboxPreview';
import ChallengeMode from './components/ChallengeMode';
import CSPPlayground from './components/CSPPlayground';
import XSSExplainer from './components/XSSExplainer';
import { defaultPayload, payloads } from './data/payloads';
import { contexts } from './utils/encoder';
import { tabs } from './components/Navbar';

function SandboxTab({ value, onValueChange, context, onContextChange }) {
  return (
    <section className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="tool-panel p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-white">Sandbox Input</h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          Run the current payload directly in the iframe preview and compare vulnerable versus encoded rendering.
        </p>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-200">Payload</span>
          <textarea
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            rows={7}
            className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-ink-950 p-3 font-mono text-sm leading-6 text-white"
            spellCheck="false"
          />
        </label>

        <div className="mt-5 grid gap-2">
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
                <span className="mt-1 block text-xs text-slate-500">{item.vulnerableLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <SandboxPreview value={value} context={context} />
    </section>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('context');
  const [selectedPayload, setSelectedPayload] = useState(defaultPayload);
  const [labValue, setLabValue] = useState(defaultPayload.payload);
  const [context, setContext] = useState(defaultPayload.context);

  const currentPayload = useMemo(
    () => payloads.find((payload) => payload.id === selectedPayload?.id) || defaultPayload,
    [selectedPayload],
  );

  const usePayload = (payload) => {
    setSelectedPayload(payload);
    setLabValue(payload.payload);
    setContext(payload.context);
    setActiveTab('context');
  };

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || 'Lab panel';

  return (
    <div className="min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase text-slate-500">Current payload</p>
            <p className="mt-1 truncate font-mono text-sm text-slate-300">{labValue}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="status-pill border-teal-300/25 text-teal-100">{currentPayload.category}</span>
            <span className="status-pill border-amber-300/25 text-amber-100">{currentPayload.severity}</span>
            <span className="status-pill">{context}</span>
          </div>
        </div>

        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-label={activeTabLabel}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
        >
          {activeTab === 'library' && (
            <PayloadLibrary
              selectedPayloadId={selectedPayload.id}
              onSelectPayload={setSelectedPayload}
              onUsePayload={usePayload}
            />
          )}

          {activeTab === 'context' && (
            <ContextExplorer
              value={labValue}
              onValueChange={setLabValue}
              context={context}
              onContextChange={setContext}
            />
          )}

          {activeTab === 'sandbox' && (
            <SandboxTab
              value={labValue}
              onValueChange={setLabValue}
              context={context}
              onContextChange={setContext}
            />
          )}

          {activeTab === 'challenges' && <ChallengeMode />}
          {activeTab === 'csp' && <CSPPlayground />}
          {activeTab === 'explainer' && <XSSExplainer />}
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="border-t border-white/10 pt-5">
          Built as a static frontend lab. No tracking, accounts, database, or hosted backend required.
        </div>
      </footer>
    </div>
  );
}

export default App;
