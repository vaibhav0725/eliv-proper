import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { Application } from "./types";

const DATA_FILE = path.join(process.cwd(), "backend/data/applications.json");
const RESUME_DIR = path.join(process.cwd(), "backend/data/resumes");
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export type ApplicationInput = {
  jobId: string;
  jobHeading: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  resume: {
    originalName: string;
    buffer: Buffer;
  };
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

async function readApplications() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Application[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeApplications(applications: Application[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, `${JSON.stringify(applications, null, 2)}\n`);
}

function isPdf(buffer: Buffer, fileName: string) {
  const lower = fileName.toLowerCase();
  if (!lower.endsWith(".pdf")) return false;
  return buffer.subarray(0, 5).toString("utf8") === "%PDF-";
}

function sanitizeFileName(name: string) {
  const base = path.basename(name).replace(/[^\w.\- ]+/g, "_").trim();
  return base || "resume.pdf";
}

export async function listApplications() {
  const applications = await withLock(readApplications);
  return [...applications].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export async function getApplication(id: string) {
  const applications = await withLock(readApplications);
  return applications.find((item) => item.id === id) ?? null;
}

export async function readResumeFile(storedName: string) {
  const filePath = path.join(RESUME_DIR, path.basename(storedName));
  return fs.readFile(filePath);
}

export async function createApplication(input: ApplicationInput) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const message = input.message.trim();
  const jobId = input.jobId.trim();
  const jobHeading = input.jobHeading.trim();
  const resumeFileName = sanitizeFileName(input.resume.originalName);

  if (!name || !email || !jobId || !jobHeading) {
    throw new Error("Name, email, and job are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  if (input.resume.buffer.length === 0) {
    throw new Error("Upload a PDF resume.");
  }
  if (input.resume.buffer.length > MAX_RESUME_BYTES) {
    throw new Error("Resume must be a PDF under 5MB.");
  }
  if (!isPdf(input.resume.buffer, resumeFileName)) {
    throw new Error("Resume must be a PDF file.");
  }

  return withLock(async () => {
    const applications = await readApplications();
    const id = randomUUID();
    const resumeStoredName = `${id}.pdf`;
    await fs.mkdir(RESUME_DIR, { recursive: true });
    await fs.writeFile(path.join(RESUME_DIR, resumeStoredName), input.resume.buffer);

    const application: Application = {
      id,
      jobId,
      jobHeading,
      name,
      email,
      phone,
      message,
      resumeFileName,
      resumeStoredName,
      submittedAt: new Date().toISOString(),
    };
    applications.push(application);
    await writeApplications(applications);
    return application;
  });
}

export async function deleteApplication(id: string) {
  return withLock(async () => {
    const applications = await readApplications();
    const existing = applications.find((item) => item.id === id);
    if (!existing) return false;

    await writeApplications(applications.filter((item) => item.id !== id));
    await fs
      .unlink(path.join(RESUME_DIR, path.basename(existing.resumeStoredName)))
      .catch(() => undefined);
    return true;
  });
}
