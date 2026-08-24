"use client";

interface Props {
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}

export default function ReorderControls({
  onUp,
  onDown,
  disableUp,
  disableDown,
}: Props) {
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <button
        type="button"
        onClick={onUp}
        disabled={disableUp}
        className="rounded-lg bg-pink-100 px-2 py-1 text-xs font-bold text-pink-700 hover:bg-pink-200 disabled:opacity-30"
        aria-label="הזז למעלה"
        title="הזז למעלה"
      >
        ▲
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={disableDown}
        className="rounded-lg bg-pink-100 px-2 py-1 text-xs font-bold text-pink-700 hover:bg-pink-200 disabled:opacity-30"
        aria-label="הזז למטה"
        title="הזז למטה"
      >
        ▼
      </button>
    </div>
  );
}
