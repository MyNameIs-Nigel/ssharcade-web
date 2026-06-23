export type ContactMethod = "email" | "phone";

/** The visitor-entered values collected by the operator terminal. */
export interface ContactFormValues {
  name: string;
  company: string;
  method: ContactMethod;
  contactValue: string;
  message: string;
}

/**
 * Wire format POSTed to `/api/contact`.
 *
 * `turnstileToken` is part of the contract today even though no widget is
 * mounted yet — keeping it in the shape means a future Cloudflare Turnstile
 * integration only has to start sending a real token, with no changes to the
 * request/response types or the server route signature.
 */
export interface ContactRequestBody extends ContactFormValues {
  turnstileToken: string | null;
}

export interface ContactResponseBody {
  ok: boolean;
  /** Human-readable error surfaced to the visitor when `ok` is false. */
  error?: string;
}

/** Lifecycle of a single transmission attempt. */
export type SubmitStatus = "idle" | "sending" | "success" | "error";
