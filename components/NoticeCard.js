import { useState } from "react";

const CATEGORY_STYLES = {
  Exam: "bg-crimson-50 text-crimson-600",
  Event: "bg-teal-50 text-teal-600",
  General: "bg-amber-50 text-amber-500",
};

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export default function NoticeCard({ notice, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isUrgent = notice.priority === "Urgent";

  async function handleConfirmDelete() {
    setDeleting(true);
    await onDelete(notice.id);
    setDeleting(false);
  }

  return (
    <article
      className={`relative flex flex-col rounded-card border bg-surface shadow-card transition-shadow hover:shadow-pop ${
        isUrgent ? "border-crimson-100" : "border-line"
      }`}
    >
      {isUrgent && (
        <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-crimson-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-pop">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Urgent
        </span>
      )}

      {notice.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.image}
          alt=""
          className="h-36 w-full rounded-t-card object-cover"
        />
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
              CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.General
            }`}
          >
            {notice.category}
          </span>
          <span className="font-mono text-[11px] text-ink/45">
            {formatDate(notice.publishDate)}
          </span>
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {notice.title}
        </h3>

        <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-ink/70 line-clamp-4">
          {notice.body}
        </p>

        <div className="mt-2 flex items-center gap-2 border-t border-line pt-3">
          <button type="button" className="btn-ghost flex-1" onClick={() => onEdit(notice.id)}>
            Edit
          </button>

          {!confirming ? (
            <button
              type="button"
              className="btn-danger flex-1"
              onClick={() => setConfirming(true)}
            >
              Delete
            </button>
          ) : (
            <div className="flex flex-1 items-center gap-2">
              <button
                type="button"
                className="btn-danger flex-1 bg-crimson-50"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Confirm"}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setConfirming(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
