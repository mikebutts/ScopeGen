import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-semibold">ScopeGen</h1>
        <p className="mt-4 max-w-2xl text-zinc-300">
          Turn a client intake into a proposal-ready scope with timeline,
          pricing, risks, and next steps.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-white px-4 py-2 text-zinc-900 font-medium hover:bg-zinc-200"
          >
            Open Dashboard
          </Link>
          <Link
            href="/projects/new"
            className="rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
          >
            New Intake
          </Link>
        </div>
      </div>
    </main>
  );
}
