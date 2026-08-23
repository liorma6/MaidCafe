import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

/** Heart-shaped frame for event covers (real ♥, not the team egg shape). */
export default function EventHeartFrame({ children, className = "" }: Props) {
  return (
    <div className={`event-heart-shell ${className}`.trim()}>
      <div className="event-heart-fill">{children}</div>
    </div>
  );
}
