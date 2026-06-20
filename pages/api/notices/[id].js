import { prisma } from "../../../lib/prisma";
import { validateNoticePayload } from "../../../lib/validateNotice";

export default async function handler(req, res) {
  const id = Number(req.query.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid notice id." });
  }

  if (req.method === "GET") {
    return handleGet(id, res);
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    return handleUpdate(id, req, res);
  }

  if (req.method === "DELETE") {
    return handleDelete(id, res);
  }

  res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function handleGet(id, res) {
  try {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      return res.status(404).json({ error: "Notice not found." });
    }
    return res.status(200).json(notice);
  } catch (err) {
    console.error(`GET /api/notices/${id} failed:`, err);
    return res.status(500).json({ error: "Could not load notice." });
  }
}

async function handleUpdate(id, req, res) {
  const errors = validateNoticePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed.", details: errors });
  }

  try {
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Notice not found." });
    }

    const { title, body, category, priority, publishDate, image } = req.body;
    const notice = await prisma.notice.update({
      where: { id },
      data: {
        title: title.trim(),
        body: body.trim(),
        category,
        priority,
        publishDate: new Date(publishDate),
        image: image || null,
      },
    });
    return res.status(200).json(notice);
  } catch (err) {
    console.error(`PUT /api/notices/${id} failed:`, err);
    return res.status(500).json({ error: "Could not update notice." });
  }
}

async function handleDelete(id, res) {
  try {
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Notice not found." });
    }

    await prisma.notice.delete({ where: { id } });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(`DELETE /api/notices/${id} failed:`, err);
    return res.status(500).json({ error: "Could not delete notice." });
  }
}
