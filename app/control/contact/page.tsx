import { getContact } from "@/lib/contactStore";
import ContactAdmin from "./ContactAdmin";

export const dynamic = "force-dynamic";

export default async function ControlContactPage() {
  const contact = await getContact();
  return <ContactAdmin initial={contact} />;
}
