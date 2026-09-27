import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { Job } from "./types";

const FILE = path.join(process.cwd(), "backend/data/jobs.json");

export type JobInput = {
  heading: string;
  details: string;
  location: string;
  type: string;
  showOnTop: boolean;
};

let writeLock: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>) {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readJobs() {
  const raw = await fs.readFile(FILE, "utf8");
  const parsed = JSON.parse(raw) as Job[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeJobs(jobs: Job[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, `${JSON.stringify(jobs, null, 2)}\n`);
}

export function sortJobsForCareers(jobs: Job[]) {
  const top = jobs.filter((job) => job.showOnTop);
  const rest = jobs.filter((job) => !job.showOnTop);
  return [...top, ...rest];
}

export async function listJobs() {
  return withLock(readJobs);
}

export async function listPublicJobs() {
  const jobs = await listJobs();
  return sortJobsForCareers(jobs);
}

function normalize(input: JobInput): JobInput {
  const heading = input.heading.trim();
  const details = input.details.trim();
  const location = input.location.trim();
  const type = input.type.trim();

  if (!heading || !details || !location || !type) {
    throw new Error("Heading, details, location, and type are required.");
  }

  return {
    heading,
    details,
    location,
    type,
    showOnTop: Boolean(input.showOnTop),
  };
}

export async function createJob(input: JobInput) {
  const data = normalize(input);
  return withLock(async () => {
    const jobs = await readJobs();
    const job: Job = {
      id: randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    jobs.push(job);
    await writeJobs(jobs);
    return job;
  });
}

export async function updateJob(id: string, input: JobInput) {
  const data = normalize(input);
  return withLock(async () => {
    const jobs = await readJobs();
    const index = jobs.findIndex((job) => job.id === id);
    if (index === -1) return null;
    const next: Job = { ...jobs[index], ...data };
    jobs[index] = next;
    await writeJobs(jobs);
    return next;
  });
}

export async function deleteJob(id: string) {
  return withLock(async () => {
    const jobs = await readJobs();
    const next = jobs.filter((job) => job.id !== id);
    if (next.length === jobs.length) return false;
    await writeJobs(next);
    return true;
  });
}
