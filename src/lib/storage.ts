import { v4 as uuidv4 } from "uuid";
import { getStorageBucket } from "./env";
import { getSupabaseAdmin } from "./supabase";

export async function uploadImage(
  folder: "events" | "merch" | "team" | "team-chibi" | "partnerships" | "about",
  file: File,
): Promise<string> {
  return uploadFile(folder, file, file.type || "image/jpeg");
}

export async function uploadVideo(
  folder: "events-videos",
  file: File,
): Promise<string> {
  return uploadFile(folder, file, file.type || "video/mp4");
}

async function uploadFile(
  folder: string,
  file: File,
  contentType: string,
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();
  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : contentType.startsWith("video/") ? ".mp4" : ".jpg";
  const objectPath = `${folder}/${uuidv4()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, buffer, {
      contentType: file.type || contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function deleteImageByUrl(url: string): Promise<void> {
  const bucket = getStorageBucket();
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const objectPath = url.slice(index + marker.length);
  const supabase = getSupabaseAdmin();
  await supabase.storage.from(bucket).remove([objectPath]);
}
