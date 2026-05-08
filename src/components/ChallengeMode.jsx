import { CheckCircle2, Eye, EyeOff, Lightbulb, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { challenges } from '../data/challenges';

function ChallengeMode() {
  const [activeId, setActiveId] = useState(challenges[0].id);
  const [showHint, setShowHint] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const [solved, setSolved] = useState([]);

  const activeChallenge = challenges.find((challenge) => challenge.id === activeId) || challenges[0];

  const toggleSolved = () => {
    setSolved((currentSolved) => (
      currentSolved.includes(activeChallenge.id)
        ? currentSolved.filter((id) => id !== activeChallenge.id)
        : [...currentSolved, activeChallenge.id]
    ));
  };

  const switchChallenge = (id) => {
    setActiveId(id);
    setShowHint(false);
    setShowFix(false);
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="tool-panel overflow-hidden">
        <div className="border-b border-white/10 p-4">
          <h2 className="text-lg font-semibold text-white">Fix This Sink</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Practice identifying the context, source, sink, and safer replacement.
          </p>
        </div>
        <div className="divide-y divide-white/10">
          {challenges.map((challenge) => {
            const isActive = challenge.id === activeChallenge.id;
            const isSolved = solved.includes(challenge.id);

            return (
              <button
                key={challenge.id}
                type="button"
                onClick={() => switchChallenge(challenge.id)}
                className={`flex w-full items-start gap-3 p-4 text-left transition ${
                  isActive ? 'bg-teal-300/[0.08]' : 'hover:bg-white/[0.025]'
                }`}
              >
                <CheckCircle2
                  className={`mt-0.5 h-5 w-5 shrink-0 ${isSolved ? 'text-lime-300' : 'text-slate-600'}`}
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-medium text-white">{challenge.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">{challenge.context} / {challenge.difficulty}</span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="tool-panel">
        <div className="border-b border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">{activeChallenge.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">{activeChallenge.prompt}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="status-pill border-amber-300/25 text-amber-100">{activeChallenge.difficulty}</span>
              <span className="status-pill border-teal-300/25 text-teal-100">{activeChallenge.context}</span>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-rose-100">Vulnerable code</h3>
              <pre className="code-block p-4"><code>{activeChallenge.vulnerableCode}</code></pre>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-amber-100">Proof payload</h3>
              <pre className="code-block p-4"><code>{activeChallenge.payload}</code></pre>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowHint((value) => !value)}
              className="icon-button px-3 py-2 text-sm"
            >
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              <span>{showHint ? 'Hide hint' : 'Show hint'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFix((value) => !value)}
              className="icon-button px-3 py-2 text-sm"
            >
              {showFix ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              <span>{showFix ? 'Hide fix' : 'Reveal fix'}</span>
            </button>
            <button
              type="button"
              onClick={toggleSolved}
              className="icon-button px-3 py-2 text-sm"
            >
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              <span>{solved.includes(activeChallenge.id) ? 'Marked solved' : 'Mark solved'}</span>
            </button>
          </div>

          {showHint && (
            <div className="muted-panel border-amber-300/20 p-4">
              <h3 className="text-sm font-semibold text-amber-100">Hint</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{activeChallenge.hint}</p>
            </div>
          )}

          {showFix && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-teal-100">One safe fix</h3>
                <pre className="code-block p-4"><code>{activeChallenge.fix}</code></pre>
              </div>
              <div className="muted-panel p-4">
                <h3 className="text-sm font-semibold text-white">Lesson</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{activeChallenge.lesson}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ChallengeMode;
