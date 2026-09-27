"use client";

import { useState } from "react";
import type { Lead } from "@/backend/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminEmailList({
  initialLeads,
  emptyLabel,
}: {
  initialLeads: Lead[];
  emptyLabel: string;
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [error, setError] = useState("");

  async function remove(id: string) {
    if (!confirm("Remove this email?")) return;
    setError("");
    const response = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not delete.");
      return;
    }
    setLeads((current) => current.filter((lead) => lead.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
          Responses
        </p>
        <p className="text-sm text-zinc-500">
          {String(leads.length).padStart(2, "0")}
        </p>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {leads.length === 0 ? (
        <p className="border border-dashed border-neutral-950/20 bg-white px-4 py-10 text-sm text-zinc-500">
          {emptyLabel}
        </p>
      ) : (
        <ul className="border-t border-neutral-950/15 bg-white">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-950/15 px-4 py-5"
            >
              <div>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sm font-medium underline decoration-zinc-300 underline-offset-4"
                >
                  {lead.email}
                </a>
                <p className="mt-1 text-sm text-zinc-500">
                  {formatDate(lead.submittedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(lead.id)}
                className="border border-red-200 px-3 py-2 text-[10px] tracking-[0.14em] text-red-700 uppercase hover:border-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
