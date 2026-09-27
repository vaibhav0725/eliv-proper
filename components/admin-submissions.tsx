"use client";

import { useState } from "react";
import type { Application } from "@/backend/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminSubmissions({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [error, setError] = useState("");

  async function remove(id: string) {
    if (!confirm("Remove this submission?")) return;
    setError("");
    const response = await fetch(`/api/admin/applications/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not delete submission.");
      return;
    }
    setApplications((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
          Responses
        </p>
        <p className="text-sm text-zinc-500">
          {String(applications.length).padStart(2, "0")}
        </p>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {applications.length === 0 ? (
        <p className="border border-dashed border-neutral-950/20 px-4 py-10 text-sm text-zinc-500">
          No applications yet. When someone applies from careers, it will show
          up here.
        </p>
      ) : (
        <ul className="border-t border-neutral-950/15">
          {applications.map((item) => (
            <li key={item.id} className="border-b border-neutral-950/15 py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 max-w-2xl">
                  <p className="text-[10px] tracking-[0.14em] text-zinc-500 uppercase">
                    {item.jobHeading}
                  </p>
                  <h2 className="mt-2 text-lg font-bold tracking-[-0.03em]">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    <a
                      href={`mailto:${item.email}`}
                      className="underline decoration-zinc-300 underline-offset-4"
                    >
                      {item.email}
                    </a>
                    {item.phone ? ` · ${item.phone}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatDate(item.submittedAt)}
                  </p>
                  {item.message ? (
                    <p className="mt-3 text-sm leading-6 text-zinc-700">
                      {item.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/api/admin/applications/${item.id}/resume`}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-neutral-950/15 px-3 py-2 text-[10px] tracking-[0.14em] uppercase hover:border-neutral-950"
                  >
                    View resume
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="border border-red-200 px-3 py-2 text-[10px] tracking-[0.14em] text-red-700 uppercase hover:border-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
