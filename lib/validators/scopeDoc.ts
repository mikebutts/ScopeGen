import { z } from "zod";

export const RiskImpactEnum = z.enum(["Low", "Medium", "High"]);

export const ScopeDocSchema = z.object({
  projectTitle: z.string().min(2),
  executiveSummary: z.string().min(10),
  problemStatement: z.string().min(10),
  goals: z.array(z.string().min(2)),
  userTypes: z.array(z.string().min(2)),

  mvp: z.object({
    features: z.array(z.string().min(2)),
    userStories: z.array(z.string().min(2)),
  }),

  phase2: z.object({
    features: z.array(z.string().min(2)),
  }),

  nonGoals: z.array(z.string().min(2)),
  assumptions: z.array(z.string().min(2)),

  risks: z.array(
    z.object({
      risk: z.string().min(2),
      impact: RiskImpactEnum,
      mitigation: z.string().min(2),
    })
  ),

  timeline: z.array(
    z.object({
      phase: z.string().min(2),
      durationWeeks: z.number().positive(),
      whatHappens: z.array(z.string().min(2)),
    })
  ),

  pricingEstimate: z.object({
    lowUSD: z.number().nonnegative(),
    highUSD: z.number().nonnegative(),
    pricingDrivers: z.array(z.string().min(2)),
    paymentScheduleSuggestion: z.string().min(2),
  }),

  techStack: z.object({
    frontend: z.array(z.string().min(2)),
    backend: z.array(z.string().min(2)),
    database: z.array(z.string().min(2)),
    auth: z.array(z.string().min(2)),
    hosting: z.array(z.string().min(2)),
    integrations: z.array(z.string().min(2)),
  }),

  deliverables: z.array(z.string().min(2)),
  nextSteps: z.array(z.string().min(2)),
});

export type ScopeDocOutput = z.infer<typeof ScopeDocSchema>;
