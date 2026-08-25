import { getSessionEmail } from "@/lib/auth";
import { getAboutPage } from "@/lib/db/about";
import { getAnnouncements } from "@/lib/db/announcements";
import { getEvents } from "@/lib/db/events";
import { getMerch } from "@/lib/db/merch";
import { getPartnerships } from "@/lib/db/partnerships";
import { getSiteViews } from "@/lib/db/site-stats";
import { getTeamMembers } from "@/lib/db/team";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const email = await getSessionEmail();

  if (!email) {
    return (
      <div className="py-12">
        <AdminLoginForm />
      </div>
    );
  }

  const [announcements, events, merch, team, partnerships, about, siteViews] =
    await Promise.all([
      getAnnouncements(),
      getEvents(),
      getMerch(),
      getTeamMembers(),
      getPartnerships(),
      getAboutPage(),
      getSiteViews().catch(() => 0),
    ]);

  return (
    <AdminPanel
      adminEmail={email}
      siteViews={siteViews}
      initialData={{
        announcements,
        events,
        merch,
        team,
        partnerships,
        about,
      }}
    />
  );
}
