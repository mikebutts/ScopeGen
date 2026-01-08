"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Intake = {
  _id: string;
  projectName: string;
  industry: string;
  projectType: string;
  budgetRange: string;
  deadline: string;
  createdAt: string;
};

export default function DashboardHome() {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/intakes", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setIntakes(data.intakes ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-zinc-300">
            Create an intake, then generate a scope doc.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="rounded-lg bg-white px-4 py-2 text-zinc-900 font-medium hover:bg-zinc-200"
        >
          + New Intake
        </Link>
      </div>

      <div className="mt-8">
        {loading && <p className="text-zinc-300">Loading…</p>}
        {err && <p className="text-red-400">Error: {err}</p>}

        {!loading && !err && intakes.length === 0 && (
          <div className="rounded-xl border border-zinc-800 p-6">
            <p className="text-zinc-300">No intakes yet.</p>
            <Link className="mt-3 inline-block underline" href="/projects/new">
              Create your first intake →
            </Link>
          </div>
        )}

        {!loading && !err && intakes.length > 0 && (
          <div className="grid gap-3">
            {intakes.map((i) => (
              <Link
                key={i._id}
                href={`/projects/${i._id}`}
                className="rounded-xl border border-zinc-800 p-4 hover:bg-zinc-900 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-medium">{i.projectName}</div>
                    <div className="mt-1 text-sm text-zinc-300">
                      {i.industry} · {i.projectType}
                    </div>
                    <div className="mt-2 text-sm text-zinc-400">
                      Budget: {i.budgetRange} · Deadline: {i.deadline}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(i.createdAt).toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
