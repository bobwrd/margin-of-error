import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";

interface NewsletterSignupProps {
  compact?: boolean;
}

export default function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const result = await subscribeNewsletter({ email, name: name || undefined });
    if (result.success) {
      setStatus("success");
      setMessage("You're in. Thanks for signing up.");
      setEmail("");
      setName("");
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className={`rounded-xl border border-border p-5 ${compact ? "" : "bg-secondary/30"}`}>
        <p className="text-sm text-foreground font-medium">✓ {message}</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-border ${compact ? "p-5" : "p-6 bg-secondary/30"}`}
    >
      {!compact && (
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">
            Subscribe to the newsletter
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Writing on economics, law, and policy. No noise.
          </p>
        </div>
      )}
      {compact && (
        <p className="text-sm font-medium text-foreground mb-3">
          Get new issues by email
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        {!compact && (
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        )}
        <div className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50 whitespace-nowrap"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </div>
        {status === "error" && (
          <p className="text-xs text-destructive">{message}</p>
        )}
      </form>
    </div>
  );
}
