export function AttentionText({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-accent/8 p-3">
      <p className="border-l-2 border-accent pl-[13px] text-lead text-accent">
        {children}
      </p>
    </div>
  );
}
