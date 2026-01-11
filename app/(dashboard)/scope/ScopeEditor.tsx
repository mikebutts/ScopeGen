"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function linesToArray(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
function arrayToLines(arr: string[]) {
  return (arr ?? []).join("\n");
}

export default function ScopeEditor({ scopeId }: { scopeId: string }) {
  const [doc, setDoc] = useState<any>(null);
  const [edited, setEdited] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/scope/${scopeId}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `Failed: ${res.status}`);
      setDoc(data.scopeDoc);
      setEdited(data.scopeDoc?.editedJson ?? data.scopeDoc?.generatedJson);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load scope");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    setErr(null);
    setSavedMsg(null);
    try {
      const res = await fetch(`/api/scope/${scopeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editedJson: edited }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `Failed: ${res.status}`);
      setDoc(data.scopeDoc);
      setEdited(data.scopeDoc?.editedJson ?? edited);
      setSavedMsg("Saved.");
      setTimeout(() => setSavedMsg(null), 1500);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
  }, [scopeId]);

  const helpers = useMemo(() => {
    if (!edited) return null;
    return {
      setField: (k: string, v: any) =>
        setEdited((p: any) => ({ ...p, [k]: v })),
      setArrField: (k: string, text: string) =>
        setEdited((p: any) => ({ ...p, [k]: linesToArray(text) })),
    };
  }, [edited]);

  if (loading) return <p className="text-zinc-300">Loading…</p>;
  if (err) return <p className="text-red-400">Error: {err}</p>;
  if (!edited) return <p className="text-zinc-300">No scope data.</p>;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{edited.projectTitle}</h1>
          <p className="mt-1 text-zinc-300">
            Edit and save your proposal-ready scope.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-700 px-3 py-2 hover:bg-zinc-900"
          >
            Dashboard
          </Link>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-white px-4 py-2 text-zinc-900 font-medium hover:bg-zinc-200 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {savedMsg && <p className="mt-3 text-green-400">{savedMsg}</p>}

      <div className="mt-6 grid gap-4">
        <Section title="Executive Summary">
          <textarea
            className="w-full min-h-[120px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
            value={edited.executiveSummary}
            onChange={(e) =>
              helpers?.setField("executiveSummary", e.target.value)
            }
          />
        </Section>

        <Section title="Problem Statement">
          <textarea
            className="w-full min-h-[100px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
            value={edited.problemStatement}
            onChange={(e) =>
              helpers?.setField("problemStatement", e.target.value)
            }
          />
        </Section>

        <TwoCol>
          <Section title="Goals (one per line)">
            <textarea
              className="w-full min-h-[140px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={arrayToLines(edited.goals)}
              onChange={(e) => helpers?.setArrField("goals", e.target.value)}
            />
          </Section>

          <Section title="User Types (one per line)">
            <textarea
              className="w-full min-h-[140px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={arrayToLines(edited.userTypes)}
              onChange={(e) =>
                helpers?.setArrField("userTypes", e.target.value)
              }
            />
          </Section>
        </TwoCol>

        <TwoCol>
          <Section title="MVP Features (one per line)">
            <textarea
              className="w-full min-h-[160px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={arrayToLines(edited.mvp?.features ?? [])}
              onChange={(e) =>
                setEdited((p: any) => ({
                  ...p,
                  mvp: { ...p.mvp, features: linesToArray(e.target.value) },
                }))
              }
            />
          </Section>

          <Section title="MVP User Stories (one per line)">
            <textarea
              className="w-full min-h-[160px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={arrayToLines(edited.mvp?.userStories ?? [])}
              onChange={(e) =>
                setEdited((p: any) => ({
                  ...p,
                  mvp: { ...p.mvp, userStories: linesToArray(e.target.value) },
                }))
              }
            />
          </Section>
        </TwoCol>

        <Section title="Phase 2 Features (one per line)">
          <textarea
            className="w-full min-h-[140px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
            value={arrayToLines(edited.phase2?.features ?? [])}
            onChange={(e) =>
              setEdited((p: any) => ({
                ...p,
                phase2: { ...p.phase2, features: linesToArray(e.target.value) },
              }))
            }
          />
        </Section>

        <TwoCol>
          <Section title="Assumptions (one per line)">
            <textarea
              className="w-full min-h-[140px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={arrayToLines(edited.assumptions ?? [])}
              onChange={(e) =>
                helpers?.setArrField("assumptions", e.target.value)
              }
            />
          </Section>

          <Section title="Non-goals / Out of scope (one per line)">
            <textarea
              className="w-full min-h-[140px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={arrayToLines(edited.nonGoals ?? [])}
              onChange={(e) => helpers?.setArrField("nonGoals", e.target.value)}
            />
          </Section>
        </TwoCol>

        <Section title="Next Steps (one per line)">
          <textarea
            className="w-full min-h-[140px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
            value={arrayToLines(edited.nextSteps ?? [])}
            onChange={(e) => helpers?.setArrField("nextSteps", e.target.value)}
          />
        </Section>

        <Section title="Deliverables (one per line)">
          <textarea
            className="w-full min-h-[140px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
            value={arrayToLines(edited.deliverables ?? [])}
            onChange={(e) =>
              helpers?.setArrField("deliverables", e.target.value)
            }
          />
        </Section>
      </div>

      <div className="mt-8">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-white px-4 py-2 text-zinc-900 font-medium hover:bg-zinc-200 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 p-4">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
