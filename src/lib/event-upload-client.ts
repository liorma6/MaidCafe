import type { EventAlbum } from "@/lib/types";
import { compressImageFile } from "@/lib/compress-image";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export type EventUploadType = "cover" | "gallery" | "video";

function uploadTypeLabel(type: EventUploadType): string {
  if (type === "cover") return "תמונה ראשית";
  if (type === "video") return "סרטון";
  return "תמונה";
}

export function formatUploadProgress(
  current: number,
  total: number,
  type: EventUploadType,
): string {
  return `מעלה ${uploadTypeLabel(type)} ${current} מתוך ${total}...`;
}

export async function uploadEventFile(
  eventId: string,
  file: File,
  type: EventUploadType,
): Promise<EventAlbum> {
  let uploadFile = file;
  if (type !== "video") {
    uploadFile = await compressImageFile(file);
  }

  const prepareRes = await fetch("/api/events/upload/prepare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId,
      type,
      fileName: uploadFile.name,
      contentType: uploadFile.type || (type === "video" ? "video/mp4" : "image/jpeg"),
    }),
  });

  if (!prepareRes.ok) {
    const data = await prepareRes.json().catch(() => ({}));
    throw new Error(data.error || "שגיאה בהכנת העלאה");
  }

  const { path, token, bucket } = (await prepareRes.json()) as {
    path: string;
    token: string;
    bucket: string;
  };

  const supabase = getSupabaseBrowser();
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(path, token, uploadFile, {
      contentType: uploadFile.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message || "שגיאה בהעלאה ל-Storage");
  }

  const completeRes = await fetch("/api/events/upload/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, type, path }),
  });

  if (!completeRes.ok) {
    const data = await completeRes.json().catch(() => ({}));
    throw new Error(data.error || "שגיאה בשמירת הקובץ");
  }

  const { event } = (await completeRes.json()) as { event: EventAlbum };
  return event;
}

export async function uploadEventFilesSequential(
  eventId: string,
  items: { file: File; type: EventUploadType }[],
  onProgress?: (message: string) => void,
): Promise<EventAlbum> {
  if (items.length === 0) {
    throw new Error("לא נבחרו קבצים להעלאה");
  }

  let latest: EventAlbum | null = null;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    onProgress?.(formatUploadProgress(i + 1, items.length, item.type));
    latest = await uploadEventFile(eventId, item.file, item.type);
  }

  return latest!;
}
