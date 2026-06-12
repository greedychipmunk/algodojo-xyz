"use server";

import {
  formatContactMessage,
  isHoneypotTriggered,
  validateContactForm,
  type ContactInput,
} from "@/lib/forms";
import type { ContactFormState } from "@/lib/form-state";
import { sendTelegramMessage } from "@/lib/telegram";

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // A filled honeypot means a bot. Pretend success so we don't tip it off.
  if (isHoneypotTriggered(formData.get("website") as string | null)) {
    return { status: "success" };
  }

  const input: ContactInput = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const { success, errors } = validateContactForm(input);
  if (!success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: errors,
    };
  }

  const delivered = await sendTelegramMessage(formatContactMessage(input));
  if (!delivered) {
    return {
      status: "error",
      message:
        "Something went wrong sending your message. Please email us directly.",
    };
  }

  return { status: "success" };
}
