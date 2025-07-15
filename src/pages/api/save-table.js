// pages/api/save-table.js
import { redis } from '@/lib/redis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { data } = req.body;

    try {
      await redis.set('table_state', data);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save data' });
    }
  }

  if (req.method === 'GET') {
    try {
      const data = await redis.get('table_state');
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
