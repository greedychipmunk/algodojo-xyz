import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Set Password",
  description: "Set your Algo Dojo account password.",
  path: "/reset-password",
});

export default function ResetPasswordPage() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-border bg-bg-card p-8 shadow-card">
          <h1 className="text-2xl font-bold text-text-primary">
            Set your password
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Choose a password for your Algo Dojo account.
          </p>
          <div className="mt-6">
            <Suspense>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </Container>
  );
}
