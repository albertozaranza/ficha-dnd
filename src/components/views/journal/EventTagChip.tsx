import { TAG_COLOR } from "../../../lib/constants";
import type { EventTag } from "../../../types";

interface EventTagChipProps {
  tag: EventTag;
  small?: boolean;
  count?: number;
}

export function EventTagChip({ tag, small, count }: EventTagChipProps) {
  return (
    <span
      className={`event-tag-chip${small ? " sm" : ""}`}
      style={{ "--tag-color": TAG_COLOR[tag] } as React.CSSProperties}
    >
      {tag}{count != null ? ` ${count}` : ""}
    </span>
  );
}
