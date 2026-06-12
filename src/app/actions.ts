"use server";

import {
  formatNewsletterMessage,
  isHoneypotTriggered,
  validateNewsletterForm,
} from "@/lib/forms";
import type { NewsletterFormState } from "@/lib/form-state";
import { sendTelegramMessage } from "@/lib/telegram";

export async function subscribeNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  if (isHoneypotTriggered(formData.get("website") as string | null)) {
    return { status: "success" };
  }

  const email = String(formData.get("email") ?? "");

  const { success } = validateNewsletterForm({ email });
  if (!success) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  const delivered = await sendTelegramMessage(formatNewsletterMessage(email));
  if (!delivered) {
    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    };
  }

  return { status: "success" };
}
