import Link from "next/link";
import { navItems } from "@/lib/nav";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 sm:py-24">
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome to Eli
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Explore the company, what we do, the industries we serve, open roles,
          and how to get in touch.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex h-full flex-col gap-2 rounded-2xl border border-black/8 p-5 transition-colors hover:bg-black/3 dark:border-white/10 dark:hover:bg-white/5"
            >
              <span className="text-lg font-medium">{item.label}</span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.href}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
