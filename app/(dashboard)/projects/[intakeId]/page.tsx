import IntakeReview from "@/components/intake/IntakeReview";

export default function IntakePage({
  params,
}: {
  params: { intakeId: string };
}) {
  return <IntakeReview intakeId={params.intakeId} />;
}
