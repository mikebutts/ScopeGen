"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function IntakeReview({ intakeId }: { intakeId: string }) {
  const router = useRouter();
  const [intake, setIntake] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/intakes/${intakeId}`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `Failed: ${res.status}`);
      setIntake(data.intake);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load intake");
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    setGenerating(true);
    setErr(null);
    try {
      const res = await fetch("/api/scope/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `Failed: ${res.status}`);
      const scopeId = data?.scopeDoc?._id;
      router.push(`/scope/${scopeId}`);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to generate scope");
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    load();
  }, [intakeId]);

  if (loading) return <p className="text-zinc-300">Loading…</p>;
  if (err) return <p className="text-red-400">Error: {err}</p>;
  if (!intake) return <p className="text-zinc-300">Not found.</p>;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{intake.projectName}</h1>
          <p className="mt-1 text-zinc-300">
            {intake.industry} · {intake.projectType} · Goal:{" "}
            {intake.primaryGoal}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
          >
            Back
          </Link>
          <button
            onClick={generate}
            disabled={generating}
            className="rounded-lg bg-white px-4 py-2 text-zinc-900 font-medium hover:bg-zinc-200 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Generate Scope"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-xl border border-zinc-800 p-4">
          <h2 className="font-semibold">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-zinc-200">
            {intake.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 p-4">
            <h2 className="font-semibold">Constraints</h2>
            <div className="mt-2 text-zinc-300 text-sm">
              <div>
                Deadline:{" "}
                <span className="text-zinc-100">{intake.deadline}</span>
              </div>
              <div>
                Budget:{" "}
                <span className="text-zinc-100">{intake.budgetRange}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <h2 className="font-semibold">Features</h2>
            <ul className="mt-2 list-disc pl-5 text-zinc-300 text-sm">
              {(intake.features ?? []).map((f: string) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        {(intake.riskFlags?.length ?? 0) > 0 && (
          <div className="rounded-xl border border-zinc-800 p-4">
            <h2 className="font-semibold">Risk flags</h2>
            <ul className="mt-2 list-disc pl-5 text-zinc-300 text-sm">
              {intake.riskFlags.map((r: string) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
