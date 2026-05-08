import { RefreshCcw, TerminalSquare } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { encodeForContext } from '../utils/encoder';

function escapeScriptText(value) {
  return String(value).replace(/<\/script/gi, '<\\/script');
}

function buildSandboxBody(value, context, mode) {
  const renderedValue = mode === 'encoded' ? encodeForContext(value, context) : value;

  if (context === 'attribute') {
    return `
      <label class="label" for="field">Attribute target</label>
      <input id="field" class="field" value="${renderedValue}" autofocus />
      <script>
        setTimeout(() => {
          const field = document.getElementById('field');
          if (field) field.focus();
        }, 250);
      </script>
    `;
  }

  if (context === 'javascript') {
    return `
      <div id="output" class="output">Waiting for script execution...</div>
      <script>
        try {
          const userInput = '${escapeScriptText(renderedValue)}';
          document.getElementById('output').textContent = userInput;
          parent.postMessage({ type: 'xss-info', message: 'Inline script completed without alert.' }, '*');
        } catch (error) {
          parent.postMessage({ type: 'xss-error', message: error.message }, '*');
        }
      </script>
    `;
  }

  if (context === 'url') {
    return `
      <a id="lab-link" class="link" href="${renderedValue}">Continue</a>
      <p class="small">The lab attempts the link target inside this sandbox.</p>
      <script>
        setTimeout(() => {
          const link = document.getElementById('lab-link');
          const href = link ? link.getAttribute('href') || '' : '';
          parent.postMessage({ type: 'xss-info', message: 'Testing href: ' + href }, '*');
          if (href.trim().toLowerCase().startsWith('javascript:')) {
            window.location.href = href;
          }
        }, 300);
      </script>
    `;
  }

  return `
    <div class="slot">${renderedValue}</div>
  `;
}

function buildSrcDoc(value, context, mode) {
  const body = buildSandboxBody(value, context, mode);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'none' data:; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'"
    />
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        min-height: 100vh;
        background: #091018;
        color: #dbeafe;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .wrap { padding: 18px; }
      .banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.22);
        padding-bottom: 12px;
        margin-bottom: 16px;
      }
      .badge {
        border: 1px solid rgba(45, 212, 191, 0.36);
        border-radius: 999px;
        color: #99f6e4;
        font-size: 12px;
        padding: 4px 8px;
      }
      .slot, .output {
        min-height: 120px;
        border: 1px solid rgba(148, 163, 184, 0.24);
        border-radius: 8px;
        background: rgba(15, 23, 42, 0.72);
        padding: 14px;
      }
      .field, .link {
        display: inline-flex;
        min-height: 42px;
        max-width: 100%;
        align-items: center;
        border-radius: 8px;
        border: 1px solid rgba(45, 212, 191, 0.42);
        background: rgba(15, 23, 42, 0.8);
        color: #ecfeff;
        padding: 0 12px;
      }
      .label, .small {
        display: block;
        margin: 0 0 10px;
        color: #94a3b8;
        font-size: 13px;
      }
      .link { text-decoration: none; }
    </style>
    <script>
      (() => {
        const send = (type, message) => {
          parent.postMessage({ type, message: String(message) }, '*');
        };

        window.alert = (message) => send('xss-alert', 'alert(' + JSON.stringify(String(message)) + ')');
        window.confirm = (message) => {
          send('xss-alert', 'confirm(' + JSON.stringify(String(message)) + ')');
          return false;
        };
        window.prompt = (message) => {
          send('xss-alert', 'prompt(' + JSON.stringify(String(message)) + ')');
          return null;
        };
        window.open = (url) => {
          send('xss-blocked', 'window.open blocked: ' + url);
          return null;
        };
        window.fetch = (...args) => {
          send('xss-blocked', 'fetch blocked: ' + args[0]);
          return Promise.reject(new Error('Network disabled inside lab sandbox'));
        };
        window.addEventListener('error', (event) => {
          send('xss-error', event.message || 'Runtime error');
        });
      })();
    </script>
  </head>
  <body>
    <main class="wrap">
      <div class="banner">
        <strong>${mode === 'encoded' ? 'Encoded render' : 'Vulnerable render'}</strong>
        <span class="badge">${context}</span>
      </div>
      ${body}
    </main>
  </body>
</html>`;
}

function SandboxPreview({ value, context = 'html', compact = false }) {
  const iframeRef = useRef(null);
  const [mode, setMode] = useState('vulnerable');
  const [refreshKey, setRefreshKey] = useState(0);
  const [events, setEvents] = useState([]);

  const srcDoc = useMemo(
    () => buildSrcDoc(value, context, mode === 'encoded' ? 'encoded' : 'vulnerable'),
    [context, mode, refreshKey, value],
  );

  useEffect(() => {
    setEvents([]);
  }, [context, mode, value]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const data = event.data || {};

      if (typeof data.type !== 'string' || !data.type.startsWith('xss-')) {
        return;
      }

      setEvents((currentEvents) => [
        {
          id: `${Date.now()}-${currentEvents.length}`,
          type: data.type,
          message: data.message,
        },
        ...currentEvents,
      ].slice(0, 6));
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <section className={compact ? '' : 'tool-panel'}>
      <div className={compact ? 'mb-3 flex flex-wrap items-center justify-between gap-3' : 'border-b border-white/10 p-4 sm:p-5'}>
        <div>
          <h2 className="text-lg font-semibold text-white">Sandbox Preview</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Payloads run in a unique-origin iframe with scripts allowed and outbound network blocked by CSP.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {['vulnerable', 'encoded'].map((item) => {
            const isActive = mode === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
                  isActive
                    ? 'border-teal-300/70 bg-teal-300/10 text-teal-100'
                    : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-teal-300/40'
                }`}
              >
                {item}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="icon-button px-3 py-2 text-sm"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      <div className={compact ? '' : 'p-4 sm:p-5'}>
        <iframe
          key={refreshKey}
          ref={iframeRef}
          title="Sandboxed XSS payload preview"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          className="h-72 w-full rounded-lg border border-white/10 bg-ink-950"
        />

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
            <TerminalSquare className="h-4 w-4 text-teal-200" aria-hidden="true" />
            Event log
          </div>
          <div className="code-block min-h-20 p-3">
            {events.length === 0 ? (
              <p className="text-sm text-slate-500">No sandbox events captured yet.</p>
            ) : (
              <ul className="space-y-2">
                {events.map((event) => (
                  <li key={event.id} className="text-sm">
                    <span className="text-teal-200">{event.type}</span>
                    <span className="text-slate-500"> : </span>
                    <span>{event.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SandboxPreview;
