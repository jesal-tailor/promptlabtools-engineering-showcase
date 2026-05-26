type WorkflowCardProps = {
  title: string;
  description: string;
  inputs: string[];
  outputs: string[];
};

export function WorkflowCard({ title, description, inputs, outputs }: WorkflowCardProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6 shadow-xl shadow-black/20">
      <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-3 leading-7 text-zinc-400">{description}</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Inputs</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {inputs.map((item) => (
              <li key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Outputs</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {outputs.map((item) => (
              <li key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
