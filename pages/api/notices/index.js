import { prisma } from "../../../lib/prisma";
import { validateNoticePayload } from "../../../lib/validateNotice";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return handleList(req, res);
  }

  if (req.method === "POST") {
    return handleCreate(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function handleList(req, res) {
  try {
    // Urgent-first ordering is done in the database query, not in the
    // browser. "Urgent" sorts after "Normal" alphabetically, so a
    // descending sort on priority puts every Urgent notice above every
    // Normal notice. Within each priority group, newest publishDate first.
    const notices = await prisma.notice.findMany({
      orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
    });
    return res.status(200).json(notices);
  } catch (err) {
    console.error("GET /api/notices failed:", err);
    return res.status(500).json({ error: "Could not load notices." });
  }
}

async function handleCreate(req, res) {
  const errors = validateNoticePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed.", details: errors });
  }

  try {
    const { title, body, category, priority, publishDate, image } = req.body;
    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        body: body.trim(),
        category,
        priority,
        publishDate: new Date(publishDate),
        image: image || null,
      },
    });
    return res.status(201).json(notice);
  } catch (err) {
    console.error("POST /api/notices failed:", err);
    return res.status(500).json({ error: "Could not create notice." });
  }
}
