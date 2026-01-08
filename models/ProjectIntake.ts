import mongoose, { Schema, models, model } from "mongoose";

const OutputPrefsSchema = new Schema(
  {
    proposalStyle: { type: String, default: "Friendly" },
    includePricing: { type: Boolean, default: true },
    includeTechStack: { type: Boolean, default: true },
    includeTimeline: { type: Boolean, default: true },
    exportFormat: { type: String, default: "PDF" },
  },
  { _id: false }
);

const ProjectIntakeSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },

    projectName: { type: String, required: true },
    clientName: { type: String },
    clientEmail: { type: String },

    industry: { type: String, required: true },
    projectType: { type: String, required: true },
    primaryGoal: { type: String, required: true },

    description: { type: String, required: true },

    userTypes: { type: [String], default: [] },
    roles: { type: [String], default: [] },

    features: { type: [String], default: [] },

    mustHaves: { type: String },
    niceToHaves: { type: String },

    designPreference: { type: String },
    referenceLinks: { type: [String], default: [] },
    screensEstimate: { type: String },

    deadline: { type: String, required: true },
    budgetRange: { type: String, required: true },

    riskFlags: { type: [String], default: [] },

    outputPrefs: { type: OutputPrefsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export type ProjectIntakeDoc = mongoose.InferSchemaType<
  typeof ProjectIntakeSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export default models.ProjectIntake ||
  model("ProjectIntake", ProjectIntakeSchema);
