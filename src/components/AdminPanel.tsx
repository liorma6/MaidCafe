"use client";

import { useState } from "react";
import type {
  Announcement,
  EventAlbum,
  JobApplication,
  MerchItem,
  TeamMember,
} from "@/lib/types";

type Tab = "announcements" | "events" | "merch" | "team" | "applications";

interface AdminPanelProps {
  initialData: {
    announcements: Announcement[];
    events: EventAlbum[];
    merch: MerchItem[];
    team: TeamMember[];
    applications: JobApplication[];
  };
  adminEmail: string;
}

export default function AdminPanel({ initialData, adminEmail }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>("announcements");
  const [data, setData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "announcements", label: "הודעות בית", emoji: "📢" },
    { id: "events", label: "אירועים", emoji: "📸" },
    { id: "merch", label: "מרצ׳", emoji: "🛍️" },
    { id: "team", label: "צוות", emoji: "♡" },
    { id: "applications", label: "מועמדויות", emoji: "📝" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pink-700">פאנל ניהול ♡</h1>
          <p className="text-sm text-pink-500">מחובר/ת: {adminEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-200"
        >
          התנתקות
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-xl bg-green-100 px-4 py-3 text-green-800">
          {message}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-pink-500 text-white"
                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {tab === "announcements" && (
        <AnnouncementsTab
          announcements={data.announcements}
          setData={setData}
          showMessage={showMessage}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {tab === "events" && (
        <EventsTab
          events={data.events}
          setData={setData}
          showMessage={showMessage}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {tab === "merch" && (
        <MerchTab
          merch={data.merch}
          setData={setData}
          showMessage={showMessage}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {tab === "team" && (
        <TeamTab
          team={data.team}
          setData={setData}
          showMessage={showMessage}
        />
      )}
      {tab === "applications" && (
        <ApplicationsTab applications={data.applications} />
      )}
    </div>
  );
}

function AnnouncementsTab({
  announcements,
  setData,
  showMessage,
  loading,
  setLoading,
}: {
  announcements: Announcement[];
  setData: React.Dispatch<React.SetStateAction<AdminPanelProps["initialData"]>>;
  showMessage: (t: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      const item = await res.json();
      setData((d) => ({
        ...d,
        announcements: [item, ...d.announcements],
      }));
      setTitle("");
      setContent("");
      showMessage("הודעה פורסמה בהצלחה! ♡");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את ההודעה?")) return;
    await fetch("/api/announcements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setData((d) => ({
      ...d,
      announcements: d.announcements.filter((a) => a.id !== id),
    }));
    showMessage("הודעה נמחקה");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="kawaii-card space-y-4 p-6">
        <h2 className="text-lg font-bold text-pink-700">פרסום הודעה חדשה</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="כותרת ההודעה"
          className="admin-input"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="תוכן ההודעה..."
          rows={4}
          className="admin-input"
          required
        />
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? "מפרסם..." : "פרסם הודעה ♡"}
        </button>
      </form>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="kawaii-card flex items-start justify-between p-4">
            <div>
              <h3 className="font-bold text-pink-700">{a.title}</h3>
              <p className="mt-1 text-sm text-pink-800/70">{a.content}</p>
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              className="shrink-0 text-sm text-red-400 hover:text-red-600"
            >
              מחק
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsTab({
  events,
  setData,
  showMessage,
  loading,
  setLoading,
}: {
  events: EventAlbum[];
  setData: React.Dispatch<React.SetStateAction<AdminPanelProps["initialData"]>>;
  showMessage: (t: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, description }),
    });
    if (res.ok) {
      const item = await res.json();
      setData((d) => ({ ...d, events: [item, ...d.events] }));
      setTitle("");
      setDate("");
      setDescription("");
      showMessage("אירוע נוצר! עכשיו אפשר להעלות תמונות 📸");
    }
    setLoading(false);
  };

  const handleUpload = async (eventId: string, file: File) => {
    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("file", file);
    const res = await fetch("/api/events/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const { event } = await res.json();
      setData((d) => ({
        ...d,
        events: d.events.map((e) => (e.id === eventId ? event : e)),
      }));
      showMessage("תמונה הועלתה! ♡");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את האירוע?")) return;
    await fetch("/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setData((d) => ({
      ...d,
      events: d.events.filter((e) => e.id !== id),
    }));
    showMessage("אירוע נמחק");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="kawaii-card space-y-4 p-6">
        <h2 className="text-lg font-bold text-pink-700">יצירת אירוע חדש</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="שם האירוע"
          className="admin-input"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="admin-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="תיאור (אופציונלי)"
          rows={2}
          className="admin-input"
        />
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? "יוצר..." : "צור אירוע"}
        </button>
      </form>

      {events.map((event) => (
        <div key={event.id} className="kawaii-card p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="font-bold text-pink-700">{event.title}</h3>
              <p className="text-sm text-pink-500">{event.date}</p>
              {event.description && (
                <p className="mt-1 text-sm text-pink-800/70">{event.description}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(event.id)}
              className="text-sm text-red-400 hover:text-red-600"
            >
              מחק
            </button>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {event.images.map((img) => (
              <img
                key={img}
                src={img}
                alt=""
                className="h-20 w-20 rounded-lg object-cover"
              />
            ))}
          </div>

          <label className="admin-btn inline-block cursor-pointer">
            📸 העלאת תמונות
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  Array.from(files).forEach((f) => handleUpload(event.id, f));
                }
              }}
            />
          </label>
        </div>
      ))}
    </div>
  );
}

function MerchTab({
  merch,
  setData,
  showMessage,
  loading,
  setLoading,
}: {
  merch: MerchItem[];
  setData: React.Dispatch<React.SetStateAction<AdminPanelProps["initialData"]>>;
  showMessage: (t: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/merch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, price }),
    });
    if (res.ok) {
      const item = await res.json();
      setData((d) => ({ ...d, merch: [item, ...d.merch] }));
      setTitle("");
      setDescription("");
      setPrice("");
      showMessage("מוצר נוסף! עכשיו אפשר להעלות תמונה 🛍️");
    }
    setLoading(false);
  };

  const handleUpload = async (merchId: string, file: File) => {
    const formData = new FormData();
    formData.append("merchId", merchId);
    formData.append("file", file);
    const res = await fetch("/api/merch/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const { item } = await res.json();
      setData((d) => ({
        ...d,
        merch: d.merch.map((m) => (m.id === merchId ? item : m)),
      }));
      showMessage("תמונה הועלתה! ♡");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את המוצר?")) return;
    await fetch("/api/merch", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setData((d) => ({
      ...d,
      merch: d.merch.filter((m) => m.id !== id),
    }));
    showMessage("מוצר נמחק");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="kawaii-card space-y-4 p-6">
        <h2 className="text-lg font-bold text-pink-700">הוספת מוצר מרצ׳</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="שם המוצר"
          className="admin-input"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="תיאור"
          rows={2}
          className="admin-input"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="מחיר (לדוגמה: 45₪)"
          className="admin-input"
        />
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? "מוסיף..." : "הוסף מוצר"}
        </button>
      </form>

      {merch.map((item) => (
        <div key={item.id} className="kawaii-card flex gap-4 p-4">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-24 w-24 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-pink-100 text-pink-300">
              אין תמונה
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-pink-700">{item.title}</h3>
            <p className="text-sm text-pink-800/70">{item.description}</p>
            <p className="font-semibold text-pink-600">{item.price}</p>
            <div className="mt-2 flex gap-2">
              <label className="cursor-pointer text-sm text-pink-500 hover:text-pink-700">
                📸 העלאת תמונה
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(item.id, file);
                  }}
                />
              </label>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamTab({
  team,
  setData,
  showMessage,
}: {
  team: TeamMember[];
  setData: React.Dispatch<React.SetStateAction<AdminPanelProps["initialData"]>>;
  showMessage: (t: string) => void;
}) {
  const [editing, setEditing] = useState<TeamMember | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    const res = await fetch("/api/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((d) => ({
        ...d,
        team: d.team.map((t) => (t.id === updated.id ? updated : t)),
      }));
      setEditing(null);
      showMessage("פרטי הצוות עודכנו! ♡");
    }
  };

  return (
    <div className="space-y-4">
      {team.map((member) => (
        <div key={member.id} className="kawaii-card p-4">
          {editing?.id === member.id ? (
            <div className="space-y-3">
              <input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="admin-input"
                placeholder="שם"
              />
              <input
                value={editing.role}
                onChange={(e) =>
                  setEditing({ ...editing, role: e.target.value })
                }
                className="admin-input"
                placeholder="תפקיד"
              />
              <input
                value={editing.catchphrase}
                onChange={(e) =>
                  setEditing({ ...editing, catchphrase: e.target.value })
                }
                className="admin-input"
                placeholder="משפט תפיסה"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="admin-btn">
                  שמור
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-full bg-pink-100 px-4 py-2 text-sm text-pink-700"
                >
                  ביטול
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-pink-700">{member.name}</h3>
                  <p className="text-sm text-pink-500">{member.role}</p>
                  <p className="text-sm text-pink-800/70">{member.catchphrase}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(member)}
                className="text-sm text-pink-500 hover:text-pink-700"
              >
                עריכה
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ApplicationsTab({
  applications,
}: {
  applications: JobApplication[];
}) {
  if (applications.length === 0) {
    return (
      <p className="text-center text-pink-500">אין מועמדויות עדיין</p>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="kawaii-card p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-pink-700">{app.fullName}</h3>
            <span className="text-xs text-pink-400">
              {new Date(app.createdAt).toLocaleDateString("he-IL")}
            </span>
          </div>
          <p className="text-sm text-pink-600">
            {app.email} · {app.phone}
            {app.age && ` · גיל ${app.age}`}
          </p>
          {app.experience && (
            <p className="mt-2 text-sm text-pink-800/70">
              <strong>ניסיון:</strong> {app.experience}
            </p>
          )}
          {app.message && (
            <p className="mt-1 text-sm text-pink-800/70">
              <strong>הודעה:</strong> {app.message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
