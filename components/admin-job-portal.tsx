"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Job } from "@/backend/types";
import { AdminShell } from "@/components/admin-shell";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Casual", "Internship"];

type FormState = {
  heading: string;
  details: string;
  location: string;
  type: string;
  showOnTop: boolean;
};

const emptyForm: FormState = {
  heading: "",
  details: "",
  location: "",
  type: "Full-time",
  showOnTop: false,
};

function toForm(job: Job): FormState {
  return {
    heading: job.heading,
    details: job.details,
    location: job.location,
    type: job.type,
    showOnTop: job.showOnTop,
  };
}

export function AdminJobPortal({ initialJobs }: { initialJobs: Job[] }) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initialJobs);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const listed = useMemo(() => {
    const top = jobs.filter((job) => job.showOnTop);
    const rest = jobs.filter((job) => !job.showOnTop);
    return [...top, ...rest];
  }, [jobs]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const url = editingId
        ? `/api/admin/jobs/${editingId}`
        : "/api/admin/jobs";
      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { job?: Job; error?: string };
      if (!response.ok || !data.job) {
        setError(data.error ?? "Could not save job.");
        return;
      }

      setJobs((current) => {
        if (editingId) {
          return current.map((job) => (job.id === editingId ? data.job! : job));
        }
        return [...current, data.job!];
      });
      setEditingId(null);
      setForm(emptyForm);
      router.refresh();
    } catch {
      setError("Could not save job.");
    } finally {
      setPending(false);
    }
  }

  async function toggleTop(job: Job) {
    setError("");
    const response = await fetch(`/api/admin/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...job, showOnTop: !job.showOnTop }),
    });
    const data = (await response.json()) as { job?: Job; error?: string };
    if (!response.ok || !data.job) {
      setError(data.error ?? "Could not update placement.");
      return;
    }
    setJobs((current) =>
      current.map((item) => (item.id === job.id ? data.job! : item)),
    );
    if (editingId === job.id) {
      setForm((current) => ({ ...current, showOnTop: data.job!.showOnTop }));
    }
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remove this job from the careers page?")) return;
    setError("");
    const response = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not delete job.");
      return;
    }
    setJobs((current) => current.filter((job) => job.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    router.refresh();
  }

  return (
    <AdminShell
      title="Job portal"
      description="Add roles for the careers page. Mark a job as on top or not — no other ranking."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
        <form
          onSubmit={onSubmit}
          className="border border-neutral-950/15 bg-white p-6"
        >
          <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
            {editingId ? "Edit job" : "New job"}
          </p>
          <label className="mt-5 block">
            <span className="text-[11px] tracking-[0.12em] text-zinc-500 uppercase">
              Heading
            </span>
            <input
              required
              value={form.heading}
              onChange={(event) =>
                setForm((current) => ({ ...current, heading: event.target.value }))
              }
              className="mt-2 w-full border border-neutral-950/15 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-[11px] tracking-[0.12em] text-zinc-500 uppercase">
              Details
            </span>
            <textarea
              required
              rows={5}
              value={form.details}
              onChange={(event) =>
                setForm((current) => ({ ...current, details: event.target.value }))
              }
              className="mt-2 w-full resize-y border border-neutral-950/15 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-[11px] tracking-[0.12em] text-zinc-500 uppercase">
              Location
            </span>
            <input
              required
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              className="mt-2 w-full border border-neutral-950/15 px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-[11px] tracking-[0.12em] text-zinc-500 uppercase">
              Type
            </span>
            <select
              required
              value={form.type}
              onChange={(event) =>
                setForm((current) => ({ ...current, type: event.target.value }))
              }
              className="mt-2 w-full border border-neutral-950/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950"
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.showOnTop}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  showOnTop: event.target.checked,
                }))
              }
              className="size-4 accent-neutral-950"
            />
            Show on top of careers page
          </label>
          {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="bg-neutral-950 px-4 py-2.5 text-[11px] font-medium tracking-[0.16em] text-white uppercase disabled:opacity-60"
            >
              {pending ? "Saving…" : editingId ? "Save changes" : "Publish job"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="px-4 py-2.5 text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
              Listed roles
            </p>
            <p className="text-sm text-zinc-500">
              {String(jobs.length).padStart(2, "0")}
            </p>
          </div>
          {listed.length === 0 ? (
            <p className="border border-dashed border-neutral-950/20 px-4 py-10 text-sm text-zinc-500">
              No jobs yet. Publish a role to show it on careers.
            </p>
          ) : (
            <ul className="border-t border-neutral-950/15">
              {listed.map((job) => (
                <li
                  key={job.id}
                  className="border-b border-neutral-950/15 py-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg leading-none font-bold tracking-[-0.03em] uppercase">
                          {job.heading}
                        </h2>
                        <span
                          className={`text-[10px] tracking-[0.14em] uppercase ${
                            job.showOnTop ? "text-neutral-950" : "text-zinc-400"
                          }`}
                        >
                          {job.showOnTop ? "On top" : "Not on top"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        {job.details}
                      </p>
                      <p className="mt-2 text-sm text-zinc-500">
                        {job.location} · {job.type}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleTop(job)}
                        className="border border-neutral-950/15 px-3 py-2 text-[10px] tracking-[0.14em] uppercase hover:border-neutral-950"
                      >
                        {job.showOnTop ? "Remove from top" : "Show on top"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(job.id);
                          setForm(toForm(job));
                          setError("");
                        }}
                        className="border border-neutral-950/15 px-3 py-2 text-[10px] tracking-[0.14em] uppercase hover:border-neutral-950"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(job.id)}
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
      </div>
    </AdminShell>
  );
}
