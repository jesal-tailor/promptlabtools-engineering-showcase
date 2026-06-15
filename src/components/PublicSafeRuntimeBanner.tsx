import { publicSafeRuntimeStatement } from "@/lib/deployment/deploymentMetadata";

export function PublicSafeRuntimeBanner() {
  return (
    <section className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
      <p className="font-semibold uppercase tracking-[0.18em] text-cyan-200">
        Public-safe runtime
      </p>
      <p className="mt-2">{publicSafeRuntimeStatement}</p>
    </section>
  );
}
