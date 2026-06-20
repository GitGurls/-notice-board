import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import NoticeCard from "../components/NoticeCard";

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  async function loadNotices() {
    setStatus("loading");
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Failed to load notices.");
      const data = await res.json();
      setNotices(data);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  useEffect(() => {
    loadNotices();
  }, []);

  async function handleDelete(id) {
    const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
    }
  }

  function handleEdit(id) {
    router.push(`/notices/${id}/edit`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-10 sm:px-8">
      <header className="mb-10 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600">
            Campus Notice Board
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Notices
          </h1>
        </div>
        <Link href="/notices/new" className="btn-primary w-fit">
          + Add notice
        </Link>
      </header>

      {status === "loading" && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-card border border-line bg-surface" />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-card border border-crimson-100 bg-crimson-50 p-6 text-center text-sm text-crimson-600">
          Couldn&apos;t load notices.{" "}
          <button className="underline" onClick={loadNotices}>Try again</button>.
        </div>
      )}

      {status === "ready" && notices.length === 0 && (
        <div className="rounded-card border border-dashed border-line p-12 text-center">
          <p className="font-display text-lg text-ink">No notices yet</p>
          <p className="mt-1 text-sm text-ink/55">
            Post the first announcement for everyone to see.
          </p>
          <Link href="/notices/new" className="btn-primary mt-5 inline-flex">
            + Add notice
          </Link>
        </div>
      )}

      {status === "ready" && notices.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}
