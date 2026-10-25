import { db, storage, auth } from 'hatchable';
import crypto from 'node:crypto';

export const access = 'public';
export const methods = ['POST'];
const ALLOWED = new Set(['joenizar470@gmail.com', 'syibat22@gmail.com']);
const TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 10 * 1024 * 1024;

export default async function (req, res) {
  const user = await auth.getUser(req);
  if (!user || !ALLOWED.has(String(user.email || '').toLowerCase())) return res.status(401).json({ error: 'Akses hanya untuk akun yang diundang.' });
  const file = (req.files || []).find((f) => f.field === 'file');
  if (!file) return res.status(400).json({ error: 'Pilih foto terlebih dahulu.' });
  if (!TYPES.has(file.contentType)) return res.status(415).json({ error: 'Gunakan foto JPG, PNG, WEBP, atau GIF.' });
  if (!file.buffer || file.buffer.length > MAX_BYTES) return res.status(413).json({ error: 'Ukuran foto maksimal 10 MB.' });
  const title = String((req.body && req.body.title) || 'Kenangan manis').trim().slice(0, 100) || 'Kenangan manis';
  const caption = String((req.body && req.body.caption) || '').trim().slice(0, 500);
  const category = String((req.body && req.body.category) || 'Our moments').trim().slice(0, 40) || 'Our moments';
  const date = String((req.body && req.body.date) || '').trim();
  const extByType = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
  const key = `couple-memories/${crypto.randomUUID()}.${extByType[file.contentType]}`;
  const bytes = file.buffer.length;
  await storage.put(key, file.buffer, file.contentType);
  const { rows } = await db.query(
    'INSERT INTO memories (title, caption, category, memory_date, storage_key, content_type, bytes, uploaded_by, uploaded_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
    [title, caption, category, /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null, key, file.contentType, bytes, user.name || user.email, String(user.email).toLowerCase()]
  );
  return res.json({ ok: true, id: rows[0].id, message: 'Kenangan berhasil disimpan.' });
}