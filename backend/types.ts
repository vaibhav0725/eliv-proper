export type Job = {
  id: string;
  heading: string;
  details: string;
  location: string;
  type: string;
  showOnTop: boolean;
  createdAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  jobHeading: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  resumeFileName: string;
  resumeStoredName: string;
  submittedAt: string;
};

export type LeadSource = "newsletter" | "book-a-call";

export type Lead = {
  id: string;
  email: string;
  source: LeadSource;
  submittedAt: string;
};

export type ContactEnquiry = {
  id: string;
  reason: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
};

export type ConsultingCallRequest = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  preferredTime: string;
  message: string;
  submittedAt: string;
};
