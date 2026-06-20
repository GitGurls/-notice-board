import { useRouter } from "next/router";
import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";

export default function NewNoticePage() {
  const router = useRouter();

  async function handleSubmit(values) {
    const res = await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.details?.join(" ") || data.error || "Could not create notice.");
    }

    router.push("/");
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10 sm:px-8">
      <Link href="/" className="text-sm text-ink/55 hover:text-ink">
        ← Back to notices
      </Link>
      <h1 className="mt-3 mb-8 font-display text-3xl font-semibold text-ink">
        Add notice
      </h1>
      <NoticeForm
        submitLabel="Publish notice"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/")}
      />
    </main>
  );
}
