import type { Metadata } from "next";
import { isAuthed } from "@/lib/auth";
import LoginGate from "./LoginGate";
import ControlShell from "./ControlShell";

export const metadata: Metadata = {
  title: "Control · Ahmad Yousef",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthed();
  if (!authed) return <LoginGate />;
  return <ControlShell>{children}</ControlShell>;
}
