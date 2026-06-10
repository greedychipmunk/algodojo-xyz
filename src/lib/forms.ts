/**
 * Pure form validation and message-formatting logic.
 *
 * Kept free of any I/O so it is fully unit-testable. The Server Actions under
 * src/app (actions.ts) compose these helpers with the Telegram fetch.
 */

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface ValidationResult<T extends string> {
  success: boolean;
  errors: Partial<Record<T, string>>;
}

// Pragmatic email check: a single @ with a dot in the domain. Server-side
// validation is a guard, not the authority; Telegram delivery is the proof.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function validateContactForm(
  input: ContactInput,
): ValidationResult<keyof ContactInput> {
  const errors: Partial<Record<keyof ContactInput, string>> = {};

  if (isBlank(input.name)) errors.name = "Please enter your name.";
  if (isBlank(input.email)) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (isBlank(input.message)) errors.message = "Please enter a message.";

  return { success: Object.keys(errors).length === 0, errors };
}

export function validateNewsletterForm(input: {
  email: string;
}): ValidationResult<"email"> {
  const errors: Partial<Record<"email", string>> = {};

  if (isBlank(input.email)) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  return { success: Object.keys(errors).length === 0, errors };
}

/**
 * A honeypot is a hidden field real users never fill. Any value means a bot.
 */
export function isHoneypotTriggered(value: string | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

// Plain text (no Markdown parse_mode) so arbitrary user input can never break
// Telegram's message parsing.
export function formatContactMessage(input: ContactInput): string {
  return [
    "New contact form submission",
    "",
    `Name: ${input.name.trim()}`,
    `Email: ${input.email.trim()}`,
    `Company: ${input.company.trim() || "(not provided)"}`,
    "",
    "Message:",
    input.message.trim(),
  ].join("\n");
}

export function formatNewsletterMessage(email: string): string {
  return ["New newsletter subscriber", "", `Email: ${email.trim()}`].join("\n");
}
