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

      if (!API_BASE) {
        throw new Error("API base URL is missing in environment variables.");
      }

      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput,
          product,
          audience,
          tone,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Generation failed");
      }

      const data: GeneratedContent = await res.json();
      setResult(data);
    } catch (err) {
      console.error("API error:", err);
      setError("Something went wrong while generating content.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8 py-4">
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
              Turn a founder&apos;s messy notes, rambles, and brain dumps into{" "}
              <span className="text-forj-accent">
                on-brand LinkedIn hooks, outlines, and posts
              </span>{" "}
              in seconds. Built as a prototype of how Forj could scale
              founder-led content without adding more meetings.
            </p>
          </div>

          <div className="rounded-xl border border-forj-border bg-gradient-to-br from-forj-card to-black px-4 py-3 text-xs text-forj-muted md:text-sm">
            <p className="font-medium text-forj-text">
              What this demo shows Matt
            </p>
            <p>
              • Intake any rough thoughts once{" "}
              <br />
              • Ship a week of content from it
            </p>
          </div>
        </div>
      </header>

      {/* Main grid */}
      <div className="grid flex-1 gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Left: Input */}
        <section className="flex flex-col rounded-2xl border border-forj-border bg-forj-card p-4 md:p-6">
          <h2 className="text-sm font-medium text-forj-muted">
            1. Drop in founder brain
          </h2>
          <p className="mt-1 text-xs text-forj-muted">
            Paste raw notes, a voice memo transcript, call notes, or a messy
            rant. The engine turns it into structured content.
          </p>

          <form
            onSubmit={handleGenerate}
            className="mt-4 flex flex-col gap-4"
          >
            <label className="flex-1 text-sm">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-forj-muted">
                Raw notes / transcript
              </span>
              <textarea
                className="min-h-[180px] w-full resize-vertical rounded-xl border border-forj-border bg-black/40 px-3 py-2 text-sm text-forj-text outline-none ring-forj-accent/40 focus:ring-2"
                placeholder="Example: Scribbles after a sales call, problems founders keep mentioning, your own rant about LinkedIn, etc..."
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
                  className="w-full rounded-lg border border-forj-border bg-black/40 px-3 py-2 text-xs outline-none ring-forj-accent/40 focus:ring-2"
                  placeholder="e.g. LinkedIn content agency for B2B SaaS"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </label>

              <label className="text-xs">
                <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-forj-muted">
                  Target audience
                </span>
                <input
                  className="w-full rounded-lg border border-forj-border bg-black/40 px-3 py-2 text-xs outline-none ring-forj-accent/40 focus:ring-2"
                  placeholder="e.g. Seed–Series B SaaS founders"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </label>

              <label className="text-xs">
                <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-forj-muted">
                  Tone
                </span>
                <select
                  className="w-full rounded-lg border border-forj-border bg-black/40 px-3 py-2 text-xs outline-none ring-forj-accent/40 focus:ring-2"
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

            {error && (
              <p className="text-xs font-medium text-red-400">{error}</p>
            )}

            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-forj-accent px-4 py-2 text-sm font-medium text-black transition hover:bg-forj-accentSoft disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate content"}
              </button>
              
            </div>
          </form>
        </section>

        {/* Right: Output */}
        <section className="flex flex-col rounded-2xl border border-forj-border bg-forj-card p-4 md:p-6">
          <h2 className="text-sm font-medium text-forj-muted">
            2. Forj-style content output
          </h2>
          <p className="mt-1 text-xs text-forj-muted">
            This is what a founder or Forj writer would see seconds after
            dropping in their notes.
          </p>

          {!result && !loading && (
            <div className="mt-6 rounded-xl border border-dashed border-forj-border/80 bg-black/20 px-4 py-6 text-xs text-forj-muted">
              <p>Hit “Generate content” to see hooks, outlines, and posts.</p>
              <p className="mt-2">
                When wired to a backend, this area becomes the live content
                workspace Forj can plug into client onboarding or a portal.
              </p>
            </div>
          )}

          {result && (
            <div className="mt-4 flex-1 space-y-5 overflow-y-auto pr-1 text-sm">
              {/* Hooks */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-forj-muted">
                  Hooks
                </h3>
                <div className="mt-2 space-y-2">
                  {result.hooks.map((hook, idx) => (
                    <ContentCard key={idx} label={`Hook ${idx + 1}`} text={hook} />
                  ))}
                </div>
              </div>

              {/* Outlines */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-forj-muted">
                  Post outlines
                </h3>
                <div className="mt-2 space-y-2">
                  {result.postOutlines.map((outline, idx) => (
                    <ContentCard
                      key={idx}
                      label={`Outline ${idx + 1}`}
                      text={outline}
                    />
                  ))}
                </div>
              </div>

              {/* Full posts */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-forj-muted">
                  Full posts
                </h3>
                <div className="mt-2 space-y-2">
                  {result.fullPosts.map((post, idx) => (
                    <ContentCard
                      key={idx}
                      label={`Post ${idx + 1}`}
                      text={post}
                      multiline
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

type ContentCardProps = {
  label: string;
  text: string;
  multiline?: boolean;
};

function ContentCard({ label, text, multiline }: ContentCardProps) {
  function handleCopy() {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy", err);
    });
  }

  return (
    <article className="group rounded-xl border border-forj-border bg-black/30 px-3 py-3 text-xs">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-forj-muted">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-forj-border bg-transparent px-2 py-0.5 text-[11px] text-forj-muted transition group-hover:border-forj-accent group-hover:text-forj-accent"
        >
          Copy
        </button>
      </div>
      <p className={multiline ? "whitespace-pre-line" : ""}>{text}</p>
    </article>
  );
}
