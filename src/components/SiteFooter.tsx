export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-sm text-zinc-500 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-semibold text-zinc-300">PromptLabTools Engineering Showcase</p>
          <p className="mt-2 max-w-2xl leading-6">
            Public-safe examples of AI workflow orchestration, lead-capture automation, platform architecture, and quality gates.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
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
