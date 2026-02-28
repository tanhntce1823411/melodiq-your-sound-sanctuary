import { ChevronRight } from "lucide-react";

export default function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold font-display text-foreground">{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} className="flex items-center gap-0.5 text-xs font-medium text-primary">
          Xem tất cả <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
