export default function Equalizer({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-end gap-[2px] h-4 ${className}`}>
      <div className="w-[3px] rounded-full bg-primary animate-eq-1" />
      <div className="w-[3px] rounded-full bg-primary animate-eq-2" />
      <div className="w-[3px] rounded-full bg-primary animate-eq-3" />
      <div className="w-[3px] rounded-full bg-primary animate-eq-4" />
    </div>
  );
}
