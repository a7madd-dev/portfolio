import { getSeo } from "@/lib/seoStore";
import SeoAdmin from "./SeoAdmin";

export const dynamic = "force-dynamic";

export default async function ControlSeoPage() {
  const seo = await getSeo();
  return <SeoAdmin initial={seo} />;
}
