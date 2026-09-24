export function PageIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-black/8 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-16 sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </header>
  );
}
