import Link from "next/link";

const navItems = [
  { href: "/", label: "Showcase" },
  { href: "/workflows", label: "Workflows" },
  { href: "/architecture", label: "Architecture" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10 text-sm font-bold text-amber-200">
            PLT
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">PromptLabTools</p>
            <p className="text-xs text-zinc-500">Engineering Showcase</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-zinc-400">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.promptlabtools.com"
            className="hidden rounded-full bg-amber-300 px-4 py-2 font-semibold text-black transition hover:bg-amber-200 sm:inline-flex"
          >
            Live Product
          </a>
        </nav>
      </div>
    </header>
  );
}
