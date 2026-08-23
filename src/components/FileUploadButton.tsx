"use client";

interface FileUploadButtonProps {
  label: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  variant?: "primary" | "secondary";
  onChange: (files: File[]) => void;
  selectedLabel?: string;
}

export default function FileUploadButton({
  label,
  hint,
  accept = "image/*",
  multiple = false,
  variant = "primary",
  onChange,
  selectedLabel,
}: FileUploadButtonProps) {
  const className =
    variant === "primary" ? "admin-upload-btn admin-upload-btn-primary" : "admin-upload-btn admin-upload-btn-secondary";

  return (
    <div className="space-y-1">
      <label className={className}>
        <span className="admin-upload-btn-icon" aria-hidden="true">
          📁
        </span>
        <span className="flex flex-col items-start gap-0.5">
          <span className="font-bold">{label}</span>
          {hint && <span className="text-xs font-normal opacity-90">{hint}</span>}
        </span>
        <span className="admin-upload-btn-action">לחצו לבחירה</span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            onChange(e.target.files ? Array.from(e.target.files) : []);
            e.target.value = "";
          }}
        />
      </label>
      {selectedLabel && (
        <p className="text-xs font-medium text-pink-500">{selectedLabel}</p>
      )}
    </div>
  );
}
