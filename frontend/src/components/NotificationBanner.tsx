export function NotificationBanner({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          // Override global button styles to make this look like a simple 'X'
          background: "transparent",
          border: "none",
          color: "inherit", // Uses the text color of the alert (red/green/blue)
          padding: "0 0 0 12px",
          width: "auto",
          fontSize: "1.5rem",
          lineHeight: "1rem",
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}