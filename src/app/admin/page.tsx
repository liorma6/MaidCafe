import { getSessionEmail } from "@/lib/auth";
import { readContent } from "@/lib/data";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminPanel from "@/components/AdminPanel";

export default async function AdminPage() {
  const email = await getSessionEmail();

  if (!email) {
    return (
      <div className="py-12">
        <AdminLoginForm />
      </div>
    );
  }

  const content = await readContent();

  return (
    <AdminPanel
      adminEmail={email}
      initialData={{
        announcements: content.announcements,
        events: content.events,
        merch: content.merch,
        team: content.team,
        applications: content.applications,
      }}
    />
  );
}
