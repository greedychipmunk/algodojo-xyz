import type { ContactInput } from "./forms";

// Form state types and initial values for useActionState.
//
// These intentionally live OUTSIDE the "use server" action files. A file with a
// top-level "use server" directive turns every export into a Server Function
// reference, so exporting a plain initial-state object there would compile it
// into a createServerReference() stub and break useActionState's initialState.

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
}

export const initialContactState: ContactFormState = { status: "idle" };

export interface NewsletterFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export const initialNewsletterState: NewsletterFormState = { status: "idle" };
