import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-sm text-zinc-500 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-semibold text-zinc-300">PromptLabTools Engineering Showcase</p>
          <p className="mt-2 max-w-2xl leading-6">
            Public-safe examples of AI workflow orchestration, agent runtime patterns, prompt and tool registries, evaluation gates, observability traces, and quality checks.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/tools" className="hover:text-white">
            Tools
          </Link>
          <a href="https://www.promptlabtools.com" className="hover:text-white">
            Website
          </a>
          <a href="https://www.promptlabtools.com/free-guide" className="hover:text-white">
            Free Guide
          </a>
          <a href="https://uk.linkedin.com/in/jesal-tailor-35bb5653" className="hover:text-white">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
