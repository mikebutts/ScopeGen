import IntakeForm from "@/components/intake/IntakeForm";

export default function NewIntakePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New Intake</h1>
      <p className="mt-1 text-zinc-300">
        Fill this out like a client discovery call.
      </p>
      <div className="mt-6">
        <IntakeForm />
      </div>
    </div>
  );
}
