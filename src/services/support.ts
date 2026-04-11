// src/services/support.ts
import { N8N_CV_WEBHOOK, N8N_SUPPORT_WEBHOOK } from "@/lib/config";

export type SupportTopic = "technical" | "billing" | "feature" | "other";

export type SendSupportArgs = {
  email: string;
  message: string;
  topic?: SupportTopic;
};

export type SupportPayload = {
  email: string;
  message: string;
  topic: SupportTopic;
  source: string;
  userAgent: string;
  pagePath: string;
  createdAt: string;
};

export type SearchResultsFeedbackOption =
  | "helpful"
  | "no_response"
  | "irrelevant"
  | "custom";

export type SendSearchResultsFeedbackArgs = {
  feedbackType: SearchResultsFeedbackOption;
  feedbackMessage?: string;
  userEmail?: string;
};

export type SendCvCustomiseArgs = {
  cvText: string;
};

type SearchResultsFeedbackPayload = {
  type: "search_results_feedback";
  feedbackType: SearchResultsFeedbackOption;
  feedbackMessage: string;
  userEmail: string;
  source: string;
  userAgent: string;
  pagePath: string;
  createdAt: string;
};

type CvCustomisePayload = {
  type: "cv_customise";
  CV_text: string;
  source: string;
  userAgent: string;
  pagePath: string;
  createdAt: string;
};

function buildPayload({
  email,
  message,
  topic,
}: SendSupportArgs): SupportPayload {
  return {
    email,
    message,
    topic: (topic as SupportTopic) || "other",
    source: "crewdog-landing",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    pagePath: typeof window !== "undefined" ? window.location.pathname : "",
    createdAt: new Date().toISOString(),
  };
}

/**
 * Posts a support message to the configured N8N webhook as JSON.
 * Throws on non-2xx responses.
 */
export async function sendSupportMessage(args: SendSupportArgs): Promise<void> {
  if (!N8N_SUPPORT_WEBHOOK) {
    throw new Error("Missing N8N_SUPPORT_WEBHOOK config.");
  }

  const payload = buildPayload(args);

  const resp = await fetch(N8N_SUPPORT_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(txt || `Support webhook error (${resp.status})`);
  }
}

export async function sendSearchResultsFeedback({
  feedbackType,
  feedbackMessage,
  userEmail,
}: SendSearchResultsFeedbackArgs): Promise<void> {
  if (!N8N_SUPPORT_WEBHOOK) {
    throw new Error("Missing N8N_SUPPORT_WEBHOOK config.");
  }

  const payload: SearchResultsFeedbackPayload = {
    type: "search_results_feedback",
    feedbackType,
    feedbackMessage: (feedbackMessage || "").trim(),
    userEmail: (userEmail || "").trim(),
    source: "run-results-page",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    pagePath: typeof window !== "undefined" ? window.location.pathname : "",
    createdAt: new Date().toISOString(),
  };

  const resp = await fetch(N8N_SUPPORT_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(txt || `Search feedback webhook error (${resp.status})`);
  }
}

export async function sendCvCustomise({
  cvText,
}: SendCvCustomiseArgs): Promise<void> {
  if (!N8N_CV_WEBHOOK) {
    throw new Error("Missing N8N_CV_WEBHOOK config.");
  }

  const payload: CvCustomisePayload = {
    type: "cv_customise",
    CV_text: (cvText || "").trim(),
    source: "run-customise-cv",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    pagePath: typeof window !== "undefined" ? window.location.pathname : "",
    createdAt: new Date().toISOString(),
  };

  const resp = await fetch(N8N_CV_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(txt || `CV customise webhook error (${resp.status})`);
  }
}
