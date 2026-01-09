import IntakeReview from "@/components/intake/IntakeReview";

type PageProps = {
  params: Promise<{ intakeId: string }>;
};

export default async function IntakePage({ params }: PageProps) {
  const { intakeId } = await params; // ✅ THIS IS THE FIX

  return (
    <div className="p-8">
      <IntakeReview intakeId={intakeId} />
    </div>
  );
}
