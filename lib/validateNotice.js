import { CATEGORIES, PRIORITIES } from "./constants";

// Validates a notice payload on the server. Returns an array of
// human-readable error strings; an empty array means the payload is valid.
// This is intentionally re-checked here even though the form also validates
// in the browser, since client-side checks can always be bypassed.
export function validateNoticePayload(body) {
  const errors = [];

  if (!body || typeof body !== "object") {
    return ["Request body is missing or malformed."];
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const noticeBody = typeof body.body === "string" ? body.body.trim() : "";

  if (!title) errors.push("Title is required.");
  if (title.length > 200) errors.push("Title must be 200 characters or fewer.");

  if (!noticeBody) errors.push("Body is required.");

  if (!CATEGORIES.includes(body.category)) {
    errors.push(`Category must be one of: ${CATEGORIES.join(", ")}.`);
  }

  if (!PRIORITIES.includes(body.priority)) {
    errors.push(`Priority must be one of: ${PRIORITIES.join(", ")}.`);
  }

  if (!body.publishDate || Number.isNaN(new Date(body.publishDate).getTime())) {
    errors.push("Publish date is required and must be a valid date.");
  }

  if (body.image !== undefined && body.image !== null && typeof body.image !== "string") {
    errors.push("Image must be a string (URL or data URL).");
  }

  return errors;
}
