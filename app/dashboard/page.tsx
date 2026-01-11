import WhoAmI from "@/components/debug/WhoAmI";
import DashboardHome from "@/components/dashboard/DashboardHome";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <WhoAmI />
      <DashboardHome />
    </div>
  );
}
