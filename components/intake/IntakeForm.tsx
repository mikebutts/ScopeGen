"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const INDUSTRIES = [
  "Real Estate",
  "Healthcare",
  "eCommerce",
  "Education",
  "Finance",
  "Logistics",
  "Nonprofit",
  "Other",
] as const;
const PROJECT_TYPES = [
  "Marketing website",
  "Web app (SaaS)",
  "Mobile app",
  "Internal tool",
  "API only",
  "Not sure",
] as const;
const GOALS = [
  "Get leads",
  "Sell products",
  "Automate operations",
  "Reduce support load",
  "Improve reporting",
  "Other",
] as const;
const DEADLINES = [
  "ASAP (2–4 weeks)",
  "1–2 months",
  "3–4 months",
  "Flexible",
] as const;
const BUDGETS = ["<$2k", "$2k–$5k", "$5k–$10k", "$10k–$25k", "$25k+"] as const;

const FEATURE_LIBRARY = [
  "Authentication / accounts",
  "Admin dashboard",
  "User profile",
  "Search / filtering",
  "Notifications (email)",
  "File uploads",
  "Payments / subscriptions",
  "Booking / scheduling",
  "Messaging / chat",
  "Reporting / analytics",
  "Maps / geolocation",
  "CSV import/export",
  "External API integration",
  "Webhooks / automation (Zapier)",
] as const;

export default function IntakeForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    projectName: "",
    industry: "Real Estate",
    projectType: "Web app (SaaS)",
    primaryGoal: "Automate operations",
    description: "",
    userTypesText: "Customers\nInternal staff\nAdmins",
    rolesText: "Admin\nStaff\nCustomer",
    features: [] as string[],
    deadline: "1–2 months",
    budgetRange: "$5k–$10k",
    riskFlagsText: "",
    outputPrefs: {
      proposalStyle: "Agency",
      includePricing: true,
      includeTechStack: true,
      includeTimeline: true,
      exportFormat: "PDF",
    },
  });

  const userTypes = useMemo(
    () =>
      form.userTypesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    [form.userTypesText]
  );

  const roles = useMemo(
    () =>
      form.rolesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    [form.rolesText]
  );

  const riskFlags = useMemo(
    () =>
      form.riskFlagsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    [form.riskFlagsText]
  );

  function toggleFeature(f: string) {
    setForm((prev) => {
      const has = prev.features.includes(f);
      return {
        ...prev,
        features: has
          ? prev.features.filter((x) => x !== f)
          : [...prev.features, f],
      };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        projectName: form.projectName,
        industry: form.industry,
        projectType: form.projectType,
        primaryGoal: form.primaryGoal,
        description: form.description,
        userTypes,
        roles,
        features: form.features,
        deadline: form.deadline,
        budgetRange: form.budgetRange,
        riskFlags,
        outputPrefs: form.outputPrefs,
      };

      const res = await fetch("/api/intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? `Failed: ${res.status}`);

      const intakeId = data?.intake?._id;
      router.push(`/projects/${intakeId}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create intake");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-zinc-800 p-4">
        <h2 className="font-semibold">Basics</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">Project name</span>
            <input
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={form.projectName}
              onChange={(e) =>
                setForm({ ...form, projectName: e.target.value })
              }
              placeholder="Acme Client Portal"
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">Industry</span>
            <select
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            >
              {INDUSTRIES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">Project type</span>
            <select
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={form.projectType}
              onChange={(e) =>
                setForm({ ...form, projectType: e.target.value })
              }
            >
              {PROJECT_TYPES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">Primary goal</span>
            <select
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={form.primaryGoal}
              onChange={(e) =>
                setForm({ ...form, primaryGoal: e.target.value })
              }
            >
              {GOALS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 grid gap-1">
          <span className="text-sm text-zinc-300">Description</span>
          <textarea
            className="min-h-[120px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what the client wants in plain language…"
          />
        </label>
      </section>

      <section className="rounded-xl border border-zinc-800 p-4">
        <h2 className="font-semibold">Users & Roles</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">
              User types (one per line)
            </span>
            <textarea
              className="min-h-[120px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={form.userTypesText}
              onChange={(e) =>
                setForm({ ...form, userTypesText: e.target.value })
              }
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">Roles (one per line)</span>
            <textarea
              className="min-h-[120px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={form.rolesText}
              onChange={(e) => setForm({ ...form, rolesText: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 p-4">
        <h2 className="font-semibold">Features</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Pick what’s needed for MVP.
        </p>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {FEATURE_LIBRARY.map((f) => {
            const checked = form.features.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`rounded-lg border px-3 py-2 text-left transition ${
                  checked
                    ? "border-white bg-white text-zinc-900"
                    : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 p-4">
        <h2 className="font-semibold">Constraints</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">Deadline</span>
            <select
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            >
              {DEADLINES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-zinc-300">Budget range</span>
            <select
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
              value={form.budgetRange}
              onChange={(e) =>
                setForm({ ...form, budgetRange: e.target.value })
              }
            >
              {BUDGETS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 grid gap-1">
          <span className="text-sm text-zinc-300">
            Risk flags (one per line)
          </span>
          <textarea
            className="min-h-[90px] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
            value={form.riskFlagsText}
            onChange={(e) =>
              setForm({ ...form, riskFlagsText: e.target.value })
            }
            placeholder="Need it fast\nNot sure what we want\nLegacy data"
          />
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button
          disabled={submitting}
          className="rounded-lg bg-white px-4 py-2 text-zinc-900 font-medium hover:bg-zinc-200 disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create Intake"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
