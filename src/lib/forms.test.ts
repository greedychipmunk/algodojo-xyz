import { describe, expect, test } from "vitest";
import {
  formatContactMessage,
  formatNewsletterMessage,
  isHoneypotTriggered,
  validateContactForm,
  validateNewsletterForm,
} from "./forms";

describe("validateContactForm", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "Analytical Engines",
    message: "I would like to optimize my workflow.",
  };

  test("accepts a fully valid submission", () => {
    const result = validateContactForm(valid);
    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
  });

  test("rejects a missing name", () => {
    const result = validateContactForm({ ...valid, name: "" });
    expect(result.success).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  test("treats whitespace-only name as empty", () => {
    const result = validateContactForm({ ...valid, name: "   " });
    expect(result.success).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  test("rejects an invalid email", () => {
    const result = validateContactForm({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  test("rejects a missing message", () => {
    const result = validateContactForm({ ...valid, message: "" });
    expect(result.success).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  test("allows an empty company (optional field)", () => {
    const result = validateContactForm({ ...valid, company: "" });
    expect(result.success).toBe(true);
  });
});

describe("validateNewsletterForm", () => {
  test("accepts a valid email", () => {
    expect(
      validateNewsletterForm({ email: "reader@example.com" }).success,
    ).toBe(true);
  });

  test("rejects an invalid email", () => {
    const result = validateNewsletterForm({ email: "nope" });
    expect(result.success).toBe(false);
    expect(result.errors.email).toBeDefined();
  });
});

describe("isHoneypotTriggered", () => {
  test("is false for empty/absent honeypot", () => {
    expect(isHoneypotTriggered("")).toBe(false);
    expect(isHoneypotTriggered(null)).toBe(false);
  });

  test("is true when a bot fills the honeypot", () => {
    expect(isHoneypotTriggered("http://spam.example")).toBe(true);
  });
});

describe("formatContactMessage", () => {
  test("includes all provided fields", () => {
    const text = formatContactMessage({
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines",
      message: "Hello there",
    });
    expect(text).toContain("Ada Lovelace");
    expect(text).toContain("ada@example.com");
    expect(text).toContain("Analytical Engines");
    expect(text).toContain("Hello there");
  });

  test("shows a placeholder when company is omitted", () => {
    const text = formatContactMessage({
      name: "Ada",
      email: "ada@example.com",
      company: "",
      message: "Hi",
    });
    expect(text).toContain("(not provided)");
  });
});

describe("formatNewsletterMessage", () => {
  test("includes the subscriber email", () => {
    expect(formatNewsletterMessage("reader@example.com")).toContain(
      "reader@example.com",
    );
  });
});
