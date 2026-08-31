import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AuthForm } from "@/components/auth/auth-form";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Sign In",
  description: "Sign in to your Algo Dojo account.",
  path: "/sign-in",
});

export default function SignInPage() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-border bg-bg-card p-8 shadow-card">
          <h1 className="text-2xl font-bold text-text-primary">Sign in</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to access premium tutorials and manage your subscription.
          </p>
          <div className="mt-6">
            <AuthForm mode="sign-in" />
          </div>
          <p className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-accent hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
