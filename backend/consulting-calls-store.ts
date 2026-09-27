import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { ConsultingCallRequest } from "./types";

const FILE = path.join(process.cwd(), "backend/data/consulting-calls.json");

export type ConsultingCallInput = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  preferredTime: string;
  message: string;
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

async function readRequests() {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as ConsultingCallRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeRequests(requests: ConsultingCallRequest[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, `${JSON.stringify(requests, null, 2)}\n`);
}

export async function listConsultingCalls() {
  const requests = await withLock(readRequests);
  return [...requests].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export async function createConsultingCall(input: ConsultingCallInput) {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const company = input.company.trim();
  const preferredTime = input.preferredTime.trim();
  const message = input.message.trim();

  if (!fullName || !email || !phone || !message) {
    throw new Error("Name, email, phone, and message are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  return withLock(async () => {
    const requests = await readRequests();
    const request: ConsultingCallRequest = {
      id: randomUUID(),
      fullName,
      email,
      phone,
      company,
      preferredTime,
      message,
      submittedAt: new Date().toISOString(),
    };
    requests.push(request);
    await writeRequests(requests);
    return request;
  });
}

export async function deleteConsultingCall(id: string) {
  return withLock(async () => {
    const requests = await readRequests();
    const next = requests.filter((item) => item.id !== id);
    if (next.length === requests.length) return false;
    await writeRequests(next);
    return true;
  });
}
