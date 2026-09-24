import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Eli.",
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        title="Contact"
        description="Send a note and we will get back to you."
      />
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <form className="grid max-w-xl gap-4">
          <label className="grid gap-1.5 text-sm font-medium">
            Name
            <input
              name="name"
              type="text"
              autoComplete="name"
              className="h-11 rounded-lg border border-black/10 bg-transparent px-3 font-normal dark:border-white/15"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="h-11 rounded-lg border border-black/10 bg-transparent px-3 font-normal dark:border-white/15"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Message
            <textarea
              name="message"
              rows={5}
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 font-normal dark:border-white/15"
            />
          </label>
          <button
            type="button"
            className="h-11 w-fit rounded-full bg-foreground px-5 text-sm font-medium text-background"
          >
            Send
          </button>
        </form>
      </section>
    </>
  );
}
