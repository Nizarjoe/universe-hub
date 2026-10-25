import { db, storage, auth } from 'hatchable';

export const access = 'public';
export const methods = ['GET'];
const ALLOWED = new Set(['joenizar470@gmail.com', 'syibat22@gmail.com']);

export default async function (req, res) {
  const user = await auth.getUser(req);
  if (!user || !ALLOWED.has(String(user.email || '').toLowerCase())) {
    return res.status(401).json({ error: 'Silakan masuk menggunakan akun yang diundang.' });
  }
  const { rows } = await db.query('SELECT id, title, caption, category, memory_date, storage_key, content_type, uploaded_by, uploaded_email, created_at FROM memories ORDER BY created_at DESC LIMIT 100');
  const items = await Promise.all(rows.map(async (row) => ({
    id: row.id, title: row.title, caption: row.caption, category: row.category,
    date: row.memory_date, image: await storage.url(row.storage_key),
    uploadedBy: row.uploaded_by, uploadedEmail: row.uploaded_email, createdAt: row.created_at
  })));
  return res.json({ items, user: { email: user.email, name: user.name || '' } });
}