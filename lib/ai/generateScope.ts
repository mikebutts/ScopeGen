// /lib/ai/generateScope.ts
import OpenAI from "openai";

import type { IntakeInput } from "@/lib/validators/intake";
import { ScopeDocSchema, type ScopeDocOutput } from "@/lib/validators/scopeDoc";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function clampArray<T>(arr: T[] | undefined | null, max: number): T[] {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, max);
}

function makeSafeIntake(intake: IntakeInput): IntakeInput {
  // Keep prompt from exploding in size
  return {
    ...intake,
    userTypes: clampArray(intake.userTypes, 8),
    // These may or may not exist on your IntakeInput; cast to avoid TS friction.
    roles: clampArray((intake as any).roles, 10) as any,
    features: clampArray((intake as any).features, 15) as any,
    referenceLinks: clampArray((intake as any).referenceLinks, 6) as any,
    riskFlags: clampArray((intake as any).riskFlags, 10) as any,
  } as any;
}

/**
 * We give the model an explicit JSON "skeleton" so it cannot rename keys or change shapes.
 * It must fill values into this exact structure.
 */
const OUTPUT_TEMPLATE: ScopeDocOutput = {
  projectTitle: "",
  executiveSummary: "",
  problemStatement: "",
  goals: ["", "", ""],
  userTypes: ["Admins", "End users"],
  mvp: {
    features: ["Authentication", "Admin dashboard", "Core workflow"],
    userStories: [
      "As an admin, I can sign in and manage records.",
      "As a user, I can complete the primary workflow.",
      "As an admin, I can review and export data.",
    ],
  },
  phase2: {
    features: ["Advanced analytics", "Automations", "Notifications"],
  },
  nonGoals: ["Enterprise SSO in MVP", "Native mobile apps in MVP"],
  scopeBoundaries: {
    inScope: [
      "Auth/roles",
      "Admin CRUD",
      "Primary user workflow",
      "Basic reporting",
    ],
    outOfScope: ["Enterprise SSO", "Native apps", "Custom data warehouse"],
  },
  timeline: [
    {
      phase: "Discovery & spec",
      durationWeeks: 1,
      whatHappens: [
        "Confirm scope",
        "Define roles",
        "Finalize success metrics",
      ],
    },
    {
      phase: "Build MVP",
      durationWeeks: 3,
      whatHappens: [
        "Implement features",
        "Admin dashboard",
        "APIs + data model",
      ],
    },
    {
      phase: "QA & launch",
      durationWeeks: 1,
      whatHappens: ["Testing", "Bug fixes", "Deploy + handoff"],
    },
  ],
  milestones: [
    {
      name: "Scope Approved",
      description:
        "Stakeholder approves requirements, milestones, and acceptance criteria.",
      dueWeek: 1,
      deliverables: ["Approved scope", "Milestone plan", "Acceptance criteria"],
    },
    {
      name: "Feature Complete",
      description: "MVP features implemented and ready for QA in staging.",
      dueWeek: 4,
      deliverables: ["Staging build", "Release notes"],
    },
    {
      name: "Launch",
      description: "Production deploy and handoff completed.",
      dueWeek: 5,
      deliverables: ["Production deployment", "Handoff docs"],
    },
  ],
  assumptions: [
    "Client provides brand assets/content or approves placeholders.",
    "A single primary stakeholder approves scope and deliverables.",
    "Third-party services are available and configured as needed.",
  ],
  dependencies: [
    "Access to required systems/third-party services (if applicable).",
    "Timely stakeholder feedback during weekly check-ins.",
    "Any existing data samples provided early for validation (if applicable).",
  ],
  risks: [
    {
      risk: "Ambiguous requirements or shifting priorities",
      impact: "High",
      mitigation: "Weekly checkpoints, change log, and a strict MVP boundary.",
    },
    {
      risk: "Timeline pressure due to scope creep",
      impact: "Medium",
      mitigation: "Prioritize MVP must-haves; move extras to Phase 2.",
    },
    {
      risk: "Data migration complexity (if importing legacy data)",
      impact: "Medium",
      mitigation:
        "Validate sample data early and define import rules/edge cases.",
    },
  ],
  pricingEstimate: {
    lowUSD: 5000,
    highUSD: 15000,
    pricingDrivers: [
      "Project complexity",
      "Feature count",
      "Deadline",
      "Integrations/compliance",
    ],
    paymentScheduleSuggestion:
      "40% deposit, 30% mid-milestone, 30% upon delivery.",
  },
  techStack: {
    frontend: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    backend: ["Next.js Route Handlers", "Node.js"],
    database: ["MongoDB", "Mongoose"],
    auth: ["Clerk"],
    hosting: ["Vercel"],
    integrations: ["Email provider (Resend/SendGrid)", "Stripe (if needed)"],
  },
  deliverables: [
    "Working MVP web application",
    "Admin dashboard",
    "Production deployment",
    "Basic documentation (setup + handoff)",
  ],
  acceptanceCriteria: [
    "Primary MVP workflow works end-to-end in production",
    "No P1 bugs at launch; critical issues resolved",
    "Admin dashboard supports required CRUD actions",
    "Docs delivered and handoff completed",
  ],
  nextSteps: [
    "Confirm MVP feature list and remove nice-to-haves",
    "Agree on milestones and communication cadence",
    "Collect brand assets and any data samples",
  ],
};

function normalizeModelOutput(parsed: any): any {
  if (!parsed || typeof parsed !== "object") return parsed;

  // Alias fixes (in case model tries to rename keys)
  if (!parsed.projectTitle && parsed.title) parsed.projectTitle = parsed.title;
  if (!parsed.executiveSummary && parsed.summary)
    parsed.executiveSummary = parsed.summary;
  if (!parsed.problemStatement && parsed.problem)
    parsed.problemStatement = parsed.problem;

  // Ensure arrays exist
  const ensureArray = (key: string) => {
    if (!Array.isArray(parsed[key])) parsed[key] = [];
  };

  ensureArray("goals");
  ensureArray("userTypes");
  ensureArray("nonGoals");
  ensureArray("assumptions");
  ensureArray("dependencies");
  ensureArray("deliverables");
  ensureArray("acceptanceCriteria");
  ensureArray("nextSteps");

  // Fix milestones if they come back as strings
  if (
    Array.isArray(parsed.milestones) &&
    typeof parsed.milestones[0] === "string"
  ) {
    parsed.milestones = parsed.milestones
      .slice(0, 5)
      .map((s: string, i: number) => ({
        name: `Milestone ${i + 1}`,
        description: s,
        dueWeek: i + 1,
        deliverables: [s],
      }));
  }

  // Fix risks if they come back as strings
  if (Array.isArray(parsed.risks) && typeof parsed.risks[0] === "string") {
    parsed.risks = parsed.risks.slice(0, 6).map((s: string) => ({
      risk: s,
      impact: "Medium",
      mitigation:
        "Mitigate via clear requirements, checkpoints, and staged rollout.",
    }));
  }

  // Fix timeline if it comes back malformed
  if (!Array.isArray(parsed.timeline)) parsed.timeline = [];
  parsed.timeline = parsed.timeline.map((t: any, idx: number) => ({
    phase:
      typeof t?.phase === "string"
        ? t.phase
        : ["Discovery", "Build", "QA & Launch"][idx] || `Phase ${idx + 1}`,
    durationWeeks: typeof t?.durationWeeks === "number" ? t.durationWeeks : 1,
    whatHappens: Array.isArray(t?.whatHappens)
      ? t.whatHappens
      : ["Define scope", "Implement features", "Test + deploy"],
  }));

  // Ensure nested objects exist
  if (!parsed.mvp || typeof parsed.mvp !== "object")
    parsed.mvp = { features: [], userStories: [] };
  if (!Array.isArray(parsed.mvp.features)) parsed.mvp.features = [];
  if (!Array.isArray(parsed.mvp.userStories)) parsed.mvp.userStories = [];

  if (!parsed.phase2 || typeof parsed.phase2 !== "object")
    parsed.phase2 = { features: [] };
  if (!Array.isArray(parsed.phase2.features)) parsed.phase2.features = [];

  if (!parsed.scopeBoundaries || typeof parsed.scopeBoundaries !== "object") {
    parsed.scopeBoundaries = { inScope: [], outOfScope: [] };
  }
  if (!Array.isArray(parsed.scopeBoundaries.inScope))
    parsed.scopeBoundaries.inScope = [];
  if (!Array.isArray(parsed.scopeBoundaries.outOfScope))
    parsed.scopeBoundaries.outOfScope = [];

  if (!parsed.pricingEstimate || typeof parsed.pricingEstimate !== "object") {
    parsed.pricingEstimate = {
      lowUSD: 0,
      highUSD: 0,
      pricingDrivers: [],
      paymentScheduleSuggestion: "",
    };
  }

  if (!parsed.techStack || typeof parsed.techStack !== "object") {
    parsed.techStack = {
      frontend: [],
      backend: [],
      database: [],
      auth: [],
      hosting: [],
      integrations: [],
    };
  }

  return parsed;
}

async function callOpenAIForScope(intake: IntakeInput, attempt: 1 | 2) {
  // GPT-5-mini does NOT support temperature changes, so omit it.
  const system =
    attempt === 1
      ? `
You generate a Scope of Work as STRICT JSON.

CRITICAL:
- Output ONE JSON object only.
- You MUST use EXACTLY the same keys and nesting as the JSON TEMPLATE.
- Do NOT rename keys.
- Do NOT omit keys.
- All arrays must be non-empty.
- milestones must be objects with name, description, dueWeek, deliverables.
- timeline must be an array of objects with phase, durationWeeks, whatHappens.
- risks items must be objects with risk, impact (Low|Medium|High), mitigation.
- Keep it concise.

Return ONLY JSON (no markdown, no code fences).
`.trim()
      : `
You generate a Scope of Work as STRICT JSON.

THIS IS A RETRY:
- Be even more concise.
- Keep strings short.
- Keep list lengths small but non-empty.

CRITICAL:
- Output ONE JSON object only.
- Use EXACTLY the JSON TEMPLATE structure and keys.
Return ONLY JSON.
`.trim();

  const user = `
Fill out this JSON TEMPLATE using the INTAKE. Copy the template structure and replace values.

JSON TEMPLATE:
${JSON.stringify(OUTPUT_TEMPLATE, null, 2)}

INTAKE:
${JSON.stringify(intake, null, 2)}
`.trim();

  return openai.chat.completions.create({
    model: "gpt-5-mini",
    // Give it enough room but keep it bounded
    max_completion_tokens: attempt === 1 ? 4500 : 6500,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
  });
}

export async function generateScopeFromIntake(
  intake: IntakeInput
): Promise<ScopeDocOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const safeIntake = makeSafeIntake(intake);

  // Attempt 1
  let res = await callOpenAIForScope(safeIntake, 1);
  let text = res.choices?.[0]?.message?.content?.trim() ?? "";
  let finishReason = res.choices?.[0]?.finish_reason;

  // Attempt 2 if empty or truncated
  if (!text || finishReason === "length") {
    res = await callOpenAIForScope(safeIntake, 2);
    text = res.choices?.[0]?.message?.content?.trim() ?? "";
    finishReason = res.choices?.[0]?.finish_reason;
  }

  if (!text) {
    throw new Error(
      `OpenAI returned empty response (finish_reason=${String(finishReason)})`
    );
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("OpenAI did not return valid JSON");
  }

  parsed = normalizeModelOutput(parsed);

  try {
    // ✅ attempt to validate
    return ScopeDocSchema.parse(parsed);
  } catch (err1) {
    // ❌ If it fails, do a second attempt (more compact prompt) and ONLY then throw
    const res2 = await callOpenAIForScope(safeIntake, 2);
    const text2 = res2.choices?.[0]?.message?.content?.trim() ?? "";
    const finish2 = res2.choices?.[0]?.finish_reason;

    if (!text2) {
      throw new Error(
        `OpenAI returned empty response on retry (finish_reason=${String(
          finish2
        )})`
      );
    }

    let parsed2: any;
    try {
      parsed2 = JSON.parse(text2);
    } catch {
      throw new Error("OpenAI retry did not return valid JSON");
    }

    parsed2 = normalizeModelOutput(parsed2);

    // ✅ if this fails too, THEN throw the real Zod errors
    return ScopeDocSchema.parse(parsed2);
  }
}
