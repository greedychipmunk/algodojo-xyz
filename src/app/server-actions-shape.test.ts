import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { initialContactState } from "@/lib/form-state";
import { initialNewsletterState } from "@/lib/form-state";

// A file with a top-level "use server" directive turns EVERY export into a
// Server Function reference. Exporting a non-async value (e.g. a plain initial
// state object) makes Next compile it into a createServerReference() stub, which
// then gets passed to useActionState as initialState and breaks the action.
// These files must therefore export only async functions (types are erased).
const serverActionFiles = [
  "src/app/actions.ts",
  "src/app/(marketing)/contact/actions.ts",
];

describe("'use server' files export only async functions", () => {
  for (const file of serverActionFiles) {
    test(`${file} has no runtime value exports`, () => {
      const src = readFileSync(file, "utf8");
      expect(src).toMatch(/^"use server";/m);

      const valueExports = src.match(/^export\s+(const|let|var)\b/gm) ?? [];
      expect(valueExports).toEqual([]);

      const nonAsyncFnExports = src.match(/^export\s+function\b/gm) ?? [];
      expect(nonAsyncFnExports).toEqual([]);
    });
  }
});

describe("form initial states are plain objects", () => {
  test("contact initial state", () => {
    expect(initialContactState).toEqual({ status: "idle" });
    expect(typeof initialContactState).toBe("object");
  });

  test("newsletter initial state", () => {
    expect(initialNewsletterState).toEqual({ status: "idle" });
    expect(typeof initialNewsletterState).toBe("object");
  });
});
