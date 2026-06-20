import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import NoticeForm from "../../../components/NoticeForm";

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function EditNoticePage() {
  const router = useRouter();
  const { id } = router.query;

  const [initialValues, setInitialValues] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (res.status === 404) {
          setStatus("notfound");
          return;
        }
        if (!res.ok) throw new Error();
        const notice = await res.json();
        setInitialValues({
          title: notice.title,
          body: notice.body,
          category: notice.category,
          priority: notice.priority,
          publishDate: toDateInputValue(notice.publishDate),
          image: notice.image || "",
        });
        setStatus("ready");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }

    load();
  }, [id]);

  async function handleSubmit(values) {
    const res = await fetch(`/api/notices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.details?.join(" ") || data.error || "Could not update notice.");
    }

    router.push("/");
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10 sm:px-8">
      <Link href="/" className="text-sm text-ink/55 hover:text-ink">
        ← Back to notices
      </Link>
      <h1 className="mt-3 mb-8 font-display text-3xl font-semibold text-ink">
        Edit notice
      </h1>

      {status === "loading" && (
        <div className="h-64 animate-pulse rounded-card border border-line bg-surface" />
      )}

      {status === "notfound" && (
        <p className="rounded-card border border-line bg-surface p-6 text-sm text-ink/60">
          This notice doesn&apos;t exist anymore.
        </p>
      )}

      {status === "error" && (
        <p className="rounded-card border border-crimson-100 bg-crimson-50 p-6 text-sm text-crimson-600">
          Couldn&apos;t load this notice. Please go back and try again.
        </p>
      )}

      {status === "ready" && (
        <NoticeForm
          initialValues={initialValues}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/")}
        />
      )}
    </main>
  );
}
