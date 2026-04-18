import { getPerformance } from "@/lib/performanceStore";
import PerformanceAdmin from "./PerformanceAdmin";

export const dynamic = "force-dynamic";

export default async function ControlPerformancePage() {
  const performance = await getPerformance();
  return <PerformanceAdmin initial={performance} />;
}
