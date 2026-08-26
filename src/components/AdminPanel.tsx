"use client";

import { useState } from "react";
import FileUploadButton from "@/components/FileUploadButton";
import HeartImageCropModal from "@/components/HeartImageCropModal";
import LinkifiedText from "@/components/LinkifiedText";
import ReorderControls from "@/components/ReorderControls";
import {
  uploadEventFile,
  uploadEventFilesSequential,
  type EventUploadType,
} from "@/lib/event-upload-client";
import type { ReorderEntity } from "@/lib/db/reorder";
import { sortAnnouncements } from "@/lib/sort-utils";
import type {
  AboutPage,
  Announcement,
  EventAlbum,
  MerchItem,
  Partnership,
  TeamMember,
} from "@/lib/types";
import type { SiteStats } from "@/lib/db/site-stats";
import { formatEventDateRange } from "@/lib/date-utils";

type Tab =
  | "announcements"
  | "events"
  | "merch"
  | "team"
  | "partnerships"
  | "about"
  | "stats";

interface AdminData {
  announcements: Announcement[];
  events: EventAlbum[];
  merch: MerchItem[];
  team: TeamMember[];
  partnerships: Partnership[];
  about: AboutPage;
}

interface AdminPanelProps {
  initialData: AdminData;
  adminEmail: string;
  siteStats: SiteStats;
}

async function reorderEntity(
  entity: ReorderEntity,
  id: string,
  direction: "up" | "down",
): Promise<unknown[] | null> {
  const res = await fetch("/api/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity, id, direction }),
  });
  if (!res.ok) return null;
  const { items } = await res.json();
  return items;
}

export default function AdminPanel({
  initialData,
  adminEmail,
  siteStats,
}: AdminPanelProps) {
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
    { id: "partnerships", label: "שת״פים", emoji: "🤝" },
    { id: "about", label: "מי אנחנו", emoji: "✨" },
    { id: "stats", label: "סטטיסטיקות", emoji: "📊" },
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
      {tab === "partnerships" && (
        <PartnershipsTab
          partnerships={data.partnerships}
          setData={setData}
          showMessage={showMessage}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {tab === "about" && (
        <AboutTab
          about={data.about}
          setData={setData}
          showMessage={showMessage}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {tab === "stats" && <AnalyticsTab siteStats={siteStats} />}
    </div>
  );
}

function AnalyticsTab({ siteStats }: { siteStats: SiteStats }) {
  return (
    <div className="kawaii-card space-y-8 p-10 text-center">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center">
          <p className="text-4xl">👁️</p>
          <p className="mt-4 text-base font-semibold text-pink-600">
            סך כל המבקרים הייחודיים:
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-pink-700">
            {siteStats.totalViews.toLocaleString("he-IL")}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center sm:border-r sm:border-pink-200">
          <p className="text-4xl">📅</p>
          <p className="mt-4 text-base font-semibold text-pink-600">
            מבקרים ייחודיים היום:
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-pink-700">
            {siteStats.dailyViews.toLocaleString("he-IL")}
          </p>
        </div>
      </div>
      <p className="text-sm text-pink-400">
        נספר פעם אחת ליום לכל מבקר (לפי IP מקודד)
      </p>
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
  setData: React.Dispatch<React.SetStateAction<AdminData>>;
  showMessage: (t: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [pinned, setPinned] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);

  const sorted = sortAnnouncements(announcements);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category, pinned }),
    });
    if (res.ok) {
      const item = await res.json();
      setData((d) => ({
        ...d,
        announcements: sortAnnouncements([...d.announcements, item]),
      }));
      setTitle("");
      setContent("");
      setCategory("");
      setPinned(false);
      showMessage("הודעה פורסמה בהצלחה! ♡");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    const res = await fetch("/api/announcements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        title: editing.title,
        content: editing.content,
        category: editing.category,
        pinned: editing.pinned,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((d) => ({
        ...d,
        announcements: sortAnnouncements(
          d.announcements.map((a) => (a.id === updated.id ? updated : a)),
        ),
      }));
      setEditing(null);
      showMessage("הודעה עודכנה! ♡");
    }
    setLoading(false);
  };

  const handleTogglePin = async (item: Announcement) => {
    const res = await fetch("/api/announcements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, pinned: !item.pinned }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((d) => ({
        ...d,
        announcements: sortAnnouncements(
          d.announcements.map((a) => (a.id === updated.id ? updated : a)),
        ),
      }));
      showMessage(updated.pinned ? "הודעה ננעצה 📌" : "הודעה הוסרה מהנעיצה");
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const items = await reorderEntity("announcements", id, direction);
    if (items) {
      setData((d) => ({
        ...d,
        announcements: items as Announcement[],
      }));
    }
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

  const canMoveUp = (index: number, item: Announcement) => {
    if (index === 0) return false;
    return sorted[index - 1].pinned === item.pinned;
  };

  const canMoveDown = (index: number, item: Announcement) => {
    if (index >= sorted.length - 1) return false;
    return sorted[index + 1].pinned === item.pinned;
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
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="נושא (למשל: אירועים, עדכונים)"
          className="admin-input"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="תוכן ההודעה... (קישורים עם https:// יהיו לחיצים)"
          rows={4}
          className="admin-input"
          required
        />
        <label className="flex items-center gap-2 text-sm font-semibold text-pink-700">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="rounded border-pink-300"
          />
          נעוץ בראש העמוד 📌
        </label>
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? "מפרסם..." : "פרסם הודעה ♡"}
        </button>
      </form>

      <div className="space-y-3">
        {sorted.map((a, index) => (
          <div key={a.id} className="kawaii-card flex items-start gap-3 p-4">
            <ReorderControls
              onUp={() => handleReorder(a.id, "up")}
              onDown={() => handleReorder(a.id, "down")}
              disableUp={!canMoveUp(index, a)}
              disableDown={!canMoveDown(index, a)}
            />
            <div className="min-w-0 flex-1">
              {editing?.id === a.id ? (
                <div className="space-y-3">
                  <input
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                    className="admin-input"
                    placeholder="כותרת"
                  />
                  <input
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    className="admin-input"
                    placeholder="נושא"
                  />
                  <textarea
                    value={editing.content}
                    onChange={(e) =>
                      setEditing({ ...editing, content: e.target.value })
                    }
                    rows={4}
                    className="admin-input"
                    placeholder="תוכן"
                  />
                  <label className="flex items-center gap-2 text-sm font-semibold text-pink-700">
                    <input
                      type="checkbox"
                      checked={editing.pinned}
                      onChange={(e) =>
                        setEditing({ ...editing, pinned: e.target.checked })
                      }
                      className="rounded border-pink-300"
                    />
                    נעוץ 📌
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={loading}
                      className="admin-btn text-sm"
                    >
                      {loading ? "שומר..." : "שמור"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="rounded-full bg-pink-100 px-4 py-2 text-sm text-pink-700"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {a.pinned && (
                      <span className="rounded-full bg-pink-500 px-2 py-0.5 text-xs font-bold text-white">
                        נעוץ 📌
                      </span>
                    )}
                    {a.category && (
                      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-semibold text-pink-700">
                        {a.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-pink-700">{a.title}</h3>
                  <LinkifiedText
                    text={a.content}
                    className="mt-1 text-sm text-pink-800/70 whitespace-pre-wrap"
                  />
                </>
              )}
            </div>
            {editing?.id !== a.id && (
              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(a)}
                  className="text-sm text-pink-600 hover:text-pink-800"
                >
                  ערוך
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePin(a)}
                  className="text-sm text-pink-500 hover:text-pink-700"
                >
                  {a.pinned ? "בטל נעיצה" : "נעץ"}
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-sm text-red-400 hover:text-red-600"
                >
                  מחק
                </button>
              </div>
            )}
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
  setData: React.Dispatch<React.SetStateAction<AdminData>>;
  showMessage: (t: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [cropState, setCropState] = useState<{
    src: string;
    onDone: (file: File) => void;
  } | null>(null);
  const [editing, setEditing] = useState<EventAlbum | null>(null);

  const closeCrop = () => {
    if (cropState?.src.startsWith("blob:")) {
      URL.revokeObjectURL(cropState.src);
    }
    setCropState(null);
  };

  const openHeartCrop = (file: File, onDone: (cropped: File) => void) => {
    setCropState({
      src: URL.createObjectURL(file),
      onDone,
    });
  };

  const buildUploadQueue = (
    cover: File | null,
    gallery: File[],
    videos: File[],
  ): { file: File; type: EventUploadType }[] => {
    const items: { file: File; type: EventUploadType }[] = [];
    if (cover) items.push({ file: cover, type: "cover" });
    gallery.forEach((file) => items.push({ file, type: "gallery" }));
    videos.forEach((file) => items.push({ file, type: "video" }));
    return items;
  };

  const uploadFiles = async (
    eventId: string,
    cover: File | null,
    gallery: File[],
    videos: File[],
  ): Promise<EventAlbum | null> => {
    const queue = buildUploadQueue(cover, gallery, videos);
    if (queue.length === 0) return null;
    return uploadEventFilesSequential(eventId, queue, setUploadProgress);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(null);
    let created: EventAlbum | null = null;

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, endDate: endDate || null, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "שגיאה ביצירת אירוע");
      }

      const eventRecord = (await res.json()) as EventAlbum;
      created = eventRecord;
      let item: EventAlbum = eventRecord;
      const withMedia = await uploadFiles(
        eventRecord.id,
        coverFile,
        galleryFiles,
        videoFiles,
      );
      if (withMedia) item = withMedia;

      setData((d) => ({ ...d, events: [item, ...d.events] }));
      setTitle("");
      setDate("");
      setEndDate("");
      setDescription("");
      setCoverFile(null);
      setGalleryFiles([]);
      setVideoFiles([]);
      setCoverPreview(null);
      showMessage("אירוע נוצר בהצלחה! ♡");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "שגיאה בהעלאת הקבצים";
      if (created) {
        setData((d) => ({
          ...d,
          events: [created!, ...d.events.filter((ev) => ev.id !== created!.id)],
        }));
        showMessage(`האירוע נוצר, אך ההעלאה נכשלה: ${message}`);
      } else {
        showMessage(message);
      }
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const handleCoverSelect = (file: File | null) => {
    if (!file) {
      setCoverFile(null);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(null);
      return;
    }
    openHeartCrop(file, (cropped) => {
      setCoverFile(cropped);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(URL.createObjectURL(cropped));
    });
  };

  const handleCoverReplace = (eventId: string, file: File) => {
    openHeartCrop(file, (cropped) => {
      handleUploadMany(eventId, [cropped], "cover");
    });
  };

  const handleRecropExistingCover = async (event: EventAlbum) => {
    if (!event.coverImage) return;
    setUploadProgress("טוען תמונה לחיתוך...");
    try {
      const res = await fetch(event.coverImage);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const file = new File([blob], "cover.jpg", {
        type: blob.type || "image/jpeg",
      });
      openHeartCrop(file, (cropped) => {
        handleUploadMany(event.id, [cropped], "cover");
      });
    } catch {
      alert("לא ניתן לטעון את התמונה — נסו להעלות תמונה חדשה");
    } finally {
      setUploadProgress(null);
    }
  };

  const handleUploadMany = async (
    eventId: string,
    files: File[],
    type: EventUploadType,
  ) => {
    if (files.length === 0) return;

    setLoading(true);
    setUploadProgress(null);

    try {
      const items = files.map((file) => ({ file, type }));
      const event =
        items.length === 1
          ? await (async () => {
              setUploadProgress(
                type === "video"
                  ? "מעלה סרטון..."
                  : type === "cover"
                    ? "מעלה תמונה ראשית..."
                    : "מעלה תמונה...",
              );
              return uploadEventFile(eventId, items[0].file, type);
            })()
          : await uploadEventFilesSequential(eventId, items, setUploadProgress);

      setData((d) => ({
        ...d,
        events: d.events.map((ev) => (ev.id === eventId ? event : ev)),
      }));
      showMessage(
        type === "cover"
          ? "תמונה ראשית הועלתה! ♡"
          : type === "video"
            ? "הסרטונים הועלו! ♡"
            : "התמונות הועלו! ♡",
      );
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : "שגיאה בהעלאה",
      );
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const handleRemoveGalleryImage = async (eventId: string, imageUrl: string) => {
    if (!confirm("למחוק את התמונה מהגלריה?")) return;

    const res = await fetch("/api/events/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, imagePath: imageUrl, type: "gallery" }),
    });

    if (res.ok) {
      setData((d) => ({
        ...d,
        events: d.events.map((e) =>
          e.id === eventId
            ? { ...e, images: e.images.filter((img) => img !== imageUrl) }
            : e,
        ),
      }));
      showMessage("תמונה הוסרה מהגלריה");
    } else {
      const data = await res.json().catch(() => ({}));
      showMessage(data.error || "שגיאה במחיקת תמונה");
    }
  };

  const handleRemoveVideo = async (eventId: string, videoUrl: string) => {
    const res = await fetch("/api/events/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, imagePath: videoUrl, type: "video" }),
    });
    if (res.ok) {
      setData((d) => ({
        ...d,
        events: d.events.map((e) =>
          e.id === eventId
            ? { ...e, videos: e.videos.filter((v) => v !== videoUrl) }
            : e,
        ),
      }));
      showMessage("סרטון הוסר");
    }
  };

  const handleRemoveCover = async (event: EventAlbum) => {
    if (!event.coverImage) return;
    const res = await fetch("/api/events/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: event.id,
        imagePath: event.coverImage,
        type: "cover",
      }),
    });
    if (res.ok) {
      const { event: updated } = await res.json();
      setData((d) => ({
        ...d,
        events: d.events.map((e) => (e.id === event.id ? updated : e)),
      }));
      showMessage("תמונה ראשית הוסרה");
    }
  };

  const handleUpdateDates = async (
    eventId: string,
    startDate: string,
    eventEndDate: string,
  ) => {
    const res = await fetch("/api/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: eventId,
        date: startDate,
        endDate: eventEndDate || null,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((d) => ({
        ...d,
        events: d.events.map((e) => (e.id === eventId ? updated : e)),
      }));
      showMessage("תאריכים עודכנו! ♡");
    }
  };

  const handleSaveDetails = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      showMessage("נא למלא שם אירוע");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        title: editing.title.trim(),
        description: (editing.description || "").trim(),
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((d) => ({
        ...d,
        events: d.events.map((e) => (e.id === updated.id ? updated : e)),
      }));
      setEditing(null);
      showMessage("פרטי האירוע עודכנו! ♡");
    } else {
      const data = await res.json().catch(() => ({}));
      showMessage(data.error || "שגיאה בעדכון");
    }
    setLoading(false);
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
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-pink-500">
              תאריך התחלה
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="admin-input"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-pink-500">
              תאריך סיום (אופציונלי)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="admin-input"
            />
          </div>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="תיאור (אופציונלי)"
          rows={2}
          className="admin-input"
        />

        <div className="space-y-3 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/50 p-4">
          <p className="text-sm font-bold text-pink-700">תמונות האירוע</p>

          <FileUploadButton
            label="🖼️ תמונה ראשית (לב)"
            hint="ייפתח חיתוך — התמונה תופיע בתוך לב ברשימת האירועים"
            onChange={(files) => handleCoverSelect(files[0] || null)}
            selectedLabel={
              coverFile ? `נבחר: ${coverFile.name}` : undefined
            }
          />
          {coverPreview && (
            <div className="mx-auto w-full max-w-[200px]">
              <div className="heart-shape relative aspect-[1/1.05] overflow-hidden border-4 border-pink-300">
                <img
                  src={coverPreview}
                  alt="תצוגה מקדימה של כיסוי אירוע מייד קפה"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 text-center text-xs text-pink-500">
                תצוגה מקדימה — לב
              </p>
            </div>
          )}

          <FileUploadButton
            label="📸 תמונות לגלריה"
            hint="אפשר לבחור כמה תמונות בבת אחת"
            multiple
            variant="secondary"
            onChange={setGalleryFiles}
            selectedLabel={
              galleryFiles.length > 0
                ? `נבחרו ${galleryFiles.length} תמונות`
                : undefined
            }
          />

          <FileUploadButton
            label="🎬 סרטונים"
            hint="MP4, WebM או MOV — אפשר כמה"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            multiple
            variant="secondary"
            onChange={setVideoFiles}
            selectedLabel={
              videoFiles.length > 0
                ? `נבחרו ${videoFiles.length} סרטונים`
                : undefined
            }
          />
        </div>

        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? "מעלה..." : "צור אירוע ♡"}
        </button>
        {uploadProgress && (
          <p className="text-center text-sm font-semibold text-pink-600">
            {uploadProgress}
          </p>
        )}
      </form>

      {uploadProgress && (
        <p className="rounded-xl bg-pink-100 px-4 py-3 text-center text-sm font-semibold text-pink-700">
          {uploadProgress}
        </p>
      )}

      {events.map((event) => (
        <div key={event.id} className="kawaii-card p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex gap-4">
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={`כיסוי אירוע מייד קפה ${event.title}`}
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-pink-200 bg-pink-50 text-2xl text-pink-300">
                  📸
                </div>
              )}
              <div className="min-w-0 flex-1">
                {editing?.id === event.id ? (
                  <div className="space-y-3">
                    <input
                      value={editing.title}
                      onChange={(e) =>
                        setEditing({ ...editing, title: e.target.value })
                      }
                      placeholder="שם האירוע"
                      className="admin-input"
                    />
                    <textarea
                      value={editing.description || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, description: e.target.value })
                      }
                      placeholder="תיאור (אופציונלי)"
                      rows={3}
                      className="admin-input"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleSaveDetails}
                        disabled={loading}
                        className="admin-btn text-sm"
                      >
                        {loading ? "שומר..." : "שמור שינויים"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-200"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-pink-700">{event.title}</h3>
                    <p className="text-sm text-pink-500">
                      {formatEventDateRange(event.date, event.endDate)}
                    </p>
                    <EventDateEditor
                      event={event}
                      onSave={(start, end) => handleUpdateDates(event.id, start, end)}
                    />
                    {event.description && (
                      <p className="preserve-lines mt-1 text-sm text-pink-800/70">{event.description}</p>
                    )}
                    <p className="mt-1 text-xs text-pink-400">
                      {event.images.length} תמונות · {event.videos.length} סרטונים
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              {editing?.id !== event.id && (
                <button
                  type="button"
                  onClick={() => setEditing(event)}
                  className="text-sm text-pink-600 hover:text-pink-800"
                >
                  ערוך
                </button>
              )}
              <button
                onClick={() => handleDelete(event.id)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                מחק
              </button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {event.images.map((img) => (
              <div key={img} className="group relative h-20 w-20 shrink-0">
                <img
                  src={img}
                  alt={`תמונה מאירוע מייד קפה ${event.title}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(event.id, img)}
                  className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow hover:bg-red-600"
                  aria-label="מחק תמונה"
                  title="מחק תמונה"
                >
                  ×
                </button>
              </div>
            ))}
            {event.videos.map((video) => (
              <div
                key={video}
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-pink-200 bg-pink-900"
              >
                <video
                  src={video}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 text-lg text-white">
                  ▶
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveVideo(event.id, video)}
                  className="absolute -left-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow hover:bg-red-600"
                  aria-label="מחק סרטון"
                  title="מחק סרטון"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <div className="min-w-[220px] flex-1">
              <FileUploadButton
                label="🖼️ תמונה ראשית (לב)"
                hint="חיתוך ללב — מחליף את כריכת האלבום"
                onChange={(files) => {
                  const file = files[0];
                  if (file) handleCoverReplace(event.id, file);
                }}
              />
            </div>
            <div className="min-w-[220px] flex-1">
              <FileUploadButton
                label="📸 תמונות לגלריה"
                hint="הוספת תמונות לאלבום"
                multiple
                variant="secondary"
                onChange={(files) => {
                  if (files.length > 0) handleUploadMany(event.id, files, "gallery");
                }}
              />
            </div>
            <div className="min-w-[220px] flex-1">
              <FileUploadButton
                label="🎬 סרטונים"
                hint="MP4, WebM או MOV"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                multiple
                variant="secondary"
                onChange={(files) => {
                  if (files.length > 0) handleUploadMany(event.id, files, "video");
                }}
              />
            </div>
            {event.coverImage && (
              <button
                type="button"
                onClick={() => handleRecropExistingCover(event)}
                className="self-start rounded-full border-2 border-pink-300 bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-700 transition hover:border-pink-400 hover:bg-pink-100"
              >
                ✂️ חתוך מחדש את התמונה הראשית
              </button>
            )}
            {event.coverImage && (
              <button
                type="button"
                onClick={() => handleRemoveCover(event)}
                className="self-start rounded-full border-2 border-pink-200 bg-white px-4 py-3 text-sm font-semibold text-pink-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                הסר תמונה ראשית
              </button>
            )}
          </div>
        </div>
      ))}

      {cropState && (
        <HeartImageCropModal
          imageSrc={cropState.src}
          open
          onClose={closeCrop}
          onConfirm={(file) => {
            cropState.onDone(file);
            closeCrop();
          }}
        />
      )}
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
  setData: React.Dispatch<React.SetStateAction<AdminData>>;
  showMessage: (t: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const items = await reorderEntity("merch", id, direction);
    if (items) {
      setData((d) => ({ ...d, merch: items as MerchItem[] }));
    }
  };

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

      {merch.map((item, index) => (
        <div key={item.id} className="kawaii-card flex gap-4 p-4">
          <ReorderControls
            onUp={() => handleReorder(item.id, "up")}
            onDown={() => handleReorder(item.id, "down")}
            disableUp={index === 0}
            disableDown={index === merch.length - 1}
          />
          {item.image ? (
            <img
              src={item.image}
              alt={`מרצ' מייד קפה - ${item.title}`}
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-pink-100 text-pink-300">
              אין תמונה
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-pink-700">{item.title}</h3>
            <p className="preserve-lines text-sm text-pink-800/70">{item.description}</p>
            <p className="font-semibold text-pink-600">{item.price}</p>
            <div className="mt-3">
              <FileUploadButton
                label="📸 העלאת תמונה"
                hint="תמונת המוצר"
                onChange={(files) => {
                  const file = files[0];
                  if (file) handleUpload(item.id, file);
                }}
              />
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="mt-2 text-sm text-red-400 hover:text-red-600"
            >
              מחק
            </button>
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
  setData: React.Dispatch<React.SetStateAction<AdminData>>;
  showMessage: (t: string) => void;
}) {
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("מייד");
  const [newCatchphrase, setNewCatchphrase] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newChibiImage, setNewChibiImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const items = await reorderEntity("team_members", id, direction);
    if (items) {
      setData((d) => ({ ...d, team: items as TeamMember[] }));
    }
  };

  const handleImageUpload = async (
    memberId: string,
    file: File,
    type: "portrait" | "chibi",
  ) => {
    const formData = new FormData();
    formData.append("memberId", memberId);
    formData.append("file", file);
    formData.append("type", type);
    const res = await fetch("/api/team/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { member } = await res.json();
      setData((d) => ({
        ...d,
        team: d.team.map((t) => (t.id === memberId ? member : t)),
      }));
      showMessage(
        type === "chibi" ? "תמונת צ'יבי עודכנה! ♡" : "תמונת פרופיל עודכנה! ♡",
      );
    } else {
      const data = await res.json();
      showMessage(data.error || "שגיאה בהעלאה");
    }
  };

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("role", newRole);
    formData.append("catchphrase", newCatchphrase);
    formData.append("file", newImage);
    if (newChibiImage) formData.append("chibiFile", newChibiImage);

    const res = await fetch("/api/team", { method: "POST", body: formData });
    if (res.ok) {
      const member = await res.json();
      setData((d) => ({ ...d, team: [...d.team, member] }));
      setNewName("");
      setNewRole("מייד");
      setNewCatchphrase("");
      setNewImage(null);
      setNewChibiImage(null);
      setCreating(false);
      showMessage("חבר/ת צוות חדש/ה נוסף/ה! ♡");
    } else {
      const data = await res.json();
      showMessage(data.error || "שגיאה בהוספה");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את חבר/ת הצוות?")) return;
    const res = await fetch("/api/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setData((d) => ({ ...d, team: d.team.filter((t) => t.id !== id) }));
      showMessage("חבר/ת צוות נמחק/ה");
    }
  };

  return (
    <div className="space-y-6">
      {!creating ? (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="admin-btn"
        >
          + הוספת חבר/ת צוות חדש/ה ♡
        </button>
      ) : (
        <form onSubmit={handleCreate} className="kawaii-card space-y-4 p-6">
          <h2 className="text-lg font-bold text-pink-700">חבר/ת צוות חדש/ה</h2>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="שם"
            className="admin-input"
            required
          />
          <input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="תפקיד (למשל: מייד)"
            className="admin-input"
            required
          />
          <textarea
            value={newCatchphrase}
            onChange={(e) => setNewCatchphrase(e.target.value)}
            placeholder="משפט תפיסה (Enter לירידת שורה)"
            rows={3}
            className="admin-input"
            required
          />
          <FileUploadButton
            label="📸 תמונה רגילה"
            hint="חובה — תמונת פרופיל (עיגול)"
            onChange={(files) => setNewImage(files[0] || null)}
            selectedLabel={newImage ? `נבחר: ${newImage.name}` : undefined}
          />
          <FileUploadButton
            label="✨ תמונת צ'יבי"
            hint="מומלץ — לקפיצה בהובר"
            variant="secondary"
            onChange={(files) => setNewChibiImage(files[0] || null)}
            selectedLabel={
              newChibiImage ? `נבחר: ${newChibiImage.name}` : undefined
            }
          />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="admin-btn">
              {loading ? "מוסיף..." : "הוסף לצוות ♡"}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-full bg-pink-100 px-4 py-2 text-sm text-pink-700"
            >
              ביטול
            </button>
          </div>
        </form>
      )}

      {team.map((member, index) => (
        <div key={member.id} className="kawaii-card flex gap-3 p-4">
          <ReorderControls
            onUp={() => handleReorder(member.id, "up")}
            onDown={() => handleReorder(member.id, "down")}
            disableUp={index === 0}
            disableDown={index === team.length - 1}
          />
          <div className="min-w-0 flex-1">
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
              <textarea
                value={editing.catchphrase}
                onChange={(e) =>
                  setEditing({ ...editing, catchphrase: e.target.value })
                }
                className="admin-input"
                placeholder="משפט תפיסה (Enter לירידת שורה)"
                rows={3}
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
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <img
                      src={member.image}
                      alt={`צוות המייד קפה ${member.name} - ${member.role}`}
                    />
                    {member.chibiImage ? (
                      <img
                        src={member.chibiImage}
                        alt={`דמות chibi של ${member.name} מצוות המייד קפה`}
                        className="h-16 w-16 rounded-xl border-2 border-pink-200 bg-pink-50 object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-pink-200 bg-pink-50 text-xs text-pink-300">
                        אין צ&apos;יבי
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-pink-700">{member.name}</h3>
                    <p className="text-sm text-pink-500">{member.role}</p>
                    <p className="preserve-lines text-sm text-pink-800/70">{member.catchphrase}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    onClick={() => setEditing(member)}
                    className="text-sm text-pink-500 hover:text-pink-700"
                  >
                    עריכת טקסט
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    מחק
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <FileUploadButton
                  label="📸 החלפת תמונה רגילה"
                  hint="תמונת הפרופיל"
                  onChange={(files) => {
                    const file = files[0];
                    if (file) handleImageUpload(member.id, file, "portrait");
                  }}
                />
                <FileUploadButton
                  label="✨ החלפת תמונת צ'יבי"
                  hint="לקפיצה בהובר"
                  variant="secondary"
                  onChange={(files) => {
                    const file = files[0];
                    if (file) handleImageUpload(member.id, file, "chibi");
                  }}
                />
              </div>
            </div>
          )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutTab({
  about,
  setData,
  showMessage,
  loading,
  setLoading,
}: {
  about: AboutPage;
  setData: React.Dispatch<React.SetStateAction<AdminData>>;
  showMessage: (t: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [title, setTitle] = useState(about.title);
  const [content, setContent] = useState(about.content);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((d) => ({ ...d, about: updated }));
      showMessage("עמוד מי אנחנו עודכן! ✨");
    } else {
      const data = await res.json();
      showMessage(data.error || "שגיאה בשמירה");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="kawaii-card space-y-4 p-6">
      <h2 className="text-lg font-bold text-pink-700">עריכת עמוד &quot;מי אנחנו&quot;</h2>
      <p className="text-sm text-pink-500">
        התוכן יוצג למשקיעים, שותפים וכל מי שמתעניין בקיומנו.
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="כותרת העמוד"
        className="admin-input"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="תוכן העמוד... (קישורים עם https:// יהיו לחיצים)"
        rows={12}
        className="admin-input"
      />
      <button type="submit" disabled={loading} className="admin-btn">
        {loading ? "שומר..." : "שמור שינויים ✨"}
      </button>
    </form>
  );
}

function EventDateEditor({
  event,
  onSave,
}: {
  event: EventAlbum;
  onSave: (startDate: string, endDate: string) => void;
}) {
  const [startDate, setStartDate] = useState(event.date);
  const [endDate, setEndDate] = useState(event.endDate || "");

  return (
    <div className="mt-2 flex flex-wrap items-end gap-2">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="rounded-lg border border-pink-200 px-2 py-1 text-xs"
        aria-label="תאריך התחלה"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="rounded-lg border border-pink-200 px-2 py-1 text-xs"
        aria-label="תאריך סיום"
      />
      <button
        type="button"
        onClick={() => onSave(startDate, endDate)}
        className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700 hover:bg-pink-200"
      >
        שמור תאריכים
      </button>
    </div>
  );
}

function PartnershipsTab({
  partnerships,
  setData,
  showMessage,
  loading,
  setLoading,
}: {
  partnerships: Partnership[];
  setData: React.Dispatch<React.SetStateAction<AdminData>>;
  showMessage: (t: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<Partnership | null>(null);

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const items = await reorderEntity("partnerships", id, direction);
    if (items) {
      setData((d) => ({ ...d, partnerships: items as Partnership[] }));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      showMessage("נא לבחור תמונה");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("url", url);
    formData.append("file", imageFile);

    const res = await fetch("/api/partnerships", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const item = await res.json();
      setData((d) => ({ ...d, partnerships: [item, ...d.partnerships] }));
      setName("");
      setDescription("");
      setUrl("");
      setImageFile(null);
      showMessage("שת״פ נוסף בהצלחה! 🤝");
    } else {
      const data = await res.json();
      showMessage(data.error || "שגיאה");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    const res = await fetch("/api/partnerships", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        name: editing.name,
        description: editing.description,
        url: editing.url,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((d) => ({
        ...d,
        partnerships: d.partnerships.map((p) =>
          p.id === updated.id ? updated : p,
        ),
      }));
      setEditing(null);
      showMessage("שת״פ עודכן! ♡");
    } else {
      const data = await res.json();
      showMessage(data.error || "שגיאה בעדכון");
    }
    setLoading(false);
  };

  const handleUpload = async (partnershipId: string, file: File) => {
    const formData = new FormData();
    formData.append("partnershipId", partnershipId);
    formData.append("file", file);
    const res = await fetch("/api/partnerships/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const { item } = await res.json();
      setData((d) => ({
        ...d,
        partnerships: d.partnerships.map((p) =>
          p.id === partnershipId ? item : p,
        ),
      }));
      if (editing?.id === partnershipId) {
        setEditing(item);
      }
      showMessage("תמונה הועלתה! ♡");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את השת״פ?")) return;
    await fetch("/api/partnerships", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setData((d) => ({
      ...d,
      partnerships: d.partnerships.filter((p) => p.id !== id),
    }));
    if (editing?.id === id) setEditing(null);
    showMessage("שת״פ נמחק");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="kawaii-card space-y-4 p-6">
        <h2 className="text-lg font-bold text-pink-700">הוספת שת״פ</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="שם העסק"
          className="admin-input"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="תיאור קצר"
          rows={2}
          className="admin-input"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="קישור לאתר (אופציונלי) — https://..."
          className="admin-input"
          dir="ltr"
        />
        <FileUploadButton
          label="📸 תמונת העסק"
          hint="חובה — לוגו או תמונה של השותף"
          onChange={(files) => setImageFile(files[0] || null)}
          selectedLabel={
            imageFile ? `נבחר: ${imageFile.name}` : undefined
          }
        />
        <button type="submit" disabled={loading} className="admin-btn">
          {loading ? "מוסיף..." : "הוסף שת״פ"}
        </button>
      </form>

      {partnerships.map((partner, index) => (
        <div key={partner.id} className="kawaii-card flex gap-4 p-4">
          <ReorderControls
            onUp={() => handleReorder(partner.id, "up")}
            onDown={() => handleReorder(partner.id, "down")}
            disableUp={index === 0}
            disableDown={index === partnerships.length - 1}
          />
          {partner.image ? (
            <img
              src={partner.image}
              alt={`שותף מייד קפה ${partner.name}`}
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-pink-100 text-pink-300">
              אין תמונה
            </div>
          )}
          <div className="flex-1">
            {editing?.id === partner.id ? (
              <div className="space-y-3">
                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  placeholder="שם העסק"
                  className="admin-input"
                />
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  placeholder="תיאור קצר"
                  rows={2}
                  className="admin-input"
                />
                <input
                  value={editing.url}
                  onChange={(e) =>
                    setEditing({ ...editing, url: e.target.value })
                  }
                  placeholder="קישור לאתר — https://..."
                  className="admin-input"
                  dir="ltr"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="admin-btn text-sm"
                  >
                    {loading ? "שומר..." : "שמור שינויים"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-200"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-pink-700">{partner.name}</h3>
                <p className="preserve-lines text-sm text-pink-800/70">{partner.description}</p>
                {partner.url && (
                  <p className="mt-1 truncate text-xs text-pink-500" dir="ltr">
                    {partner.url}
                  </p>
                )}
              </>
            )}
            <div className="mt-3">
              <FileUploadButton
                label="📸 העלאת / החלפת תמונה"
                hint="לוגו או תמונה של העסק"
                onChange={(files) => {
                  const file = files[0];
                  if (file) handleUpload(partner.id, file);
                }}
              />
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 self-start">
            {editing?.id !== partner.id && (
              <button
                type="button"
                onClick={() => setEditing({ ...partner })}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                ערוך
              </button>
            )}
            <button
              onClick={() => handleDelete(partner.id)}
              className="text-sm text-red-400 hover:text-red-600"
            >
              מחק
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
