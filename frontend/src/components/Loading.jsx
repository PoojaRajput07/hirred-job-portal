const Loading = ({ label = "Loading your workspace" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" role="status" aria-live="polite" aria-label="Loading">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-8 py-6 shadow-xl">
        <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};

export default Loading;
