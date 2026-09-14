type BlogStatusProps = {
  status: "loading" | "ok" | "error" | "empty";
  loading?: string;
  error?: string;
  empty?: string;
};

export function BlogStatus({
  status,
  loading = "Loading briefings…",
  error = "Could not load briefings. Try again in a moment.",
  empty = "No briefings found."
}: BlogStatusProps) {
  if (status === "ok") {
    return null;
  }
  const message = status === "loading" ? loading : status === "error" ? error : empty;
  return <p className={`blog-status blog-status--${status}`}>{message}</p>;
}
