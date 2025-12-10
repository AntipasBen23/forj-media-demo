"use client";

import { useState } from "react";

type GeneratedContent = {
  hooks: string[];
  postOutlines: string[];
  fullPosts: string[];
};

export default function HomePage() {
  const [rawInput, setRawInput] = useState("");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("direct");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!rawInput.trim()) {
      setError("Drop in at least a few lines of notes.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput, product, audience, tone }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data: GeneratedContent = await res.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong while generating content.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header / Hero */}
      <header className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-forj-border bg-forj-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-forj-muted">
          Demo • Forj Media
        </span>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold md:text-4xl">
              Founder Intake Engine
            </h1>
            <p className="max-w-2xl text-sm text-forj-muted md:text-base">
              Turn a founder&apos;s messy notes into{" "}
              <span className="text-forj-accent">
                hooks, outlines, and full posts
              </span>{" "}
              in seconds.
            </p>
          </div>

          <div className="rounded-xl border border-forj-border bg-gradient-to-br from-forj-card to-black px-4 py-3 text-xs text-forj-muted md:text-sm">
            <p className="font-medium text-forj-text">
              What this demo shows Matt
            </p>
            <p>• Intake rough thoughts once<br/>• Ship a week of content</p>
          </div>
        </div>
      </header>

      {/* Main grid */}
      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        
        {/* LEFT SIDE — Input panel */}
        <section className="flex flex-col rounded-2xl border border-forj-border bg-forj-card p-6">
          <h2 className="text-sm font-medium text-forj-muted">
            1. Drop in founder brain
          </h2>

          <form onSubmit={handleGenerate} className="flex flex-col gap-4 mt-4">
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-forj-muted">
                Raw notes / transcript
              </span>
              <textarea
                className="min-h-[180px] w-full rounded-xl border border-forj-border bg-black/40 px-3 py-2 text-sm text-forj-text focus:ring-2 ring-forj-accent/40 outline-none"
                placeholder="Example: call notes, rants, problems founders keep repeating..."
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />
            </label>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-xs">
                <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-forj-muted">
                  Product
                </span>
                <input
                  className="w-full rounded-lg border border-forj-border bg-black/40 px-3 py-2 text-xs"
                  placeholder="e.g. LinkedIn content agency"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </label>

              <label className="text-xs">
                <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-forj-muted">
                  Audience
                </span>
                <input
                  className="w-full rounded-lg border border-forj-border bg-black/40 px-3 py-2 text-xs"
                  placeholder="e.g. SaaS founders"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </label>

              <label className="text-xs">
                <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-forj-muted">
                  Tone
                </span>
                <select
                  className="w-full rounded-lg border border-forj-border bg-black/40 px-3 py-2 text-xs"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="direct">Direct & sharp</option>
                  <option value="story">Story-driven</option>
                  <option value="contrarian">Contrarian</option>
                  <option value="mentor">Calm mentor</option>
                </select>
              </label>
            </div>

            {error && <p className="text-xs font-medium text-red-400">{error}</p>}

            {/* ALWAYS VISIBLE BUTTON */}
            <div className="flex items-center justify-between mt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white text-black px-5 py-2 text-sm font-semibold shadow-[0_0_10px_rgba(255,255,255,0.5)] hover:bg-gray-200 transition disabled:opacity-60 cursor-pointer"


              >
                {loading ? "Generating..." : "Generate content"}
              </button>

              <p className="text-[11px] text-forj-muted">
                Backend connected to /api/generate
              </p>
            </div>
          </form>
        </section>

        {/* RIGHT SIDE — Results */}
        <section className="flex flex-col rounded-2xl border border-forj-border bg-forj-card p-6">
          <h2 className="text-sm font-medium text-forj-muted">
            2. Forj-style content output
          </h2>

          {!result && !loading && (
            <div className="mt-6 rounded-xl border border-dashed border-forj-border/60 bg-black/20 px-4 py-6 text-xs text-forj-muted">
              Hit “Generate content” to see hooks, outlines, and full posts.
            </div>
          )}

          {result && (
            <div className="mt-4 flex-1 space-y-5 overflow-y-auto pr-1 text-sm">

              <ContentBlock title="Hooks" items={result.hooks} />
              <ContentBlock title="Post outlines" items={result.postOutlines} />
              <ContentBlock title="Full posts" items={result.fullPosts} multiline />

            </div>
          )}
        </section>

      </div>
    </div>
  );
}

function ContentBlock({
  title,
  items,
  multiline,
}: {
  title: string;
  items: string[];
  multiline?: boolean;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-forj-muted">
        {title}
      </h3>
      <div className="mt-2 space-y-2">
        {items.map((text, idx) => (
          <ContentCard
            key={idx}
            label={`${title.slice(0, -1)} ${idx + 1}`}
            text={text}
            multiline={multiline}
          />
        ))}
      </div>
    </div>
  );
}

function ContentCard({
  label,
  text,
  multiline,
}: {
  label: string;
  text: string;
  multiline?: boolean;
}) {
  return (
    <article className="group rounded-xl border border-forj-border bg-black/30 px-3 py-3 text-xs">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-medium text-forj-muted">{label}</span>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(text)}
          className="rounded-full border border-forj-border px-2 py-0.5 text-[11px] group-hover:border-forj-accent group-hover:text-forj-accent"
        >
          Copy
        </button>
      </div>

      <p className={multiline ? "whitespace-pre-line" : ""}>{text}</p>
    </article>
  );
}
