import mongoose, { Schema, models, model } from "mongoose";

const ScopeDocSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    intakeId: {
      type: Schema.Types.ObjectId,
      ref: "ProjectIntake",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "generated", "final"],
      default: "generated",
    },
    version: { type: Number, default: 1 },

    // Store both: raw AI and user-edited
    generatedJson: { type: Schema.Types.Mixed, required: true },
    editedJson: { type: Schema.Types.Mixed },

    exportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ScopeDocDb = mongoose.InferSchemaType<typeof ScopeDocSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default models.ScopeDoc || model("ScopeDoc", ScopeDocSchema);
