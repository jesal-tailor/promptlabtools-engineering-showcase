const layers = [
  "User",
  "Next.js Frontend",
  "Workflow / Product Pages",
  "Mock Lead Capture API",
  "Validation + Event Payload",
  "Mock Workflow Orchestration Layer",
  "Human Review / Automation Queue / Future AI Agents",
];

export function ArchitectureDiagram() {
  return (
    <div className="rounded-[2rem] border border-amber-300/25 bg-black p-5 shadow-2xl shadow-amber-500/10">
      <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">System flow</p>
        <div className="mt-5 grid gap-3">
          {layers.map((layer, index) => (
            <div key={layer}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-zinc-100">
                {layer}
              </div>
              {index < layers.length - 1 && <div className="py-1 text-center text-amber-300">↓</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
