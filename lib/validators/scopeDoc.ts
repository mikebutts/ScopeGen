import { z } from "zod";

/**
 * Helpers
 */
const NonEmptyString = z.string().min(1);
const NonEmptyStringArray = z.array(NonEmptyString).min(1);

/**
 * Sub-schemas
 */
export const RiskSchema = z.object({
  risk: NonEmptyString,
  impact: z.enum(["Low", "Medium", "High"]),
  mitigation: NonEmptyString,
});

export const TimelineItemSchema = z.object({
  phase: NonEmptyString,
  durationWeeks: z.number().int().min(1),
  whatHappens: NonEmptyStringArray,
});

export const MilestoneSchema = z.object({
  name: NonEmptyString,
  description: NonEmptyString,
  dueWeek: z.number().int().min(1),
  deliverables: NonEmptyStringArray,
});

export const PricingEstimateSchema = z.object({
  lowUSD: z.number().int().min(0),
  highUSD: z.number().int().min(0),
  pricingDrivers: NonEmptyStringArray,
  paymentScheduleSuggestion: NonEmptyString,
});

export const TechStackSchema = z.object({
  frontend: NonEmptyStringArray,
  backend: NonEmptyStringArray,
  database: NonEmptyStringArray,
  auth: NonEmptyStringArray,
  hosting: NonEmptyStringArray,
  integrations: z.array(NonEmptyString).default([]),
});

export const MVPSchema = z.object({
  features: NonEmptyStringArray,
  userStories: NonEmptyStringArray,
});

export const Phase2Schema = z.object({
  features: NonEmptyStringArray,
});

export const ScopeBoundariesSchema = z.object({
  inScope: NonEmptyStringArray,
  outOfScope: NonEmptyStringArray,
});

/**
 * MAIN SCOPE DOCUMENT SCHEMA
 */
export const ScopeDocSchema = z.object({
  // Overview
  projectTitle: NonEmptyString,
  executiveSummary: NonEmptyString,
  problemStatement: NonEmptyString,

  // Goals & users
  goals: NonEmptyStringArray,
  userTypes: NonEmptyStringArray,

  // Scope
  mvp: MVPSchema,
  phase2: Phase2Schema,
  nonGoals: NonEmptyStringArray,
  scopeBoundaries: ScopeBoundariesSchema,

  // Planning
  timeline: z.array(TimelineItemSchema).min(1),
  milestones: z.array(MilestoneSchema).min(1),

  // Constraints
  assumptions: NonEmptyStringArray,
  dependencies: NonEmptyStringArray,
  risks: z.array(RiskSchema).min(1),

  // Commercials & tech
  pricingEstimate: PricingEstimateSchema,
  techStack: TechStackSchema,

  // Delivery
  deliverables: NonEmptyStringArray,
  acceptanceCriteria: NonEmptyStringArray,
  nextSteps: NonEmptyStringArray,
});

export type ScopeDocOutput = z.infer<typeof ScopeDocSchema>;
