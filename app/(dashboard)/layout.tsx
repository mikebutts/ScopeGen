import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-zinc-950 text-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
        </div>
      </SignedIn>
    </>
  );
}
