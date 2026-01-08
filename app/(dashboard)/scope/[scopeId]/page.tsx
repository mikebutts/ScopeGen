import ScopeEditor from "@/components/scope/ScopeEditor";

export default function ScopePage({ params }: { params: { scopeId: string } }) {
  return <ScopeEditor scopeId={params.scopeId} />;
}
