import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AuthForm } from "@/components/auth/auth-form";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Create Account",
  description: "Create an Algo Dojo account to access premium tutorials.",
  path: "/sign-up",
});

export default function SignUpPage() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-border bg-bg-card p-8 shadow-card">
          <h1 className="text-2xl font-bold text-text-primary">
            Create account
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Create an account to access premium tutorials and subscribe to
            all-access content.
          </p>
          <div className="mt-6">
            <AuthForm mode="sign-up" />
          </div>
          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-accent hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
