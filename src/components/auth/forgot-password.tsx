"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function ForgotPassword() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setMessage(
          error.message ?? "Failed to send reset link. Please try again.",
        );
      } else {
        setMessage("Check your email for a link to set your password.");
        setShowForm(false);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (resetSuccess) {
    return (
      <p className="mt-6 text-center text-sm text-success">
        Password set successfully. You can now sign in.
      </p>
    );
  }

  if (message && !showForm) {
    return (
      <div className="mt-6 space-y-2 text-center">
        <p className="text-sm text-text-secondary">{message}</p>
        <button
          onClick={() => {
            setShowForm(true);
            setMessage(null);
          }}
          className="text-sm font-medium text-accent hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="mt-6 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        {message && (
          <p className="text-center text-sm text-error">{message}</p>
        )}
        <button
          onClick={() => setShowForm(false)}
          className="block w-full text-center text-sm text-text-secondary hover:text-text-primary"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="mt-6 block w-full text-center text-sm text-text-secondary hover:text-text-primary"
    >
      Forgot password?
    </button>
  );
}
