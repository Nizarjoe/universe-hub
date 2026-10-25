import { db, storage, auth } from 'hatchable';
export const access = 'public';
export const methods = ['POST'];
const ALLOWED = new Set(['joenizar470@gmail.com', 'syibat22@gmail.com']);
export default async function (req, res) {
  const user = await auth.getUser(req);
  if (!user || !ALLOWED.has(String(user.email || '').toLowerCase())) return res.status(401).json({ error: 'Akun tidak diizinkan.' });
  const id = Number((req.body && req.body.id) || req.query.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'ID foto tidak valid.' });
  const { rows } = await db.query('SELECT storage_key FROM memories WHERE id = $1', [id]);
  if (!rows.length) return res.status(404).json({ error: 'Kenangan tidak ditemukan.' });
  await storage.del(rows[0].storage_key);
  await db.query('DELETE FROM memories WHERE id = $1', [id]);
  return res.json({ ok: true });
}