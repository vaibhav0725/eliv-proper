import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { Lead, LeadSource } from "./types";

const FILE = path.join(process.cwd(), "backend/data/leads.json");

let writeLock: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>) {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readLeads() {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Lead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeLeads(leads: Lead[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, `${JSON.stringify(leads, null, 2)}\n`);
}

function sortNewest(leads: Lead[]) {
  return [...leads].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export async function listLeads(source?: LeadSource) {
  const leads = await withLock(readLeads);
  const filtered = source
    ? leads.filter((lead) => lead.source === source)
    : leads;
  return sortNewest(filtered);
}

export async function createLead(email: string, source: LeadSource) {
  const value = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error("Enter a valid email address.");
  }
  if (source !== "newsletter" && source !== "book-a-call") {
    throw new Error("Unknown form.");
  }

  return withLock(async () => {
    const leads = await readLeads();
    const lead: Lead = {
      id: randomUUID(),
      email: value,
      source,
      submittedAt: new Date().toISOString(),
    };
    leads.push(lead);
    await writeLeads(leads);
    return lead;
  });
}

export async function deleteLead(id: string) {
  return withLock(async () => {
    const leads = await readLeads();
    const next = leads.filter((lead) => lead.id !== id);
    if (next.length === leads.length) return false;
    await writeLeads(next);
    return true;
  });
}
