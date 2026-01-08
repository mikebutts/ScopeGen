import { z } from "zod";

export const BudgetRangeEnum = z.enum([
  "<$2k",
  "$2k–$5k",
  "$5k–$10k",
  "$10k–$25k",
  "$25k+",
]);

export const DeadlineEnum = z.enum([
  "ASAP (2–4 weeks)",
  "1–2 months",
  "3–4 months",
  "Flexible",
]);

export const ProjectTypeEnum = z.enum([
  "Marketing website",
  "Web app (SaaS)",
  "Mobile app",
  "Internal tool",
  "API only",
  "Not sure",
]);

export const PrimaryGoalEnum = z.enum([
  "Get leads",
  "Sell products",
  "Automate operations",
  "Reduce support load",
  "Improve reporting",
  "Other",
]);

export const IndustryEnum = z.enum([
  "Real Estate",
  "Healthcare",
  "eCommerce",
  "Education",
  "Finance",
  "Logistics",
  "Nonprofit",
  "Other",
]);

export const ProposalStyleEnum = z.enum([
  "Friendly",
  "Formal",
  "Agency",
  "Short & punchy",
]);

export const IntakeSchema = z.object({
  projectName: z.string().min(2).max(120),
  clientName: z.string().max(120).optional(),
  clientEmail: z.string().email().optional(),

  industry: IndustryEnum,
  projectType: ProjectTypeEnum,
  primaryGoal: PrimaryGoalEnum,

  description: z.string().min(10).max(4000).optional(),

  userTypes: z.array(z.string().min(2).max(50)).default([]),
  roles: z.array(z.string().min(2).max(50)).default([]),

  features: z.array(z.string().min(2).max(80)).default([]),

  mustHaves: z.string().max(3000).optional(),
  niceToHaves: z.string().max(3000).optional(),

  designPreference: z
    .enum([
      "Clean & modern",
      "Bold & playful",
      "Corporate",
      "Minimal",
      "Match my existing site",
    ])
    .optional(),
  referenceLinks: z.array(z.string().url()).default([]),
  screensEstimate: z.enum(["1–3", "4–7", "8–15", "16+"]).optional(),

  deadline: DeadlineEnum,
  budgetRange: BudgetRangeEnum,

  riskFlags: z.array(z.string().min(2).max(80)).default([]),

  outputPrefs: z
    .object({
      proposalStyle: ProposalStyleEnum.default("Friendly"),
      includePricing: z.boolean().default(true),
      includeTechStack: z.boolean().default(true),
      includeTimeline: z.boolean().default(true),
      exportFormat: z.enum(["PDF", "Share link", "Both"]).default("PDF"),
    })
    .default({}),
});

export type IntakeInput = z.infer<typeof IntakeSchema>;
