/** Classic heart SVG path (viewBox 0 0 100 92) */
export const EVENT_HEART_PATH =
  "M50 88 C22 62 10 46 10 31 C10 17 20 8 33 8 C41 8 47 12 50 18 C53 12 59 8 67 8 C80 8 90 17 90 31 C90 46 78 62 50 88 Z";

export const EVENT_HEART_VIEWBOX = { width: 100, height: 92 } as const;

export const EVENT_HEART_ASPECT =
  EVENT_HEART_VIEWBOX.width / EVENT_HEART_VIEWBOX.height;

const encodedPath = encodeURIComponent(EVENT_HEART_PATH);

export const EVENT_HEART_MASK_IMAGE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 92'%3E%3Cpath fill='%23000' d='${encodedPath}'/%3E%3C/svg%3E")`;
