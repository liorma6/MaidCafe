import imageCompression from "browser-image-compression";

export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return imageCompression(file, {
    maxSizeMB: 0.85,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.82,
    fileType: file.type,
  });
}
