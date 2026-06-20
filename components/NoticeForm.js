import { useState } from "react";
import { CATEGORIES, PRIORITIES } from "../lib/constants";

const EMPTY = {
  title: "",
  body: "",
  category: "General",
  priority: "Normal",
  publishDate: "",
  image: "",
};

// Converts a File to a base64 data URL so it can be stored directly in the
// database as text — no external storage service required, which keeps
// the project on free tiers only.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NoticeForm({ initialValues, onSubmit, submitLabel, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!values.title.trim()) next.title = "Title is required.";
    if (!values.body.trim()) next.body = "Body is required.";
    if (!values.publishDate || Number.isNaN(new Date(values.publishDate).getTime())) {
      next.publishDate = "Enter a valid date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      update("image", dataUrl);
    } finally {
      setImageBusy(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {serverError && (
        <p className="rounded-md border border-crimson-100 bg-crimson-50 px-3 py-2 text-sm text-crimson-600">
          {serverError}
        </p>
      )}

      <div>
        <label className="field-label" htmlFor="title">Title</label>
        <input
          id="title"
          className="field-input"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Mid-semester exam schedule released"
          maxLength={200}
        />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="body">Body</label>
        <textarea
          id="body"
          className="field-input min-h-[120px] resize-y"
          value={values.body}
          onChange={(e) => update("body", e.target.value)}
          placeholder="Details for the notice…"
        />
        {errors.body && <p className="field-error">{errors.body}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="category">Category</label>
          <select
            id="category"
            className="field-input"
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <span className="field-label">Priority</span>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <label
                key={p}
                className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors ${
                  values.priority === p
                    ? p === "Urgent"
                      ? "border-crimson-500 bg-crimson-50 text-crimson-600"
                      : "border-teal-500 bg-teal-50 text-teal-600"
                    : "border-line text-ink/60 hover:border-ink/30"
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={values.priority === p}
                  onChange={(e) => update("priority", e.target.value)}
                  className="sr-only"
                />
                {p}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="publishDate">Publish date</label>
          <input
            id="publishDate"
            type="date"
            className="field-input"
            value={values.publishDate}
            onChange={(e) => update("publishDate", e.target.value)}
          />
          {errors.publishDate && <p className="field-error">{errors.publishDate}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="image">Image (optional)</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="field-input file:mr-3 file:rounded file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
          />
          {imageBusy && <p className="mt-1 text-xs text-ink/45">Reading image…</p>}
          {values.image && !imageBusy && (
            <div className="mt-2 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={values.image} alt="" className="h-12 w-12 rounded object-cover" />
              <button
                type="button"
                className="text-xs text-crimson-500 underline"
                onClick={() => update("image", "")}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={submitting || imageBusy}>
          {submitting ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
