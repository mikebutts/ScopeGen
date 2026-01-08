import type { IntakeInput } from "@/lib/validators/intake";
import { ScopeDocSchema, type ScopeDocOutput } from "@/lib/validators/scopeDoc";

// TODO: replace with real model call
export async function generateScopeFromIntake(
  intake: IntakeInput
): Promise<ScopeDocOutput> {
  const draft: ScopeDocOutput = {
    projectTitle: intake.projectName,
    executiveSummary: `This proposal outlines an MVP for a ${intake.projectType} in the ${intake.industry} space focused on: ${intake.primaryGoal}.`,
    problemStatement:
      "The current process is unclear/inefficient and needs a structured solution with defined roles, features, and milestones.",
    goals: [
      `Deliver an MVP aligned to the stated primary goal: ${intake.primaryGoal}.`,
      "Provide an admin-friendly workflow to manage core data and operations.",
      "Ship a stable, maintainable v1 that can be extended in Phase 2.",
    ],
    userTypes: intake.userTypes.length
      ? intake.userTypes
      : ["Admins", "End users"],

    mvp: {
      features: [
        ...(intake.features?.length
          ? intake.features.slice(0, 8)
          : ["Authentication", "Admin dashboard"]),
        "Basic analytics/reporting",
      ],
      userStories: [
        "As an admin, I can sign in and manage key records through an admin dashboard.",
        "As a user, I can complete the primary workflow quickly and reliably.",
        "As an admin, I can export/import data (CSV) when needed.",
      ],
    },

    phase2: {
      features: [
        "Advanced analytics and segmentation",
        "Role-based permissions refinement",
        "Automations and integrations (Zapier/webhooks)",
        "Notifications and audit logs",
      ],
    },

    nonGoals: [
      "Complex enterprise SSO in MVP (Phase 2)",
      "Highly custom BI warehouse pipelines in MVP",
      "Native mobile apps unless explicitly required",
    ],

    assumptions: [
      "Client provides brand assets/content or approves placeholders.",
      "A single primary stakeholder approves scope and deliverables.",
      "Third-party services (e.g., Stripe) are available and configured by client as needed.",
    ],

    risks: [
      {
        risk: "Ambiguous requirements or shifting priorities",
        impact: "High",
        mitigation: "Weekly checkpoints + change log + clear MVP boundary.",
      },
      {
        risk: "Timeline pressure",
        impact: "Medium",
        mitigation: "Prioritize MVP features; move extras to Phase 2.",
      },
      {
        risk: "Data migration complexity",
        impact: "Medium",
        mitigation:
          "Validate sample data early; define import rules and edge cases.",
      },
    ],

    timeline: [
      {
        phase: "Discovery & spec",
        durationWeeks: 1,
        whatHappens: [
          "Finalize MVP scope",
          "Define user roles",
          "Confirm success metrics",
        ],
      },
      {
        phase: "Build MVP",
        durationWeeks: 3,
        whatHappens: [
          "Core features",
          "Admin dashboard",
          "Data model + CRUD",
          "Basic analytics",
        ],
      },
      {
        phase: "QA & launch",
        durationWeeks: 1,
        whatHappens: ["Testing", "Bug fixes", "Deploy", "Handover docs"],
      },
    ],

    pricingEstimate: {
      lowUSD: 5000,
      highUSD: 15000,
      pricingDrivers: [
        `Project type: ${intake.projectType}`,
        `Feature count: ${intake.features?.length ?? 0}`,
        `Deadline: ${intake.deadline}`,
        `Compliance/integrations: ${intake.riskFlags?.join(", ") || "None"}`,
      ],
      paymentScheduleSuggestion:
        "40% deposit to start, 30% mid-project milestone, 30% upon delivery.",
    },

    techStack: {
      frontend: ["Next.js", "TypeScript", "shadcn/ui", "Tailwind"],
      backend: ["Next.js Route Handlers", "Node.js"],
      database: ["MongoDB", "Mongoose"],
      auth: ["Clerk"],
      hosting: ["Vercel"],
      integrations: ["Stripe (if needed)", "Email provider (Resend/SendGrid)"],
    },

    deliverables: [
      "Working MVP web application",
      "Admin dashboard",
      "Deployment to production",
      "Basic documentation (setup + handoff)",
    ],

    nextSteps: [
      "Confirm MVP feature list and remove any nice-to-haves",
      "Agree on milestones and communication cadence",
      "Collect brand assets and any existing data samples",
    ],
  };

  const validated = ScopeDocSchema.parse(draft);
  return validated;
}
