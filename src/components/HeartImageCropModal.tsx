"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImageFile, HEART_CROP_ASPECT } from "@/lib/crop-image";

interface Props {
  imageSrc: string;
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: (file: File) => void;
}

export default function HeartImageCropModal({
  imageSrc,
  open,
  title = "חיתוך תמונה ללב ♡",
  onClose,
  onConfirm,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels);
      onConfirm(file);
      onClose();
    } catch {
      alert("שגיאה בחיתוך התמונה");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-lg rounded-2xl border-4 border-pink-300 bg-white p-4 shadow-2xl">
        <h3 className="mb-3 text-center text-lg font-bold text-pink-700">
          {title}
        </h3>
        <p className="mb-4 text-center text-sm text-pink-500">
          גררו והתקרבו כדי שהתמונה תיכנס יפה בתוך הלב
        </p>

        <div className="relative mx-auto aspect-[1/1.05] w-full max-w-sm overflow-hidden rounded-2xl bg-pink-50">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={HEART_CROP_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="horizontal-cover"
          />
          <div
            className="heart-crop-frame pointer-events-none absolute inset-0"
            aria-hidden
          />
        </div>

        <label className="mt-4 block text-sm font-semibold text-pink-600">
          זום
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="mt-1 w-full accent-pink-500"
          />
        </label>

        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-pink-100 px-5 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-200"
          >
            ביטול
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving || !croppedAreaPixels}
            className="admin-btn text-sm"
          >
            {saving ? "שומר..." : "אישור חיתוך ♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
